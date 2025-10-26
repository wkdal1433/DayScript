import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { styles } from './Lv1OXProblemScreen.styles';
import { Lv1OXProblemScreenProps, OXAnswer, ProblemData } from './Lv1OXProblemScreen.types';

const Lv1OXProblemScreen: React.FC<Lv1OXProblemScreenProps> = ({
  onAnswerSelect = (answer) => console.log('Answer selected:', answer),
  onClose = () => console.log('Screen closed'),
  onNext = () => console.log('Next problem'),
  currentProblem = 1,
  totalProblems = 10,
  timeRemaining = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<OXAnswer | null>(null);
  const [showResult, setShowResult] = useState(false);
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
    if (selectedAnswer) return; // Prevent multiple selections

    setSelectedAnswer(answer);
    setShowResult(true);
    onAnswerSelect(answer);

    // Auto proceed to next after showing result for 2 seconds
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  return (
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

export default Lv1OXProblemScreen;