// Type definitions for Lv4DebuggingScreen component

export type TestCaseResult = 'PASSED' | 'FAILED' | 'PENDING';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  result?: TestCaseResult;
  description: string;
}

export interface DebuggingProblemData {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  language: string;
  difficulty: 'intermediate' | 'advanced';
  testCases: TestCase[];
  hints: DebuggingHint[];
  category: string;
  timeLimit?: number;
  memoryLimit?: string;
}

export interface DebuggingHint {
  id: number;
  title: string;
  content: string;
  type: 'concept' | 'visual' | 'specific';
  codeHighlight?: {
    startLine: number;
    endLine: number;
    message: string;
  };
}

export interface CodeExecutionResult {
  isSuccess: boolean;
  passedTests: number;
  totalTests: number;
  testResults: TestCase[];
  executionTime?: number;
  error?: string;
}

export interface Lv4DebuggingScreenProps {
  /** Callback when user completes debugging successfully */
  onDebugComplete?: (result: CodeExecutionResult) => void;

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
  problemData?: DebuggingProblemData;
}

export interface CodeEditorProps {
  /** Current code content */
  code: string;

  /** Programming language for syntax highlighting */
  language: string;

  /** Callback when code changes */
  onCodeChange: (newCode: string) => void;

  /** Whether the editor is readonly */
  readonly?: boolean;

  /** Line numbers to highlight for hints */
  highlightedLines?: number[];

  /** Theme for the editor */
  theme?: 'light' | 'dark';
}

export interface DebugSimulationModalProps {
  /** Whether modal is visible */
  isVisible: boolean;

  /** Code to execute */
  code: string;

  /** Programming language */
  language: string;

  /** Test cases to run */
  testCases: TestCase[];

  /** Callback when execution completes */
  onExecutionComplete: (result: CodeExecutionResult) => void;

  /** Callback to close modal */
  onClose: () => void;

  /** Whether execution is in progress */
  isExecuting?: boolean;
}

export interface DebuggingHintCardProps {
  /** Whether hint card is visible */
  isVisible: boolean;

  /** Current hint data */
  hint: DebuggingHint;

  /** Current step number */
  currentStep: number;

  /** Total number of steps */
  totalSteps: number;

  /** XP deducted so far */
  totalXpDeducted: number;

  /** Callback when next hint is requested */
  onNextHint: () => void;

  /** Callback to close hint */
  onClose: () => void;

  /** Whether this is the last hint step */
  isLastStep: boolean;
}

export interface DebuggingHeaderProps {
  /** Current problem number */
  currentProblem: number;

  /** Total number of problems */
  totalProblems: number;

  /** Problem category */
  category: string;

  /** Time remaining in seconds */
  timeRemaining: number;

  /** Callback when close is pressed */
  onClose: () => void;
}

export interface ExecutionButtonProps {
  /** Whether execution is enabled */
  isEnabled: boolean;

  /** Callback when execution is requested */
  onExecute: () => void;

  /** Whether execution is in progress */
  isExecuting?: boolean;
}

export interface NextButtonProps {
  /** Whether next button is enabled */
  isEnabled: boolean;

  /** Callback when next is pressed */
  onNext: () => void;

  /** Button text */
  text?: string;
}

export interface ProgressBarProps {
  /** Current progress (0-1) */
  progress: number;

  /** Whether to show success state */
  isSuccess?: boolean;

  /** Whether to show error state */
  isError?: boolean;

  /** Animation duration in ms */
  animationDuration?: number;
}

export interface ShakeAnimationProps {
  /** Whether to trigger shake animation */
  shouldShake: boolean;

  /** Animation intensity */
  intensity?: number;

  /** Animation duration in ms */
  duration?: number;

  /** Child components */
  children: React.ReactNode;
}