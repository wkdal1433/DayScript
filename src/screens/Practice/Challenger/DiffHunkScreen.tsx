/**
 * DiffHunkScreen - LV5 Code Review Core Component
 *
 * Git diff 시각화와 Hunk 단위 코드 리뷰를 위한 전문적인 UI 컴포넌트
 * 실무형 통합 Diff View와 Hunk 단위 인터랙션 로직을 제공합니다.
 */

import React, { useState, useEffect, useReducer, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  DiffHunkScreenProps,
  DiffHunkScreenState,
  DiffHunkScreenAction,
  FileDiff,
  DiffHunk,
  DiffLine,
  HunkReviewDecision,
  HunkReviewAction,
  ViewportState,
  NavigationState,
  ReviewSessionProgress,
} from './DiffHunkScreen.types';
import { diffHunkStyles, getLineBackgroundColor, getStatusBadgeColor } from './DiffHunkScreen.styles';
import { COLORS } from '../../../constants/colors';

// ============================================================================
// Mock Data Generator
// ============================================================================

const generateMockFileDiff = (fileName: string): FileDiff => {
  const mockHunks: DiffHunk[] = [
    {
      index: 0,
      startLineOld: 45,
      linesOld: 8,
      startLineNew: 45,
      linesNew: 12,
      header: '@@ -45,8 +45,12 @@ export const validateUserInput = (input: string) => {',
      contextBefore: ['  const trimmed = input.trim();', '  if (!trimmed) {'],
      contextAfter: ['  }', '  return result;'],
      originalLines: [
        { number: 45, content: '  const trimmed = input.trim();', type: 'context' },
        { number: 46, content: '  if (!trimmed) {', type: 'context' },
        { number: 47, content: '    return null;', type: 'delete' },
        { number: 48, content: '  }', type: 'context' },
        { number: 49, content: '  return sanitizeInput(trimmed);', type: 'delete' },
      ],
      modifiedLines: [
        { number: 45, content: '  const trimmed = input.trim();', type: 'context' },
        { number: 46, content: '  if (!trimmed) {', type: 'context' },
        { number: 47, content: '    throw new Error("Input cannot be empty");', type: 'add' },
        { number: 48, content: '  }', type: 'context' },
        { number: 49, content: '  ', type: 'add' },
        { number: 50, content: '  // Enhanced input validation', type: 'add' },
        { number: 51, content: '  const sanitized = sanitizeInput(trimmed);', type: 'add' },
        { number: 52, content: '  if (!isValidFormat(sanitized)) {', type: 'add' },
        { number: 53, content: '    throw new Error("Invalid input format");', type: 'add' },
        { number: 54, content: '  }', type: 'add' },
        { number: 55, content: '  return sanitized;', type: 'add' },
      ],
      changeType: 'modification',
    },
    {
      index: 1,
      startLineOld: 78,
      linesOld: 4,
      startLineNew: 82,
      linesNew: 6,
      header: '@@ -78,4 +82,6 @@ const processData = async (data: any[]) => {',
      contextBefore: ['  const results = [];', '  for (const item of data) {'],
      contextAfter: ['  }', '  return results;'],
      originalLines: [
        { number: 78, content: '  const results = [];', type: 'context' },
        { number: 79, content: '  for (const item of data) {', type: 'context' },
        { number: 80, content: '    results.push(item);', type: 'delete' },
        { number: 81, content: '  }', type: 'context' },
      ],
      modifiedLines: [
        { number: 82, content: '  const results = [];', type: 'context' },
        { number: 83, content: '  for (const item of data) {', type: 'context' },
        { number: 84, content: '    const processed = await processItem(item);', type: 'add' },
        { number: 85, content: '    if (processed) {', type: 'add' },
        { number: 86, content: '      results.push(processed);', type: 'add' },
        { number: 87, content: '    }', type: 'add' },
        { number: 88, content: '  }', type: 'context' },
      ],
      changeType: 'modification',
    },
  ];

  return {
    fileChange: {
      path: fileName,
      status: 'modified',
      additions: 12,
      deletions: 2,
    },
    hunks: mockHunks,
    summary: 'Enhanced input validation and async data processing',
    complexity: 'medium',
    riskLevel: 'low',
    reviewPriority: 3,
  };
};

// ============================================================================
// State Reducer
// ============================================================================

const initialViewport: ViewportState = {
  splitRatio: 0.5,
  showLineNumbers: true,
  wrapLines: false,
  fontSize: 12,
  theme: 'light',
  highlightMode: 'line',
};

const diffHunkReducer = (state: DiffHunkScreenState, action: DiffHunkScreenAction): DiffHunkScreenState => {
  switch (action.type) {
    case 'SET_FILE_DIFF':
      return {
        ...state,
        fileDiff: action.payload,
        navigation: {
          ...state.navigation,
          totalHunks: action.payload.hunks.length,
          isFirstHunk: state.currentHunkIndex === 0,
          isLastHunk: state.currentHunkIndex === action.payload.hunks.length - 1,
        },
        isLoading: false,
        error: null,
      };

    case 'SET_CURRENT_HUNK':
      return {
        ...state,
        currentHunkIndex: action.payload,
        navigation: {
          ...state.navigation,
          currentHunkIndex: action.payload,
          isFirstHunk: action.payload === 0,
          isLastHunk: action.payload === (state.fileDiff?.hunks.length || 1) - 1,
        },
        isEditingHunk: false,
        editingHunkIndex: null,
        tempEditedLines: [],
      };

    case 'ADD_HUNK_DECISION':
      const newDecisions = new Map(state.hunkDecisions);
      newDecisions.set(action.payload.hunkIndex, action.payload);

      const reviewedCount = newDecisions.size;
      const totalHunks = state.fileDiff?.hunks.length || 0;

      return {
        ...state,
        hunkDecisions: newDecisions,
        reviewProgress: {
          ...state.reviewProgress,
          reviewedHunks: reviewedCount,
          acceptedHunks: Array.from(newDecisions.values()).filter(d => d.action === 'accept').length,
          rejectedHunks: Array.from(newDecisions.values()).filter(d => d.action === 'reject').length,
          editedHunks: Array.from(newDecisions.values()).filter(d => d.action === 'edit').length,
          commentedHunks: Array.from(newDecisions.values()).filter(d => d.action === 'comment').length,
          currentScore: Math.round((reviewedCount / totalHunks) * 100),
        },
        unsavedChanges: true,
      };

    case 'UPDATE_VIEWPORT':
      return {
        ...state,
        viewport: { ...state.viewport, ...action.payload },
      };

    case 'UPDATE_NAVIGATION':
      return {
        ...state,
        navigation: { ...state.navigation, ...action.payload },
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        reviewProgress: { ...state.reviewProgress, ...action.payload },
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'START_EDIT_HUNK':
      return {
        ...state,
        isEditingHunk: true,
        editingHunkIndex: action.payload.hunkIndex,
        tempEditedLines: [...action.payload.lines],
      };

    case 'UPDATE_EDIT_LINES':
      return {
        ...state,
        tempEditedLines: action.payload,
      };

    case 'SAVE_EDIT_HUNK':
      if (state.editingHunkIndex !== null) {
        const decision: HunkReviewDecision = {
          hunkIndex: state.editingHunkIndex,
          action: 'edit',
          editedLines: state.tempEditedLines,
          comment: action.payload.comment,
          timestamp: new Date(),
          confidence: 4,
        };

        const newDecisions = new Map(state.hunkDecisions);
        newDecisions.set(state.editingHunkIndex, decision);

        return {
          ...state,
          hunkDecisions: newDecisions,
          isEditingHunk: false,
          editingHunkIndex: null,
          tempEditedLines: [],
          unsavedChanges: true,
        };
      }
      return state;

    case 'CANCEL_EDIT_HUNK':
      return {
        ...state,
        isEditingHunk: false,
        editingHunkIndex: null,
        tempEditedLines: [],
      };

    case 'MARK_UNSAVED_CHANGES':
      return { ...state, unsavedChanges: action.payload };

    default:
      return state;
  }
};

// ============================================================================
// Sub-Components
// ============================================================================

interface DiffLineComponentProps {
  line: DiffLine;
  isEditing: boolean;
  onEdit?: (newContent: string) => void;
  showLineNumber: boolean;
}

const DiffLineComponent: React.FC<DiffLineComponentProps> = ({
  line,
  isEditing,
  onEdit,
  showLineNumber,
}) => {
  const [editValue, setEditValue] = useState(line.content);

  const lineStyle = [
    diffHunkStyles.codeLineContainer,
    {
      backgroundColor: getLineBackgroundColor(line.type),
    },
  ];

  const handleEditComplete = () => {
    if (onEdit && editValue !== line.content) {
      onEdit(editValue);
    }
  };

  return (
    <View style={lineStyle}>
      {showLineNumber && (
        <Text style={diffHunkStyles.lineNumber}>
          {line.number > 0 ? line.number : ''}
        </Text>
      )}
      {isEditing ? (
        <TextInput
          style={diffHunkStyles.editableCodeInput}
          value={editValue}
          onChangeText={setEditValue}
          onBlur={handleEditComplete}
          multiline
          scrollEnabled={false}
        />
      ) : (
        <Text style={diffHunkStyles.codeContent}>
          {line.content}
        </Text>
      )}
    </View>
  );
};

interface SplitPaneProps {
  title: string;
  lines: DiffLine[];
  isEditing: boolean;
  onLineEdit?: (lineIndex: number, newContent: string) => void;
  showLineNumbers: boolean;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  title,
  lines,
  isEditing,
  onLineEdit,
  showLineNumbers,
}) => {
  return (
    <View style={diffHunkStyles.rightPane}>
      <View style={diffHunkStyles.paneHeader}>
        <Text style={diffHunkStyles.paneTitle}>{title}</Text>
      </View>
      <ScrollView style={diffHunkStyles.codeScrollView}>
        {lines.map((line, index) => (
          <DiffLineComponent
            key={`${line.number}-${index}`}
            line={line}
            isEditing={isEditing}
            onEdit={onLineEdit ? (newContent) => onLineEdit(index, newContent) : undefined}
            showLineNumber={showLineNumbers}
          />
        ))}
        {lines.length === 0 && (
          <View style={diffHunkStyles.emptyLine}>
            <Text style={diffHunkStyles.codeContent}>{'// No content'}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const DiffHunkScreen: React.FC<DiffHunkScreenProps> = ({ navigation, route }) => {
  const { sessionId, fileName, fileIndex, totalFiles } = route.params;

  const initialState: DiffHunkScreenState = {
    fileDiff: null,
    currentHunkIndex: 0,
    hunkDecisions: new Map(),
    viewport: initialViewport,
    navigation: {
      currentHunkIndex: 0,
      totalHunks: 0,
      isFirstHunk: true,
      isLastHunk: true,
      hasNextFile: (totalFiles || 1) > (fileIndex + 1),
      hasPreviousFile: fileIndex > 0,
    },
    reviewProgress: {
      sessionId,
      startTime: new Date(),
      currentTime: new Date(),
      totalHunks: 0,
      reviewedHunks: 0,
      acceptedHunks: 0,
      rejectedHunks: 0,
      editedHunks: 0,
      commentedHunks: 0,
      averageTimePerHunk: 0,
      currentScore: 0,
      remainingFiles: (totalFiles || 1) - fileIndex - 1,
    },
    isLoading: true,
    error: null,
    isEditingHunk: false,
    editingHunkIndex: null,
    tempEditedLines: [],
    unsavedChanges: false,
  };

  const [state, dispatch] = useReducer(diffHunkReducer, initialState);
  const [commentText, setCommentText] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<HunkReviewAction | null>(null);

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    loadFileDiff();
  }, [fileName]);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: { currentTime: new Date() }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ============================================================================
  // Handlers
  // ============================================================================

  const loadFileDiff = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockDiff = generateMockFileDiff(fileName);
      dispatch({ type: 'SET_FILE_DIFF', payload: mockDiff });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load file diff' });
    }
  }, [fileName]);

  const handleHunkAction = useCallback((action: HunkReviewAction, data?: any) => {
    const currentHunk = state.fileDiff?.hunks[state.currentHunkIndex];
    if (!currentHunk) return;

    if (action === 'comment') {
      setPendingAction(action);
      setShowCommentModal(true);
      return;
    }

    if (action === 'edit') {
      dispatch({
        type: 'START_EDIT_HUNK',
        payload: {
          hunkIndex: state.currentHunkIndex,
          lines: currentHunk.modifiedLines,
        }
      });
      return;
    }

    const decision: HunkReviewDecision = {
      hunkIndex: state.currentHunkIndex,
      action,
      comment: data?.comment,
      timestamp: new Date(),
      confidence: 4,
    };

    dispatch({ type: 'ADD_HUNK_DECISION', payload: decision });

    // Auto-navigate to next hunk
    if (!state.navigation.isLastHunk) {
      setTimeout(() => {
        handleNavigate('next');
      }, 500);
    }
  }, [state.currentHunkIndex, state.fileDiff, state.navigation.isLastHunk]);

  const handleNavigate = useCallback((direction: 'previous' | 'next' | 'previousFile' | 'nextFile') => {
    switch (direction) {
      case 'previous':
        if (!state.navigation.isFirstHunk) {
          dispatch({ type: 'SET_CURRENT_HUNK', payload: state.currentHunkIndex - 1 });
        }
        break;
      case 'next':
        if (!state.navigation.isLastHunk) {
          dispatch({ type: 'SET_CURRENT_HUNK', payload: state.currentHunkIndex + 1 });
        }
        break;
      case 'previousFile':
        if (state.navigation.hasPreviousFile) {
          navigation.goBack();
        }
        break;
      case 'nextFile':
        if (state.navigation.hasNextFile) {
          // Navigate to next file in session
          Alert.alert('Next File', 'Moving to next file in review session');
        } else {
          // All files reviewed - complete session
          handleCompleteReview();
        }
        break;
    }
  }, [state.currentHunkIndex, state.navigation, navigation]);

  const handleCompleteReview = useCallback(() => {
    const { reviewedHunks, totalHunks } = state.reviewProgress;
    const completionRate = totalHunks > 0 ? (reviewedHunks / totalHunks) * 100 : 0;

    Alert.alert(
      'Review Complete',
      `Session completed!\n\nReviewed: ${reviewedHunks}/${totalHunks} hunks\nCompletion: ${completionRate.toFixed(1)}%\nScore: ${state.reviewProgress.currentScore}`,
      [
        { text: 'Continue Session', style: 'cancel' },
        {
          text: 'Finish',
          onPress: () => {
            navigation.navigate('LV5ChallengerMode' as never);
          }
        }
      ]
    );
  }, [state.reviewProgress, navigation]);

  const handleLineEdit = useCallback((lineIndex: number, newContent: string) => {
    const updatedLines = [...state.tempEditedLines];
    updatedLines[lineIndex] = { ...updatedLines[lineIndex], content: newContent };
    dispatch({ type: 'UPDATE_EDIT_LINES', payload: updatedLines });
  }, [state.tempEditedLines]);

  const handleSaveEdit = useCallback(() => {
    dispatch({ type: 'SAVE_EDIT_HUNK', payload: { comment: commentText } });
    setCommentText('');

    // Auto-navigate to next hunk
    if (!state.navigation.isLastHunk) {
      setTimeout(() => {
        handleNavigate('next');
      }, 500);
    }
  }, [commentText, state.navigation.isLastHunk, handleNavigate]);

  const handleCommentSubmit = useCallback(() => {
    if (pendingAction) {
      const decision: HunkReviewDecision = {
        hunkIndex: state.currentHunkIndex,
        action: pendingAction,
        comment: commentText,
        timestamp: new Date(),
        confidence: 4,
      };

      dispatch({ type: 'ADD_HUNK_DECISION', payload: decision });
    }

    setShowCommentModal(false);
    setCommentText('');
    setPendingAction(null);

    // Auto-navigate to next hunk
    if (!state.navigation.isLastHunk) {
      setTimeout(() => {
        handleNavigate('next');
      }, 500);
    }
  }, [pendingAction, commentText, state.currentHunkIndex, state.navigation.isLastHunk, handleNavigate]);

  // ============================================================================
  // Computed Values
  // ============================================================================

  const currentHunk = useMemo(() => {
    return state.fileDiff?.hunks[state.currentHunkIndex] || null;
  }, [state.fileDiff, state.currentHunkIndex]);

  const currentDecision = useMemo(() => {
    return state.hunkDecisions.get(state.currentHunkIndex);
  }, [state.hunkDecisions, state.currentHunkIndex]);

  const progressPercentage = useMemo(() => {
    const { reviewedHunks, totalHunks } = state.reviewProgress;
    return totalHunks > 0 ? (reviewedHunks / totalHunks) * 100 : 0;
  }, [state.reviewProgress]);

  // ============================================================================
  // Render Methods
  // ============================================================================

  const renderHeader = () => (
    <View style={diffHunkStyles.header}>
      <TouchableOpacity
        style={diffHunkStyles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={diffHunkStyles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={diffHunkStyles.headerCenter}>
        <Text style={diffHunkStyles.headerTitle}>{fileName}</Text>
        <Text style={diffHunkStyles.headerSubtitle}>
          LV5 Code Review • Hunk {state.currentHunkIndex + 1} of {state.navigation.totalHunks}
        </Text>
      </View>

      <View style={diffHunkStyles.headerRight}>
        <View style={diffHunkStyles.fileIndicator}>
          <Text style={diffHunkStyles.fileIndicatorText}>
            {fileIndex + 1}/{totalFiles || 1}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={diffHunkStyles.progressContainer}>
      <View style={diffHunkStyles.progressHeader}>
        <Text style={diffHunkStyles.progressTitle}>Review Progress</Text>
        <Text style={diffHunkStyles.progressStats}>
          {state.reviewProgress.reviewedHunks}/{state.reviewProgress.totalHunks} • {progressPercentage.toFixed(0)}%
        </Text>
      </View>
      <View style={diffHunkStyles.progressBar}>
        <View
          style={[
            diffHunkStyles.progressFill,
            { width: `${progressPercentage}%` }
          ]}
        />
      </View>
    </View>
  );

  const renderHunkHeader = () => {
    if (!currentHunk) return null;

    return (
      <View style={diffHunkStyles.hunkHeader}>
        <View style={diffHunkStyles.hunkInfo}>
          <Text style={diffHunkStyles.hunkTitle}>
            Hunk {currentHunk.index + 1}: {currentHunk.changeType}
          </Text>
          <Text style={diffHunkStyles.hunkRange}>
            {currentHunk.header}
          </Text>
        </View>
        <View style={diffHunkStyles.hunkStatus}>
          {currentDecision && (
            <View style={[
              diffHunkStyles.statusBadge,
              { backgroundColor: getStatusBadgeColor(currentDecision.action) }
            ]}>
              <Text style={diffHunkStyles.statusText}>
                {currentDecision.action.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSplitView = () => {
    if (!currentHunk) return null;

    const isEditingThisHunk = state.isEditingHunk && state.editingHunkIndex === state.currentHunkIndex;
    const displayLines = isEditingThisHunk ? state.tempEditedLines : currentHunk.modifiedLines;

    return (
      <View style={diffHunkStyles.splitView}>
        <SplitPane
          title="Original"
          lines={currentHunk.originalLines}
          isEditing={false}
          showLineNumbers={state.viewport.showLineNumbers}
        />
        <View style={diffHunkStyles.divider} />
        <SplitPane
          title="Modified"
          lines={displayLines}
          isEditing={isEditingThisHunk}
          onLineEdit={isEditingThisHunk ? handleLineEdit : undefined}
          showLineNumbers={state.viewport.showLineNumbers}
        />
      </View>
    );
  };

  const renderActionBar = () => (
    <View style={diffHunkStyles.actionBar}>
      <View style={diffHunkStyles.navigationSection}>
        <TouchableOpacity
          style={[
            diffHunkStyles.navigationButton,
            state.navigation.isFirstHunk && diffHunkStyles.navigationButtonDisabled
          ]}
          disabled={state.navigation.isFirstHunk}
          onPress={() => handleNavigate('previous')}
        >
          <Text style={diffHunkStyles.navigationButtonText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            diffHunkStyles.navigationButton,
            state.navigation.isLastHunk && diffHunkStyles.navigationButtonDisabled
          ]}
          disabled={state.navigation.isLastHunk}
          onPress={() => handleNavigate('next')}
        >
          <Text style={diffHunkStyles.navigationButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={diffHunkStyles.actionSection}>
        {state.isEditingHunk ? (
          <>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.saveButton]}
              onPress={handleSaveEdit}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.cancelButton]}
              onPress={() => dispatch({ type: 'CANCEL_EDIT_HUNK' })}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.acceptButton]}
              onPress={() => handleHunkAction('accept')}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Accept
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.rejectButton]}
              onPress={() => handleHunkAction('reject')}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.editButton]}
              onPress={() => handleHunkAction('edit')}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.commentButton]}
              onPress={() => handleHunkAction('comment')}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Comment
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={diffHunkStyles.navigationSection}>
        <TouchableOpacity
          style={diffHunkStyles.navigationButton}
          onPress={() => {
            if (state.navigation.isLastHunk) {
              handleNavigate('nextFile');
            } else {
              handleCompleteReview();
            }
          }}
        >
          <Text style={diffHunkStyles.navigationButtonText}>
            {state.navigation.hasNextFile ? '⇥' : '✓'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCommentModal = () => {
    if (!showCommentModal) return null;

    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 20,
          width: '100%',
          maxWidth: 400,
        }}>
          <Text style={diffHunkStyles.editCommentLabel}>
            Add Comment for {pendingAction?.toUpperCase()} Action
          </Text>
          <TextInput
            style={diffHunkStyles.editCommentInput}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Enter your review comment..."
            multiline
            textAlignVertical="top"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 15 }}>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.cancelButton]}
              onPress={() => {
                setShowCommentModal(false);
                setCommentText('');
                setPendingAction(null);
              }}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[diffHunkStyles.actionButton, diffHunkStyles.saveButton]}
              onPress={handleCommentSubmit}
            >
              <Text style={[diffHunkStyles.actionButtonText, diffHunkStyles.actionButtonTextLight]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // ============================================================================
  // Main Render
  // ============================================================================

  if (state.isLoading) {
    return (
      <SafeAreaView style={diffHunkStyles.safeArea}>
        <View style={diffHunkStyles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={diffHunkStyles.loadingText}>Loading file diff...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.error) {
    return (
      <SafeAreaView style={diffHunkStyles.safeArea}>
        <View style={diffHunkStyles.errorContainer}>
          <Text style={diffHunkStyles.errorText}>{state.error}</Text>
          <TouchableOpacity
            style={diffHunkStyles.retryButton}
            onPress={loadFileDiff}
          >
            <Text style={diffHunkStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={diffHunkStyles.safeArea}>
      <View style={diffHunkStyles.container}>
        {renderHeader()}
        {renderProgressBar()}

        <View style={diffHunkStyles.splitViewContainer}>
          {renderHunkHeader()}
          {renderSplitView()}
        </View>

        {renderActionBar()}
        {renderCommentModal()}
      </View>
    </SafeAreaView>
  );
};

export default DiffHunkScreen;