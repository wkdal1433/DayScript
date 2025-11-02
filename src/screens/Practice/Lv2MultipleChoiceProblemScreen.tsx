import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import { useHint, HintStep } from '../../hooks/useHint';
import { styles } from './Lv2MultipleChoiceProblemScreen.styles';
import {
  Lv2MultipleChoiceProblemScreenProps,
  MultipleChoiceAnswer,
  MultipleChoiceProblemData,
  ChoiceOption,
  ResultState,
  MultipleChoiceResultData
} from './Lv2MultipleChoiceProblemScreen.types';
import ProblemReviewModal from '../../components/Modals/ProblemReviewModal';
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

const Lv2MultipleChoiceProblemScreen: React.FC<Lv2MultipleChoiceProblemScreenProps> = ({
  onAnswerSelect = (answer) => console.log('Answer selected:', answer),
  onClose = () => console.log('Screen closed'),
  onNext = () => console.log('Next problem'),
  onSessionComplete = () => console.log('Session completed'),
  onShowGoalModal = () => console.log('Show goal modal'),
  timeRemaining = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<MultipleChoiceAnswer | null>(null);
  const [resultState, setResultState] = useState<ResultState>('ANSWERING');
  const [resultData, setResultData] = useState<MultipleChoiceResultData | null>(null);
  const [progressAnimation] = useState(new Animated.Value(0));
  const [currentProblemData, setCurrentProblemData] = useState<MultipleChoiceProblemData | null>(null);
  const [sessionProgress, setSessionProgress] = useState({ current: 1, total: 10, percentage: 10 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  // Hint system integration
  const hintConfig = { maxSteps: 2, xpDeductionPerStep: 5 };
  const {
    hintState,
    hintAnimation,
    slideAnimation,
    scaleAnimation,
    showHint,
    nextHint,
    hideHint,
    resetHint,
    getCurrentHintData,
    isLastStep,
  } = useHint(hintConfig);

  // Mock hint data for Multiple Choice problems
  const hintData: HintStep[] = [
    {
      id: 1,
      title: '💡 단서 제공',
      content: currentProblemData?.hints?.[0] || '이 문제를 해결하는 데 도움이 되는 핵심 단서입니다.',
      type: 'concept',
    },
    {
      id: 2,
      title: '❌ 오답 제거',
      content: '명백하게 틀린 선택지 하나를 제거해드릴게요!',
      type: 'elimination',
      data: {
        eliminateOptionId: getIncorrectOptionToEliminate(),
      },
    },
  ];

  // Function to get an incorrect option to eliminate
  function getIncorrectOptionToEliminate(): MultipleChoiceAnswer | null {
    if (!currentProblemData) return null;

    const incorrectOptions = currentProblemData.choices
      .filter(choice => !choice.isCorrect)
      .map(choice => choice.id);

    // Return the first incorrect option, or null if none found
    return incorrectOptions.length > 0 ? incorrectOptions[0] : null;
  }

  // Initialize session and get current problem
  useEffect(() => {
    let currentSession = sessionManager.getCurrentSession();

    // Create new session if none exists
    if (!currentSession) {
      currentSession = createNewSession('MULTIPLE_CHOICE', 10);
    }

    // Load current problem
    const problem = getCurrentProblem() as MultipleChoiceProblemData;
    if (problem) {
      setCurrentProblemData(problem);
    }

    // Update progress
    const progress = getSessionProgress();
    setSessionProgress(progress);
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

  const handleChoicePress = (choiceId: MultipleChoiceAnswer) => {
    if (resultState !== 'ANSWERING') return; // Only prevent selection after submission

    setSelectedAnswer(choiceId);
    onAnswerSelect(choiceId);
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
      setEliminatedOptions([]);
      resetHint();

      // Load next problem
      const nextProblem = getCurrentProblem() as MultipleChoiceProblemData;
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
    // Reset to problem view
    setSelectedAnswer(null);
    setResultState('ANSWERING');
    setResultData(null);
    setEliminatedOptions([]);
    resetHint();
  };

  // Handle hint request
  const handleHintRequest = () => {
    if (!hintState.isVisible) {
      showHint();
    } else if (!isLastStep()) {
      nextHint();

      // Apply elimination effect for step 2
      const nextStepData = hintData.find(hint => hint.id === 2);
      if (nextStepData && nextStepData.type === 'elimination' && nextStepData.data && nextStepData.data.eliminateOptionId) {
        setEliminatedOptions([nextStepData.data.eliminateOptionId]);
      }
    }
  };

  // Render HintCard component
  const renderHintCard = () => {
    if (!hintState.isVisible) return null;

    const currentHint = getCurrentHintData(hintData);
    if (!currentHint) return null;

    return (
      <Animated.View
        style={[
          styles.hintCard,
          {
            opacity: hintAnimation,
            transform: [
              { translateY: slideAnimation },
              { scale: scaleAnimation },
            ],
          },
        ]}
        accessibilityRole="alert"
        accessibilityLabel={`힌트 카드 ${hintState.currentStep}단계`}
        accessibilityLiveRegion="polite"
      >
        <View style={styles.hintCardHeader}>
          <Text style={styles.hintCardTitle}>{currentHint.title}</Text>
          <TouchableOpacity
            style={styles.hintCardClose}
            onPress={hideHint}
            accessibilityRole="button"
            accessibilityLabel="힌트 카드 닫기"
          >
            <Text style={styles.hintCardCloseText}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hintCardContent}>{currentHint.content}</Text>

        {/* Elimination Notice for Step 2 */}
        {currentHint.type === 'elimination' && eliminatedOptions.length > 0 && (
          <View style={styles.eliminationNotice}>
            <Text style={styles.eliminationText}>
              ⚙️ 오답 선택지가 회색으로 표시되었습니다!
            </Text>
          </View>
        )}

        {/* XP Deduction Notice */}
        <View style={styles.xpNotice}>
          <Text style={styles.xpNoticeText}>
            💰 힌트 사용으로 {hintState.currentStep * 5} XP가 차감되었습니다
          </Text>
        </View>

        <View style={styles.hintCardActions}>
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
    onClose();
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  const renderChoice = (choice: ChoiceOption) => {
    const isSelected = selectedAnswer === choice.id;
    const isCorrect = choice.isCorrect;
    const isEliminated = eliminatedOptions.includes(choice.id);
    const showCorrectAnswer = (resultState === 'CORRECT' || resultState === 'INCORRECT') && isCorrect;
    const showIncorrectAnswer = (resultState === 'INCORRECT') && isSelected && !isCorrect;

    return (
      <TouchableOpacity
        key={choice.id}
        style={[
          styles.choiceContainer,
          isSelected && styles.choiceContainerSelected,
          showCorrectAnswer && styles.choiceContainerCorrect,
          showIncorrectAnswer && styles.choiceContainerIncorrect,
          isEliminated && styles.choiceContainerEliminated,
        ]}
        onPress={() => !isEliminated && handleChoicePress(choice.id)}
        disabled={resultState !== 'ANSWERING' || isEliminated}
        activeOpacity={isEliminated ? 1 : 0.8}
      >
        <View style={styles.choiceContent}>
          <View style={[
            styles.choiceIdContainer,
            isSelected && styles.choiceIdContainerSelected,
            showCorrectAnswer && styles.choiceIdContainerCorrect,
            showIncorrectAnswer && styles.choiceIdContainerIncorrect,
            isEliminated && styles.choiceIdContainerEliminated,
          ]}>
            <Text style={[
              styles.choiceIdText,
              isSelected && styles.choiceIdTextSelected,
              showCorrectAnswer && styles.choiceIdTextCorrect,
              showIncorrectAnswer && styles.choiceIdTextIncorrect,
              isEliminated && styles.choiceIdTextEliminated,
            ]}>
              {choice.id}
            </Text>
          </View>
          <Text style={[
            styles.choiceText,
            isSelected && styles.choiceTextSelected,
            showCorrectAnswer && styles.choiceTextCorrect,
            showIncorrectAnswer && styles.choiceTextIncorrect,
            isEliminated && styles.choiceTextEliminated,
          ]}>
            {choice.text}
          </Text>
        </View>
      </TouchableOpacity>
    );
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

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Problem Content */}
          <View style={styles.problemContainer}>
            <Text style={styles.problemTitle}>{currentProblemData?.title || ''}</Text>
            <Text style={styles.problemSubtitle}>{currentProblemData?.subtitle || ''}</Text>
          </View>

          {/* Multiple Choice Options */}
          <View style={styles.choicesContainer}>
            {currentProblemData?.choices.map(renderChoice)}
          </View>
        </ScrollView>

        {/* Hint Card */}
        {renderHintCard()}
      </View>

      {/* Bottom Submit Section - Fixed Position */}
      <View style={styles.bottomSection}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.hintButton}
            onPress={handleHintRequest}
            disabled={resultState !== 'ANSWERING'}
            activeOpacity={0.8}
          >
            <Text style={styles.hintButtonText}>
              💡 힌트 {hintState.usedSteps > 0 ? `${hintState.usedSteps}/${hintConfig.maxSteps}` : '보기'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedAnswer && styles.submitButtonEnabled,
          ]}
          onPress={() => {
            if (selectedAnswer && resultState === 'ANSWERING' && currentProblemData) {
              // Determine if answer is correct
              const isCorrect = selectedAnswer === currentProblemData.correctAnswer;
              const newResultState: ResultState = isCorrect ? 'CORRECT' : 'INCORRECT';

              // Submit answer to session manager
              submitAnswer(selectedAnswer, isCorrect);

              // Get current session stats for result data
              const progress = getSessionProgress();
              const sessionStats = sessionManager.getSessionStats();

              // Create result data
              const result: MultipleChoiceResultData = {
                isCorrect,
                userAnswer: selectedAnswer,
                correctAnswer: currentProblemData.correctAnswer,
                explanation: currentProblemData.explanation,
                pointsEarned: isCorrect ? 15 : 0,
                streakCount: isCorrect ? 3 : 0, // Mock streak count
                currentScore: sessionStats?.correctAnswers.toString() || '0',
                totalScore: progress.total.toString(),
                experiencePoints: {
                  current: isCorrect ? 680 : 650, // Mock XP gain
                  required: 1000
                },
                achievements: isCorrect ? ['🏆 3연속 정답 달성!'] : undefined
              };

              setResultData(result);
              setResultState(newResultState);
            }
          }}
          disabled={!selectedAnswer || resultState !== 'ANSWERING'}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.submitButtonText,
            selectedAnswer && styles.submitButtonTextEnabled,
          ]}>
            정답 제출하기
          </Text>
        </TouchableOpacity>

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
  );

  // Main render based on current state
  return (
    <>
      {(resultState === 'CORRECT' || resultState === 'INCORRECT') ? renderResultView() : renderProblemView()}

      <ProblemReviewModal
        visible={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        problemData={currentProblemData}
        userAnswer={selectedAnswer || ''}
        isCorrect={resultData?.isCorrect || false}
        problemType="MULTIPLE_CHOICE"
      />
    </>
  );
};

export default Lv2MultipleChoiceProblemScreen;