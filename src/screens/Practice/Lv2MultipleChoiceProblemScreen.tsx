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
  ChoiceOption
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
  const [showResult, setShowResult] = useState(false);
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
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(choiceId);
    setShowResult(true);
    onAnswerSelect(choiceId);

    // Auto proceed to next after showing result for 2 seconds
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  const renderChoice = (choice: ChoiceOption) => {
    const isSelected = selectedAnswer === choice.id;
    const isCorrect = choice.isCorrect;
    const showCorrectAnswer = showResult && isCorrect;
    const showIncorrectAnswer = showResult && isSelected && !isCorrect;

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

  return (
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
            if (selectedAnswer) {
              setShowResult(true);
              setTimeout(() => onNext(), 1500);
            }
          }}
          disabled={!selectedAnswer}
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

      {/* Result Modal Overlay (if needed) */}
      {showResult && (
        <View style={styles.resultOverlay}>
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {selectedAnswer === problemData.correctAnswer ? '정답!' : '오답!'}
            </Text>
            <Text style={styles.explanationText}>{problemData.explanation}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Lv2MultipleChoiceProblemScreen;