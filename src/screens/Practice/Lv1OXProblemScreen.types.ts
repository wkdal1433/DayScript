// Type definitions for Lv1OXProblemScreen component

export type OXAnswer = 'O' | 'X';

export type ResultState = 'ANSWERING' | 'CORRECT' | 'INCORRECT';

export interface ResultData {
  isCorrect: boolean;
  userAnswer: OXAnswer;
  correctAnswer: OXAnswer;
  explanation: string;
  pointsEarned: number;
  streakCount: number;
  currentScore: string;
  totalScore: string;
  experiencePoints: {
    current: number;
    required: number;
  };
  achievements?: string[];
}

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

  /** Callback when session is completed (all 10 problems finished) */
  onSessionComplete?: () => void;

  /** Callback when goal completion modal should be shown */
  onShowGoalModal?: () => void;

  /** Time remaining in seconds */
  timeRemaining?: number;

  /** Custom problem data (optional) - now managed by session */
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