import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from './Lv3FillInTheBlankProblemScreen.styles';
import {
  Lv3FillInTheBlankProblemScreenProps,
  FillInTheBlankAnswer,
  FillInTheBlankProblemData,
  ResultState,
  FillInTheBlankResultData,
  CodeLine,
  BlankField,
} from './Lv3FillInTheBlankProblemScreen.types';
import ProblemReviewModal from '../../components/Modals/ProblemReviewModal';

// Mock data for development - this will be replaced with actual data from sessionManager
const mockProblemData: FillInTheBlankProblemData = {
  id: 'fill_blank_001',
  title: '다음 Python 코드에서 빈칸에 들어갈',
  subtitle: '올바른 키워드를 입력하세요.',
  description: 'Python 반복문에서 사용되는 키워드를 입력하세요.',
  category: 'Python 기초',
  codeLines: [
    {
      lineNumber: 1,
      content: '___',
      hasBlank: true,
      blankField: {
        id: 'blank_1',
        placeholder: '___',
        correctAnswer: 'for',
        position: 0,
      },
    },
    {
      lineNumber: 2,
      content: '    print(i)',
      hasBlank: false,
    },
  ],
  correctAnswers: {
    blank_1: 'for',
  },
  explanation: 'Python에서 반복문을 만들 때는 "for" 키워드를 사용합니다.',
  hints: [
    'Python의 반복문 키워드입니다.',
    '영어로 "~동안"이라는 의미입니다.',
    'F로 시작하는 3글자 단어입니다.'
  ],
};

// Mock hint data for 3-step progressive system
const mockHintData = {
  step1: {
    title: '💡 개념적 단서',
    content: 'Python에서 반복작업을 수행할 때 사용하는 핵심 키워드입니다.',
    type: 'concept' as const,
  },
  step2: {
    title: '📍 문맥 힌트',
    content: '아래 코드에서 하이라이트된 부분을 주의깊게 보세요.',
    type: 'context' as const,
    highlightText: 'print(i)',
  },
  step3: {
    title: '🎯 부분 정답',
    content: '첫 글자를 알려드릴게요!',
    type: 'partial' as const,
    partialAnswer: 'f',
  },
};

const Lv3FillInTheBlankProblemScreen: React.FC<Lv3FillInTheBlankProblemScreenProps> = ({
  onAnswerSubmit = (answers) => console.log('Answer submitted:', answers),
  onClose = () => console.log('Screen closed'),
  onNext = () => console.log('Next problem'),
  onSessionComplete = () => console.log('Session completed'),
  onShowGoalModal = () => console.log('Show goal modal'),
  timeRemaining = 30,
  problemData = mockProblemData,
}) => {
  const [userAnswers, setUserAnswers] = useState<{ [blankId: string]: string }>({});
  const [resultState, setResultState] = useState<ResultState>('ANSWERING');
  const [resultData, setResultData] = useState<FillInTheBlankResultData | null>(null);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [sessionProgress, setSessionProgress] = useState({ current: 2, total: 10, percentage: 20 });
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Hint system states
  const [showHint, setShowHint] = useState(false);
  const [currentHintStep, setCurrentHintStep] = useState(1);
  const [usedHints, setUsedHints] = useState(0);
  const [highlightText, setHighlightText] = useState<string | null>(null);
  const [partialAnswer, setPartialAnswer] = useState<string | null>(null);

  // Animation refs
  const hintAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Initialize session progress animation
    const progressPercentage = sessionProgress.percentage;
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [sessionProgress, progressAnimation]);

  // Handle blank input changes
  const handleBlankChange = (blankId: string, text: string) => {
    if (resultState !== 'ANSWERING') return; // Prevent changes after submission

    setUserAnswers(prev => ({
      ...prev,
      [blankId]: text,
    }));
  };

  // Check if all blanks are filled
  const isAllBlanksFilled = () => {
    const requiredBlanks = Object.keys(problemData.correctAnswers);
    return requiredBlanks.every(blankId =>
      userAnswers[blankId] && userAnswers[blankId].trim().length > 0
    );
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (!isAllBlanksFilled() || resultState !== 'ANSWERING') return;

    // Check answers
    const correctAnswers = problemData.correctAnswers;
    let correctCount = 0;
    const totalBlanks = Object.keys(correctAnswers).length;

    Object.keys(correctAnswers).forEach(blankId => {
      const userAnswer = userAnswers[blankId]?.toLowerCase().trim();
      const correctAnswer = correctAnswers[blankId].toLowerCase().trim();
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });

    const isCorrect = correctCount === totalBlanks;
    const newResultState: ResultState = isCorrect ? 'CORRECT' : 'INCORRECT';

    // Create result data
    const result: FillInTheBlankResultData = {
      isCorrect,
      userAnswer: Object.values(userAnswers).join(', '),
      correctAnswer: Object.values(correctAnswers).join(', '),
      explanation: problemData.explanation,
      pointsEarned: isCorrect ? 20 : 0,
      streakCount: isCorrect ? 2 : 0,
      currentScore: isCorrect ? '2' : '1',
      totalScore: sessionProgress.total.toString(),
      experiencePoints: {
        current: isCorrect ? 720 : 680,
        required: 1000,
      },
      achievements: isCorrect ? ['🎯 정확한 코딩!'] : undefined,
    };

    setResultData(result);
    setResultState(newResultState);
    onAnswerSubmit(userAnswers);
  };

  // Handle next problem
  const handleNextProblem = () => {
    // Reset states for next problem
    setUserAnswers({});
    setResultState('ANSWERING');
    setResultData(null);

    // Update progress (mock)
    const newProgress = {
      current: sessionProgress.current + 1,
      total: sessionProgress.total,
      percentage: Math.round(((sessionProgress.current + 1) / sessionProgress.total) * 100),
    };
    setSessionProgress(newProgress);

    onNext();
  };

  // Handle retry problem
  const handleRetryProblem = () => {
    setUserAnswers({});
    setResultState('ANSWERING');
    setResultData(null);
  };

  // XP deduction mock function
  const deductXPForHint = (hintStep: number) => {
    const xpDeduction = hintStep * 5; // 5 XP per hint step
    console.log(`XP deducted: ${xpDeduction} points for hint step ${hintStep}`);
    // In a real app, this would update the user's XP in the backend
    return xpDeduction;
  };

  // Handle hint request
  const handleHintRequest = () => {
    if (showHint && currentHintStep < 3) {
      // Move to next hint step
      setCurrentHintStep(prev => prev + 1);
      setUsedHints(prev => prev + 1);
      deductXPForHint(currentHintStep + 1);

      // Apply hint effects based on step
      const nextStep = currentHintStep + 1;
      if (nextStep === 2) {
        setHighlightText(mockHintData.step2.highlightText);
      } else if (nextStep === 3) {
        setPartialAnswer(mockHintData.step3.partialAnswer);
        // Auto-fill first character
        const blankId = Object.keys(problemData.correctAnswers)[0];
        if (blankId) {
          setUserAnswers(prev => ({
            ...prev,
            [blankId]: mockHintData.step3.partialAnswer + '___'
          }));
        }
      }
    } else if (!showHint) {
      // Show first hint
      setShowHint(true);
      setCurrentHintStep(1);
      setUsedHints(1);
      deductXPForHint(1);

      // Animate hint card appearance
      Animated.parallel([
        Animated.timing(hintAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  // Handle hint close
  const handleHintClose = () => {
    Animated.parallel([
      Animated.timing(hintAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnimation, {
        toValue: 50,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowHint(false);
    });
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  // Render HintCard component
  const renderHintCard = () => {
    const getCurrentHintData = () => {
      switch (currentHintStep) {
        case 1: return mockHintData.step1;
        case 2: return mockHintData.step2;
        case 3: return mockHintData.step3;
        default: return mockHintData.step1;
      }
    };

    const hintData = getCurrentHintData();
    const isLastStep = currentHintStep === 3;

    return (
      <Animated.View
        style={[
          styles.hintCard,
          {
            opacity: hintAnimation,
            transform: [{ translateY: slideAnimation }],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`힌트 카드 ${currentHintStep}단계`}
        accessibilityLiveRegion="polite"
      >
        {/* Header */}
        <View style={styles.hintCardHeader}>
          <Text style={styles.hintTitle}>{hintData.title}</Text>
          <TouchableOpacity
            style={styles.hintCloseButton}
            onPress={handleHintClose}
            accessibilityRole="button"
            accessibilityLabel="힌트 카드 닫기"
          >
            <Text style={styles.hintCloseText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text style={styles.hintContent}>{hintData.content}</Text>

        {/* Context Highlight for Step 2 */}
        {currentHintStep === 2 && highlightText && (
          <View style={styles.highlightedText}>
            <Text style={styles.hintContent}>"{highlightText}"</Text>
          </View>
        )}

        {/* XP Deduction Notice */}
        <View style={styles.xpDeductionNotice}>
          <Text style={styles.xpDeductionText}>
            💰 힌트 사용으로 {currentHintStep * 5} XP가 차감되었습니다
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.hintActions}>
          <Text style={styles.hintStepInfo}>
            단계 {currentHintStep} / 3
          </Text>

          {!isLastStep && (
            <TouchableOpacity
              style={styles.hintNextButton}
              onPress={handleHintRequest}
              accessibilityRole="button"
              accessibilityLabel="다음 힌트 보기"
            >
              <Text style={styles.hintNextButtonText}>힌트 더보기</Text>
            </TouchableOpacity>
          )}

          {isLastStep && (
            <TouchableOpacity
              style={[styles.hintNextButton, styles.hintNextButtonDisabled]}
              disabled={true}
            >
              <Text style={[styles.hintNextButtonText, styles.hintNextButtonTextDisabled]}>
                마지막 힌트
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  // Render a single code line with potential blank input
  const renderCodeLine = (codeLine: CodeLine) => {
    if (!codeLine.hasBlank || !codeLine.blankField) {
      // Regular code line without blank
      return (
        <View key={codeLine.lineNumber} style={styles.codeLine}>
          <Text style={styles.lineNumber}>{codeLine.lineNumber}</Text>
          <Text style={styles.codeText}>{codeLine.content}</Text>
        </View>
      );
    }

    // Code line with blank input
    const blankField = codeLine.blankField;
    const userAnswer = userAnswers[blankField.id] || '';
    const isCorrect = resultState !== 'ANSWERING' &&
      userAnswer.toLowerCase().trim() === blankField.correctAnswer.toLowerCase().trim();
    const isIncorrect = resultState !== 'ANSWERING' && !isCorrect;

    // Parse content to show blank input in context
    const parts = codeLine.content.split(blankField.placeholder);

    return (
      <View key={codeLine.lineNumber} style={styles.codeLine}>
        <Text style={styles.lineNumber}>{codeLine.lineNumber}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
          {parts[0] && <Text style={styles.codeText}>{parts[0]}</Text>}
          <View style={[
            styles.blankContainer,
            isCorrect && styles.blankInputCorrect,
            isIncorrect && styles.blankInputIncorrect,
          ]}>
            <TextInput
              style={[
                styles.blankInput,
                isCorrect && { color: '#FFFFFF' },
                isIncorrect && { color: '#FFFFFF' },
              ]}
              value={userAnswer}
              onChangeText={(text) => handleBlankChange(blankField.id, text)}
              placeholder={blankField.placeholder}
              placeholderTextColor="#BE185D"
              autoCorrect={false}
              autoCapitalize="none"
              editable={resultState === 'ANSWERING'}
              multiline={false}
              textAlign="center"
            />
          </View>
          {parts[1] && (
            <Text style={[
              styles.codeText,
              currentHintStep === 2 && highlightText === 'print(i)' && parts[1].includes('print(i)')
                ? styles.highlightedText
                : {}
            ]}>
              {parts[1]}
            </Text>
          )}
        </View>
      </View>
    );
  };

  // Render Result View
  const renderResultView = () => {
    if (!resultData) return null;

    const { isCorrect, explanation, pointsEarned, currentScore, totalScore, experiencePoints, achievements } = resultData;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header Section - Same as problem view */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.problemCounter}>문제 {sessionProgress.current} / {sessionProgress.total}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{problemData.category}</Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        {/* Progress Bar - Same as problem view */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Result Content */}
        <View style={styles.resultContentContainer}>
          {/* Achievement Badge (only for correct answers) */}
          {isCorrect && achievements && achievements.length > 0 && (
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementText}>{achievements[0]}</Text>
            </View>
          )}

          {/* Result Status */}
          <View style={styles.resultStatusContainer}>
            <Text style={[styles.resultStatusText, isCorrect ? styles.correctText : styles.incorrectText]}>
              {isCorrect ? '정답입니다!' : '오답입니다!'}
            </Text>
          </View>

          {/* Celebration Message and Explanation */}
          <View style={styles.explanationContainer}>
            <Text style={styles.celebrationText}>
              {isCorrect ? '🎉 훌륭해요!' : '💪 다시 한번!'}
            </Text>
            <Text style={styles.explanationText}>{explanation}</Text>
          </View>
        </View>

        {/* Bottom Stats Section */}
        <View style={styles.resultBottomSection}>
          {/* Score and Points */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>정답: {currentScore} / {totalScore}</Text>
              {pointsEarned > 0 && (
                <View style={styles.pointsContainer}>
                  <Text style={styles.pointsText}>✨ +{pointsEarned} 포인트</Text>
                </View>
              )}
            </View>

            {/* Experience Points */}
            <View style={styles.expContainer}>
              <Text style={styles.expLabel}>🌟 학습 경험치</Text>
              <Text style={styles.expText}>{experiencePoints.current} / {experiencePoints.required} XP</Text>
            </View>
            <View style={styles.expBarContainer}>
              <View style={styles.expBarBg}>
                <View
                  style={[
                    styles.expBarFill,
                    { width: `${(experiencePoints.current / experiencePoints.required) * 100}%` }
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.resultActionButtons}>
            {(sessionProgress.current >= sessionProgress.total) ? (
              <TouchableOpacity
                style={styles.goalCompleteButton}
                onPress={onShowGoalModal}
                activeOpacity={0.8}
              >
                <Text style={styles.goalCompleteButtonText}>🎯 오늘의 목표 완료</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextProblem}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>다음 문제로 이동 →</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => setShowReviewModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>📖 문제 다시 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  // Render Problem View
  const renderProblemView = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.problemCounter}>문제 {sessionProgress.current} / {sessionProgress.total}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{problemData.category}</Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Problem Content */}
          <View style={styles.problemContainer}>
            <View style={styles.problemHeader}>
              <View style={styles.problemBadge}>
                <Text style={styles.problemBadgeText}>🎯 빈칸 채우기</Text>
              </View>
              <Text style={styles.problemTitle}>{problemData.title}</Text>
              <Text style={styles.problemSubtitle}>{problemData.subtitle}</Text>
            </View>

            {/* Code Block */}
            <View style={styles.codeContainer}>
              {problemData.codeLines.map(renderCodeLine)}
            </View>
          </View>

        </ScrollView>

        {/* Hint Card */}
        {showHint && renderHintCard()}

        {/* Bottom Submit Section */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.hintButton}
              onPress={handleHintRequest}
              disabled={resultState !== 'ANSWERING'}
              activeOpacity={0.8}
            >
              <Text style={styles.hintButtonText}>💡 힌트 보기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isAllBlanksFilled() && styles.submitButtonEnabled,
              ]}
              onPress={handleSubmit}
              disabled={!isAllBlanksFilled() || resultState !== 'ANSWERING'}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.submitButtonText,
                isAllBlanksFilled() && styles.submitButtonTextEnabled,
              ]}>
                정답 제출하기
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomProgressContainer}>
            <View style={styles.bottomProgressBar}>
              <Animated.View
                style={[
                  styles.bottomProgressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>전체 진행률</Text>
              <Text style={styles.progressPercentage}>{sessionProgress.percentage}%</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );

  // Main render based on current state
  return (
    <>
      {(resultState === 'CORRECT' || resultState === 'INCORRECT') ? renderResultView() : renderProblemView()}

      <ProblemReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        problemData={problemData}
        userAnswer={Object.values(userAnswers).join(', ')}
        isCorrect={resultData?.isCorrect || false}
        problemType="FILL_IN_THE_BLANK"
      />
    </>
  );
};

export default Lv3FillInTheBlankProblemScreen;