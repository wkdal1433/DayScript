import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useHint, HintStep } from '../../hooks/useHint';
import { styles } from './Lv1OXProblemScreen.styles';
import { Lv1OXProblemScreenProps, OXAnswer, ProblemData, ResultState, ResultData } from './Lv1OXProblemScreen.types';
import ProblemReviewModal from '../../components/Modals/ProblemReviewModal';
import GoalCompletionModal from '../../components/Modals/GoalCompletionModal';
import {
  sessionManager,
  createNewSession,
  getCurrentProblem,
  submitAnswer,
  goToNextProblem,
  getSessionProgress,
  isSessionCompleted,
  clearCurrentSession
} from '../../data/sessionManager';
import { useCommunityIntegration } from './hooks/useCommunityIntegration';

const Lv1OXProblemScreen: React.FC<Lv1OXProblemScreenProps> = ({
  navigation,
  route,
  onAnswerSelect = (answer) => console.log('Answer selected:', answer),
  onClose = () => console.log('Screen closed'),
  onNext = () => console.log('Next problem'),
  onSessionComplete = () => console.log('Session completed'),
  onShowGoalModal = () => console.log('Show goal modal'),
  timeRemaining = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<OXAnswer | null>(null);
  const [resultState, setResultState] = useState<ResultState>('ANSWERING');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [currentProblemData, setCurrentProblemData] = useState<ProblemData | null>(null);
  const [sessionProgress, setSessionProgress] = useState({ current: 1, total: 10, percentage: 10 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showGoalCompletionModal, setShowGoalCompletionModal] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);

  // Community integration
  const {
    showCommunityPrompt,
    getCommunityActions,
    getCommunityHeaderButton,
    handleCommunityNavigation,
    trackEngagement
  } = useCommunityIntegration({
    navigation: {
      navigate: (screen: string, params?: any) => {
        if (screen === 'ProblemDiscussion') {
          // TODO: This should integrate with AppNavigator's mockNavigation
          console.log('Navigate to ProblemDiscussion with params:', params);
          // For now, just log - actual navigation will be implemented when integrated with the main navigator
        } else {
          console.log('Navigate:', screen, params);
        }
      }
    },
    screenType: 'Lv1OXProblem',
    screenData: {
      problemId: `lv1_ox_${sessionProgress.current}`,
      problemTitle: currentProblemData?.title,
      level: 1,
      category: currentProblemData?.category,
    },
    onCommunityNavigation: () => {
      trackEngagement({
        type: 'navigation',
        source: 'Lv1OXProblem',
        action: 'community_access',
      });
    },
  });

  // Hint system integration
  const hintConfig = { maxSteps: 2, xpDeductionPerStep: 5 };
  const {
    hintState,
    hintAnimation,
    slideAnimation,
    showHint,
    nextHint,
    hideHint,
    resetHint,
    getCurrentHintData,
    isLastStep,
  } = useHint(hintConfig);

  // Mock hint data for OX problems
  const hintData: HintStep[] = [
    {
      id: 1,
      title: '💡 개념적 단서',
      content: currentProblemData?.hints?.[0] || '이 문제의 핵심 개념을 떠올려보세요.',
      type: 'concept',
    },
    {
      id: 2,
      title: '⚖️ 판단 기준',
      content: currentProblemData?.hints?.[1] || '참/거짓을 판단하는 명확한 기준이 있습니다.',
      type: 'context',
    },
  ];

  // Initialize session and get current problem
  useEffect(() => {
    try {
      console.log('🔄 Initializing LV1 OX Problem session...');
      let currentSession = sessionManager.getCurrentSession();

      // Create new session if none exists
      if (!currentSession) {
        console.log('📝 Creating new OX session...');
        currentSession = createNewSession('OX', 10);
        console.log('✅ New session created:', currentSession?.id);
      } else {
        console.log('♻️ Using existing session:', currentSession?.id);
      }

      // Load current problem
      const problem = getCurrentProblem() as ProblemData;
      if (problem) {
        console.log('📖 Problem loaded successfully:', problem.id, problem.title);
        setCurrentProblemData(problem);
      } else {
        console.error('❌ CRITICAL: No problem data available!');
        console.log('Session state:', currentSession);
        console.log('Available problems:', currentSession?.problems?.length || 0);
        // Set a fallback error state or message
        setCurrentProblemData(null);
      }

      // Update progress
      const progress = getSessionProgress();
      console.log('📊 Session progress:', progress);
      setSessionProgress(progress);
    } catch (error) {
      console.error('💥 Error initializing LV1 OX session:', error);
      setCurrentProblemData(null);
    }
  }, []);

  useEffect(() => {
    // Calculate progress percentage based on session progress
    const progressPercentage = sessionProgress.percentage;
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [sessionProgress, progressAnimation]);

  const handleAnswerPress = (answer: OXAnswer) => {
    if (selectedAnswer || resultState !== 'ANSWERING' || !currentProblemData) return;

    setSelectedAnswer(answer);
    onAnswerSelect(answer);

    // Determine if answer is correct
    const isCorrect = answer === currentProblemData.correctAnswer;
    const newResultState: ResultState = isCorrect ? 'CORRECT' : 'INCORRECT';

    // Submit answer to session manager
    submitAnswer(answer, isCorrect);

    // Get current session stats for result data
    const progress = getSessionProgress();
    const sessionStats = sessionManager.getSessionStats();

    // Create result data
    const result: ResultData = {
      isCorrect,
      userAnswer: answer,
      correctAnswer: currentProblemData.correctAnswer,
      explanation: currentProblemData.explanation,
      pointsEarned: isCorrect ? 10 : 0,
      streakCount: isCorrect ? 4 : 0, // Mock streak count
      currentScore: sessionStats?.correctAnswers.toString() || '0',
      totalScore: progress.total.toString(),
      experiencePoints: {
        current: isCorrect ? 660 : 650, // Mock XP gain
        required: 1000
      },
      achievements: isCorrect ? ['🏆 연속 정답 배지 획득!'] : undefined
    };

    setResultData(result);
    setResultState(newResultState);

    // Show community prompt after answer submission
    showCommunityPrompt({
      isCorrect,
      userAnswer: answer,
      explanation: currentProblemData.explanation,
      hintUsage: hintState.usedSteps,
    });
  };

  const handleNextProblem = () => {
    // Check if session is completed
    if (isSessionCompleted()) {
      // Session completed, trigger completion callback
      if (onSessionComplete) {
        onSessionComplete();
      }
      return;
    }

    // Move to next problem in session
    const hasNextProblem = goToNextProblem();

    if (hasNextProblem) {
      // Reset states for next problem
      setSelectedAnswer(null);
      setResultState('ANSWERING');
      setResultData(null);
      resetHint();

      // Load next problem
      const nextProblem = getCurrentProblem() as ProblemData;
      if (nextProblem) {
        setCurrentProblemData(nextProblem);
      }

      // Update progress
      const progress = getSessionProgress();
      setSessionProgress(progress);

      onNext();
    } else {
      // No more problems, complete session
      if (onSessionComplete) {
        onSessionComplete();
      }
    }
  };

  const handleRetryProblem = () => {
    // Reset to problem view (keeping original functionality as fallback)
    setSelectedAnswer(null);
    setResultState('ANSWERING');
    setResultData(null);
    resetHint();
  };

  // Handle hint request
  const handleHintRequest = () => {
    if (!hintState.isVisible) {
      showHint();
    } else if (!isLastStep()) {
      nextHint();
    }
  };

  // Render HintBubble component
  const renderHintBubble = () => {
    if (!hintState.isVisible) return null;

    const currentHint = getCurrentHintData(hintData);
    if (!currentHint) return null;

    return (
      <Animated.View
        style={[
          styles.hintBubble,
          {
            opacity: hintAnimation,
            transform: [{ translateY: slideAnimation }],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`힌트 ${hintState.currentStep}단계`}
        accessibilityLiveRegion="polite"
      >
        <View style={styles.hintBubbleHeader}>
          <Text style={styles.hintBubbleTitle}>{currentHint.title}</Text>
          <TouchableOpacity
            style={styles.hintBubbleClose}
            onPress={hideHint}
            accessibilityRole="button"
            accessibilityLabel="힌트 닫기"
          >
            <Text style={styles.hintBubbleCloseText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hintBubbleContent}>{currentHint.content}</Text>

        {/* XP Deduction Notice */}
        <View style={styles.xpNotice}>
          <Text style={styles.xpNoticeText}>
            💰 힌트 사용으로 {hintState.currentStep * 5} XP가 차감되었습니다
          </Text>
        </View>

        <View style={styles.hintBubbleActions}>
          <Text style={styles.hintStepText}>
            단계 {hintState.currentStep} / {hintConfig.maxSteps}
          </Text>

          {!isLastStep() && (
            <TouchableOpacity
              style={styles.hintNextButton}
              onPress={handleHintRequest}
              accessibilityRole="button"
              accessibilityLabel="다음 힌트 보기"
            >
              <Text style={styles.hintNextButtonText}>힌트 더보기</Text>
            </TouchableOpacity>
          )}

          {isLastStep() && (
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

  const handleClose = () => {
    // Clear session when closing
    clearCurrentSession();

    // Use navigation.goBack() if available, fallback to onClose callback
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      onClose();
    }
  };

  const handleGoalCompletion = async () => {
    try {
      // Get final session statistics
      const currentSession = sessionManager.getCurrentSession();
      const stats = sessionManager.getSessionStats();

      if (stats) {
        setSessionStats(stats);
      }

      // Mark session as completed
      if (currentSession && !currentSession.isCompleted) {
        currentSession.isCompleted = true;
      }

      // Show the goal completion modal with animation
      setShowGoalCompletionModal(true);

      // Trigger session completion callback
      onSessionComplete();

      // Call original goal modal callback as fallback
      onShowGoalModal();

      console.log('🎯 Goal completion flow triggered', { stats, sessionCompleted: true });
    } catch (error) {
      console.error('❌ Error in goal completion flow:', error);
      // Fallback to original callback
      onShowGoalModal();
    }
  };

  const handleGoalModalClose = () => {
    setShowGoalCompletionModal(false);
  };

  const handleGoalModalGoHome = () => {
    setShowGoalCompletionModal(false);
    // Clear session data
    clearCurrentSession();
    // Navigate back to home
    if (navigation?.goBack) {
      navigation.goBack();
    } else {
      onClose();
    }
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  // Render Result View based on Figma design
  const renderResultView = () => {
    if (!resultData) return null;

    const { isCorrect, explanation, pointsEarned, streakCount, currentScore, totalScore, experiencePoints, achievements } = resultData;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header Section - Same as problem view */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleClose}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.problemCounter}>문제 {sessionProgress.current} / {sessionProgress.total}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentProblemData?.category || ''}</Text>
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

          {/* Community Actions */}
          <View style={styles.communityActionContainer}>
            {getCommunityActions({ isCorrect, userAnswer: resultData?.userAnswer }).map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.communityActionButton,
                        action.style === 'success' && styles.communityActionSuccess,
                        action.style === 'warning' && styles.communityActionWarning,
                        action.style === 'info' && styles.communityActionInfo]}
                onPress={action.onPress}
                activeOpacity={0.8}
              >
                <Text style={[styles.communityActionTitle,
                             action.style === 'success' && styles.communityActionTitleSuccess,
                             action.style === 'warning' && styles.communityActionTitleWarning,
                             action.style === 'info' && styles.communityActionTitleInfo]}>
                  {action.title}
                </Text>
                <Text style={styles.communityActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.resultActionButtons}>
            {(sessionProgress.current >= sessionProgress.total) ? (
              <TouchableOpacity
                style={styles.goalCompleteButton}
                onPress={handleGoalCompletion}
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
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.problemCounter}>문제 {sessionProgress.current} / {sessionProgress.total}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentProblemData?.category || ''}</Text>
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

      {/* Problem Content */}
      <View style={styles.problemContainer}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{currentProblemData?.emoji || '🤔'}</Text>
        </View>

        <Text style={styles.problemTitle}>{currentProblemData?.title || ''}</Text>
        <Text style={styles.problemSubtitle}>{currentProblemData?.subtitle || ''}</Text>

        {/* Hint Button */}
        <TouchableOpacity
          style={[
            styles.hintButton,
            hintState.isVisible && styles.hintButtonActive,
          ]}
          onPress={handleHintRequest}
          disabled={resultState !== 'ANSWERING'}
          accessibilityRole="button"
          accessibilityLabel="힌트 보기"
        >
          <Text style={[
            styles.hintButtonText,
            hintState.isVisible && styles.hintButtonTextActive,
          ]}>
            💡 힌트 보기 {hintState.usedSteps > 0 && `(${hintState.usedSteps}/${hintConfig.maxSteps})`}
          </Text>
        </TouchableOpacity>

        {/* Hint Bubble */}
        {renderHintBubble()}
      </View>

      {/* Answer Buttons - with background color transition */}
      <View style={[
        styles.answerSection,
        hintState.isVisible && styles.answerSectionHinted,
      ]}>
        <TouchableOpacity
          style={[
            styles.answerButton,
            styles.answerButtonX,
            selectedAnswer === 'X' && styles.answerButtonSelected,
          ]}
          onPress={() => handleAnswerPress('X')}
          disabled={selectedAnswer !== null}
          activeOpacity={0.8}
        >
          <View style={styles.answerIconContainer}>
            <Text style={styles.answerIconX}>✕</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.answerButton,
            styles.answerButtonO,
            selectedAnswer === 'O' && styles.answerButtonSelected,
          ]}
          onPress={() => handleAnswerPress('O')}
          disabled={selectedAnswer !== null}
          activeOpacity={0.8}
        >
          <View style={styles.answerIconContainer}>
            <Text style={styles.answerIconO}>○</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Progress Section */}
      <View style={styles.bottomSection}>
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
          <Text style={styles.progressLabel}>진행률</Text>
          <Text style={styles.progressPercentage}>{sessionProgress.percentage}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );

  // Error state render
  const renderErrorState = () => (
    <SafeAreaView style={styles.container}>
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FF4D4D', marginBottom: 10 }}>
          ❌ 문제를 불러올 수 없습니다
        </Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          문제 데이터를 로딩하는 중 오류가 발생했습니다.{'\n'}
          앱을 다시 시작하거나 잠시 후 다시 시도해주세요.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#F2BED1',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
          onPress={() => {
            console.log('🔄 Retrying problem load...');
            // Clear any existing session and retry
            clearCurrentSession();
            // Trigger re-initialization
            let currentSession = createNewSession('OX', 10);
            const problem = getCurrentProblem() as ProblemData;
            if (problem) {
              setCurrentProblemData(problem);
              const progress = getSessionProgress();
              setSessionProgress(progress);
            }
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>다시 시도</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: '#666',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
          onPress={handleClose}
        >
          <Text style={{ color: 'white' }}>뒤로 가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Main render based on current state
  return (
    <>
      {!currentProblemData ?
        renderErrorState() :
        (resultState === 'CORRECT' || resultState === 'INCORRECT') ? renderResultView() : renderProblemView()
      }

      <ProblemReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        problemData={currentProblemData}
        userAnswer={selectedAnswer || ''}
        isCorrect={resultData?.isCorrect || false}
        problemType="OX"
      />

      {/* Goal Completion Modal */}
      <GoalCompletionModal
        visible={showGoalCompletionModal}
        onRequestClose={handleGoalModalClose}
        onGoHome={handleGoalModalGoHome}
        experiencePoints={sessionStats?.correctAnswers ? sessionStats.correctAnswers * 10 : 50}
        animationDuration={1400}
      />
    </>
  );
};

export default Lv1OXProblemScreen;