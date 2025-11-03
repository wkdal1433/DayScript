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
  GenerationRequest,
  TokenUsage,
  UserActionType,
  PanelDimensions,
} from './VibeSessionScreen.types';

// Style imports
import { styles, gradientConfigs, animations, layout } from './VibeSessionScreen.styles';

// Component imports
import ConversationPanel from './components/ConversationPanel';
import ResultPreviewPanel from './components/ResultPreviewPanel';
import TokenMonitor from './components/TokenMonitor';
import CodeEditor from './components/CodeEditor';

const { width: screenWidth } = Dimensions.get('window');

/**
 * VibeSessionScreen Component
 *
 * LV5 Vibe Coding 세션의 메인 화면으로, AI와의 대화를 통한 코드 생성 및 평가를 담당합니다.
 * Figma 디자인의 Live Coding 화면을 기반으로 하되, Vibe Coding에 최적화된 UI를 제공합니다.
 *
 * 주요 기능:
 * - 좌우 분할 레이아웃 (대화 히스토리 + 결과 미리보기)
 * - AI 프롬프트 입력 및 응답 생성
 * - 실시간 토큰 사용량 모니터링
 * - 코드 편집 및 결과 관리
 * - 접근성 및 반응형 디자인 지원
 *
 * SOLID 원칙 적용:
 * - Single Responsibility: 세션 관리와 UI 조정에만 집중
 * - Open/Closed: 새로운 AI 프로바이더나 평가 방식 확장 가능
 * - Interface Segregation: 각 하위 컴포넌트별 독립적인 props
 * - Dependency Inversion: 추상화된 서비스 인터페이스 사용
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
    timeLimit = 1800, // 30분 기본값
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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [panelDimensions, setPanelDimensions] = useState<PanelDimensions>({
    conversationWidth: screenWidth * 0.5,
    previewWidth: screenWidth * 0.5,
    headerHeight: layout.headerHeight,
    inputHeight: layout.promptInputMinHeight,
    availableHeight: 600, // 초기값
  });

  // Refs
  const promptInputRef = useRef<TextInput>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout>();
  const generationTimeoutRef = useRef<NodeJS.Timeout>();

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

      // TODO: Replace with actual API calls
      const mockProblem: VibeProblem = {
        id: problemId,
        title: '한 모델을 학습시켰는데 Validation Loss가 계속 줄지 않고 있습니다. 이 경우 어떤 조치를 취하시겠습니까?',
        description: 'ML 모델의 Validation Loss 개선을 위한 실전 솔루션을 AI와 협업하여 구현하세요.',
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

      // 초기 AI 인사 메시지 추가
      const initialMessage: ConversationMessage = {
        id: 'initial_' + Date.now(),
        role: 'ai',
        content: '안녕하세요! 저는 AI 면접관입니다. 주어진 문제를 함께 해결해보겠습니다. 어떤 접근 방식으로 시작하고 싶으신가요?',
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
  }, []);

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
          onPress: () => setTimeRemaining(300), // 5분 추가
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

      // Simulate AI generation process
      await simulateAIGeneration(trimmedPrompt, userMessage.id);

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

  // Simulate AI generation (mock implementation)
  const simulateAIGeneration = async (prompt: string, userMessageId: string) => {
    return new Promise<void>((resolve, reject) => {
      generationTimeoutRef.current = setTimeout(async () => {
        try {
          // Mock token calculation
          const estimatedTokens = Math.floor(prompt.length * 1.5) + Math.floor(Math.random() * 200) + 100;

          // Create AI response
          const aiMessage: ConversationMessage = {
            id: 'ai_' + Date.now(),
            role: 'ai',
            content: `좋은 질문입니다! Validation Loss가 개선되지 않는 문제에 대해 단계별로 접근해보겠습니다.

먼저 다음 체크리스트를 확인해보세요:

1. **과적합 여부 확인**
   - Training Loss vs Validation Loss 그래프 분석
   - Early stopping 적용 여부

2. **학습률 조정**
   - Learning rate scheduling 적용
   - Adaptive optimizers 사용 (Adam, AdamW)

다음은 실제 구현 코드입니다:`,
            timestamp: new Date(),
            tokensUsed: estimatedTokens,
            generationId: 'gen_' + Date.now(),
            metadata: {
              promptType: 'clarification',
              confidence: 0.87,
              processingTime: 2500,
            },
          };

          // Create generation result
          const generationResult: GenerationResult = {
            id: aiMessage.generationId!,
            sessionId: state.session!.id,
            conversationMessageId: aiMessage.id,
            generatedContent: aiMessage.content,
            extractedCode: `
import tensorflow as tf
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

# Early Stopping으로 과적합 방지
early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True
)

# 학습률 스케줄링
lr_scheduler = ReduceLROnPlateau(
    monitor='val_loss',
    factor=0.5,
    patience=5,
    min_lr=1e-7
)

# 모델 컴파일 (AdamW 옵티마이저 사용)
model.compile(
    optimizer=tf.keras.optimizers.AdamW(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# 학습 실행
history = model.fit(
    train_data,
    epochs=100,
    validation_data=val_data,
    callbacks=[early_stopping, lr_scheduler],
    verbose=1
)

# 학습 곡선 시각화
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.title('Model Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy')
plt.legend()

plt.show()
            `.trim(),
            language: 'python',
            tokensUsed: estimatedTokens,
            processingTime: 2500,
            confidence: 0.87,
            status: 'success',
            metadata: {
              aiProvider: 'openai',
              model: 'gpt-4',
              requestParameters: {
                maxTokens: 1000,
                temperature: 0.7,
                includeExplanation: true,
                codeStyle: 'documented',
                outputFormat: 'mixed',
              },
              qualityMetrics: {
                relevanceScore: 88,
                completenessScore: 85,
                clarityScore: 90,
                codeQualityScore: 87,
                estimatedAccuracy: 87,
              },
              extractionResults: {
                codeBlocks: [
                  {
                    id: 'code_1',
                    language: 'python',
                    code: aiMessage.content,
                    isMainSolution: true,
                    isExecutable: true,
                  },
                ],
                explanations: ['Early stopping과 learning rate scheduling을 활용한 과적합 방지 솔루션'],
                suggestions: ['데이터 증강 기법 추가 고려', '모델 아키텍처 최적화 검토'],
                warnings: ['대용량 데이터셋에서는 배치 크기 조정 필요'],
              },
            },
            userActions: [],
            createdAt: new Date(),
          };

          // Update state
          dispatch({ type: 'ADD_MESSAGE', payload: aiMessage });
          dispatch({ type: 'ADD_GENERATION', payload: generationResult });

          // Update token usage
          const newTokenUsage = state.tokenUsage.currentSession + estimatedTokens;
          dispatch({
            type: 'UPDATE_TOKEN_USAGE',
            payload: {
              currentSession: newTokenUsage,
              averagePerPrompt: Math.round(newTokenUsage / (state.session!.conversations.length + 1)),
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
      }, 2000 + Math.random() * 2000); // 2-4초 시뮬레이션
    });
  };

  // Handle various user actions
  const handleRetry = useCallback(() => {
    const lastUserMessage = state.session?.conversations
      .filter(msg => msg.role === 'user')
      .pop();

    if (lastUserMessage) {
      setPromptText(lastUserMessage.content);
      promptInputRef.current?.focus();
    }
  }, [state.session?.conversations]);

  const handlePin = useCallback(() => {
    if (state.currentGeneration) {
      Alert.alert('결과 고정', '현재 결과를 고정하시겠습니까?', [
        { text: '취소', style: 'cancel' },
        { text: '고정', onPress: () => {
          AccessibilityInfo.announceForAccessibility('결과가 고정되었습니다');
        }},
      ]);
    }
  }, [state.currentGeneration]);

  const handleSessionSubmit = useCallback(() => {
    Alert.alert(
      '세션 제출',
      '현재 세션을 제출하시겠습니까? 제출 후에는 수정할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제출',
          onPress: () => {
            // TODO: Implement session submission
            navigation.navigate(returnRoute as never);
            AccessibilityInfo.announceForAccessibility('세션이 제출되었습니다');
          },
        },
      ]
    );
  }, [navigation, returnRoute]);

  const handleSkip = useCallback(() => {
    Alert.alert(
      '문제 건너뛰기',
      '현재 문제를 건너뛰시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '건너뛰기', onPress: () => navigation.goBack() },
      ]
    );
  }, [navigation]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (generationTimeoutRef.current) {
      clearTimeout(generationTimeoutRef.current);
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
            style={styles.controlButton}
            onPress={() => {
              dispatch({ type: 'SET_ERROR', payload: null });
              initializeSession();
            }}
          >
            <Text style={styles.controlButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={gradientConfigs.header.colors}
        start={gradientConfigs.header.start}
        end={gradientConfigs.header.end}
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradientConfigs.progress.colors}
              start={gradientConfigs.progress.start}
              end={gradientConfigs.progress.end}
              style={styles.progressFill}
            />
          </View>

          {/* Header Content */}
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.levelText}>LV5 진행률</Text>
              <Text style={styles.problemCountText}>문제 1/5</Text>
            </View>

            <View style={styles.headerCenter}>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.difficultyBadge}>
                <Text style={styles.difficultyText}>
                  {difficulty === 'hard' ? 'Hard' : difficulty === 'medium' ? 'Medium' : 'Easy'}
                </Text>
              </View>
              <Text style={styles.difficultyLabel}>난이도</Text>
            </View>
          </View>
        </View>

        {/* AI Interviewer Section */}
        <View style={styles.aiInterviewerSection}>
          <View style={styles.aiInterviewerCard}>
            <LinearGradient
              colors={gradientConfigs.aiAvatar.colors}
              start={gradientConfigs.aiAvatar.start}
              end={gradientConfigs.aiAvatar.end}
              style={styles.aiAvatarContainer}
            >
              <Text style={styles.aiAvatarEmoji}>🤖</Text>
            </LinearGradient>
            <View style={styles.aiInterviewerInfo}>
              <Text style={styles.aiInterviewerName}>AI 면접관</Text>
              <Text style={styles.aiInterviewerRole}>Senior Technical Interviewer</Text>
            </View>
          </View>
        </View>

        {/* Main Content - Split Layout */}
        <View style={styles.mainContent}>
          {/* Left Panel - Conversation History */}
          <View style={[styles.conversationPanel, { width: panelDimensions.conversationWidth }]}>
            {/* Problem Section */}
            {state.problem && (
              <LinearGradient
                colors={gradientConfigs.questionCard.colors}
                start={gradientConfigs.questionCard.start}
                end={gradientConfigs.questionCard.end}
                style={styles.problemSection}
              >
                <View style={styles.problemBadge}>
                  <View style={styles.problemBadgeIcon} />
                  <Text style={styles.problemBadgeText}>질문 #1</Text>
                </View>
                <Text style={styles.problemTitle}>{state.problem.title}</Text>

                {state.problem.hints.length > 0 && (
                  <View style={styles.problemHint}>
                    <Text style={styles.problemHintText}>
                      {state.problem.hints[0].content}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            )}

            {/* Conversation Messages */}
            <ScrollView style={styles.conversationList} showsVerticalScrollIndicator={false}>
              {state.session?.conversations.map((message) => (
                <View key={message.id} style={styles.messageItem}>
                  <View style={message.role === 'user' ? styles.userMessage : styles.aiMessage}>
                    <Text style={styles.messageText}>{message.content}</Text>
                    <Text style={styles.messageTimestamp}>
                      {message.timestamp.toLocaleTimeString()}
                      {message.tokensUsed && ` • ${message.tokensUsed} tokens`}
                    </Text>
                  </View>
                </View>
              ))}

              {state.isGenerating && (
                <View style={styles.messageItem}>
                  <View style={styles.aiMessage}>
                    <ActivityIndicator size="small" color="#3B82F6" />
                    <Text style={styles.messageText}>AI가 응답을 생성하고 있습니다...</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Right Panel - Result Preview */}
          <View style={[styles.previewPanel, { width: panelDimensions.previewWidth }]}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>생성된 코드</Text>
              <Text style={styles.previewSubtitle}>
                {state.currentGeneration?.language || 'Python'} • 편집 가능
              </Text>
            </View>

            {state.currentGeneration?.extractedCode ? (
              <CodeEditor
                code={state.currentGeneration.extractedCode}
                language={state.currentGeneration.language || 'python'}
                onCodeChange={(code) => {
                  // TODO: Handle code changes
                }}
                showLineNumbers={true}
                theme="light"
              />
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                  {state.isGenerating ? 'AI가 코드를 생성하고 있습니다...' : '프롬프트를 입력하여 코드를 생성하세요'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom Section */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.bottomSection}
        >
          {/* Token Monitor */}
          <TokenMonitor
            usage={state.tokenUsage}
            onRecommendationPress={(recommendation) => {
              Alert.alert('토큰 효율성 팁', recommendation.message);
            }}
          />

          {/* Prompt Input Section */}
          <View style={styles.promptInputSection}>
            <View style={styles.promptAnnouncementContainer}>
              <Text style={styles.promptAnnouncementText}>📢 답변을 시작해주세요</Text>
            </View>

            <View style={[
              styles.promptInputContainer,
              isInputFocused && styles.promptInputFocused,
            ]}>
              <TextInput
                ref={promptInputRef}
                style={styles.promptTextInput}
                value={promptText}
                onChangeText={setPromptText}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="텍스트로 답변을 입력해주세요..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                maxLength={2000}
                accessibilityLabel="AI 프롬프트 입력창"
                accessibilityHint="AI에게 전달할 메시지를 입력하세요"
              />

              {!promptText && (
                <View style={styles.promptSuggestions}>
                  <Text style={styles.suggestionText}>
                    예: Validation Loss가 감소하지 않는 경우,
                  </Text>
                  <Text style={styles.suggestionText}>
                    먼저 과적합 여부를 확인하고...
                  </Text>
                </View>
              )}
            </View>

            {/* Control Buttons */}
            <View style={styles.controlButtonsContainer}>
              <TouchableOpacity
                style={[styles.controlButton, styles.skipButton]}
                onPress={handleSkip}
                accessibilityRole="button"
                accessibilityLabel="건너뛰기"
              >
                <Text style={[styles.controlButtonText, styles.skipButtonText]}>건너뛰기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.controlButton,
                  styles.submitButton,
                  (!promptText.trim() || state.isGenerating) && styles.controlButtonDisabled,
                ]}
                onPress={handlePromptSubmit}
                disabled={!promptText.trim() || state.isGenerating}
                accessibilityRole="button"
                accessibilityLabel={state.isGenerating ? "생성 중" : "답변 제출"}
              >
                <Text style={[styles.controlButtonText, styles.submitButtonText]}>
                  {state.isGenerating ? '생성 중...' : '답변 제출'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Generating Overlay */}
        {state.isGenerating && (
          <View style={styles.generatingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.generatingText}>AI가 응답을 생성하고 있습니다...</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default VibeSessionScreen;