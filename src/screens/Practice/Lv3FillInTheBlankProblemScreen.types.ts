// Type definitions for Lv3FillInTheBlankProblemScreen component

export type FillInTheBlankAnswer = string;

export type ResultState = 'ANSWERING' | 'CORRECT' | 'INCORRECT';

export interface FillInTheBlankResultData {
  isCorrect: boolean;
  userAnswer: FillInTheBlankAnswer;
  correctAnswer: FillInTheBlankAnswer;
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

export interface BlankField {
  id: string;
  placeholder: string;
  correctAnswer: string;
  position: number; // Position in the code string
}

export interface CodeLine {
  lineNumber: number;
  content: string;
  hasBlank: boolean;
  blankField?: BlankField;
}

export interface FillInTheBlankProblemData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  codeLines: CodeLine[];
  correctAnswers: { [blankId: string]: string };
  explanation: string;
  hints?: string[];
}

export interface Lv3FillInTheBlankProblemScreenProps {
  /** Callback when user submits answer */
  onAnswerSubmit?: (answers: { [blankId: string]: string }) => void;

  /** Callback when user closes the screen */
  onClose?: () => void;

  /** Callback when moving to next problem */
  onNext?: () => void;

  /** Callback when session is completed (all problems finished) */
  onSessionComplete?: () => void;

  /** Callback when goal completion modal should be shown */
  onShowGoalModal?: () => void;

  /** Time remaining in seconds */
  timeRemaining?: number;

  /** Custom problem data (optional) - now managed by session */
  problemData?: FillInTheBlankProblemData;
}

export interface BlankInputFieldProps {
  blankField: BlankField;
  value: string;
  onChangeText: (blankId: string, text: string) => void;
  isCorrect?: boolean;
  showResult?: boolean;
  disabled: boolean;
}

export interface CodeBlockProps {
  codeLines: CodeLine[];
  userAnswers: { [blankId: string]: string };
  onBlankChange: (blankId: string, text: string) => void;
  showResults?: boolean;
  correctAnswers?: { [blankId: string]: string };
  disabled: boolean;
}

export interface FillInTheBlankProgressBarProps {
  current: number;
  total: number;
  animated?: boolean;
}

export interface FillInTheBlankTimerProps {
  timeRemaining: number;
  onTimeUp?: () => void;
}

export interface FillInTheBlankProblemHeaderProps {
  currentProblem: number;
  totalProblems: number;
  category: string;
  timeRemaining: number;
  onClose: () => void;
}

export interface FillInTheBlankResultModalProps {
  isVisible: boolean;
  isCorrect: boolean;
  explanation: string;
  correctAnswers: { [blankId: string]: string };
  userAnswers: { [blankId: string]: string };
  onContinue: () => void;
}

export interface SubmitButtonProps {
  isEnabled: boolean;
  onPress: () => void;
}