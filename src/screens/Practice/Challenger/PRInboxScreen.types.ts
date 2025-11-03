/**
 * PRInboxScreen Type Definitions
 *
 * LV5 Code Review & PR 모듈의 PR Inbox 화면을 위한 타입 정의
 * 커밋 스택 검토 및 시나리오 관리를 위한 인터페이스 제공
 */

// Navigation Types
export interface PRInboxScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route: {
    params: {
      sessionId: string;
      scenarioId: string;
      difficulty: 'medium' | 'hard' | 'expert';
      timeLimit?: number;
      returnRoute?: string;
    };
  };
}

// Core Data Types
export interface PRScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  requirements: string[];
  difficulty: 'medium' | 'hard' | 'expert';
  estimatedTime: number; // in minutes
  tags: string[];
  createdAt: Date;
}

export interface CommitInfo {
  hash: string;
  shortHash: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp: Date;
  filesChanged: CommitFile[];
  stats: {
    additions: number;
    deletions: number;
    filesCount: number;
  };
  diffPreview: DiffPreview;
  status: CommitStatus;
  reviewNotes?: string;
}

export interface CommitFile {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  patch?: string; // Simplified diff content
}

export interface DiffPreview {
  summary: string;
  keyChanges: string[];
  codeSnippet?: string;
  riskLevel: 'low' | 'medium' | 'high';
  reviewPriority: number; // 1-5 scale
}

export type CommitStatus = 'pending' | 'accepted' | 'rejected' | 'needs_review';

export interface CommitReviewAction {
  commitHash: string;
  action: 'accept' | 'reject' | 'flag_for_review';
  reason?: string;
  timestamp: Date;
}

// Screen State Management
export interface PRInboxState {
  scenario: PRScenario | null;
  commits: CommitInfo[];
  reviewActions: CommitReviewAction[];
  selectedCommit: string | null;
  isLoading: boolean;
  error: string | null;
  sessionProgress: SessionProgress;
}

export interface SessionProgress {
  totalCommits: number;
  reviewedCommits: number;
  acceptedCommits: number;
  rejectedCommits: number;
  flaggedCommits: number;
  startTime: Date;
  timeRemaining: number;
  currentScore: number;
}

// Component Props Interfaces
export interface CommitCardProps {
  commit: CommitInfo;
  onStatusChange: (hash: string, status: CommitStatus, reason?: string) => void;
  onViewDetails: (hash: string) => void;
  isSelected: boolean;
  onSelect: (hash: string) => void;
}

export interface ScenarioSectionProps {
  scenario: PRScenario;
  progress: SessionProgress;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface DiffPreviewCardProps {
  diffPreview: DiffPreview;
  onExpand: () => void;
  isExpanded: boolean;
}

export interface ReviewActionButtonsProps {
  commitHash: string;
  currentStatus: CommitStatus;
  onAction: (action: 'accept' | 'reject' | 'flag_for_review', reason?: string) => void;
  disabled?: boolean;
}

// Event and Action Types
export type PRInboxAction =
  | { type: 'SET_SCENARIO'; payload: PRScenario }
  | { type: 'SET_COMMITS'; payload: CommitInfo[] }
  | { type: 'UPDATE_COMMIT_STATUS'; payload: { hash: string; status: CommitStatus; reason?: string } }
  | { type: 'SELECT_COMMIT'; payload: string | null }
  | { type: 'ADD_REVIEW_ACTION'; payload: CommitReviewAction }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<SessionProgress> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Analytics and Evaluation
export interface PRInboxAnalytics {
  sessionId: string;
  scenarioId: string;
  timeSpent: number;
  accuracyScore: number;
  efficiencyScore: number;
  detailsViewed: number;
  actionsPerMinute: number;
  reviewQuality: ReviewQuality;
  mistakesCount: number;
  helpUsed: boolean;
}

export interface ReviewQuality {
  thoroughness: number; // 1-10 scale
  accuracy: number; // percentage
  consistency: number; // 1-10 scale
  reasoning: number; // 1-10 scale
  timeliness: number; // 1-10 scale
}

// Mock Data Generators (for development)
export interface MockDataConfig {
  commitCount: number;
  scenarioType: 'feature_request' | 'bug_fix' | 'refactoring' | 'security_update';
  difficulty: 'medium' | 'hard' | 'expert';
  includeProblematicCommits: boolean;
  timeConstraint: number; // in minutes
}

// Error Handling
export interface PRInboxError {
  code: string;
  message: string;
  type: 'network' | 'validation' | 'session' | 'data';
  retryable: boolean;
  context?: Record<string, any>;
}

// Integration Types
export interface ExternalIntegration {
  gitProvider?: 'github' | 'gitlab' | 'bitbucket';
  repositoryUrl?: string;
  prNumber?: number;
  isSimulated: boolean;
}

// Accessibility Support
export interface AccessibilityFeatures {
  screenReaderSupport: boolean;
  highContrastMode: boolean;
  largeTextMode: boolean;
  keyboardNavigation: boolean;
  voiceCommands: boolean;
}

// Performance Monitoring
export interface PerformanceMetrics {
  renderTime: number;
  listScrollPerformance: number;
  memoryUsage: number;
  networkLatency?: number;
}

// All types are already exported above