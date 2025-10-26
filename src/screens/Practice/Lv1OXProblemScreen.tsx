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

const Lv1OXProblemScreen: React.FC<Lv1OXProblemScreenProps> = ({
  onAnswerSelect = (answer) => console.log('Answer selected:', answer),
  onClose = () => console.log('Screen closed'),
  onNext = () => console.log('Next problem'),
  currentProblem = 1,
  totalProblems = 10,
  timeRemaining = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<OXAnswer | null>(null);
  const [resultState, setResultState] = useState<ResultState>('ANSWERING');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [progressAnimation] = useState(new Animated.Value(0));

  // Mock problem data based on Figma design
  const problemData: ProblemData = {
    id: '1',
    title: 'Python에서 리스트는',
    subtitle: '가변(mutable) 자료형이다.',
    correctAnswer: 'O',
    explanation: '리스트는 생성 후에도 요소를 추가, 삭제, 수정할 수 있는 가변 자료형입니다.',
    category: 'Python 기초',
    emoji: '🤔',
  };

  useEffect(() => {
    // Calculate progress percentage
    const progressPercentage = (currentProblem / totalProblems) * 100;
    Animated.timing(progressAnimation, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [currentProblem, totalProblems, progressAnimation]);

  const handleAnswerPress = (answer: OXAnswer) => {
    if (selectedAnswer || resultState !== 'ANSWERING') return; // Prevent multiple selections

    setSelectedAnswer(answer);
    onAnswerSelect(answer);

    // Determine if answer is correct
    const isCorrect = answer === problemData.correctAnswer;
    const newResultState: ResultState = isCorrect ? 'CORRECT' : 'INCORRECT';

    // Create result data
    const result: ResultData = {
      isCorrect,
      userAnswer: answer,
      correctAnswer: problemData.correctAnswer,
      explanation: problemData.explanation,
      pointsEarned: isCorrect ? 10 : 0,
      streakCount: isCorrect ? 4 : 0, // Mock streak count
      currentScore: '4',
      totalScore: '10',
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
    // Reset states for next problem
    setSelectedAnswer(null);
    setResultState('ANSWERING');
    setResultData(null);
    onNext();
  };

  const handleRetryProblem = () => {
    // Reset to problem view
    setSelectedAnswer(null);
    setResultState('ANSWERING');
    setResultData(null);
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
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.problemCounter}>문제 {currentProblem} / {totalProblems}</Text>
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
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextProblem}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>다음 문제로 이동 →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetryProblem}
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
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.problemCounter}>문제 {currentProblem} / {totalProblems}</Text>
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

      {/* Problem Content */}
      <View style={styles.problemContainer}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{problemData.emoji}</Text>
        </View>

        <Text style={styles.problemTitle}>{problemData.title}</Text>
        <Text style={styles.problemSubtitle}>{problemData.subtitle}</Text>

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
          <Text style={styles.progressPercentage}>{Math.round((currentProblem / totalProblems) * 100)}%</Text>
        </View>
      </View>
    </SafeAreaView>
  );

  // Main render based on current state
  if (resultState === 'CORRECT' || resultState === 'INCORRECT') {
    return renderResultView();
  }

  return renderProblemView();
};

export default Lv1OXProblemScreen;