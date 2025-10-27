import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { styles } from './Lv1OXProblemScreen.styles';
import { Lv1OXProblemScreenProps, OXAnswer, ProblemData, ResultState, ResultData } from './Lv1OXProblemScreen.types';
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

const Lv1OXProblemScreen: React.FC<Lv1OXProblemScreenProps> = ({
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

  // Initialize session and get current problem
  useEffect(() => {
    let currentSession = sessionManager.getCurrentSession();

    // Create new session if none exists
    if (!currentSession) {
      currentSession = createNewSession('OX', 10);
    }

    // Load current problem
    const problem = getCurrentProblem() as ProblemData;
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
  };

  const handleClose = () => {
    // Clear session when closing
    clearCurrentSession();
    onClose();
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

      {/* Problem Content */}
      <View style={styles.problemContainer}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{currentProblemData?.emoji || '🤔'}</Text>
        </View>

        <Text style={styles.problemTitle}>{currentProblemData?.title || ''}</Text>
        <Text style={styles.problemSubtitle}>{currentProblemData?.subtitle || ''}</Text>

        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>힌트</Text>
        </View>
      </View>

      {/* Answer Buttons */}
      <View style={styles.answerSection}>
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
        problemType="OX"
      />
    </>
  );
};

export default Lv1OXProblemScreen;