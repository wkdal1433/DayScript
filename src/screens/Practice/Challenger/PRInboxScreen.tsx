/**
 * PRInboxScreen Component
 *
 * LV5 Code Review & PR 모듈의 메인 화면
 * 가상의 깃 커밋 스택을 표시하고 검토할 수 있는 전문적인 인터페이스
 *
 * SOLID 원칙 적용:
 * - Single Responsibility: PR 시나리오와 커밋 리스트 관리만 담당
 * - Open/Closed: 새로운 커밋 타입이나 검토 액션 추가 시 확장 가능
 * - Liskov Substitution: 타입 시스템으로 예측 가능한 동작 보장
 * - Interface Segregation: 각 컴포넌트별 독립적 props 인터페이스
 * - Dependency Inversion: 추상화된 인터페이스 사용
 */

import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  BackHandler,
  AccessibilityInfo,
} from 'react-native';

// Type imports
import {
  PRInboxScreenProps,
  PRInboxState,
  PRInboxAction,
  CommitInfo,
  CommitStatus,
  PRScenario,
  SessionProgress,
  MockDataConfig,
} from './PRInboxScreen.types';

// Style imports
import { styles } from './PRInboxScreen.styles';

// Component imports
import CommitCard from './components/CommitCard';
import ScenarioSection from './components/ScenarioSection';

/**
 * State Reducer for PRInbox
 */
const prInboxReducer = (state: PRInboxState, action: PRInboxAction): PRInboxState => {
  switch (action.type) {
    case 'SET_SCENARIO':
      return { ...state, scenario: action.payload };

    case 'SET_COMMITS':
      return { ...state, commits: action.payload };

    case 'UPDATE_COMMIT_STATUS':
      return {
        ...state,
        commits: state.commits.map(commit =>
          commit.hash === action.payload.hash
            ? { ...commit, status: action.payload.status, reviewNotes: action.payload.reason }
            : commit
        ),
      };

    case 'SELECT_COMMIT':
      return { ...state, selectedCommit: action.payload };

    case 'ADD_REVIEW_ACTION':
      return {
        ...state,
        reviewActions: [...state.reviewActions, action.payload],
      };

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        sessionProgress: { ...state.sessionProgress, ...action.payload },
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
};

/**
 * Initial state for PRInbox
 */
const initialState: PRInboxState = {
  scenario: null,
  commits: [],
  reviewActions: [],
  selectedCommit: null,
  isLoading: true,
  error: null,
  sessionProgress: {
    totalCommits: 0,
    reviewedCommits: 0,
    acceptedCommits: 0,
    rejectedCommits: 0,
    flaggedCommits: 0,
    startTime: new Date(),
    timeRemaining: 1800, // 30 minutes default
    currentScore: 0,
  },
};

/**
 * Mock Data Generator
 */
const generateMockData = (): { scenario: PRScenario; commits: CommitInfo[] } => {
  const scenario: PRScenario = {
    id: 'scenario_001',
    title: '사용자 인증 시스템 개선 PR',
    description: '새로운 OAuth 2.0 인증 플로우를 구현하고 기존 세션 관리를 개선하는 Pull Request입니다. 보안성과 사용자 경험을 동시에 향상시키는 것이 목표입니다.',
    context: '현재 시스템은 JWT 기반의 간단한 인증을 사용하고 있으나, 보안 취약점과 토큰 관리 문제가 지속적으로 발생하고 있습니다. 이번 업데이트를 통해 더 안전하고 확장 가능한 인증 시스템으로 전환합니다.',
    requirements: [
      '모든 새로운 인증 관련 코드는 보안 가이드라인을 준수해야 합니다',
      '기존 사용자 세션이 중단되지 않도록 하는 마이그레이션 전략이 필요합니다',
      '새로운 API 엔드포인트는 적절한 테스트 커버리지를 가져야 합니다',
      '민감한 정보(토큰, 패스워드 등)가 로그에 기록되지 않도록 확인해야 합니다',
      '성능 저하 없이 새로운 인증 플로우가 동작해야 합니다',
    ],
    difficulty: 'hard',
    estimatedTime: 25,
    tags: ['security', 'authentication', 'backend', 'oauth'],
    createdAt: new Date(),
  };

  const commits: CommitInfo[] = [
    {
      hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
      shortHash: 'a1b2c3d',
      message: 'feat: implement OAuth 2.0 authorization code flow',
      author: {
        name: 'Alice Johnson',
        email: 'alice.johnson@company.com',
      },
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      filesChanged: [
        {
          path: 'src/auth/oauth.js',
          status: 'added',
          additions: 156,
          deletions: 0,
        },
        {
          path: 'src/auth/config.js',
          status: 'modified',
          additions: 23,
          deletions: 8,
        },
      ],
      stats: {
        additions: 179,
        deletions: 8,
        filesCount: 2,
      },
      diffPreview: {
        summary: 'OAuth 2.0 인증 플로우의 핵심 구현을 추가했습니다. 새로운 엔드포인트와 토큰 관리 로직이 포함되어 있습니다.',
        keyChanges: [
          'OAuth 클라이언트 설정 및 인증 URL 생성',
          '인증 코드 교환을 위한 토큰 엔드포인트',
          '액세스 토큰 검증 및 갱신 로직',
        ],
        codeSnippet: `+export const generateAuthUrl = (clientId, redirectUri, state) => {\n+  const params = new URLSearchParams({\n+    response_type: 'code',\n+    client_id: clientId,\n+    redirect_uri: redirectUri,\n+    state: state,\n+    scope: 'openid profile email'\n+  });\n+  return \`\${AUTH_BASE_URL}/authorize?\${params}\`;\n+};`,
        riskLevel: 'medium',
        reviewPriority: 4,
      },
      status: 'pending',
    },
    {
      hash: 'b2c3d4e5f6789012345678901234567890abcdef',
      shortHash: 'b2c3d4e',
      message: 'refactor: update user session management',
      author: {
        name: 'Bob Smith',
        email: 'bob.smith@company.com',
      },
      timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
      filesChanged: [
        {
          path: 'src/auth/session.js',
          status: 'modified',
          additions: 45,
          deletions: 32,
        },
        {
          path: 'src/middleware/auth.js',
          status: 'modified',
          additions: 18,
          deletions: 12,
        },
      ],
      stats: {
        additions: 63,
        deletions: 44,
        filesCount: 2,
      },
      diffPreview: {
        summary: '기존 세션 관리 로직을 새로운 OAuth 플로우와 호환되도록 수정했습니다. 세션 저장소와 만료 정책을 개선했습니다.',
        keyChanges: [
          '세션 데이터 구조 변경 (OAuth 토큰 포함)',
          '세션 만료 시간 동적 계산',
          '리프레시 토큰 자동 갱신 로직',
        ],
        codeSnippet: `const updateSession = (userId, oauthTokens) => {\n-  return sessionStore.set(userId, { timestamp: Date.now() });\n+  return sessionStore.set(userId, {\n+    timestamp: Date.now(),\n+    accessToken: oauthTokens.access_token,\n+    refreshToken: oauthTokens.refresh_token,\n+    expiresAt: Date.now() + (oauthTokens.expires_in * 1000)\n+  });\n};`,
        riskLevel: 'high',
        reviewPriority: 5,
      },
      status: 'pending',
    },
    {
      hash: 'c3d4e5f6789012345678901234567890abcdef12',
      shortHash: 'c3d4e5f',
      message: 'fix: prevent token leakage in error logs',
      author: {
        name: 'Charlie Davis',
        email: 'charlie.davis@company.com',
      },
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      filesChanged: [
        {
          path: 'src/utils/logger.js',
          status: 'modified',
          additions: 28,
          deletions: 5,
        },
        {
          path: 'src/auth/oauth.js',
          status: 'modified',
          additions: 12,
          deletions: 3,
        },
      ],
      stats: {
        additions: 40,
        deletions: 8,
        filesCount: 2,
      },
      diffPreview: {
        summary: '민감한 정보가 로그에 기록되는 것을 방지하는 보안 패치입니다. 토큰과 개인정보를 마스킹하는 로직을 추가했습니다.',
        keyChanges: [
          '로그 출력 시 토큰 자동 마스킹',
          '에러 스택에서 민감 정보 제거',
          '로그 레벨별 정보 필터링',
        ],
        codeSnippet: `+const sanitizeLogData = (data) => {\n+  const sensitiveKeys = ['token', 'password', 'secret', 'key'];\n+  const sanitized = { ...data };\n+  \n+  sensitiveKeys.forEach(key => {\n+    if (sanitized[key]) {\n+      sanitized[key] = '***REDACTED***';\n+    }\n+  });\n+  \n+  return sanitized;\n+};`,
        riskLevel: 'low',
        reviewPriority: 3,
      },
      status: 'pending',
    },
    {
      hash: 'd4e5f6789012345678901234567890abcdef1234',
      shortHash: 'd4e5f67',
      message: 'test: add comprehensive OAuth flow tests',
      author: {
        name: 'Diana Wilson',
        email: 'diana.wilson@company.com',
      },
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      filesChanged: [
        {
          path: 'tests/auth/oauth.test.js',
          status: 'added',
          additions: 245,
          deletions: 0,
        },
        {
          path: 'tests/auth/session.test.js',
          status: 'modified',
          additions: 67,
          deletions: 23,
        },
      ],
      stats: {
        additions: 312,
        deletions: 23,
        filesCount: 2,
      },
      diffPreview: {
        summary: 'OAuth 인증 플로우에 대한 포괄적인 테스트 스위트를 추가했습니다. 엣지 케이스와 에러 상황을 모두 다루고 있습니다.',
        keyChanges: [
          '정상적인 OAuth 플로우 테스트',
          '토큰 만료 및 갱신 시나리오',
          '잘못된 토큰 및 에러 핸들링',
          '세션 동시성 테스트',
        ],
        codeSnippet: `describe('OAuth 2.0 Flow', () => {\n  test('should generate valid authorization URL', () => {\n    const authUrl = generateAuthUrl(CLIENT_ID, REDIRECT_URI, STATE);\n    expect(authUrl).toContain('response_type=code');\n    expect(authUrl).toContain('client_id=' + CLIENT_ID);\n  });\n\n  test('should handle token exchange correctly', async () => {\n    const tokens = await exchangeCodeForTokens(VALID_CODE);\n    expect(tokens).toHaveProperty('access_token');\n    expect(tokens).toHaveProperty('refresh_token');\n  });\n});`,
        riskLevel: 'low',
        reviewPriority: 2,
      },
      status: 'pending',
    },
    {
      hash: 'e5f6789012345678901234567890abcdef123456',
      shortHash: 'e5f6789',
      message: 'docs: update authentication API documentation',
      author: {
        name: 'Eve Brown',
        email: 'eve.brown@company.com',
      },
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      filesChanged: [
        {
          path: 'docs/api/authentication.md',
          status: 'modified',
          additions: 89,
          deletions: 34,
        },
        {
          path: 'README.md',
          status: 'modified',
          additions: 15,
          deletions: 7,
        },
      ],
      stats: {
        additions: 104,
        deletions: 41,
        filesCount: 2,
      },
      diffPreview: {
        summary: '새로운 OAuth 2.0 인증 시스템에 대한 API 문서를 업데이트했습니다. 개발자들이 쉽게 이해할 수 있도록 예제와 설명을 추가했습니다.',
        keyChanges: [
          '새로운 OAuth 엔드포인트 문서화',
          '인증 플로우 다이어그램 추가',
          '에러 코드 및 응답 예제',
          '마이그레이션 가이드 작성',
        ],
        codeSnippet: `## OAuth 2.0 Authentication Flow\n\n### Step 1: Authorization Request\n\`\`\`\nGET /oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&state={STATE}\n\`\`\`\n\n### Step 2: Token Exchange\n\`\`\`\nPOST /oauth/token\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code&code={CODE}&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}\n\`\`\``,
        riskLevel: 'low',
        reviewPriority: 1,
      },
      status: 'pending',
    },
  ];

  return { scenario, commits };
};

/**
 * Main PRInboxScreen Component
 */
const PRInboxScreen: React.FC<PRInboxScreenProps> = ({ navigation, route }) => {
  // Extract route parameters
  const {
    sessionId,
    scenarioId,
    difficulty = 'medium',
    timeLimit = 1800,
    returnRoute = 'Practice',
  } = route.params;

  // State management
  const [state, dispatch] = useReducer(prInboxReducer, initialState);
  const [isScenarioCollapsed, setIsScenarioCollapsed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  // Refs
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize screen data
  useEffect(() => {
    const initializeData = () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        // Generate mock data
        const { scenario, commits } = generateMockData();

        // Set scenario and commits
        dispatch({ type: 'SET_SCENARIO', payload: scenario });
        dispatch({ type: 'SET_COMMITS', payload: commits });

        // Initialize progress
        dispatch({
          type: 'UPDATE_PROGRESS',
          payload: {
            totalCommits: commits.length,
            startTime: new Date(),
            timeRemaining: timeLimit,
          },
        });

        dispatch({ type: 'SET_LOADING', payload: false });

        // Announce screen load for accessibility
        AccessibilityInfo.announceForAccessibility(
          `PR 검토 화면이 로드되었습니다. ${commits.length}개의 커밋을 검토할 수 있습니다.`
        );
      } catch (error) {
        dispatch({
          type: 'SET_ERROR',
          payload: `데이터 로드 실패: ${error}`,
        });
      }
    };

    initializeData();
  }, [sessionId, scenarioId, timeLimit]);

  // Timer management
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle timer expiration
  const handleTimeUp = useCallback(() => {
    Alert.alert(
      '시간 종료',
      '제한 시간이 만료되었습니다. 현재 진행상황을 저장하고 결과를 확인하시겠습니까?',
      [
        {
          text: '계속하기',
          onPress: () => setTimeRemaining(300), // Extra 5 minutes
        },
        {
          text: '완료',
          onPress: handleCompleteSession,
        },
      ]
    );
  }, []);

  // Handle commit status change
  const handleCommitStatusChange = useCallback((
    hash: string,
    status: CommitStatus,
    reason?: string
  ) => {
    dispatch({
      type: 'UPDATE_COMMIT_STATUS',
      payload: { hash, status, reason },
    });

    // Add review action
    dispatch({
      type: 'ADD_REVIEW_ACTION',
      payload: {
        commitHash: hash,
        action: status === 'accepted' ? 'accept' :
                status === 'rejected' ? 'reject' : 'flag_for_review',
        reason,
        timestamp: new Date(),
      },
    });

    // Update progress
    const updatedCommits = state.commits.map(commit =>
      commit.hash === hash ? { ...commit, status } : commit
    );

    const reviewedCount = updatedCommits.filter(c => c.status !== 'pending').length;
    const acceptedCount = updatedCommits.filter(c => c.status === 'accepted').length;
    const rejectedCount = updatedCommits.filter(c => c.status === 'rejected').length;
    const flaggedCount = updatedCommits.filter(c => c.status === 'needs_review').length;

    // Calculate score based on accuracy and completeness
    const progressPercentage = reviewedCount / state.commits.length;
    const accuracyBonus = (acceptedCount + rejectedCount) / reviewedCount; // Decisive actions
    const currentScore = Math.round((progressPercentage * 70) + (accuracyBonus * 30));

    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        reviewedCommits: reviewedCount,
        acceptedCommits: acceptedCount,
        rejectedCommits: rejectedCount,
        flaggedCommits: flaggedCount,
        currentScore,
      },
    });

    // Check if all commits are reviewed
    if (reviewedCount === state.commits.length) {
      setTimeout(() => {
        Alert.alert(
          '검토 완료',
          '모든 커밋 검토가 완료되었습니다! 결과를 확인하시겠습니까?',
          [
            { text: '계속 검토', style: 'cancel' },
            { text: '완료', onPress: handleCompleteSession },
          ]
        );
      }, 500);
    }
  }, [state.commits]);

  // Handle commit selection
  const handleCommitSelect = useCallback((hash: string) => {
    dispatch({ type: 'SELECT_COMMIT', payload: hash });
  }, []);

  // Handle view commit details
  const handleViewCommitDetails = useCallback((hash: string) => {
    // TODO: Navigate to detailed diff view
    Alert.alert(
      '상세 Diff 보기',
      '상세한 코드 변경사항을 확인할 수 있는 화면으로 이동합니다.',
      [
        { text: '취소', style: 'cancel' },
        { text: '보기', onPress: () => console.log('Navigate to diff view:', hash) },
      ]
    );
  }, []);

  // Handle session completion
  const handleCompleteSession = useCallback(() => {
    const finalScore = state.sessionProgress.currentScore;
    const timeSpent = Math.round((Date.now() - state.sessionProgress.startTime.getTime()) / 1000);

    Alert.alert(
      '세션 완료',
      `최종 점수: ${finalScore}점\n소요 시간: ${Math.floor(timeSpent / 60)}분 ${timeSpent % 60}초\n\n수고하셨습니다!`,
      [
        {
          text: '확인',
          onPress: () => navigation.navigate(returnRoute as never),
        },
      ]
    );
  }, [state.sessionProgress, navigation, returnRoute]);

  // Handle back button
  const handleBackPress = useCallback(() => {
    Alert.alert(
      '세션 종료',
      '정말로 PR 검토를 종료하시겠습니까? 진행상황이 저장되지 않을 수 있습니다.',
      [
        { text: '계속하기', style: 'cancel' },
        { text: '종료', style: 'destructive', onPress: () => navigation.navigate(returnRoute as never) },
      ]
    );
    return true;
  }, [navigation, returnRoute]);

  // Setup back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [handleBackPress]);

  // Format timer display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Render commit item for FlatList
  const renderCommitItem = useCallback(({ item }: { item: CommitInfo }) => (
    <CommitCard
      commit={item}
      onStatusChange={handleCommitStatusChange}
      onViewDetails={handleViewCommitDetails}
      isSelected={state.selectedCommit === item.hash}
      onSelect={handleCommitSelect}
    />
  ), [
    handleCommitStatusChange,
    handleViewCommitDetails,
    handleCommitSelect,
    state.selectedCommit,
  ]);

  // Key extractor for FlatList
  const keyExtractor = useCallback((item: CommitInfo) => item.hash, []);

  // Get item layout for FlatList optimization
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 200, // Estimated height
    offset: 200 * index,
    index,
  }), []);

  // Loading state
  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>
            PR 검토 환경을 준비하고 있습니다...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (state.error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              // Reload the data instead of refreshing the page
              dispatch({ type: 'SET_LOADING', payload: true });
              dispatch({ type: 'SET_ERROR', payload: null });
            }}
          >
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>PR 검토</Text>
            <Text style={styles.headerSubtitle}>
              {state.sessionProgress.reviewedCommits}/{state.sessionProgress.totalCommits} 완료
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              ⏱️ {formatTime(timeRemaining)}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>전체 진행률</Text>
            <Text style={styles.progressStats}>
              점수: {Math.round(state.sessionProgress.currentScore)}점
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${state.sessionProgress.totalCommits > 0
                    ? (state.sessionProgress.reviewedCommits / state.sessionProgress.totalCommits) * 100
                    : 0
                  }%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Scenario Section */}
        {state.scenario && (
          <ScenarioSection
            scenario={state.scenario}
            progress={state.sessionProgress}
            isCollapsed={isScenarioCollapsed}
            onToggleCollapse={() => setIsScenarioCollapsed(!isScenarioCollapsed)}
          />
        )}

        {/* Commit List Section */}
        <View style={styles.commitListSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>검토할 커밋 목록</Text>
            <Text style={styles.commitCount}>
              {state.commits.length}개 커밋
            </Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={state.commits}
            renderItem={renderCommitItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            style={styles.commitList}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={100}
            windowSize={10}
            accessibilityRole="list"
            accessibilityLabel="커밋 목록"
          />
        </View>

        {/* Bottom Action Bar */}
        <View style={styles.bottomActionBar}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryActionButton]}
              onPress={() => Alert.alert('도움말', 'PR 검토 가이드를 확인하시겠습니까?')}
              accessibilityRole="button"
              accessibilityLabel="도움말"
            >
              <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
                ❓ 도움말
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.primaryActionButton]}
              onPress={handleCompleteSession}
              accessibilityRole="button"
              accessibilityLabel="검토 완료"
            >
              <Text style={[styles.actionButtonText, styles.primaryActionButtonText]}>
                ✅ 완료
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PRInboxScreen;