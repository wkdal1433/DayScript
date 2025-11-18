import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CodeReviewModuleProps,
  CodeReviewState,
  CodeReviewAction,
  ReviewComment,
  ReviewStatus,
  PullRequestData,
  HunkInfo,
  HunkDecision,
  PRReviewSession,
  FileReviewState,
  DiffData,
} from '../../Lv5ExpertModeScreen.types';
import { styles } from '../../Lv5ExpertModeScreen.styles';

// Import new components
import HunkDiffView from './HunkDiffView';
import ProgressIndicator from './ProgressIndicator';

/**
 * CodeReviewModule Component
 *
 * LV5 Expert Mode의 Code Review & PR Flow 모듈
 * Git 워크플로우 시뮬레이션과 코드 리뷰 프로세스를 제공합니다.
 *
 * 주요 기능:
 * - PR 생성 및 관리
 * - 코드 리뷰 및 댓글 시스템
 * - Git 워크플로우 시뮬레이션
 * - 머지 충돌 해결
 * - 리뷰 점수 및 평가
 */

// 초기 상태 - Hunk-level 리뷰 시스템을 위한 확장된 상태
const initialState: CodeReviewState = {
  currentPR: null,
  reviewComments: [],
  diffData: [],
  reviewProgress: {
    filesReviewed: 0,
    totalFiles: 0,
    commentsAdded: 0,
    issuesFound: 0,
  },
  gitStatus: {
    branch: 'feature/lv5-implementation',
    ahead: 3,
    behind: 0,
    hasConflicts: false,
    uncommittedChanges: false,
  },
  isLoading: false,
  error: null,
  // New Hunk-level review state
  reviewSession: null,
  currentFileIndex: 0,
  currentHunkIndex: 0,
};

// 리듀서 - Hunk-level 액션을 포함하여 확장
const codeReviewReducer = (state: CodeReviewState, action: CodeReviewAction): CodeReviewState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_CURRENT_PR':
      return { ...state, currentPR: action.payload };

    case 'ADD_REVIEW_COMMENT':
      return {
        ...state,
        reviewComments: [...state.reviewComments, action.payload],
        reviewProgress: {
          ...state.reviewProgress,
          commentsAdded: state.reviewProgress.commentsAdded + 1,
        }
      };

    case 'UPDATE_REVIEW_PROGRESS':
      return {
        ...state,
        reviewProgress: { ...state.reviewProgress, ...action.payload }
      };

    case 'UPDATE_GIT_STATUS':
      return {
        ...state,
        gitStatus: { ...state.gitStatus, ...action.payload }
      };

    case 'SET_DIFF_DATA':
      return { ...state, diffData: action.payload };

    // New Hunk-level review actions
    case 'INITIALIZE_REVIEW_SESSION':
      return {
        ...state,
        reviewSession: action.payload,
        currentFileIndex: 0,
        currentHunkIndex: 0,
      };

    case 'UPDATE_REVIEW_SESSION':
      return {
        ...state,
        reviewSession: state.reviewSession ? {
          ...state.reviewSession,
          ...action.payload,
        } : null,
      };

    case 'HUNK_DECISION':
      if (!state.reviewSession) return state;

      const { fileIndex, hunkIndex, decision } = action.payload;
      const updatedFiles = [...state.reviewSession.files];

      if (updatedFiles[fileIndex] && updatedFiles[fileIndex].hunks[hunkIndex]) {
        updatedFiles[fileIndex].hunks[hunkIndex] = {
          ...updatedFiles[fileIndex].hunks[hunkIndex],
          reviewStatus: decision.action === 'accept' ? 'accepted' :
                       decision.action === 'reject' ? 'rejected' : 'edited',
          userDecision: decision,
        };

        // Update file completion status
        const reviewedInFile = updatedFiles[fileIndex].hunks.filter(h => h.reviewStatus !== 'pending').length;
        updatedFiles[fileIndex] = {
          ...updatedFiles[fileIndex],
          reviewedHunks: reviewedInFile,
          isComplete: reviewedInFile === updatedFiles[fileIndex].totalHunks,
        };
      }

      // Calculate overall progress
      const totalReviewed = updatedFiles.reduce((sum, file) => sum + file.reviewedHunks, 0);
      const totalHunks = updatedFiles.reduce((sum, file) => sum + file.totalHunks, 0);
      const completionPercentage = totalHunks > 0 ? (totalReviewed / totalHunks) * 100 : 0;

      return {
        ...state,
        reviewSession: {
          ...state.reviewSession,
          files: updatedFiles,
          reviewedHunks: totalReviewed,
          sessionProgress: {
            ...state.reviewSession.sessionProgress,
            completionPercentage,
            currentPhase: completionPercentage === 100 ? 'final_review' : 'hunk_review',
          },
          isComplete: completionPercentage === 100,
        },
      };

    case 'NAVIGATE_TO_HUNK':
      return {
        ...state,
        currentFileIndex: action.payload.fileIndex,
        currentHunkIndex: action.payload.hunkIndex,
      };

    case 'COMPLETE_FILE_REVIEW':
      if (!state.reviewSession) return state;

      const completedFiles = [...state.reviewSession.files];
      if (completedFiles[action.payload.fileIndex]) {
        completedFiles[action.payload.fileIndex].isComplete = true;
      }

      return {
        ...state,
        reviewSession: {
          ...state.reviewSession,
          files: completedFiles,
        },
        reviewProgress: {
          ...state.reviewProgress,
          filesReviewed: state.reviewProgress.filesReviewed + 1,
        },
      };

    case 'COMPLETE_REVIEW_SESSION':
      return {
        ...state,
        reviewSession: state.reviewSession ? {
          ...state.reviewSession,
          isComplete: true,
          sessionProgress: {
            ...state.reviewSession.sessionProgress,
            currentPhase: 'completed',
            completionPercentage: 100,
          },
        } : null,
      };

    default:
      return state;
  }
};

const CodeReviewModule: React.FC<CodeReviewModuleProps> = ({
  sessionId,
  problemData,
  userProgress,
  onModuleComplete,
  onScoreUpdate,
  onError,
}) => {
  const [state, dispatch] = useReducer(codeReviewReducer, initialState);
  const scrollViewRef = useRef<ScrollView>(null);

  // Hunk 데이터 생성 유틸리티 함수
  const generateMockHunks = (fileName: string, fileIndex: number): HunkInfo[] => {
    const baseHunks: Omit<HunkInfo, 'id' | 'fileId' | 'fileName' | 'hunkIndex'>[] = [
      {
        startLineOld: 1,
        startLineNew: 1,
        linesOld: 0,
        linesNew: 2,
        originalCode: [],
        modifiedCode: [
          "import React, { useState, useEffect } from 'react';",
          "import { View, Text, StyleSheet } from 'react-native';"
        ],
        changeType: 'addition',
        reviewStatus: 'pending',
        context: {
          beforeLines: [],
          afterLines: ["", "export interface Props {"]
        }
      },
      {
        startLineOld: 15,
        startLineNew: 17,
        linesOld: 1,
        linesNew: 1,
        originalCode: ["const ExpertModeScreen = () => {"],
        modifiedCode: ["const ExpertModeScreen: React.FC = () => {"],
        changeType: 'modification',
        reviewStatus: 'pending',
        context: {
          beforeLines: ["", "// Component definition"],
          afterLines: ["  // Component logic", "  return ("]
        }
      },
      {
        startLineOld: 25,
        startLineNew: 27,
        linesOld: 0,
        linesNew: 1,
        originalCode: [],
        modifiedCode: ["  const [activeModule, setActiveModule] = useState<'vibe' | 'review'>('vibe');"],
        changeType: 'addition',
        reviewStatus: 'pending',
        context: {
          beforeLines: ["  const [isLoading, setIsLoading] = useState(false);"],
          afterLines: ["", "  useEffect(() => {"]
        }
      }
    ];

    return baseHunks.map((hunk, index) => ({
      ...hunk,
      id: `hunk_${fileIndex}_${index}`,
      fileId: `file_${fileIndex}`,
      fileName,
      hunkIndex: index,
    }));
  };

  // 모듈 초기화 - Hunk-level 리뷰 시스템으로 완전 재구성
  const initializeModule = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // 시뮬레이션된 PR 데이터 생성
      const mockPR: PullRequestData = {
        id: `pr_${Date.now()}`,
        title: 'LV5 Expert Mode Implementation - Hunk Review System',
        description: 'Implementing advanced Hunk-level code review with AI integration and sequential progression.',
        author: 'student_user',
        reviewers: ['senior_dev', 'tech_lead', 'ai_reviewer'],
        status: 'open' as ReviewStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        filesChanged: [
          'src/screens/Practice/Expert/Lv5ExpertModeScreen.tsx',
          'src/screens/Practice/Expert/components/CodeReview/CodeReviewModule.tsx',
          'src/screens/Practice/Expert/components/CodeReview/HunkDiffView.tsx',
        ],
        additions: 1247,
        deletions: 156,
        commits: [
          {
            hash: 'abc123',
            shortHash: 'abc123',
            message: 'feat: Add Hunk-level review foundation',
            author: {
              name: 'student_user',
              email: 'student@example.com',
            },
            date: new Date(Date.now() - 3600000),
            filesChanged: 3,
            additions: 456,
            deletions: 78,
            status: 'unreviewed',
          },
          {
            hash: 'def456',
            shortHash: 'def456',
            message: 'feat: Implement unified diff view component',
            author: {
              name: 'student_user',
              email: 'student@example.com',
            },
            date: new Date(Date.now() - 1800000),
            filesChanged: 2,
            additions: 623,
            deletions: 45,
            status: 'reviewing',
          },
          {
            hash: 'ghi789',
            shortHash: 'ghi789',
            message: 'feat: Add progressive review system',
            author: {
              name: 'student_user',
              email: 'student@example.com',
            },
            date: new Date(),
            filesChanged: 4,
            additions: 168,
            deletions: 33,
            status: 'unreviewed',
          },
        ],
      };

      // Hunk 구조를 포함한 확장된 diff 데이터 생성
      const mockDiffData: DiffData[] = mockPR.filesChanged.map((fileName, fileIndex) => ({
        fileName,
        changes: [
          { lineNumber: 1, type: 'add' as const, content: '+import React, { useState, useEffect } from \'react\';' },
          { lineNumber: 2, type: 'add' as const, content: '+import { View, Text, StyleSheet } from \'react-native\';' },
          { lineNumber: 15, type: 'modify' as const, content: '~const ExpertModeScreen: React.FC = () => {' },
          { lineNumber: 25, type: 'add' as const, content: '+  const [activeModule, setActiveModule] = useState<\'vibe\' | \'review\'>(\'vibe\');' },
        ],
        hunks: generateMockHunks(fileName, fileIndex),
      }));

      // 파일별 리뷰 상태 생성
      const fileReviewStates: FileReviewState[] = mockDiffData.map((diffData, index) => ({
        fileId: `file_${index}`,
        fileName: diffData.fileName,
        hunks: diffData.hunks,
        currentHunkIndex: 0,
        totalHunks: diffData.hunks.length,
        isComplete: false,
        reviewedHunks: 0,
      }));

      // PR 리뷰 세션 초기화
      const reviewSession: PRReviewSession = {
        id: `session_${Date.now()}`,
        prId: mockPR.id,
        files: fileReviewStates,
        currentFileIndex: 0,
        totalHunks: fileReviewStates.reduce((sum, file) => sum + file.totalHunks, 0),
        reviewedHunks: 0,
        sessionProgress: {
          currentPhase: 'hunk_review',
          completionPercentage: 0,
        },
        startedAt: new Date(),
        isComplete: false,
      };

      // 상태 업데이트
      dispatch({ type: 'SET_CURRENT_PR', payload: mockPR });
      dispatch({ type: 'SET_DIFF_DATA', payload: mockDiffData });
      dispatch({ type: 'INITIALIZE_REVIEW_SESSION', payload: reviewSession });
      dispatch({
        type: 'UPDATE_REVIEW_PROGRESS',
        payload: {
          totalFiles: mockPR.filesChanged.length,
          filesReviewed: 0,
        }
      });

      // 초기 AI 리뷰어 댓글 추가 (Hunk-specific)
      setTimeout(() => {
        const aiComment: ReviewComment = {
          id: `comment_${Date.now()}`,
          author: 'ai_reviewer',
          content: 'Hunk-level 리뷰 시스템이 잘 구현되었습니다. 각 변경 블록을 독립적으로 검토할 수 있어 더 정밀한 코드 리뷰가 가능합니다.',
          fileName: fileReviewStates[0].fileName,
          lineNumber: 1,
          type: 'suggestion',
          timestamp: new Date(),
          resolved: false,
        };
        dispatch({ type: 'ADD_REVIEW_COMMENT', payload: aiComment });
      }, 2000);

      dispatch({ type: 'SET_LOADING', payload: false });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `Hunk-level 리뷰 시스템 초기화 실패: ${error}` });
      onError && onError && onError({
        code: 'HUNK_INIT_FAILED',
        message: `CodeReview 모듈 초기화 실패: ${error}`,
        type: 'service',
        retryable: true,
        context: { error },
      });
    }
  }, [sessionId, onError]);

  // Hunk 결정 처리 함수
  const handleHunkDecision = useCallback((fileIndex: number, hunkIndex: number, decision: HunkDecision) => {
    dispatch({
      type: 'HUNK_DECISION',
      payload: { fileIndex, hunkIndex, decision }
    });

    // 점수 업데이트
    const baseScore = decision.action === 'accept' ? 85 :
                     decision.action === 'reject' ? 75 : 90; // Edit gets highest score
    const qualityBonus = decision.comment ? 10 : 0;
    const finalScore = Math.min(baseScore + qualityBonus, 100);

    onScoreUpdate && onScoreUpdate({
      category: 'hunk_review',
      score: finalScore,
      details: `Hunk ${decision.action} with ${decision.comment ? 'detailed' : 'standard'} feedback`,
    });

    // 자동으로 다음 Hunk로 이동 (순차 진행 강제)
    moveToNextHunk(fileIndex, hunkIndex);
  }, [onScoreUpdate]);

  // 다음 Hunk로 이동 (순차 진행 강제)
  const moveToNextHunk = useCallback((currentFileIndex: number, currentHunkIndex: number) => {
    if (!state.reviewSession) return;

    const currentFile = state.reviewSession.files[currentFileIndex];
    if (!currentFile) return;

    // 현재 파일의 다음 Hunk가 있는지 확인
    if (currentHunkIndex + 1 < currentFile.totalHunks) {
      // 같은 파일의 다음 Hunk로 이동
      dispatch({
        type: 'NAVIGATE_TO_HUNK',
        payload: {
          fileIndex: currentFileIndex,
          hunkIndex: currentHunkIndex + 1
        }
      });
    } else {
      // 현재 파일 완료, 다음 파일로 이동
      dispatch({ type: 'COMPLETE_FILE_REVIEW', payload: { fileIndex: currentFileIndex } });

      if (currentFileIndex + 1 < state.reviewSession.files.length) {
        // 다음 파일의 첫 번째 Hunk로 이동
        dispatch({
          type: 'NAVIGATE_TO_HUNK',
          payload: {
            fileIndex: currentFileIndex + 1,
            hunkIndex: 0
          }
        });
      } else {
        // 모든 파일 완료
        handleCompleteReview();
      }
    }
  }, [state.reviewSession]);

  // 리뷰 완료 처리
  const handleCompleteReview = useCallback(() => {
    if (!state.reviewSession) return;

    // 모든 결정사항 수집
    const allDecisions: HunkDecision[] = [];
    state.reviewSession.files.forEach(file => {
      file.hunks.forEach(hunk => {
        if (hunk.userDecision) {
          allDecisions.push(hunk.userDecision);
        }
      });
    });

    dispatch({ type: 'COMPLETE_REVIEW_SESSION', payload: { finalDecisions: allDecisions } });

    // 최종 점수 계산
    const finalScore = calculateFinalReviewScore();

    // 모듈 완료 알림
    Alert.alert(
      '🎉 Hunk-level 리뷰 완료!',
      `모든 변경사항을 성공적으로 검토했습니다.\n최종 점수: ${finalScore}%`,
      [
        {
          text: '결과 확인',
          onPress: () => {
            onModuleComplete && onModuleComplete({
              moduleType: 'code_review',
              completed: true,
              score: finalScore,
              timeSpent: Date.now() - (state.reviewSession?.startedAt.getTime() || Date.now()),
              achievements: getHunkReviewAchievements(),
            });
          },
        },
      ],
      { cancelable: false }
    );
  }, [state.reviewSession, onModuleComplete]);

  // 최종 점수 계산 (Hunk-level 기반)
  const calculateFinalReviewScore = (): number => {
    if (!state.reviewSession) return 0;

    let totalScore = 0;
    let totalHunks = 0;

    state.reviewSession.files.forEach(file => {
      file.hunks.forEach(hunk => {
        if (hunk.userDecision) {
          totalHunks++;
          const hunkScore = hunk.userDecision.action === 'accept' ? 85 :
                           hunk.userDecision.action === 'reject' ? 75 : 90;
          const commentBonus = hunk.userDecision.comment ? 10 : 0;
          totalScore += Math.min(hunkScore + commentBonus, 100);
        }
      });
    });

    return totalHunks > 0 ? Math.round(totalScore / totalHunks) : 0;
  };

  // Hunk 리뷰 업적 계산
  const getHunkReviewAchievements = (): string[] => {
    if (!state.reviewSession) return [];

    const achievements: string[] = [];
    let acceptedHunks = 0;
    let editedHunks = 0;
    let commentedHunks = 0;

    state.reviewSession.files.forEach(file => {
      file.hunks.forEach(hunk => {
        if (hunk.userDecision) {
          if (hunk.userDecision.action === 'accept') acceptedHunks++;
          if (hunk.userDecision.action === 'edit') editedHunks++;
          if (hunk.userDecision.comment) commentedHunks++;
        }
      });
    });

    if (acceptedHunks >= 5) achievements.push('efficient_reviewer');
    if (editedHunks >= 2) achievements.push('code_improver');
    if (commentedHunks >= 3) achievements.push('detailed_feedback');
    if (state.reviewSession.isComplete) achievements.push('complete_hunk_review');

    return achievements;
  };


  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    initializeModule();
  }, [initializeModule]);

  // 로딩 상태
  if (state.isLoading) {
    return (
      <View style={[styles.moduleContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#666' }}>🔄 코드 리뷰 환경을 준비하고 있습니다...</Text>
      </View>
    );
  }

  // 에러 상태
  if (state.error) {
    return (
      <View style={[styles.moduleContainer, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 16, color: '#EF4444', marginBottom: 16 }}>❌ {state.error}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#3B82F6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 }}
          onPress={initializeModule}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 현재 검토 중인 Hunk 가져오기
  const getCurrentHunk = (): HunkInfo | null => {
    if (!state.reviewSession) return null;

    const currentFile = state.reviewSession.files[state.currentFileIndex];
    if (!currentFile) return null;

    return currentFile.hunks[state.currentHunkIndex] || null;
  };

  // 검토 완료 여부 확인
  const isReviewComplete = (): boolean => {
    return state.reviewSession?.isComplete || false;
  };

  // 다음 Hunk로 이동 가능 여부 확인
  const canProceedToNext = (): boolean => {
    const currentHunk = getCurrentHunk();
    return currentHunk?.reviewStatus !== 'pending';
  };

  return (
    <KeyboardAvoidingView
      style={styles.moduleContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* PR 헤더 정보 - Hunk-level 정보 포함 */}
      {state.currentPR && (
        <View style={styles.prHeader}>
          <View style={styles.prTitleSection}>
            <Text style={styles.prTitle}>{state.currentPR.title}</Text>
            <Text style={styles.prStatus}>
              📋 {state.currentPR.status.toUpperCase()} • #{state.currentPR.id.slice(-6)}
            </Text>
          </View>

          <View style={styles.prMetrics}>
            <Text style={styles.prMetricText}>
              📁 {state.currentPR.filesChanged.length}개 파일 변경
            </Text>
            <Text style={styles.prMetricText}>
              +{state.currentPR.additions} -{state.currentPR.deletions}
            </Text>
          </View>
        </View>
      )}

      {/* Hunk-level 진행 상황 표시기 */}
      {state.reviewSession && (
        <ProgressIndicator
          currentFileIndex={state.currentFileIndex}
          totalFiles={state.reviewSession.files.length}
          currentHunkIndex={state.currentHunkIndex}
          totalHunks={state.reviewSession.totalHunks}
          reviewedHunks={state.reviewSession.reviewedHunks}
          completionPercentage={state.reviewSession.sessionProgress.completionPercentage}
        />
      )}

      {/* 메인 콘텐츠 영역 - Hunk-level 리뷰 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.reviewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 현재 Hunk 표시 */}
        {(() => {
          const currentHunk = getCurrentHunk();
          if (!currentHunk) {
            return (
              <View style={styles.noHunkContainer}>
                <Text style={styles.noHunkText}>
                  {isReviewComplete()
                    ? '🎉 모든 Hunk 검토가 완료되었습니다!'
                    : '검토할 Hunk가 없습니다.'}
                </Text>
              </View>
            );
          }

          return (
            <HunkDiffView
              hunk={currentHunk}
              isActive={true}
              onHunkDecision={(decision) =>
                handleHunkDecision(state.currentFileIndex, state.currentHunkIndex, decision)
              }
              showLineNumbers={true}
              enableInlineEdit={true}
            />
          );
        })()}

        {/* 리뷰 댓글 목록 - 현재 파일에 관련된 것만 표시 */}
        {state.reviewComments.length > 0 && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>💬 리뷰 댓글</Text>
            {state.reviewComments
              .filter(comment => {
                const currentFile = state.reviewSession?.files[state.currentFileIndex];
                return currentFile ? comment.fileName === currentFile.fileName : false;
              })
              .map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                      {comment.author === 'ai_reviewer' ? '🤖 AI 리뷰어' : '👤 ' + comment.author}
                    </Text>
                    <Text style={styles.commentTime}>
                      {comment.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={styles.commentContent}>{comment.content}</Text>
                  <Text style={styles.commentLocation}>
                    📍 {comment.fileName}:{comment.lineNumber}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* 검토 완료된 Hunk 요약 (선택적) */}
        {state.reviewSession && state.reviewSession.reviewedHunks > 0 && (
          <View style={styles.reviewSummary}>
            <Text style={styles.summaryTitle}>✅ 검토 완료된 Hunk</Text>
            {state.reviewSession.files.map((file, fileIndex) =>
              file.hunks
                .filter(hunk => hunk.reviewStatus !== 'pending')
                .map((hunk, hunkIndex) => (
                  <View key={`${fileIndex}-${hunkIndex}`} style={styles.summaryItem}>
                    <Text style={styles.summaryHunk}>
                      {file.fileName} - Hunk {hunk.hunkIndex + 1}
                    </Text>
                    <Text style={[
                      styles.summaryStatus,
                      hunk.reviewStatus === 'accepted' && styles.acceptedStatus,
                      hunk.reviewStatus === 'rejected' && styles.rejectedStatus,
                      hunk.reviewStatus === 'edited' && styles.editedStatus,
                    ]}>
                      {hunk.reviewStatus === 'accepted' ? '✅ 승인' :
                       hunk.reviewStatus === 'rejected' ? '❌ 거부' : '✏️ 편집'}
                    </Text>
                  </View>
                ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Hunk-level 네비게이션 및 액션 영역 */}
      {!isReviewComplete() && (
        <View style={styles.hunkNavigation}>
          <View style={styles.navigationInfo}>
            <Text style={styles.navigationText}>
              {state.reviewSession && (
                `File ${state.currentFileIndex + 1}/${state.reviewSession.files.length} • ` +
                `Hunk ${state.currentHunkIndex + 1}/${getCurrentHunk() ? state.reviewSession.files[state.currentFileIndex].totalHunks : 0}`
              )}
            </Text>
          </View>

          <View style={styles.navigationActions}>
            {/* 이전 Hunk로 이동 (검토 완료된 것들만) */}
            <TouchableOpacity
              style={[
                styles.navigationButton,
                styles.secondaryButton,
                (state.currentFileIndex === 0 && state.currentHunkIndex === 0) && styles.disabledButton
              ]}
              onPress={() => {
                // 이전 Hunk로 이동 로직 (참고용으로만 표시)
                if (state.currentHunkIndex > 0) {
                  dispatch({
                    type: 'NAVIGATE_TO_HUNK',
                    payload: {
                      fileIndex: state.currentFileIndex,
                      hunkIndex: state.currentHunkIndex - 1
                    }
                  });
                } else if (state.currentFileIndex > 0) {
                  const prevFile = state.reviewSession?.files[state.currentFileIndex - 1];
                  if (prevFile) {
                    dispatch({
                      type: 'NAVIGATE_TO_HUNK',
                      payload: {
                        fileIndex: state.currentFileIndex - 1,
                        hunkIndex: prevFile.totalHunks - 1
                      }
                    });
                  }
                }
              }}
              disabled={state.currentFileIndex === 0 && state.currentHunkIndex === 0}
            >
              <Text style={styles.navigationButtonText}>⬅️ 이전</Text>
            </TouchableOpacity>

            {/* 현재 Hunk 건너뛰기 (긴급 시에만) */}
            <TouchableOpacity
              style={[styles.navigationButton, styles.warningButton]}
              onPress={() => {
                Alert.alert(
                  '⚠️ Hunk 건너뛰기',
                  '현재 Hunk를 건너뛰고 다음으로 이동하시겠습니까?\n(권장하지 않습니다)',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '건너뛰기',
                      style: 'destructive',
                      onPress: () => {
                        // 자동으로 Accept 처리하고 다음으로 이동
                        const decision: HunkDecision = {
                          action: 'accept',
                          comment: '자동 승인 (건너뛰기)',
                          timestamp: new Date(),
                        };
                        handleHunkDecision(state.currentFileIndex, state.currentHunkIndex, decision);
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.navigationButtonText}>⏭️ 건너뛰기</Text>
            </TouchableOpacity>

            {/* 다음 Hunk로 이동 (현재 Hunk 검토 완료 시에만 활성화) */}
            <TouchableOpacity
              style={[
                styles.navigationButton,
                styles.primaryButton,
                !canProceedToNext() && styles.disabledButton
              ]}
              onPress={() => moveToNextHunk(state.currentFileIndex, state.currentHunkIndex)}
              disabled={!canProceedToNext()}
            >
              <Text style={styles.navigationButtonText}>
                {canProceedToNext() ? '다음 ➡️' : '검토 필요'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 최종 리뷰 완료 액션 */}
      {isReviewComplete() && (
        <View style={styles.finalActions}>
          <View style={styles.completionMessage}>
            <Text style={styles.completionTitle}>🎉 모든 Hunk 검토 완료!</Text>
            <Text style={styles.completionSubtitle}>
              최종 결정을 내려주세요
            </Text>
          </View>

          <View style={styles.finalButtonContainer}>
            <TouchableOpacity
              style={[styles.finalActionButton, styles.approveButton]}
              onPress={() => {
                Alert.alert(
                  '✅ PR 승인',
                  '모든 변경사항을 승인하시겠습니까?',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '승인',
                      onPress: () => handleCompleteReview(),
                    },
                  ]
                );
              }}
            >
              <Text style={styles.finalActionButtonText}>✅ PR 승인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.finalActionButton, styles.changesButton]}
              onPress={() => {
                Alert.alert(
                  '🔄 수정 요청',
                  '추가 수정이 필요하다고 판단하시겠습니까?',
                  [
                    { text: '취소', style: 'cancel' },
                    {
                      text: '수정 요청',
                      onPress: () => handleCompleteReview(),
                    },
                  ]
                );
              }}
            >
              <Text style={styles.finalActionButtonText}>🔄 수정 요청</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default CodeReviewModule;