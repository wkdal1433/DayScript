/**
 * 결과 표시 모달 컴포넌트
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 퀴즈 결과 표시만 담당
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { resultModalStyles } from '../styles/ResultModal.styles';

export interface ResultModalProps {
  isVisible: boolean;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: any;
  userAnswer: any;
  points: number;
  hintsUsed: number;
  onContinue: () => void;
  timeSpent?: number;
  bonusPoints?: number;
}

export function ResultModal({
  isVisible,
  isCorrect,
  explanation,
  correctAnswer,
  userAnswer,
  points,
  hintsUsed,
  onContinue,
  timeSpent,
  bonusPoints = 0,
}: ResultModalProps) {
  const getResultEmoji = () => {
    if (isCorrect) {
      if (hintsUsed === 0) return '🎉'; // 완벽
      if (hintsUsed <= 1) return '✅'; // 좋음
      return '👍'; // 통과
    }
    return '❌'; // 틀림
  };

  const getResultTitle = () => {
    if (isCorrect) {
      if (hintsUsed === 0) return '완벽합니다!';
      if (hintsUsed <= 1) return '정답입니다!';
      return '정답입니다!';
    }
    return '틀렸습니다';
  };

  const getResultSubtitle = () => {
    if (isCorrect) {
      if (hintsUsed === 0) return '힌트 없이 정답을 맞혔어요';
      return `힌트 ${hintsUsed}개를 사용했어요`;
    }
    return '다시 한번 도전해보세요';
  };

  const getAnswerText = (answer: any) => {
    if (typeof answer === 'boolean') {
      return answer ? 'O (참)' : 'X (거짓)';
    }
    return String(answer);
  };

  const calculateFinalPoints = () => {
    return isCorrect ? points + bonusPoints : 0;
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onContinue}
    >
      <Pressable style={resultModalStyles.overlay} onPress={onContinue}>
        <Pressable
          style={resultModalStyles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <View style={[
            resultModalStyles.header,
            isCorrect ? resultModalStyles.correctHeader : resultModalStyles.incorrectHeader
          ]}>
            <Text style={resultModalStyles.resultEmoji}>{getResultEmoji()}</Text>
            <Text style={resultModalStyles.resultTitle}>{getResultTitle()}</Text>
            <Text style={resultModalStyles.resultSubtitle}>{getResultSubtitle()}</Text>
          </View>

          {/* 답안 비교 */}
          <View style={resultModalStyles.answersContainer}>
            <View style={resultModalStyles.answerRow}>
              <Text style={resultModalStyles.answerLabel}>내 답안:</Text>
              <Text style={[
                resultModalStyles.answerValue,
                isCorrect ? resultModalStyles.correctAnswer : resultModalStyles.wrongAnswer
              ]}>
                {getAnswerText(userAnswer)}
              </Text>
            </View>

            <View style={resultModalStyles.answerRow}>
              <Text style={resultModalStyles.answerLabel}>정답:</Text>
              <Text style={[resultModalStyles.answerValue, resultModalStyles.correctAnswer]}>
                {getAnswerText(correctAnswer)}
              </Text>
            </View>
          </View>

          {/* 점수 정보 */}
          <View style={resultModalStyles.scoreContainer}>
            <View style={resultModalStyles.scoreRow}>
              <Text style={resultModalStyles.scoreLabel}>획득 점수</Text>
              <Text style={[
                resultModalStyles.scoreValue,
                isCorrect ? resultModalStyles.positiveScore : resultModalStyles.zeroScore
              ]}>
                +{calculateFinalPoints()}점
              </Text>
            </View>

            {bonusPoints > 0 && isCorrect && (
              <View style={resultModalStyles.bonusRow}>
                <Text style={resultModalStyles.bonusLabel}>⚡ 보너스</Text>
                <Text style={resultModalStyles.bonusValue}>+{bonusPoints}점</Text>
              </View>
            )}

            {timeSpent && (
              <View style={resultModalStyles.scoreRow}>
                <Text style={resultModalStyles.scoreLabel}>소요 시간</Text>
                <Text style={resultModalStyles.scoreValue}>{timeSpent}초</Text>
              </View>
            )}

            {hintsUsed > 0 && (
              <View style={resultModalStyles.scoreRow}>
                <Text style={resultModalStyles.scoreLabel}>사용한 힌트</Text>
                <Text style={resultModalStyles.scoreValue}>{hintsUsed}개</Text>
              </View>
            )}
          </View>

          {/* 해설 */}
          <View style={resultModalStyles.explanationContainer}>
            <Text style={resultModalStyles.explanationTitle}>📝 해설</Text>
            <ScrollView style={resultModalStyles.explanationScroll}>
              <Text style={resultModalStyles.explanationText}>{explanation}</Text>
            </ScrollView>
          </View>

          {/* 하단 버튼 */}
          <View style={resultModalStyles.footer}>
            <TouchableOpacity
              style={[
                resultModalStyles.continueButton,
                isCorrect ? resultModalStyles.correctButton : resultModalStyles.incorrectButton
              ]}
              onPress={onContinue}
            >
              <Text style={resultModalStyles.continueButtonText}>
                계속하기
              </Text>
            </TouchableOpacity>
          </View>

          {/* 성과 인디케이터 */}
          {isCorrect && hintsUsed === 0 && (
            <View style={resultModalStyles.achievementBadge}>
              <Text style={resultModalStyles.achievementText}>🌟 완벽!</Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}