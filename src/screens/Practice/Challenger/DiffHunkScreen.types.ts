/**
 * Type definitions for DiffHunkScreen
 *
 * LV5 Code Review Diff View의 완전한 타입 시스템
 * Git diff 시맨틱과 사용자 인터랙션을 모두 지원하는 포괄적인 타입 정의
 */

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// ============================================================================
// Navigation Types
// ============================================================================

export type DiffHunkScreenNavigationProp = StackNavigationProp<any, 'DiffHunkScreen'>;

export interface DiffHunkScreenRoutParams {
  sessionId: string;
  commitHash: string;
  fileIndex: number;
  fileName: string;
  returnRoute?: string;
  totalFiles?: number;
  currentFileIndex?: number;
}

export type DiffHunkScreenRouteProp = RouteProp<{ DiffHunkScreen: DiffHunkScreenRoutParams }, 'DiffHunkScreen'>;

export interface DiffHunkScreenProps {
  navigation: DiffHunkScreenNavigationProp;
  route: DiffHunkScreenRouteProp;
}

// ============================================================================
// Git Diff Data Types
// ============================================================================

export interface FileChange {
  path: string;
  oldPath?: string; // For renamed files
  status: 'added' | 'modified' | 'deleted' | 'renamed' | 'copied';
  additions: number;
  deletions: number;
  isBinary?: boolean;
}

export interface DiffHunk {
  index: number;
  startLineOld: number;
  linesOld: number;
  startLineNew: number;
  linesNew: number;
  header: string; // @@ -start,lines +start,lines @@
  contextBefore: string[];
  contextAfter: string[];
  originalLines: DiffLine[];
  modifiedLines: DiffLine[];
  changeType: 'addition' | 'deletion' | 'modification' | 'context';
}

export interface DiffLine {
  number: number;
  content: string;
  type: 'add' | 'delete' | 'context' | 'no-newline';
  isConflict?: boolean;
  conflictMarker?: '<<<<<<< ' | '=======' | '>>>>>>> ';
}

export interface FileDiff {
  fileChange: FileChange;
  hunks: DiffHunk[];
  summary: string;
  complexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reviewPriority: number; // 1-5
}

// ============================================================================
// Hunk Review Types
// ============================================================================

export type HunkReviewAction = 'accept' | 'reject' | 'edit' | 'comment';

export type HunkReviewStatus = 'pending' | 'accepted' | 'rejected' | 'edited' | 'commented';

export interface HunkReviewDecision {
  hunkIndex: number;
  action: HunkReviewAction;
  editedLines?: DiffLine[];
  comment?: string;
  timestamp: Date;
  confidence?: number; // 1-5 user confidence in decision
}

export interface HunkReviewMetrics {
  timeSpent: number; // seconds
  scrollsCount: number;
  zoomLevel: number;
  linesReviewed: number;
  editsCount: number;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface ViewportState {
  splitRatio: number; // 0.5 = equal split, 0.3 = 30% left, 70% right
  showLineNumbers: boolean;
  wrapLines: boolean;
  fontSize: number;
  theme: 'light' | 'dark' | 'high-contrast';
  highlightMode: 'word' | 'line' | 'character';
}

export interface NavigationState {
  currentHunkIndex: number;
  totalHunks: number;
  isFirstHunk: boolean;
  isLastHunk: boolean;
  hasNextFile: boolean;
  hasPreviousFile: boolean;
}

export interface ReviewSessionProgress {
  sessionId: string;
  startTime: Date;
  currentTime: Date;
  totalHunks: number;
  reviewedHunks: number;
  acceptedHunks: number;
  rejectedHunks: number;
  editedHunks: number;
  commentedHunks: number;
  averageTimePerHunk: number;
  currentScore: number;
  remainingFiles: number;
}

// ============================================================================
// Component State Types
// ============================================================================

export interface DiffHunkScreenState {
  fileDiff: FileDiff | null;
  currentHunkIndex: number;
  hunkDecisions: Map<number, HunkReviewDecision>;
  viewport: ViewportState;
  navigation: NavigationState;
  reviewProgress: ReviewSessionProgress;
  isLoading: boolean;
  error: string | null;
  isEditingHunk: boolean;
  editingHunkIndex: number | null;
  tempEditedLines: DiffLine[];
  unsavedChanges: boolean;
}

export type DiffHunkScreenAction =
  | { type: 'SET_FILE_DIFF'; payload: FileDiff }
  | { type: 'SET_CURRENT_HUNK'; payload: number }
  | { type: 'ADD_HUNK_DECISION'; payload: HunkReviewDecision }
  | { type: 'UPDATE_VIEWPORT'; payload: Partial<ViewportState> }
  | { type: 'UPDATE_NAVIGATION'; payload: Partial<NavigationState> }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<ReviewSessionProgress> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'START_EDIT_HUNK'; payload: { hunkIndex: number; lines: DiffLine[] } }
  | { type: 'UPDATE_EDIT_LINES'; payload: DiffLine[] }
  | { type: 'SAVE_EDIT_HUNK'; payload: { comment?: string } }
  | { type: 'CANCEL_EDIT_HUNK' }
  | { type: 'MARK_UNSAVED_CHANGES'; payload: boolean };

// ============================================================================
// Props Types for Sub-components
// ============================================================================

export interface DiffSplitViewProps {
  hunk: DiffHunk;
  currentDecision?: HunkReviewDecision;
  viewport: ViewportState;
  isActive: boolean;
  isEditing: boolean;
  editedLines?: DiffLine[];
  onViewportChange: (changes: Partial<ViewportState>) => void;
  onLineEdit?: (lineIndex: number, newContent: string) => void;
}

export interface HunkActionBarProps {
  hunkIndex: number;
  totalHunks: number;
  isEditing: boolean;
  canNavigate: {
    previous: boolean;
    next: boolean;
    previousFile: boolean;
    nextFile: boolean;
  };
  onAction: (action: HunkReviewAction, data?: any) => void;
  onNavigate: (direction: 'previous' | 'next' | 'previousFile' | 'nextFile') => void;
}

export interface ReviewProgressBarProps {
  progress: ReviewSessionProgress;
  navigation: NavigationState;
  onProgressTap?: () => void;
}

export interface DiffLineProps {
  line: DiffLine;
  isEditing: boolean;
  onEdit?: (newContent: string) => void;
  showLineNumber: boolean;
  highlightMode: ViewportState['highlightMode'];
}

export interface EditCommentModalProps {
  isVisible: boolean;
  currentComment?: string;
  onSave: (comment: string) => void;
  onCancel: () => void;
  hunkIndex: number;
  action: HunkReviewAction;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface DiffHunkScreenConfig {
  autoSaveInterval: number; // milliseconds
  maxUndoLevels: number;
  defaultViewport: ViewportState;
  keyboardShortcuts: boolean;
  gestureNavigation: boolean;
  performanceMode: 'smooth' | 'fast' | 'detailed';
}

// ============================================================================
// Mock Data Types
// ============================================================================

export interface MockDiffConfig {
  generateRandomHunks: boolean;
  complexityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  averageHunksPerFile: number;
  includeConflicts: boolean;
  includeBinaryFiles: boolean;
}

// ============================================================================
// Export Collection
// ============================================================================

export type {
  // Core exports for component usage
  DiffHunkScreenProps,
  DiffHunkScreenState,
  DiffHunkScreenAction,

  // Sub-component props
  DiffSplitViewProps,
  HunkActionBarProps,
  ReviewProgressBarProps,
  DiffLineProps,
  EditCommentModalProps,

  // Data structure exports
  FileDiff,
  DiffHunk,
  DiffLine,
  FileChange,
  HunkReviewDecision,

  // UI state exports
  ViewportState,
  NavigationState,
  ReviewSessionProgress,

  // Configuration exports
  DiffHunkScreenConfig,
  MockDiffConfig,
};