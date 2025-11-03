// Type definitions for VibeSessionScreen component
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Navigation types
export type ChallengerStackParamList = {
  VibeSession: {
    problemId: string;
    sessionId: string;
    timeLimit?: number;
    difficulty: 'easy' | 'medium' | 'hard';
    returnRoute?: string;
  };
};

export type VibeSessionScreenProps = NativeStackScreenProps<
  ChallengerStackParamList,
  'VibeSession'
>;

// Session data types
export interface VibeSessionData {
  id: string;
  problemId: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  timeLimit: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'timeout' | 'abandoned';
  tokensUsed: number;
  tokensLimit: number;
  currentScore: number;
  conversations: ConversationMessage[];
  generatedResults: GenerationResult[];
}

// Problem definition types
export interface VibeProblem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  constraints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  expectedOutputType: 'code' | 'mockup' | 'architecture' | 'solution';
  language?: string;
  framework?: string;
  hints: VibeProblemHint[];
  estimatedTime: number; // in minutes
}

export interface VibeProblemHint {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  content: string;
  tokensDeduction: number;
}

// Conversation types
export type ConversationRole = 'user' | 'ai';

export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  content: string;
  timestamp: Date;
  tokensUsed?: number;
  generationId?: string; // Links to GenerationResult
  metadata?: {
    promptType?: 'initial' | 'clarification' | 'modification' | 'retry';
    confidence?: number;
    processingTime?: number;
  };
}

// AI Generation types
export interface GenerationRequest {
  promptText: string;
  context: GenerationContext;
  parameters: GenerationParameters;
}

export interface GenerationContext {
  problemId: string;
  previousAttempts: GenerationResult[];
  userFeedback?: string;
  requirements: string[];
  constraints: string[];
  targetLanguage?: string;
  targetFramework?: string;
}

export interface GenerationParameters {
  maxTokens: number;
  temperature: number;
  includeExplanation: boolean;
  codeStyle?: 'clean' | 'documented' | 'optimized';
  outputFormat: 'code' | 'mockup' | 'explanation' | 'mixed';
}

export interface GenerationResult {
  id: string;
  sessionId: string;
  conversationMessageId: string;
  generatedContent: string;
  extractedCode?: string;
  language?: string;
  tokensUsed: number;
  processingTime: number;
  confidence: number;
  status: 'success' | 'error' | 'timeout';
  error?: string;
  metadata: GenerationMetadata;
  userActions: UserAction[];
  createdAt: Date;
}

export interface GenerationMetadata {
  aiProvider: 'openai' | 'claude' | 'custom';
  model: string;
  requestParameters: GenerationParameters;
  qualityMetrics: QualityMetrics;
  extractionResults: ExtractionResults;
}

export interface QualityMetrics {
  relevanceScore: number; // 0-100
  completenessScore: number; // 0-100
  clarityScore: number; // 0-100
  codeQualityScore?: number; // 0-100 (if code generation)
  estimatedAccuracy: number; // 0-100
}

export interface ExtractionResults {
  codeBlocks: CodeBlock[];
  explanations: string[];
  suggestions: string[];
  warnings: string[];
}

export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  startLine?: number;
  endLine?: number;
  isMainSolution: boolean;
  isExecutable: boolean;
}

// User interaction types
export type UserActionType = 'pin' | 'edit' | 'retry' | 'approve' | 'reject' | 'request_modification';

export interface UserAction {
  id: string;
  type: UserActionType;
  timestamp: Date;
  data?: {
    editedCode?: string;
    feedback?: string;
    modificationRequest?: string;
    rating?: number; // 1-5 stars
  };
}

// Token management types
export interface TokenUsage {
  currentSession: number;
  sessionLimit: number;
  averagePerPrompt: number;
  estimatedRemaining: number;
  efficiencyScore: number; // 0-100
  recommendations: TokenRecommendation[];
}

export interface TokenRecommendation {
  type: 'efficiency' | 'clarity' | 'specificity' | 'structure';
  message: string;
  impact: 'low' | 'medium' | 'high';
  examples?: string[];
}

// UI Component Props types
export interface ConversationPanelProps {
  conversations: ConversationMessage[];
  problem: VibeProblem;
  isLoading: boolean;
  onMessagePress?: (message: ConversationMessage) => void;
  onProblemHintRequest?: (hintLevel: 1 | 2 | 3) => void;
}

export interface ResultPreviewPanelProps {
  currentResult: GenerationResult | null;
  allResults: GenerationResult[];
  isGenerating: boolean;
  onCodeEdit?: (code: string) => void;
  onResultAction?: (action: UserActionType, data?: any) => void;
  onResultSelect?: (result: GenerationResult) => void;
}

export interface PromptInputProps {
  onSubmit: (request: GenerationRequest) => void;
  isLoading: boolean;
  placeholder?: string;
  maxLength?: number;
  suggestions?: string[];
  currentTokenUsage: TokenUsage;
}

export interface TokenMonitorProps {
  usage: TokenUsage;
  onRecommendationPress?: (recommendation: TokenRecommendation) => void;
  showDetailedStats?: boolean;
}

export interface ControlButtonsProps {
  onRetry: () => void;
  onPin: () => void;
  onSubmit: () => void;
  onSkip?: () => void;
  isRetryEnabled: boolean;
  isPinEnabled: boolean;
  isSubmitEnabled: boolean;
  currentResult?: GenerationResult;
}

// Code editor types
export interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
  fontSize?: number;
  maxHeight?: number;
}

export interface SyntaxHighlightTheme {
  background: string;
  foreground: string;
  comment: string;
  keyword: string;
  string: string;
  number: string;
  operator: string;
  function: string;
  variable: string;
  type: string;
  lineNumber: string;
  selection: string;
  cursor: string;
}

// Evaluation types
export interface SessionEvaluation {
  sessionId: string;
  finalScore: number;
  metrics: EvaluationMetrics;
  feedback: EvaluationFeedback;
  recommendations: string[];
  nextLevelUnlocked: boolean;
}

export interface EvaluationMetrics {
  promptEffectiveness: number; // 0-100
  tokenEfficiency: number; // 0-100
  resultQuality: number; // 0-100
  iterationSpeed: number; // 0-100
  problemSolving: number; // 0-100
  overallPerformance: number; // 0-100
}

export interface EvaluationFeedback {
  strengths: string[];
  improvementAreas: string[];
  specificSuggestions: string[];
  examplePrompts: string[];
}

// Error types
export interface VibeSessionError {
  code: string;
  message: string;
  type: 'network' | 'ai_service' | 'validation' | 'timeout' | 'quota_exceeded' | 'unknown';
  retryable: boolean;
  context?: {
    sessionId?: string;
    messageId?: string;
    generationId?: string;
    additionalInfo?: Record<string, any>;
  };
}

// State management types
export interface VibeSessionState {
  session: VibeSessionData | null;
  problem: VibeProblem | null;
  currentGeneration: GenerationResult | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: VibeSessionError | null;
  tokenUsage: TokenUsage;
  selectedResultId: string | null;
  showHints: boolean;
  availableHints: VibeProblemHint[];
}

export type VibeSessionAction =
  | { type: 'SET_SESSION'; payload: VibeSessionData }
  | { type: 'SET_PROBLEM'; payload: VibeProblem }
  | { type: 'ADD_MESSAGE'; payload: ConversationMessage }
  | { type: 'ADD_GENERATION'; payload: GenerationResult }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: VibeSessionError | null }
  | { type: 'UPDATE_TOKEN_USAGE'; payload: Partial<TokenUsage> }
  | { type: 'SELECT_RESULT'; payload: string }
  | { type: 'TOGGLE_HINTS'; payload?: boolean }
  | { type: 'ADD_USER_ACTION'; payload: { resultId: string; action: UserAction } };

// Animation and UI state types
export interface PanelDimensions {
  conversationWidth: number;
  previewWidth: number;
  headerHeight: number;
  inputHeight: number;
  availableHeight: number;
}

export interface AnimationConfig {
  panelResize: {
    duration: number;
    easing: string;
  };
  messageAppear: {
    duration: number;
    easing: string;
  };
  codeHighlight: {
    duration: number;
    easing: string;
  };
}

// Accessibility types
export interface AccessibilityConfig {
  announcements: {
    messageReceived: string;
    generationComplete: string;
    tokenUsageUpdate: string;
    errorOccurred: string;
  };
  labels: {
    conversationPanel: string;
    previewPanel: string;
    promptInput: string;
    controlButtons: string;
  };
  hints: {
    promptSubmission: string;
    codeEditing: string;
    resultActions: string;
  };
}