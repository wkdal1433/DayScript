// Type definitions for Lv2MultipleChoiceProblemScreen component

export type MultipleChoiceAnswer = 'A' | 'B' | 'C' | 'D';

export interface ChoiceOption {
  id: MultipleChoiceAnswer;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceProblemData {
  id: string;
  title: string;
  subtitle: string;
  correctAnswer: MultipleChoiceAnswer;
  explanation: string;
  category: string;
  choices: ChoiceOption[];
}

export interface Lv2MultipleChoiceProblemScreenProps {
  /** Callback when user selects an answer */
  onAnswerSelect?: (answer: MultipleChoiceAnswer) => void;

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
  problemData?: MultipleChoiceProblemData;
}

export interface ChoiceButtonProps {
  choice: ChoiceOption;
  isSelected: boolean;
  isCorrect?: boolean;
  showResult?: boolean;
  onPress: (choiceId: MultipleChoiceAnswer) => void;
  disabled: boolean;
}

export interface MultipleChoiceProgressBarProps {
  current: number;
  total: number;
  animated?: boolean;
}

export interface MultipleChoiceTimerProps {
  timeRemaining: number;
  onTimeUp?: () => void;
}

export interface MultipleChoiceProblemHeaderProps {
  currentProblem: number;
  totalProblems: number;
  category: string;
  timeRemaining: number;
  onClose: () => void;
}

export interface MultipleChoiceResultModalProps {
  isVisible: boolean;
  isCorrect: boolean;
  explanation: string;
  correctAnswer: MultipleChoiceAnswer;
  selectedAnswer: MultipleChoiceAnswer;
  onContinue: () => void;
}

export interface SubmitButtonProps {
  isEnabled: boolean;
  onPress: () => void;
}