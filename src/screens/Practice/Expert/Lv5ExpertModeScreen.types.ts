// Type definitions for LV5 Expert Mode Screen and components

import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Navigation types
export type ExpertModeStackParamList = {
  Lv5ExpertMode: {
    initialModule?: 'vibe_coding' | 'code_review';
    returnRoute?: string;
    sessionConfig?: ExpertSessionConfig;
  };
};

export type Lv5ExpertModeScreenProps = NativeStackScreenProps<
  ExpertModeStackParamList,
  'Lv5ExpertMode'
>;

// Session Management Types
export interface ExpertSessionConfig {
  timeLimit?: number; // in seconds
  difficulty: 'intermediate' | 'advanced' | 'expert';
  enableAIAssistance: boolean;
  enableCollaboration: boolean;
  autoSave: boolean;
}

export interface ExpertSession {
  id: string;
  userId: string;
  sessionType: 'vibe_coding' | 'code_review';
  startedAt: Date;
  endedAt?: Date;
  totalDurationSeconds: number;
  status: 'active' | 'completed' | 'abandoned';
  config: ExpertSessionConfig;
  currentModule: 'vibe_coding' | 'code_review';
  progress: ExpertSessionProgress;
}

export interface ExpertSessionProgress {
  totalTasks: number;
  completedTasks: number;
  currentTaskId?: string;
  overallScore: number;
  moduleScores: {
    vibeCoding?: VibeModuleScore;
    codeReview?: CodeReviewModuleScore;
  };
}

// Vibe Coding Module Types
export interface VibeModuleScore {
  accuracy: number; // 30%
  quality: number; // 20%
  efficiency: number; // 20%
  creativity: number; // 15%
  speed: number; // 15%
  overall: number;
}

export interface VibePromptData {
  id: string;
  sessionId: string;
  promptText: string;
  language?: string;
  taskType: 'code_generation' | 'mockup_creation' | 'architecture_design' | 'debugging_assistance';
  context?: Record<string, any>;
  aiResponse?: string;
  generatedCode?: string;
  tokensUsed: number;
  responseTime: number; // in milliseconds
  userRating?: number; // 1-5 stars
  evaluationScores?: VibeEvaluationScores;
  createdAt: Date;
}

export interface VibeEvaluationScores {
  accuracy: number;
  quality: number;
  efficiency: number;
  creativity: number;
  speed: number;
  feedback: string[];
  suggestions: string[];
}

export interface VibePromptInterfaceProps {
  onPromptSubmit: (prompt: VibePromptRequest) => void;
  isLoading: boolean;
  placeholder?: string;
  maxLength?: number;
  supportedLanguages: string[];
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export interface VibePromptRequest {
  promptText: string;
  language: string;
  taskType: 'code_generation' | 'mockup_creation' | 'architecture_design' | 'debugging_assistance';
  context?: {
    existingCode?: string;
    requirements?: string[];
    constraints?: string[];
    targetPlatform?: string;
  };
}

export interface AIResponseViewerProps {
  response: VibePromptData | null;
  isLoading: boolean;
  onRetry?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestModification?: (feedback: string) => void;
}

export interface TokenEfficiencyMonitorProps {
  currentSessionTokens: number;
  totalSessionLimit: number;
  currentPromptTokens?: number;
  averageTokensPerPrompt: number;
  efficiencyScore: number;
  recommendations: string[];
}

// Code Review Module Types
export interface CodeReviewModuleScore {
  codeQuality: number; // 40%
  collaboration: number; // 25%
  reviewAccuracy: number; // 20%
  processEfficiency: number; // 15%
  overall: number;
}

export interface CodeReviewSession {
  id: string;
  expertSessionId: string;
  repositoryUrl: string;
  branchName: string;
  targetCommit?: string;
  reviewType: 'commit_review' | 'pr_creation' | 'code_analysis' | 'collaboration_review';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  reviewData: CodeReviewData;
  createdAt: Date;
  completedAt?: Date;
}

export interface CodeReviewData {
  codeQualityScore: number;
  collaborationScore: number;
  reviewAccuracyScore: number;
  processEfficiencyScore: number;
  issues: CodeIssue[];
  suggestions: ReviewSuggestion[];
  metrics: CodeMetrics;
  pullRequestId?: number;
  reviewComments: ReviewComment[];
}

export interface CodeIssue {
  id: string;
  type: 'bug' | 'vulnerability' | 'code_smell' | 'performance' | 'maintainability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line: number;
  column?: number;
  message: string;
  suggestion?: string;
  rule?: string;
}

export interface ReviewSuggestion {
  id: string;
  category: 'improvement' | 'best_practice' | 'optimization' | 'refactoring';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  codeExample?: string;
}

export interface CodeMetrics {
  linesOfCode: number;
  complexity: number;
  maintainabilityIndex: number;
  testCoverage?: number;
  duplicatedLines: number;
  codeSmells: number;
  bugs: number;
  vulnerabilities: number;
}

export interface ReviewComment {
  id: string;
  author: string;
  content: string;
  fileName: string;
  lineNumber: number;
  type: 'comment' | 'suggestion' | 'issue' | 'question' | 'approval';
  timestamp: Date;
  resolved: boolean;
}

export interface GitIntegrationPanelProps {
  onRepositoryConnect: (repoConfig: RepositoryConfig) => void;
  connectedRepository?: RepositoryInfo;
  isConnecting: boolean;
  connectionError?: string;
}

export interface RepositoryConfig {
  url: string;
  branch: string;
  accessToken?: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
}

export interface RepositoryInfo {
  name: string;
  owner: string;
  url: string;
  branch: string;
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    date: Date;
  };
  isPrivate: boolean;
}

export interface CommitHistoryViewerProps {
  commits: GitCommit[];
  selectedCommit?: string;
  onCommitSelect: (commitHash: string) => void;
  isLoading: boolean;
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: {
    name: string;
    email: string;
  };
  date: Date;
  filesChanged: number;
  additions: number;
  deletions: number;
  status: 'unreviewed' | 'reviewing' | 'approved' | 'rejected';
}

export interface PRCreationModalProps {
  isVisible: boolean;
  repositoryInfo: RepositoryInfo;
  selectedCommits: string[];
  onCreatePR: (prData: PRCreationData) => void;
  onClose: () => void;
  isCreating: boolean;
}

export interface PRCreationData {
  title: string;
  description: string;
  targetBranch: string;
  sourceBranch: string;
  isDraft: boolean;
  assignees: string[];
  reviewers: string[];
  labels: string[];
}

// Analytics and Evaluation Types
export interface ExpertAnalytics {
  sessionId: string;
  userId: string;
  moduleType: 'vibe_coding' | 'code_review';
  totalTimeSpent: number;
  tasksCompleted: number;
  tasksAttempted: number;
  averageScore: number;
  strengthAreas: string[];
  improvementAreas: string[];
  recommendations: AnalyticsRecommendation[];
  progressTrend: ProgressDataPoint[];
}

export interface AnalyticsRecommendation {
  id: string;
  type: 'skill_development' | 'practice_focus' | 'learning_resource' | 'collaboration_tip';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionItems: string[];
  estimatedImpact: number; // 1-10 scale
}

export interface ProgressDataPoint {
  timestamp: Date;
  metric: string;
  value: number;
  context?: Record<string, any>;
}

export interface ExpertMetricsDashboardProps {
  analytics: ExpertAnalytics;
  timeRange: 'session' | 'day' | 'week' | 'month';
  onTimeRangeChange: (range: string) => void;
  isLoading: boolean;
}

// Shared Component Types
export interface ExpertModeTabNavigationProps {
  activeModule: 'vibe_coding' | 'code_review';
  onModuleChange: (module: 'vibe_coding' | 'code_review') => void;
  moduleProgress: {
    vibe_coding: number;
    code_review: number;
  };
  isModuleUnlocked: {
    vibe_coding: boolean;
    code_review: boolean;
  };
}

export interface TimerComponentProps {
  initialTime: number; // in seconds
  isRunning: boolean;
  onTimeUp: () => void;
  onTimeUpdate?: (remainingTime: number) => void;
  showWarningAt?: number; // seconds remaining when to show warning
  format?: 'mm:ss' | 'hh:mm:ss';
}

export interface ExpertModeErrorBoundaryState {
  hasError: boolean;
  errorType: 'ai_service' | 'git_integration' | 'network' | 'session_expired' | 'unknown';
  errorMessage: string;
  sessionId?: string;
  canRecover: boolean;
}

// AI Integration Types
export interface AIServiceConfig {
  provider: 'openai' | 'claude' | 'custom';
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number; // in milliseconds
}

export interface AIServiceResponse {
  id: string;
  content: string;
  tokensUsed: number;
  processingTime: number;
  metadata: Record<string, any>;
  error?: string;
}

// Evaluation System Types
export interface EvaluationCriteria {
  metric: string;
  weight: number; // 0-1
  description: string;
  scoringRubric: ScoringRubric[];
}

export interface ScoringRubric {
  scoreRange: [number, number]; // [min, max]
  description: string;
  examples: string[];
}

export interface EvaluationResult {
  overall: number;
  breakdown: Record<string, number>;
  feedback: string[];
  suggestions: string[];
  nextSteps: string[];
}

// Error Handling Types
export interface ExpertModeError {
  code: string;
  message: string;
  type: 'validation' | 'service' | 'network' | 'auth' | 'timeout';
  retryable: boolean;
  context?: Record<string, any>;
}

// Code Review specific types
export type ReviewStatus = 'open' | 'approved' | 'rejected' | 'changes_requested' | 'draft';

export interface PullRequestData {
  id: string;
  title: string;
  description: string;
  author: string;
  reviewers: string[];
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
  filesChanged: string[];
  additions: number;
  deletions: number;
  commits: GitCommit[];
}

export interface CodeReviewState {
  currentPR: PullRequestData | null;
  reviewComments: ReviewComment[];
  diffData: DiffData[];
  reviewProgress: ReviewProgress;
  gitStatus: GitStatus;
  isLoading: boolean;
  error: string | null;
  // New Hunk-level review state
  reviewSession: PRReviewSession | null;
  currentFileIndex: number;
  currentHunkIndex: number;
}

export interface PRReviewSession {
  id: string;
  prId: string;
  files: FileReviewState[];
  currentFileIndex: number;
  totalHunks: number;
  reviewedHunks: number;
  sessionProgress: SessionProgress;
  startedAt: Date;
  isComplete: boolean;
}

export interface SessionProgress {
  currentPhase: 'file_selection' | 'hunk_review' | 'final_review' | 'completed';
  completionPercentage: number;
  estimatedTimeRemaining?: number;
}

export interface DiffData {
  fileName: string;
  changes: DiffChange[];
  hunks: HunkInfo[];
}

export interface DiffChange {
  lineNumber: number;
  type: 'add' | 'delete' | 'modify';
  content: string;
}

// Hunk-level review system types
export interface HunkInfo {
  id: string;
  fileId: string;
  fileName: string;
  hunkIndex: number;
  startLineOld: number;
  startLineNew: number;
  linesOld: number;
  linesNew: number;
  originalCode: string[];
  modifiedCode: string[];
  changeType: 'addition' | 'deletion' | 'modification' | 'mixed';
  reviewStatus: 'pending' | 'accepted' | 'rejected' | 'edited';
  userDecision?: HunkDecision;
  context: {
    beforeLines: string[];
    afterLines: string[];
  };
}

export interface HunkDecision {
  action: 'accept' | 'reject' | 'edit';
  editedCode?: string[];
  comment?: string;
  timestamp: Date;
}

export interface FileReviewState {
  fileId: string;
  fileName: string;
  hunks: HunkInfo[];
  currentHunkIndex: number;
  totalHunks: number;
  isComplete: boolean;
  reviewedHunks: number;
}

export interface ReviewProgress {
  filesReviewed: number;
  totalFiles: number;
  commentsAdded: number;
  issuesFound: number;
}

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  hasConflicts: boolean;
  uncommittedChanges: boolean;
}

export type CodeReviewAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PR'; payload: PullRequestData | null }
  | { type: 'ADD_REVIEW_COMMENT'; payload: ReviewComment }
  | { type: 'UPDATE_REVIEW_PROGRESS'; payload: Partial<ReviewProgress> }
  | { type: 'UPDATE_GIT_STATUS'; payload: Partial<GitStatus> }
  | { type: 'SET_DIFF_DATA'; payload: DiffData[] }
  // New Hunk-level review actions
  | { type: 'INITIALIZE_REVIEW_SESSION'; payload: PRReviewSession }
  | { type: 'UPDATE_REVIEW_SESSION'; payload: Partial<PRReviewSession> }
  | { type: 'HUNK_DECISION'; payload: { fileIndex: number; hunkIndex: number; decision: HunkDecision } }
  | { type: 'NAVIGATE_TO_HUNK'; payload: { fileIndex: number; hunkIndex: number } }
  | { type: 'COMPLETE_FILE_REVIEW'; payload: { fileIndex: number } }
  | { type: 'COMPLETE_REVIEW_SESSION'; payload: { finalDecisions: HunkDecision[] } };

export interface VibeCodingModuleProps {
  sessionId: string;
  problemData?: any;
  userProgress?: any;
  onModuleComplete?: (result: ModuleResult) => void;
  onScoreUpdate?: (scoreUpdate: ScoreUpdate) => void;
  onError?: (error: string) => void;
}

export interface CodeReviewModuleProps {
  sessionId: string;
  problemData?: any;
  userProgress?: any;
  onModuleComplete?: (result: ModuleResult) => void;
  onScoreUpdate?: (scoreUpdate: ScoreUpdate) => void;
  onError?: (error: string) => void;
}

export interface ModuleResult {
  moduleType: 'vibe_coding' | 'code_review';
  completed: boolean;
  score: number;
  timeSpent: number;
  achievements: string[];
}

export interface ScoreUpdate {
  category: string;
  score: number;
  details: string;
}

// New Hunk-level review component types
export interface HunkDiffViewProps {
  hunk: HunkInfo;
  isActive: boolean;
  onHunkDecision: (decision: HunkDecision) => void;
  showLineNumbers?: boolean;
  enableInlineEdit?: boolean;
}

export interface ProgressIndicatorProps {
  currentFileIndex: number;
  totalFiles: number;
  currentHunkIndex: number;
  totalHunks: number;
  reviewedHunks: number;
  completionPercentage: number;
}

export interface HunkActionBarProps {
  hunk: HunkInfo;
  onAccept: () => void;
  onReject: () => void;
  onEdit: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export interface InlineEditorProps {
  code: string[];
  onSave: (editedCode: string[]) => void;
  onCancel: () => void;
  language?: string;
  readOnly?: boolean;
}

// Events and Actions Types
export type ExpertModeAction =
  | { type: 'SESSION_START'; payload: ExpertSessionConfig }
  | { type: 'SESSION_END'; payload: { reason: 'completed' | 'timeout' | 'user_exit' } }
  | { type: 'MODULE_SWITCH'; payload: { from: string; to: string } }
  | { type: 'PROMPT_SUBMIT'; payload: VibePromptRequest }
  | { type: 'CODE_REVIEW_START'; payload: CodeReviewSession }
  | { type: 'EVALUATION_COMPLETE'; payload: EvaluationResult }
  | { type: 'ERROR_OCCURRED'; payload: ExpertModeError };

export interface ExpertModeState {
  currentSession?: ExpertSession;
  activeModule: 'vibe_coding' | 'code_review';
  isLoading: boolean;
  error?: ExpertModeError;
  analytics: ExpertAnalytics | null;
}