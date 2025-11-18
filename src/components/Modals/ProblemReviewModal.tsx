import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { styles } from './ProblemReviewModal.styles';
import { ProblemReviewModalProps } from './ProblemReviewModal.types';

const ProblemReviewModal: React.FC<ProblemReviewModalProps> = ({
  visible,
  onClose,
  problemData,
  userAnswer,
  isCorrect,
  problemType = 'OX',
}) => {
  if (!problemData) return null;

  const renderOXProblem = () => (
    <>
      {/* Problem Content */}
      <View style={styles.problemContainer}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{problemData.emoji || '🤔'}</Text>
        </View>
        <Text style={styles.problemTitle}>{problemData.title}</Text>
        <Text style={styles.problemSubtitle}>{problemData.subtitle}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.answerContainer}>
        <Text style={styles.answerSectionTitle}>답안 선택지</Text>

        <View style={styles.oxOptionsContainer}>
          <View style={[
            styles.oxOption,
            userAnswer === 'X' && !isCorrect && styles.incorrectAnswer,
            problemData.correctAnswer === 'X' && styles.correctAnswer,
          ]}>
            <Text style={[
              styles.oxOptionText,
              userAnswer === 'X' && !isCorrect && styles.incorrectAnswerText,
              problemData.correctAnswer === 'X' && styles.correctAnswerText,
            ]}>
              X (틀림)
            </Text>
            {userAnswer === 'X' && (
              <Text style={styles.yourAnswerLabel}>내 답</Text>
            )}
            {problemData.correctAnswer === 'X' && (
              <Text style={styles.correctAnswerLabel}>정답</Text>
            )}
          </View>

          <View style={[
            styles.oxOption,
            userAnswer === 'O' && !isCorrect && styles.incorrectAnswer,
            problemData.correctAnswer === 'O' && styles.correctAnswer,
          ]}>
            <Text style={[
              styles.oxOptionText,
              userAnswer === 'O' && !isCorrect && styles.incorrectAnswerText,
              problemData.correctAnswer === 'O' && styles.correctAnswerText,
            ]}>
              O (맞음)
            </Text>
            {userAnswer === 'O' && (
              <Text style={styles.yourAnswerLabel}>내 답</Text>
            )}
            {problemData.correctAnswer === 'O' && (
              <Text style={styles.correctAnswerLabel}>정답</Text>
            )}
          </View>
        </View>
      </View>
    </>
  );

  const renderMultipleChoiceProblem = () => (
    <>
      {/* Problem Content */}
      <View style={styles.problemContainer}>
        <Text style={styles.problemTitle}>{problemData.title}</Text>
        <Text style={styles.problemSubtitle}>{problemData.subtitle}</Text>
      </View>

      {/* Answer Options */}
      <View style={styles.answerContainer}>
        <Text style={styles.answerSectionTitle}>답안 선택지</Text>

        <View style={styles.choicesContainer}>
          {problemData.choices?.map((choice: any) => (
            <View
              key={choice.id}
              style={[
                styles.choiceOption,
                userAnswer === choice.id && !choice.isCorrect && styles.incorrectAnswer,
                choice.isCorrect && styles.correctAnswer,
              ]}
            >
              <View style={styles.choiceContent}>
                <View style={[
                  styles.choiceIdContainer,
                  userAnswer === choice.id && !choice.isCorrect && styles.incorrectAnswerContainer,
                  choice.isCorrect && styles.correctAnswerContainer,
                ]}>
                  <Text style={[
                    styles.choiceIdText,
                    userAnswer === choice.id && !choice.isCorrect && styles.incorrectAnswerText,
                    choice.isCorrect && styles.correctAnswerText,
                  ]}>
                    {choice.id}
                  </Text>
                </View>
                <Text style={[
                  styles.choiceText,
                  userAnswer === choice.id && !choice.isCorrect && styles.incorrectAnswerText,
                  choice.isCorrect && styles.correctAnswerText,
                ]}>
                  {choice.text}
                </Text>
              </View>

              {userAnswer === choice.id && (
                <Text style={styles.yourAnswerLabel}>내 답</Text>
              )}
              {choice.isCorrect && (
                <Text style={styles.correctAnswerLabel}>정답</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>문제 다시보기</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="닫기"
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Category Badge */}
            <View style={styles.categoryContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{problemData.category}</Text>
              </View>
            </View>

            {/* Render problem based on type */}
            {problemType === 'OX' ? renderOXProblem() : renderMultipleChoiceProblem()}

            {/* Explanation */}
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>💡 해설</Text>
              <Text style={styles.explanationText}>{problemData.explanation}</Text>
            </View>

            {/* Result Summary */}
            <View style={styles.resultContainer}>
              <View style={[
                styles.resultBadge,
                isCorrect ? styles.correctResultBadge : styles.incorrectResultBadge
              ]}>
                <Text style={[
                  styles.resultText,
                  isCorrect ? styles.correctResultText : styles.incorrectResultText
                ]}>
                  {isCorrect ? '정답입니다! 🎉' : '오답입니다 💪'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default ProblemReviewModal;