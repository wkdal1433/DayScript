/**
 * LV1 O/X 문제 화면 - 새로운 SOLID 기반 구조
 * SOLID 원칙 중 SRP(단일 책임) 적용 - UI 렌더링만 담당
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuizSession } from '../core/application/useQuizSession';
import { useQuizHint } from '../core/application/useQuizHint';
import { QuizRepositoryImpl } from '../infra/QuizRepositoryImpl';
import { QuizLevel } from '../core/domain/QuizBase';
import { OXQuiz } from '../core/domain/QuizTypes';
import { SimpleCache } from '../../common/infra/SimpleCache';
import { MockAnalytics } from '../../common/infra/MockAnalytics';
import { ProblemCard } from './components/ProblemCard';
import { HintModal } from './components/HintModal';
import { ResultModal } from './components/ResultModal';
import { QuizProgressBar } from './components/QuizProgressBar';
import { QuizTimer } from './components/QuizTimer';
import { lv1Styles } from './styles/Lv1OXProblemScreen.styles';

interface Lv1OXProblemScreenProps {
  navigation: any;
  route: {
    params: {
      difficulty?: any;
      language?: string;
    };
  };
}

export default function Lv1OXProblemScreen({ navigation, route }: Lv1OXProblemScreenProps) {
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);

  // 의존성 주입 - Repository 인스턴스 생성
  const repository = new QuizRepositoryImpl(
    new SimpleCache(),
    new MockAnalytics(),
    '/api'
  );

  // 커스텀 훅 사용 - 비즈니스 로직 분리
  const quizSession = useQuizSession({
    repository,
    userId: 'current_user', // 실제로는 인증 시스템에서 가져와야 함
    autoSubmitOnTimeout: true,
    shuffleQuizzes: true,
  });

  const hintSystem = useQuizHint({
    quiz: quizSession.currentQuiz,
    maxHintsAllowed: 3,
    onHintUsed: (hint) => {
      quizSession.useHint(hint.id);
    },
    onPointsPenalty: (penalty) => {
      Alert.alert('힌트 사용', `${penalty}점이 차감됩니다.`);
    },
  });

  // 컴포넌트 마운트 시 퀴즈 로드
  useEffect(() => {
    quizSession.loadQuizzes(QuizLevel.LV1);
  }, []);

  // 답안 선택 핸들러
  const handleAnswerSelect = (answer: boolean) => {
    setSelectedAnswer(answer);
    quizSession.setUserAnswer(answer);
  };

  // 답안 제출 핸들러
  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) {
      Alert.alert('답안 선택', '답을 선택해주세요.');
      return;
    }

    await quizSession.submitAnswer();
    setShowResultModal(true);
  };

  // 다음 문제로 이동
  const handleNextQuiz = () => {
    setShowResultModal(false);
    setSelectedAnswer(null);

    if (quizSession.isLastQuiz) {
      // 세션 완료
      Alert.alert(
        '축하합니다!',
        `모든 문제를 완료했습니다.\n총 점수: ${quizSession.totalScore}점\n연속 정답: ${quizSession.streak}개`,
        [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      quizSession.goToNextQuiz();
    }
  };

  // 로딩 상태 렌더링
  if (quizSession.isLoading) {
    return (
      <SafeAreaView style={lv1Styles.safeArea}>
        <View style={lv1Styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3563e9" />
          <Text style={lv1Styles.loadingText}>문제를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 에러 상태 렌더링
  if (quizSession.error) {
    return (
      <SafeAreaView style={lv1Styles.safeArea}>
        <View style={lv1Styles.errorContainer}>
          <Text style={lv1Styles.errorText}>{quizSession.error}</Text>
          <TouchableOpacity
            style={lv1Styles.retryButton}
            onPress={() => quizSession.loadQuizzes(QuizLevel.LV1)}
          >
            <Text style={lv1Styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 현재 퀴즈가 없는 경우
  if (!quizSession.currentQuiz) {
    return (
      <SafeAreaView style={lv1Styles.safeArea}>
        <View style={lv1Styles.errorContainer}>
          <Text style={lv1Styles.errorText}>문제를 찾을 수 없습니다.</Text>
          <TouchableOpacity
            style={lv1Styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={lv1Styles.retryButtonText}>뒤로가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuiz = quizSession.currentQuiz as OXQuiz;

  return (
    <SafeAreaView style={lv1Styles.safeArea}>
      <View style={lv1Styles.container}>
        {/* 헤더 */}
        <View style={lv1Styles.header}>
          <TouchableOpacity
            style={lv1Styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={lv1Styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={lv1Styles.headerCenter}>
            <Text style={lv1Styles.headerTitle}>LV1 O/X 문제</Text>
            <Text style={lv1Styles.headerSubtitle}>
              {quizSession.currentIndex + 1} / {quizSession.quizzes.length}
            </Text>
          </View>

          <TouchableOpacity
            style={lv1Styles.hintButton}
            onPress={() => hintSystem.useHint()}
            disabled={!hintSystem.canUseHint}
          >
            <Text style={[
              lv1Styles.hintButtonText,
              !hintSystem.canUseHint && lv1Styles.hintButtonDisabled
            ]}>
              💡 힌트 ({hintSystem.hintStatistics.remainingHints})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 진행률 바 */}
        <QuizProgressBar
          current={quizSession.currentIndex + 1}
          total={quizSession.quizzes.length}
          score={quizSession.totalScore}
          streak={quizSession.streak}
        />

        {/* 타이머 (시간 제한이 있는 경우) */}
        {currentQuiz.timeLimit && (
          <QuizTimer
            timeRemaining={quizSession.timeRemaining || 0}
            totalTime={currentQuiz.timeLimit}
            onTimeUp={() => handleSubmitAnswer()}
          />
        )}

        {/* 문제 카드 */}
        <View style={lv1Styles.content}>
          <ProblemCard
            question={currentQuiz.question}
            category={currentQuiz.category}
            tags={currentQuiz.tags}
            difficulty={currentQuiz.difficulty}
            points={currentQuiz.points}
          />

          {/* O/X 선택 버튼 */}
          <View style={lv1Styles.answerContainer}>
            <TouchableOpacity
              style={[
                lv1Styles.answerButton,
                lv1Styles.trueButton,
                selectedAnswer === true && lv1Styles.selectedButton,
              ]}
              onPress={() => handleAnswerSelect(true)}
              disabled={quizSession.isAnswered}
            >
              <Text style={[
                lv1Styles.answerButtonText,
                selectedAnswer === true && lv1Styles.selectedButtonText,
              ]}>
                O (참)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                lv1Styles.answerButton,
                lv1Styles.falseButton,
                selectedAnswer === false && lv1Styles.selectedButton,
              ]}
              onPress={() => handleAnswerSelect(false)}
              disabled={quizSession.isAnswered}
            >
              <Text style={[
                lv1Styles.answerButtonText,
                selectedAnswer === false && lv1Styles.selectedButtonText,
              ]}>
                X (거짓)
              </Text>
            </TouchableOpacity>
          </View>

          {/* 제출 버튼 */}
          {!quizSession.isAnswered && (
            <TouchableOpacity
              style={[
                lv1Styles.submitButton,
                selectedAnswer === null && lv1Styles.submitButtonDisabled,
              ]}
              onPress={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              <Text style={lv1Styles.submitButtonText}>답안 제출</Text>
            </TouchableOpacity>
          )}

          {/* 다음 문제 버튼 */}
          {quizSession.isAnswered && (
            <TouchableOpacity
              style={lv1Styles.nextButton}
              onPress={handleNextQuiz}
            >
              <Text style={lv1Styles.nextButtonText}>
                {quizSession.isLastQuiz ? '완료' : '다음 문제'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 힌트 모달 */}
        <HintModal
          isVisible={hintSystem.isHintModalVisible}
          hint={hintSystem.currentHint}
          onClose={hintSystem.closeHintModal}
          usedHintsCount={hintSystem.hintUsageCount}
          maxHints={hintSystem.maxHintsAllowed}
        />

        {/* 결과 모달 */}
        <ResultModal
          isVisible={showResultModal}
          isCorrect={quizSession.isCorrect || false}
          explanation={currentQuiz.explanation}
          correctAnswer={currentQuiz.correctAnswer}
          userAnswer={selectedAnswer}
          points={currentQuiz.points}
          hintsUsed={hintSystem.hintUsageCount}
          onContinue={handleNextQuiz}
        />
      </View>
    </SafeAreaView>
  );
}