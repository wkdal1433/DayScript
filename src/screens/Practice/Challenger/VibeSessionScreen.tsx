import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Type imports
import {
  VibeSessionScreenProps,
  VibeSessionState,
  VibeSessionAction,
  VibeSessionData,
  VibeProblem,
  ConversationMessage,
  GenerationResult,
  TokenUsage,
} from './VibeSessionScreen.types';

// Style imports
import { styles } from './VibeSessionScreen.styles';

const { width: screenWidth } = Dimensions.get('window');

/**
 * VibeSessionScreen Component - 3-Tier Architecture
 *
 * 새로운 3단 논리 구조:
 * 1️⃣ 상단: 진행 상태 (프로그레스, 타이머, AI 면접관)
 * 2️⃣ 중단: 질문 & 코드 (60% 질문/대화 : 40% 코드 편집)
 * 3️⃣ 하단: 대화 기록 및 입력 컨트롤
 *
 * UX 목표: 시각적 과밀 해소, 학습 루프 명확화
 */

// State reducer for complex state management
const vibeSessionReducer = (state: VibeSessionState, action: VibeSessionAction): VibeSessionState => {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.payload };

    case 'SET_PROBLEM':
      return { ...state, problem: action.payload };

    case 'ADD_MESSAGE':
      return {
        ...state,
        session: state.session ? {
          ...state.session,
          conversations: [...state.session.conversations, action.payload],
        } : null,
      };

    case 'ADD_GENERATION':
      return {
        ...state,
        currentGeneration: action.payload,
        session: state.session ? {
          ...state.session,
          generatedResults: [...state.session.generatedResults, action.payload],
        } : null,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false, isGenerating: false };

    case 'UPDATE_TOKEN_USAGE':
      return { ...state, tokenUsage: { ...state.tokenUsage, ...action.payload } };

    case 'SELECT_RESULT':
      return { ...state, selectedResultId: action.payload };

    case 'TOGGLE_HINTS':
      return { ...state, showHints: action.payload ?? !state.showHints };

    default:
      return state;
  }
};

const VibeSessionScreen: React.FC<VibeSessionScreenProps> = ({
  route,
  navigation,
}) => {
  // Extract route parameters
  const {
    problemId,
    sessionId,
    timeLimit = 1800,
    difficulty,
    returnRoute = 'Practice',
  } = route.params;

  // State management
  const [state, dispatch] = useReducer(vibeSessionReducer, {
    session: null,
    problem: null,
    currentGeneration: null,
    isLoading: true,
    isGenerating: false,
    error: null,
    tokenUsage: {
      currentSession: 0,
      sessionLimit: 5000,
      averagePerPrompt: 0,
      estimatedRemaining: 5000,
      efficiencyScore: 100,
      recommendations: [],
    },
    selectedResultId: null,
    showHints: false,
    availableHints: [],
  });

  // Local UI state
  const [promptText, setPromptText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [codeContent, setCodeContent] = useState('');
  const [codeEfficiency, setCodeEfficiency] = useState(85);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);

  // Refs
  const promptInputRef = useRef<TextInput>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const codeEditorRef = useRef<TextInput>(null);

  // Initialize session
  useEffect(() => {
    initializeSession();
    startTimer();

    return () => {
      cleanup();
    };
  }, []);

  // Mock data initialization
  const initializeSession = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const mockProblem: VibeProblem = {
        id: problemId,
        title: 'ML 모델 성능 최적화 문제',
        description: 'ML 모델의 Validation Loss가 계속 줄지 않고 있습니다. 이 경우 어떤 조치를 취하시겠습니까?',
        requirements: [
          'Validation Loss 분석 방법 제시',
          '구체적인 해결책 코드 구현',
          '성능 개선 전략 수립',
        ],
        constraints: [
          '실행 가능한 Python 코드 제공',
          '명확한 주석과 설명 포함',
          '실제 프로젝트 적용 가능한 수준',
        ],
        difficulty,
        category: 'Machine Learning',
        expectedOutputType: 'code',
        language: 'python',
        framework: 'tensorflow',
        hints: [
          {
            id: '1',
            level: 1,
            title: '💡 힌트: 과적합, 학습률, 데이터 품질 등을 고려해서 답변해보세요.',
            content: '과적합 여부를 먼저 확인하고, 학습률 조정, 데이터 증강, 정규화 기법 등을 고려해보세요.',
            tokensDeduction: 50,
          },
        ],
        estimatedTime: 30,
      };

      const mockSession: VibeSessionData = {
        id: sessionId,
        problemId,
        userId: 'current_user',
        startedAt: new Date(),
        timeLimit,
        difficulty,
        status: 'active',
        tokensUsed: 0,
        tokensLimit: 5000,
        currentScore: 0,
        conversations: [],
        generatedResults: [],
      };

      dispatch({ type: 'SET_PROBLEM', payload: mockProblem });
      dispatch({ type: 'SET_SESSION', payload: mockSession });

      // 초기 AI 메시지
      const initialMessage: ConversationMessage = {
        id: 'initial_' + Date.now(),
        role: 'ai',
        content: '안녕하세요! 저는 AI 면접관입니다. ML 모델의 성능 최적화 문제를 함께 해결해보겠습니다. 먼저 현재 상황을 어떻게 분석하시겠습니까?',
        timestamp: new Date(),
        metadata: {
          promptType: 'initial',
          confidence: 0.95,
        },
      };

      dispatch({ type: 'ADD_MESSAGE', payload: initialMessage });

      AccessibilityInfo.announceForAccessibility('Vibe Coding 세션이 시작되었습니다');

    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'SESSION_INIT_FAILED',
          message: '세션 초기화에 실패했습니다',
          type: 'unknown',
          retryable: true,
        },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [problemId, sessionId, timeLimit, difficulty]);

  // Timer management
  const startTimer = useCallback(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTimeUp]);

  const handleTimeUp = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    Alert.alert(
      '⏰ 시간 종료',
      '세션 시간이 만료되었습니다. 현재까지의 결과를 제출하시겠습니까?',
      [
        {
          text: '계속 작업',
          style: 'cancel',
          onPress: () => setTimeRemaining(300),
        },
        {
          text: '제출하기',
          onPress: handleSessionSubmit,
        },
      ]
    );
  }, []);

  // Format timer display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Prompt submission handler
  const handlePromptSubmit = useCallback(async () => {
    if (!promptText.trim() || state.isGenerating) return;

    const trimmedPrompt = promptText.trim();
    setPromptText('');

    try {
      dispatch({ type: 'SET_GENERATING', payload: true });

      // Add user message
      const userMessage: ConversationMessage = {
        id: 'user_' + Date.now(),
        role: 'user',
        content: trimmedPrompt,
        timestamp: new Date(),
        metadata: {
          promptType: 'clarification',
        },
      };

      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      // Simulate AI generation
      await simulateAIGeneration(trimmedPrompt);

      AccessibilityInfo.announceForAccessibility('AI 응답이 생성되었습니다');

    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'GENERATION_FAILED',
          message: 'AI 응답 생성에 실패했습니다',
          type: 'ai_service',
          retryable: true,
        },
      });
    }
  }, [promptText, state.isGenerating]);

  // Simulate AI generation
  const simulateAIGeneration = async (prompt: string) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const estimatedTokens = Math.floor(prompt.length * 1.5) + Math.floor(Math.random() * 200) + 100;

          const aiMessage: ConversationMessage = {
            id: 'ai_' + Date.now(),
            role: 'ai',
            content: `좋은 접근입니다! 다음과 같은 방향으로 코드를 작성해보세요:\n\n1. Training Loss vs Validation Loss 그래프 분석\n2. Early stopping 적용\n3. Learning rate scheduling\n\n우측 코드 편집기에서 구현해보시겠습니까?`,
            timestamp: new Date(),
            tokensUsed: estimatedTokens,
            metadata: {
              promptType: 'clarification',
              confidence: 0.87,
            },
          };

          dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });

          // Update token usage
          const newTokenUsage = state.tokenUsage.currentSession + estimatedTokens;
          dispatch({
            type: 'UPDATE_TOKEN_USAGE',
            payload: {
              currentSession: newTokenUsage,
              averagePerPrompt: Math.round(newTokenUsage / (state.session?.conversations.length || 1)),
              estimatedRemaining: Math.max(0, state.tokenUsage.sessionLimit - newTokenUsage),
              efficiencyScore: Math.max(20, 100 - (newTokenUsage / state.tokenUsage.sessionLimit) * 100),
            },
          });

          resolve();
        } catch (error) {
          reject(error);
        } finally {
          dispatch({ type: 'SET_GENERATING', payload: false });
        }
      }, 2000);
    });
  };

  // Handle session completion
  const handleSessionSubmit = useCallback(() => {
    Alert.alert(
      '세션 제출',
      '현재 세션을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제출',
          onPress: () => {
            navigation.navigate(returnRoute as never);
            AccessibilityInfo.announceForAccessibility('세션이 제출되었습니다');
          },
        },
      ]
    );
  }, [navigation, returnRoute]);

  // Handle back navigation
  const handleBackPress = useCallback(() => {
    Alert.alert(
      '세션 종료',
      '정말로 세션을 종료하시겠습니까? 진행상황이 저장되지 않을 수 있습니다.',
      [
        { text: '계속하기', style: 'cancel' },
        { text: '종료', onPress: () => navigation.navigate(returnRoute as never) },
      ]
    );
  }, [navigation, returnRoute]);

  // Code editor change handler
  const handleCodeChange = useCallback((code: string) => {
    setCodeContent(code);
    // Mock efficiency calculation
    const efficiency = Math.min(100, Math.max(0, 85 + Math.floor((code.length - 100) / 50)));
    setCodeEfficiency(efficiency);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, []);

  // Loading state
  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>세션을 준비하고 있습니다...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (state.error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>오류가 발생했습니다: {state.error.message}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              dispatch({ type: 'SET_ERROR', payload: null });
              initializeSession();
            }}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1️⃣ 상단 영역 - 진행 상태 */}
        <View style={styles.topSection}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={['#10B981', '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${(currentQuestionIndex / 5) * 100}%` }]}
              />
            </View>
            <Text style={styles.progressText}>문제 {currentQuestionIndex}/5</Text>
          </View>

          {/* Timer and AI Interviewer Row */}
          <View style={styles.statusRow}>
            {/* AI Interviewer Profile */}
            <View style={styles.aiInterviewerContainer}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.aiAvatar}
              >
                <Text style={styles.aiAvatarEmoji}>🤖</Text>
              </LinearGradient>
              <View style={styles.aiInfo}>
                <Text style={styles.aiName}>AI 면접관</Text>
                <Text style={styles.aiRole}>Senior Technical Interviewer</Text>
              </View>
            </View>

            {/* Timer */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>남은 시간</Text>
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
          </View>
        </View>

        {/* 2️⃣ 중단 영역 - 질문 & 코드 (60:40 분할) */}
        <View style={styles.middleSection}>
          {/* 좌측 - AI 질문 박스 (60%) */}
          <View style={styles.questionSection}>
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionBadge}>질문 #{currentQuestionIndex}</Text>
                <Text style={styles.questionCategory}>ML 성능 최적화</Text>
              </View>

              {state.problem && (
                <View style={styles.questionContent}>
                  <Text style={styles.questionTitle}>{state.problem.title}</Text>
                  <Text style={styles.questionDescription}>{state.problem.description}</Text>

                  <View style={styles.requirementsList}>
                    <Text style={styles.requirementsTitle}>요구사항:</Text>
                    {state.problem.requirements.map((req, index) => (
                      <Text key={index} style={styles.requirementItem}>• {req}</Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* 우측 - 코드 편집 영역 (40%) */}
          <View style={styles.codeSection}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeTitle}>코드 편집기</Text>
              <View style={styles.codeMetrics}>
                <Text style={styles.codeMetric}>효율성: {codeEfficiency}%</Text>
                <Text style={styles.codeMetric}>토큰: {state.tokenUsage.currentSession}/{state.tokenUsage.sessionLimit}</Text>
              </View>
            </View>

            <View style={styles.codeEditorContainer}>
              <TextInput
                ref={codeEditorRef}
                style={styles.codeEditor}
                value={codeContent}
                onChangeText={handleCodeChange}
                placeholder="# Python 코드를 작성하세요&#10;import tensorflow as tf&#10;&#10;# 여기에 코드를 입력하세요..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                scrollEnabled
                accessibilityLabel="코드 편집기"
                accessibilityHint="Python 코드를 작성할 수 있습니다"
              />
            </View>
          </View>
        </View>

        {/* 3️⃣ 하단 영역 - 대화 기록 및 입력 */}
        <View style={styles.bottomSection}>
          {/* 대화 기록 */}
          <ScrollView style={styles.conversationHistory} showsVerticalScrollIndicator={false}>
            {state.session?.conversations.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageCard,
                  message.role === 'ai' ? styles.aiMessageCard : styles.userMessageCard,
                ]}
              >
                <Text style={styles.messageContent}>{message.content}</Text>
                <Text style={styles.messageTimestamp}>
                  {message.timestamp.toLocaleTimeString()}
                  {message.tokensUsed && ` • ${message.tokensUsed} tokens`}
                </Text>
              </View>
            ))}

            {state.isGenerating && (
              <View style={[styles.messageCard, styles.aiMessageCard]}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.messageContent}>AI가 응답을 생성하고 있습니다...</Text>
              </View>
            )}
          </ScrollView>

          {/* 입력 컨트롤 */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputSection}
          >
            <View style={styles.inputContainer}>
              <TextInput
                ref={promptInputRef}
                style={styles.promptInput}
                value={promptText}
                onChangeText={setPromptText}
                placeholder="AI에게 질문하거나 답변을 입력하세요..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
                accessibilityLabel="프롬프트 입력창"
                accessibilityHint="AI에게 질문이나 답변을 입력할 수 있습니다"
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!promptText.trim() || state.isGenerating) && styles.submitButtonDisabled,
                ]}
                onPress={handlePromptSubmit}
                disabled={!promptText.trim() || state.isGenerating}
                accessibilityRole="button"
                accessibilityLabel="답변 제출"
              >
                <Text style={styles.submitButtonText}>
                  {state.isGenerating ? '생성중...' : '제출'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Control Buttons */}
            <View style={styles.controlButtons}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                accessibilityRole="button"
                accessibilityLabel="세션 종료"
              >
                <Text style={styles.backButtonText}>← 종료</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleSessionSubmit}
                accessibilityRole="button"
                accessibilityLabel="세션 완료"
              >
                <Text style={styles.completeButtonText}>완료</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VibeSessionScreen;