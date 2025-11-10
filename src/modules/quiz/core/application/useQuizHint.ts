/**
 * Quiz 힌트 시스템 훅
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 힌트 관리만 담당
 */

import { useState, useCallback, useEffect } from 'react';
import { QuizHint, HintLevel, QuizBase } from '../domain/QuizBase';

export interface HintState {
  availableHints: QuizHint[];
  usedHints: QuizHint[];
  currentHint: QuizHint | null;
  isHintModalVisible: boolean;
  hintUsageCount: number;
  maxHintsAllowed: number;
  totalPointsPenalty: number;
}

export interface UseQuizHintOptions {
  quiz: QuizBase | null;
  maxHintsAllowed?: number;
  onHintUsed?: (hint: QuizHint) => void;
  onPointsPenalty?: (penalty: number) => void;
}

export function useQuizHint({
  quiz,
  maxHintsAllowed = 3,
  onHintUsed,
  onPointsPenalty,
}: UseQuizHintOptions) {
  const [state, setState] = useState<HintState>({
    availableHints: [],
    usedHints: [],
    currentHint: null,
    isHintModalVisible: false,
    hintUsageCount: 0,
    maxHintsAllowed,
    totalPointsPenalty: 0,
  });

  // 퀴즈가 변경될 때 힌트 상태 초기화
  useEffect(() => {
    if (quiz) {
      const hints = quiz.getHints();
      setState(prev => ({
        ...prev,
        availableHints: hints,
        usedHints: [],
        currentHint: null,
        hintUsageCount: 0,
        totalPointsPenalty: 0,
        isHintModalVisible: false,
      }));
    }
  }, [quiz]);

  // 힌트 사용 가능 여부 확인
  const canUseHint = useCallback((hintLevel?: HintLevel): boolean => {
    if (!quiz || state.hintUsageCount >= state.maxHintsAllowed) {
      return false;
    }

    if (hintLevel) {
      const hint = state.availableHints.find(h =>
        h.level === hintLevel && !state.usedHints.find(used => used.id === h.id)
      );
      return !!hint;
    }

    return state.availableHints.length > state.usedHints.length;
  }, [quiz, state.hintUsageCount, state.maxHintsAllowed, state.availableHints, state.usedHints]);

  // 사용 가능한 다음 힌트 가져오기
  const getNextAvailableHint = useCallback((): QuizHint | null => {
    const unusedHints = state.availableHints.filter(hint =>
      !state.usedHints.find(used => used.id === hint.id)
    );

    if (unusedHints.length === 0) {
      return null;
    }

    // 힌트 레벨 순서대로 반환 (BASIC -> INTERMEDIATE -> ADVANCED -> SOLUTION)
    const levelOrder = [HintLevel.BASIC, HintLevel.INTERMEDIATE, HintLevel.ADVANCED, HintLevel.SOLUTION];

    for (const level of levelOrder) {
      const hint = unusedHints.find(h => h.level === level);
      if (hint) {
        return hint;
      }
    }

    return unusedHints[0];
  }, [state.availableHints, state.usedHints]);

  // 특정 레벨의 힌트 가져오기
  const getHintByLevel = useCallback((level: HintLevel): QuizHint | null => {
    const hint = state.availableHints.find(h =>
      h.level === level && !state.usedHints.find(used => used.id === h.id)
    );
    return hint || null;
  }, [state.availableHints, state.usedHints]);

  // 힌트 사용
  const useHint = useCallback((hintId?: string) => {
    let hintToUse: QuizHint | null = null;

    if (hintId) {
      // 특정 힌트 ID로 힌트 찾기
      hintToUse = state.availableHints.find(h => h.id === hintId) || null;
    } else {
      // 다음 사용 가능한 힌트 찾기
      hintToUse = getNextAvailableHint();
    }

    if (!hintToUse || !canUseHint()) {
      return false;
    }

    // 이미 사용한 힌트인지 확인
    if (state.usedHints.find(used => used.id === hintToUse!.id)) {
      return false;
    }

    const pointsPenalty = hintToUse.pointsPenalty || 0;

    setState(prev => ({
      ...prev,
      usedHints: [...prev.usedHints, hintToUse!],
      currentHint: hintToUse,
      hintUsageCount: prev.hintUsageCount + 1,
      totalPointsPenalty: prev.totalPointsPenalty + pointsPenalty,
      isHintModalVisible: true,
    }));

    // 콜백 실행
    onHintUsed?.(hintToUse);
    if (pointsPenalty > 0) {
      onPointsPenalty?.(pointsPenalty);
    }

    return true;
  }, [state.availableHints, state.usedHints, getNextAvailableHint, canUseHint, onHintUsed, onPointsPenalty]);

  // 레벨별 힌트 사용
  const useHintByLevel = useCallback((level: HintLevel) => {
    const hint = getHintByLevel(level);
    if (hint) {
      return useHint(hint.id);
    }
    return false;
  }, [getHintByLevel, useHint]);

  // 힌트 모달 표시
  const showHint = useCallback((hint: QuizHint) => {
    setState(prev => ({
      ...prev,
      currentHint: hint,
      isHintModalVisible: true,
    }));
  }, []);

  // 힌트 모달 닫기
  const closeHintModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isHintModalVisible: false,
    }));
  }, []);

  // 힌트 시스템 리셋
  const resetHints = useCallback(() => {
    setState(prev => ({
      ...prev,
      usedHints: [],
      currentHint: null,
      hintUsageCount: 0,
      totalPointsPenalty: 0,
      isHintModalVisible: false,
    }));
  }, []);

  // 힌트 통계 가져오기
  const getHintStatistics = useCallback(() => {
    const stats = {
      totalHints: state.availableHints.length,
      usedHints: state.usedHints.length,
      remainingHints: Math.max(0, state.maxHintsAllowed - state.hintUsageCount),
      totalPointsPenalty: state.totalPointsPenalty,
      hintsByLevel: {
        [HintLevel.BASIC]: {
          available: state.availableHints.filter(h => h.level === HintLevel.BASIC).length,
          used: state.usedHints.filter(h => h.level === HintLevel.BASIC).length,
        },
        [HintLevel.INTERMEDIATE]: {
          available: state.availableHints.filter(h => h.level === HintLevel.INTERMEDIATE).length,
          used: state.usedHints.filter(h => h.level === HintLevel.INTERMEDIATE).length,
        },
        [HintLevel.ADVANCED]: {
          available: state.availableHints.filter(h => h.level === HintLevel.ADVANCED).length,
          used: state.usedHints.filter(h => h.level === HintLevel.ADVANCED).length,
        },
        [HintLevel.SOLUTION]: {
          available: state.availableHints.filter(h => h.level === HintLevel.SOLUTION).length,
          used: state.usedHints.filter(h => h.level === HintLevel.SOLUTION).length,
        },
      },
    };

    return stats;
  }, [state]);

  // 다음 힌트 미리보기 (레벨과 점수 차감 정보만)
  const getNextHintPreview = useCallback(() => {
    const nextHint = getNextAvailableHint();
    if (!nextHint) return null;

    return {
      level: nextHint.level,
      pointsPenalty: nextHint.pointsPenalty || 0,
      unlockCondition: nextHint.unlockCondition,
    };
  }, [getNextAvailableHint]);

  return {
    // State
    ...state,

    // Computed values
    canUseHint: canUseHint(),
    nextAvailableHint: getNextAvailableHint(),
    hintStatistics: getHintStatistics(),
    nextHintPreview: getNextHintPreview(),

    // Actions
    useHint,
    useHintByLevel,
    showHint,
    closeHintModal,
    resetHints,
    canUseHint: canUseHint,
    getHintByLevel,
    getNextAvailableHint,
  };
}