import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  CodeReviewModuleProps,
  CodeReviewState,
  CodeReviewAction,
  ReviewComment,
  ReviewStatus,
  PullRequestData
} from '../../Lv5ExpertModeScreen.types';
import { styles } from '../../Lv5ExpertModeScreen.styles';

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

// 초기 상태
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
};

// 리듀서
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
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // 모듈 초기화
  const initializeModule = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // 시뮬레이션된 PR 데이터 생성
      const mockPR: PullRequestData = {
        id: `pr_${Date.now()}`,
        title: 'LV5 Expert Mode Implementation',
        description: 'Implementing advanced coding challenges with AI integration and code review workflows.',
        author: 'student_user',
        reviewers: ['senior_dev', 'tech_lead', 'ai_reviewer'],
        status: 'open' as ReviewStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        filesChanged: [
          'src/screens/Practice/Expert/Lv5ExpertModeScreen.tsx',
          'src/screens/Practice/Expert/components/VibeCoding/VibeCodingModule.tsx',
          'src/screens/Practice/Expert/components/CodeReview/CodeReviewModule.tsx',
        ],
        additions: 847,
        deletions: 23,
        commits: [
          {
            hash: 'abc123',
            shortHash: 'abc123',
            message: 'feat: Add LV5 Expert Mode foundation',
            author: {
              name: 'student_user',
              email: 'student@example.com',
            },
            date: new Date(Date.now() - 3600000), // 1 hour ago
            filesChanged: 3,
            additions: 247,
            deletions: 12,
            status: 'unreviewed',
          },
          {
            hash: 'def456',
            shortHash: 'def456',
            message: 'feat: Implement Vibe Coding module',
            author: {
              name: 'student_user',
              email: 'student@example.com',
            },
            date: new Date(Date.now() - 1800000), // 30 minutes ago
            filesChanged: 2,
            additions: 412,
            deletions: 8,
            status: 'reviewing',
          },
          {
            hash: 'ghi789',
            shortHash: 'ghi789',
            message: 'feat: Add Code Review module structure',
            author: {
              name: 'student_user',
              email: 'student@example.com',
            },
            date: new Date(),
            filesChanged: 4,
            additions: 188,
            deletions: 3,
            status: 'unreviewed',
          },
        ],
      };

      // 시뮬레이션된 diff 데이터
      const mockDiffData = [
        {
          fileName: 'src/screens/Practice/Expert/Lv5ExpertModeScreen.tsx',
          changes: [
            { lineNumber: 1, type: 'add', content: '+import React, { useState, useEffect } from \'react\';' },
            { lineNumber: 2, type: 'add', content: '+import { View, Text, StyleSheet } from \'react-native\';' },
            { lineNumber: 15, type: 'modify', content: '~const ExpertModeScreen: React.FC = () => {' },
            { lineNumber: 25, type: 'add', content: '+  const [activeModule, setActiveModule] = useState<\'vibe\' | \'review\'>(\'vibe\');' },
          ],
        },
      ];

      dispatch({ type: 'SET_CURRENT_PR', payload: mockPR });
      dispatch({ type: 'SET_DIFF_DATA', payload: mockDiffData });
      dispatch({
        type: 'UPDATE_REVIEW_PROGRESS',
        payload: {
          totalFiles: mockPR.filesChanged.length,
          filesReviewed: 0,
        }
      });

      // 초기 AI 리뷰어 댓글 추가
      setTimeout(() => {
        const aiComment: ReviewComment = {
          id: `comment_${Date.now()}`,
          author: 'ai_reviewer',
          content: '코드 구조가 잘 정리되어 있습니다. SOLID 원칙을 잘 따르고 있네요. 다만 타입 정의 부분에서 몇 가지 개선 사항이 있어 보입니다.',
          fileName: 'src/screens/Practice/Expert/Lv5ExpertModeScreen.tsx',
          lineNumber: 25,
          type: 'suggestion',
          timestamp: new Date(),
          resolved: false,
        };
        dispatch({ type: 'ADD_REVIEW_COMMENT', payload: aiComment });
      }, 2000);

      dispatch({ type: 'SET_LOADING', payload: false });

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: `모듈 초기화 실패: ${error}` });
      onError && onError(`CodeReview 모듈 초기화 실패: ${error}`);
    }
  }, [sessionId, onError]);

  // 리뷰 댓글 추가
  const addReviewComment = useCallback(() => {
    if (!newCommentText.trim() || selectedLine === null) {
      Alert.alert('알림', '댓글 내용과 라인을 선택해주세요.');
      return;
    }

    const comment: ReviewComment = {
      id: `comment_${Date.now()}`,
      author: 'student_user',
      content: newCommentText.trim(),
      fileName: state.diffData[0]?.fileName || '',
      lineNumber: selectedLine,
      type: 'comment',
      timestamp: new Date(),
      resolved: false,
    };

    dispatch({ type: 'ADD_REVIEW_COMMENT', payload: comment });
    setNewCommentText('');
    setSelectedLine(null);

    // 점수 업데이트
    const commentQuality = newCommentText.length > 50 ? 85 : 75;
    onScoreUpdate && onScoreUpdate({
      category: 'code_review',
      score: commentQuality,
      details: '리뷰 댓글 품질 평가',
    });

  }, [newCommentText, selectedLine, state.diffData, onScoreUpdate]);

  // PR 승인/거부
  const handlePRAction = useCallback((action: 'approve' | 'reject' | 'request_changes') => {
    if (!state.currentPR) return;

    Alert.alert(
      'PR 액션 확인',
      `이 PR을 ${action === 'approve' ? '승인' : action === 'reject' ? '거부' : '수정 요청'}하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            const updatedPR = {
              ...state.currentPR,
              status: action === 'approve' ? 'approved' as ReviewStatus :
                      action === 'reject' ? 'rejected' as ReviewStatus :
                      'changes_requested' as ReviewStatus,
              updatedAt: new Date(),
            };

            dispatch({ type: 'SET_CURRENT_PR', payload: updatedPR });

            // 최종 점수 계산
            const finalScore = calculateFinalScore();
            onModuleComplete && onModuleComplete({
              moduleType: 'code_review',
              completed: true,
              score: finalScore,
              timeSpent: Date.now() - (state.currentPR?.createdAt.getTime() || Date.now()),
              achievements: getAchievements(),
            });
          },
        },
      ]
    );
  }, [state.currentPR, onModuleComplete]);

  // 최종 점수 계산
  const calculateFinalScore = (): number => {
    const commentsScore = Math.min(state.reviewProgress.commentsAdded * 10, 40);
    const filesScore = (state.reviewProgress.filesReviewed / state.reviewProgress.totalFiles) * 30;
    const qualityScore = 30; // 댓글 품질 기반

    return Math.round(commentsScore + filesScore + qualityScore);
  };

  // 업적 계산
  const getAchievements = (): string[] => {
    const achievements: string[] = [];

    if (state.reviewProgress.commentsAdded >= 5) {
      achievements.push('thorough_reviewer');
    }
    if (state.reviewProgress.filesReviewed === state.reviewProgress.totalFiles) {
      achievements.push('complete_review');
    }
    if (state.reviewComments.some(c => c.type === 'suggestion')) {
      achievements.push('constructive_feedback');
    }

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

  return (
    <KeyboardAvoidingView
      style={styles.moduleContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* PR 헤더 정보 */}
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

      {/* 리뷰 진행 상황 */}
      <View style={styles.reviewProgress}>
        <Text style={styles.progressTitle}>📊 리뷰 진행 상황</Text>
        <View style={styles.progressStats}>
          <Text style={styles.progressStat}>
            파일: {state.reviewProgress.filesReviewed}/{state.reviewProgress.totalFiles}
          </Text>
          <Text style={styles.progressStat}>
            댓글: {state.reviewProgress.commentsAdded}개
          </Text>
          <Text style={styles.progressStat}>
            이슈: {state.reviewProgress.issuesFound}개
          </Text>
        </View>
      </View>

      {/* 메인 컨텐츠 영역 */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.reviewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 파일 diff 표시 */}
        {state.diffData.map((file, fileIndex) => (
          <View key={fileIndex} style={styles.diffContainer}>
            <Text style={styles.fileName}>📄 {file.fileName}</Text>

            {file.changes.map((change, changeIndex) => (
              <TouchableOpacity
                key={changeIndex}
                style={[
                  styles.diffLine,
                  change.type === 'add' && styles.addedLine,
                  change.type === 'delete' && styles.deletedLine,
                  change.type === 'modify' && styles.modifiedLine,
                  selectedLine === change.lineNumber && styles.selectedLine,
                ]}
                onPress={() => setSelectedLine(change.lineNumber)}
              >
                <Text style={styles.lineNumber}>{change.lineNumber}</Text>
                <Text style={styles.diffContent}>{change.content}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 리뷰 댓글 목록 */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>💬 리뷰 댓글</Text>
          {state.reviewComments.map((comment) => (
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
      </ScrollView>

      {/* 댓글 입력 영역 */}
      <View style={styles.commentInput}>
        <Text style={styles.inputLabel}>
          💬 리뷰 댓글 추가 {selectedLine && `(라인 ${selectedLine})`}
        </Text>
        <TextInput
          style={styles.commentTextInput}
          value={newCommentText}
          onChangeText={setNewCommentText}
          placeholder="코드에 대한 리뷰 댓글을 입력하세요..."
          multiline
          numberOfLines={3}
        />
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={addReviewComment}
            disabled={!newCommentText.trim() || selectedLine === null}
          >
            <Text style={styles.addCommentButtonText}>댓글 추가</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PR 액션 버튼들 */}
      <View style={styles.prActions}>
        <TouchableOpacity
          style={[styles.prActionButton, styles.approveButton]}
          onPress={() => handlePRAction('approve')}
        >
          <Text style={styles.prActionButtonText}>✅ 승인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.prActionButton, styles.changesButton]}
          onPress={() => handlePRAction('request_changes')}
        >
          <Text style={styles.prActionButtonText}>🔄 수정 요청</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.prActionButton, styles.rejectButton]}
          onPress={() => handlePRAction('reject')}
        >
          <Text style={styles.prActionButtonText}>❌ 거부</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CodeReviewModule;