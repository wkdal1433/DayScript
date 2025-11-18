import { useState, useRef } from 'react';
import { Animated } from 'react-native';

export interface HintConfig {
  maxSteps: number;
  xpDeductionPerStep: number;
}

export interface HintStep {
  id: number;
  title: string;
  content: string;
  type: 'concept' | 'context' | 'elimination' | 'partial';
  data?: any; // Additional data for specific hint types
}

export interface HintState {
  isVisible: boolean;
  currentStep: number;
  usedSteps: number;
  totalXpDeducted: number;
}

export interface UseHintReturn {
  hintState: HintState;
  hintAnimation: Animated.Value;
  slideAnimation: Animated.Value;
  scaleAnimation: Animated.Value;
  showHint: () => void;
  nextHint: () => void;
  hideHint: () => void;
  resetHint: () => void;
  deductXP: (step: number) => number;
  getCurrentHintData: (hints: HintStep[]) => HintStep | null;
  isLastStep: () => boolean;
}

/**
 * Reusable hook for managing hint system state and animations
 * Based on LV3 implementation patterns for consistency across problem types
 */
export const useHint = (config: HintConfig): UseHintReturn => {
  const [hintState, setHintState] = useState<HintState>({
    isVisible: false,
    currentStep: 1,
    usedSteps: 0,
    totalXpDeducted: 0,
  });

  // Animation refs
  const hintAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;

  /**
   * XP deduction logic consistent with LV3 implementation
   */
  const deductXP = (step: number): number => {
    const xpDeduction = step * config.xpDeductionPerStep;
    console.log(`XP deducted: ${xpDeduction} points for hint step ${step}`);
    // In a real app, this would update the user's XP in the backend
    return xpDeduction;
  };

  /**
   * Show hint with fade-in and slide-up animation
   */
  const showHint = () => {
    if (!hintState.isVisible) {
      setHintState(prev => ({
        ...prev,
        isVisible: true,
        currentStep: 1,
        usedSteps: 1,
        totalXpDeducted: prev.totalXpDeducted + deductXP(1),
      }));

      // Animate hint appearance
      Animated.parallel([
        Animated.timing(hintAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  /**
   * Move to next hint step
   */
  const nextHint = () => {
    if (hintState.currentStep < config.maxSteps) {
      const nextStep = hintState.currentStep + 1;

      setHintState(prev => ({
        ...prev,
        currentStep: nextStep,
        usedSteps: prev.usedSteps + 1,
        totalXpDeducted: prev.totalXpDeducted + deductXP(nextStep),
      }));
    }
  };

  /**
   * Hide hint with fade-out animation
   */
  const hideHint = () => {
    Animated.parallel([
      Animated.timing(hintAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnimation, {
        toValue: 50,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setHintState(prev => ({
        ...prev,
        isVisible: false,
      }));
    });
  };

  /**
   * Reset hint state for new problem
   */
  const resetHint = () => {
    setHintState({
      isVisible: false,
      currentStep: 1,
      usedSteps: 0,
      totalXpDeducted: 0,
    });

    // Reset animations
    hintAnimation.setValue(0);
    slideAnimation.setValue(50);
    scaleAnimation.setValue(0.9);
  };

  /**
   * Get current hint data from provided hints array
   */
  const getCurrentHintData = (hints: HintStep[]): HintStep | null => {
    return hints.find(hint => hint.id === hintState.currentStep) || null;
  };

  /**
   * Check if current step is the last available step
   */
  const isLastStep = (): boolean => {
    return hintState.currentStep >= config.maxSteps;
  };

  return {
    hintState,
    hintAnimation,
    slideAnimation,
    scaleAnimation,
    showHint,
    nextHint,
    hideHint,
    resetHint,
    deductXP,
    getCurrentHintData,
    isLastStep,
  };
};