/**
 * Quiz 세션 관리 훅
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 퀴즈 세션 상태만 관리
 */

import { useState, useCallback, useEffect, useReducer } from 'react';
import { QuizBase, QuizResult, QuizLevel } from '../domain/QuizBase';
import { IQuizRepository } from '../domain/IQuizRepository';

export interface QuizSessionState {
  currentQuiz: QuizBase | null;
  quizzes: QuizBase[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  userAnswer: any;
  isAnswered: boolean;
  isCorrect: boolean | null;
  timeRemaining: number | null;
  hintsUsed: string[];
  sessionStartTime: Date | null;
  sessionResults: QuizResult[];
  totalScore: number;
  streak: number;
}

export enum QuizSessionActionType {
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
  LOAD_QUIZZES = 'LOAD_QUIZZES',
  SET_CURRENT_QUIZ = 'SET_CURRENT_QUIZ',
  SET_USER_ANSWER = 'SET_USER_ANSWER',
  SUBMIT_ANSWER = 'SUBMIT_ANSWER',
  NEXT_QUIZ = 'NEXT_QUIZ',
  PREVIOUS_QUIZ = 'PREVIOUS_QUIZ',
  USE_HINT = 'USE_HINT',
  START_TIMER = 'START_TIMER',
  TICK_TIMER = 'TICK_TIMER',
  STOP_TIMER = 'STOP_TIMER',
  RESET_SESSION = 'RESET_SESSION',
  START_SESSION = 'START_SESSION',
}

export interface QuizSessionAction {
  type: QuizSessionActionType;
  payload?: any;
}

const initialState: QuizSessionState = {
  currentQuiz: null,
  quizzes: [],
  currentIndex: 0,
  isLoading: false,
  error: null,
  userAnswer: null,
  isAnswered: false,
  isCorrect: null,
  timeRemaining: null,
  hintsUsed: [],
  sessionStartTime: null,
  sessionResults: [],
  totalScore: 0,
  streak: 0,
};

function quizSessionReducer(state: QuizSessionState, action: QuizSessionAction): QuizSessionState {
  switch (action.type) {
    case QuizSessionActionType.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case QuizSessionActionType.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case QuizSessionActionType.START_SESSION:
      return {
        ...state,
        sessionStartTime: new Date(),
        sessionResults: [],
        totalScore: 0,
        streak: 0,
      };

    case QuizSessionActionType.LOAD_QUIZZES:
      return {
        ...state,
        quizzes: action.payload,
        currentIndex: 0,
        currentQuiz: action.payload[0] || null,
        isLoading: false,
        error: null,
      };

    case QuizSessionActionType.SET_CURRENT_QUIZ:
      const quiz = state.quizzes[action.payload];
      return {
        ...state,
        currentIndex: action.payload,
        currentQuiz: quiz || null,
        userAnswer: null,
        isAnswered: false,
        isCorrect: null,
        hintsUsed: [],
        timeRemaining: quiz?.timeLimit || null,
      };

    case QuizSessionActionType.SET_USER_ANSWER:
      return {
        ...state,
        userAnswer: action.payload,
      };

    case QuizSessionActionType.SUBMIT_ANSWER:
      const isCorrect = state.currentQuiz?.validateAnswer(state.userAnswer) || false;
      const newStreak = isCorrect ? state.streak + 1 : 0;

      return {
        ...state,
        isAnswered: true,
        isCorrect,
        streak: newStreak,
      };

    case QuizSessionActionType.NEXT_QUIZ:
      const nextIndex = Math.min(state.currentIndex + 1, state.quizzes.length - 1);
      const nextQuiz = state.quizzes[nextIndex];

      return {
        ...state,
        currentIndex: nextIndex,
        currentQuiz: nextQuiz,
        userAnswer: null,
        isAnswered: false,
        isCorrect: null,
        hintsUsed: [],
        timeRemaining: nextQuiz?.timeLimit || null,
      };

    case QuizSessionActionType.PREVIOUS_QUIZ:
      const prevIndex = Math.max(state.currentIndex - 1, 0);
      const prevQuiz = state.quizzes[prevIndex];

      return {
        ...state,
        currentIndex: prevIndex,
        currentQuiz: prevQuiz,
        userAnswer: null,
        isAnswered: false,
        isCorrect: null,
        hintsUsed: [],
        timeRemaining: prevQuiz?.timeLimit || null,
      };

    case QuizSessionActionType.USE_HINT:
      if (state.hintsUsed.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        hintsUsed: [...state.hintsUsed, action.payload],
      };

    case QuizSessionActionType.START_TIMER:
      return {
        ...state,
        timeRemaining: action.payload,
      };

    case QuizSessionActionType.TICK_TIMER:
      const newTime = Math.max((state.timeRemaining || 0) - 1, 0);
      return {
        ...state,
        timeRemaining: newTime,
      };

    case QuizSessionActionType.STOP_TIMER:
      return {
        ...state,
        timeRemaining: null,
      };

    case QuizSessionActionType.RESET_SESSION:
      return {
        ...initialState,
        quizzes: state.quizzes,
      };

    default:
      return state;
  }
}

export interface UseQuizSessionOptions {
  repository: IQuizRepository;
  userId: string;
  autoSubmitOnTimeout?: boolean;
  shuffleQuizzes?: boolean;
}

export function useQuizSession({
  repository,
  userId,
  autoSubmitOnTimeout = true,
  shuffleQuizzes = false,
}: UseQuizSessionOptions) {
  const [state, dispatch] = useReducer(quizSessionReducer, initialState);

  // 타이머 관리
  useEffect(() => {
    if (state.timeRemaining === null || state.timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: QuizSessionActionType.TICK_TIMER });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeRemaining]);

  // 시간 초과 시 자동 제출
  useEffect(() => {
    if (autoSubmitOnTimeout && state.timeRemaining === 0 && !state.isAnswered) {
      handleSubmitAnswer();
    }
  }, [state.timeRemaining, state.isAnswered, autoSubmitOnTimeout]);

  // 퀴즈 로드
  const loadQuizzes = useCallback(async (level: QuizLevel) => {
    dispatch({ type: QuizSessionActionType.SET_LOADING, payload: true });

    try {
      let quizzes = await repository.getQuizzesByLevel(level);

      if (shuffleQuizzes) {
        quizzes = quizzes.sort(() => Math.random() - 0.5);
      }

      dispatch({ type: QuizSessionActionType.LOAD_QUIZZES, payload: quizzes });
      dispatch({ type: QuizSessionActionType.START_SESSION });

      if (quizzes.length > 0 && quizzes[0].timeLimit) {
        dispatch({ type: QuizSessionActionType.START_TIMER, payload: quizzes[0].timeLimit });
      }
    } catch (error) {
      dispatch({
        type: QuizSessionActionType.SET_ERROR,
        payload: error instanceof Error ? error.message : '퀴즈를 불러오는데 실패했습니다.'
      });
    }
  }, [repository, shuffleQuizzes]);

  // 답안 설정
  const setUserAnswer = useCallback((answer: any) => {
    dispatch({ type: QuizSessionActionType.SET_USER_ANSWER, payload: answer });
  }, []);

  // 답안 제출
  const handleSubmitAnswer = useCallback(async () => {
    if (!state.currentQuiz || state.isAnswered) return;

    dispatch({ type: QuizSessionActionType.SUBMIT_ANSWER });
    dispatch({ type: QuizSessionActionType.STOP_TIMER });

    // 결과 저장
    const result: QuizResult = {
      quizId: state.currentQuiz.id,
      userId,
      isCorrect: state.currentQuiz.validateAnswer(state.userAnswer),
      userAnswer: state.userAnswer,
      timeSpent: state.currentQuiz.timeLimit ?
        state.currentQuiz.timeLimit - (state.timeRemaining || 0) : 0,
      hintsUsed: state.hintsUsed,
      pointsEarned: calculatePoints(state.currentQuiz, state.hintsUsed, result.isCorrect),
      timestamp: new Date(),
      explanation: state.currentQuiz.getExplanation(),
    };

    try {
      await repository.saveQuizResult(result);

      // 오답인 경우 오답노트에 추가
      if (!result.isCorrect) {
        await repository.addToWrongAnswers(result);
      }
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  }, [state.currentQuiz, state.isAnswered, state.userAnswer, state.timeRemaining, state.hintsUsed, userId, repository]);

  // 다음 문제로 이동
  const goToNextQuiz = useCallback(() => {
    if (state.currentIndex < state.quizzes.length - 1) {
      dispatch({ type: QuizSessionActionType.NEXT_QUIZ });

      const nextQuiz = state.quizzes[state.currentIndex + 1];
      if (nextQuiz?.timeLimit) {
        dispatch({ type: QuizSessionActionType.START_TIMER, payload: nextQuiz.timeLimit });
      }
    }
  }, [state.currentIndex, state.quizzes]);

  // 이전 문제로 이동
  const goToPreviousQuiz = useCallback(() => {
    if (state.currentIndex > 0) {
      dispatch({ type: QuizSessionActionType.PREVIOUS_QUIZ });

      const prevQuiz = state.quizzes[state.currentIndex - 1];
      if (prevQuiz?.timeLimit) {
        dispatch({ type: QuizSessionActionType.START_TIMER, payload: prevQuiz.timeLimit });
      }
    }
  }, [state.currentIndex, state.quizzes]);

  // 힌트 사용
  const useHint = useCallback((hintId: string) => {
    dispatch({ type: QuizSessionActionType.USE_HINT, payload: hintId });
  }, []);

  // 세션 리셋
  const resetSession = useCallback(() => {
    dispatch({ type: QuizSessionActionType.RESET_SESSION });
  }, []);

  // 유틸리티 함수들
  const isFirstQuiz = state.currentIndex === 0;
  const isLastQuiz = state.currentIndex === state.quizzes.length - 1;
  const progress = state.quizzes.length > 0 ? (state.currentIndex + 1) / state.quizzes.length : 0;

  return {
    // State
    ...state,

    // Computed values
    isFirstQuiz,
    isLastQuiz,
    progress,

    // Actions
    loadQuizzes,
    setUserAnswer,
    submitAnswer: handleSubmitAnswer,
    goToNextQuiz,
    goToPreviousQuiz,
    useHint,
    resetSession,
  };
}

// 점수 계산 유틸리티 함수
function calculatePoints(quiz: QuizBase, hintsUsed: string[], isCorrect: boolean): number {
  if (!isCorrect) return 0;

  let points = quiz.points;

  // 힌트 사용에 따른 점수 차감
  hintsUsed.forEach(hintId => {
    const hint = quiz.getHints().find(h => h.id === hintId);
    if (hint?.pointsPenalty) {
      points = Math.max(0, points - hint.pointsPenalty);
    }
  });

  return points;
}