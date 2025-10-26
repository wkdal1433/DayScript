import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ScrollView,
} from 'react-native';
import { styles } from './Lv2MultipleChoiceProblemScreen.styles';
import {
  Lv2MultipleChoiceProblemScreenProps,
  MultipleChoiceAnswer,
  MultipleChoiceProblemData,
  ChoiceOption,
  ResultState,
  MultipleChoiceResultData
} from './Lv2MultipleChoiceProblemScreen.types';

const Lv2MultipleChoiceProblemScreen: React.FC<Lv2MultipleChoiceProblemScreenProps> = ({
  onAnswerSelect = (answer) => console.log('Answer selected:', answer),
  onClose = () => console.log('Screen closed'),
  onNext = () => console.log('Next problem'),
  currentProblem = 2,
  totalProblems = 10,
  timeRemaining = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<MultipleChoiceAnswer | null>(null);
  const [resultState, setResultState] = useState<ResultState>('ANSWERING');
  const [resultData, setResultData] = useState<MultipleChoiceResultData | null>(null);
  const [progressAnimation] = useState(new Animated.Value(0));

  // Mock problem data based on Figma design
  const problemData: MultipleChoiceProblemData = {
    id: '2',
    title: 'Python에서 함수를 정의할 때 사용하는',
    subtitle: '키워드는 무엇일까요?',
    correctAnswer: 'C',
    explanation: 'Python에서 함수를 정의할 때는 "def" 키워드를 사용합니다.',
    category: '기초 문법 : 함수 정의',
    choices: [
      {
        id: 'A',
        text: 'function',
        isCorrect: false,
      },
      {
        id: 'B',
        text: 'define',
        isCorrect: false,
      },
      {
        id: 'C',
        text: 'def',
        isCorrect: true,
      },
      {
        id: 'D',
        text: 'func',
        isCorrect: false,
      },
    ],
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

  const handleChoicePress = (choiceId: MultipleChoiceAnswer) => {
    if (selectedAnswer || resultState !== 'ANSWERING') return; // Prevent multiple selections

    setSelectedAnswer(choiceId);
    onAnswerSelect(choiceId);
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

  const renderChoice = (choice: ChoiceOption) => {
    const isSelected = selectedAnswer === choice.id;
    const isCorrect = choice.isCorrect;
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
        ]}
        onPress={() => handleChoicePress(choice.id)}
        disabled={selectedAnswer !== null}
        activeOpacity={0.8}
      >
        <View style={styles.choiceContent}>
          <View style={[
            styles.choiceIdContainer,
            isSelected && styles.choiceIdContainerSelected,
            showCorrectAnswer && styles.choiceIdContainerCorrect,
            showIncorrectAnswer && styles.choiceIdContainerIncorrect,
          ]}>
            <Text style={[
              styles.choiceIdText,
              isSelected && styles.choiceIdTextSelected,
              showCorrectAnswer && styles.choiceIdTextCorrect,
              showIncorrectAnswer && styles.choiceIdTextIncorrect,
            ]}>
              {choice.id}
            </Text>
          </View>
          <Text style={[
            styles.choiceText,
            isSelected && styles.choiceTextSelected,
            showCorrectAnswer && styles.choiceTextCorrect,
            showIncorrectAnswer && styles.choiceTextIncorrect,
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
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.problemCounter}>문제 {currentProblem}/ {totalProblems}</Text>
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
          <Text style={styles.problemCounter}>문제 {currentProblem}/ {totalProblems}</Text>
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
          <Text style={styles.problemTitle}>{problemData.title}</Text>
          <Text style={styles.problemSubtitle}>{problemData.subtitle}</Text>
        </View>

        {/* Multiple Choice Options */}
        <View style={styles.choicesContainer}>
          {problemData.choices.map(renderChoice)}
        </View>
      </ScrollView>

      {/* Bottom Submit Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            selectedAnswer && styles.submitButtonEnabled,
          ]}
          onPress={() => {
            if (selectedAnswer && resultState === 'ANSWERING') {
              // Determine if answer is correct
              const isCorrect = selectedAnswer === problemData.correctAnswer;
              const newResultState: ResultState = isCorrect ? 'CORRECT' : 'INCORRECT';

              // Create result data
              const result: MultipleChoiceResultData = {
                isCorrect,
                userAnswer: selectedAnswer,
                correctAnswer: problemData.correctAnswer,
                explanation: problemData.explanation,
                pointsEarned: isCorrect ? 15 : 0,
                streakCount: isCorrect ? 3 : 0, // Mock streak count
                currentScore: '3',
                totalScore: '10',
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
            <Text style={styles.progressPercentage}>{Math.round((currentProblem / totalProblems) * 100)}%</Text>
          </View>
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

export default Lv2MultipleChoiceProblemScreen;