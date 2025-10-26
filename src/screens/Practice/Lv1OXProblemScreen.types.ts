// Type definitions for Lv1OXProblemScreen component

export type OXAnswer = 'O' | 'X';

export interface ProblemData {
  id: string;
  title: string;
  subtitle: string;
  correctAnswer: OXAnswer;
  explanation: string;
  category: string;
  emoji: string;
}

export interface Lv1OXProblemScreenProps {
  /** Callback when user selects an answer */
  onAnswerSelect?: (answer: OXAnswer) => void;

  /** Callback when user closes the screen */
  onClose?: () => void;

  /** Callback when moving to next problem */
  onNext?: () => void;

  /** Current problem number (1-based) */
  currentProblem?: number;

  /** Total number of problems */
  totalProblems?: number;

  /** Time remaining in seconds */
  timeRemaining?: number;

  /** Custom problem data (optional) */
  problemData?: ProblemData;
}

export interface AnswerButtonProps {
  answer: OXAnswer;
  isSelected: boolean;
  onPress: (answer: OXAnswer) => void;
  disabled: boolean;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  animated?: boolean;
}

export interface TimerProps {
  timeRemaining: number;
  onTimeUp?: () => void;
}

export interface ProblemHeaderProps {
  currentProblem: number;
  totalProblems: number;
  category: string;
  timeRemaining: number;
  onClose: () => void;
}

export interface ResultModalProps {
  isVisible: boolean;
  isCorrect: boolean;
  explanation: string;
  onContinue: () => void;
}