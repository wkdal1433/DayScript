import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Type imports
import {
  Lv5ExpertModeScreenProps,
  ExpertSession,
  ExpertSessionConfig,
  ExpertModeAction,
  ExpertModeState,
  ExpertModeError,
} from './Lv5ExpertModeScreen.types';

// Style imports
import { styles, gradientStyles, accessibility } from './Lv5ExpertModeScreen.styles';

// Component imports
import ExpertModeTabNavigation from './components/Shared/ExpertModeTabNavigation';
import TimerComponent from './components/Shared/TimerComponent';
import ExpertMetricsDashboard from './components/Analytics/ExpertMetricsDashboard';
import ExpertModeErrorBoundary from './components/Shared/ExpertModeErrorBoundary';

// Lazy load heavy components for performance
const VibeCodingModule = React.lazy(() => import('./components/VibeCoding/VibeCodingModule'));
const CodeReviewModule = React.lazy(() => import('./components/CodeReview/CodeReviewModule'));

/**
 * LV5 Expert Mode Screen Component
 *
 * Advanced learning mode with two specialized modules:
 * 1. Vibe Coding: AI prompting and code generation with evaluation
 * 2. Code Review: Git-based workflow and collaboration assessment
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Main screen manages overall state and navigation
 * - Open/Closed: Extensible for new modules without modifying existing code
 * - Liskov Substitution: Interface-based props ensure predictable behavior
 * - Interface Segregation: Each module has independent, focused interfaces
 * - Dependency Inversion: Depends on abstractions, not concrete implementations
 */

// State management reducer
const expertModeReducer = (state: ExpertModeState, action: ExpertModeAction): ExpertModeState => {
  switch (action.type) {
    case 'SESSION_START':
      return {
        ...state,
        isLoading: false,
        error: undefined,
      };

    case 'SESSION_END':
      return {
        ...state,
        currentSession: state.currentSession ? {
          ...state.currentSession,
          endedAt: new Date(),
          status: action.payload.reason === 'completed' ? 'completed' : 'abandoned',
        } : undefined,
      };

    case 'MODULE_SWITCH':
      return {
        ...state,
        activeModule: action.payload.to as 'vibe_coding' | 'code_review',
        currentSession: state.currentSession ? {
          ...state.currentSession,
          currentModule: action.payload.to as 'vibe_coding' | 'code_review',
        } : undefined,
      };

    case 'ERROR_OCCURRED':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const Lv5ExpertModeScreen: React.FC<Lv5ExpertModeScreenProps> = ({
  route,
  navigation
}) => {
  // Extract route parameters
  const {
    initialModule = 'vibe_coding',
    returnRoute = 'Practice',
    sessionConfig
  } = route.params || {};

  // State management using reducer pattern
  const [state, dispatch] = useReducer(expertModeReducer, {
    activeModule: initialModule,
    isLoading: true,
    error: undefined,
    analytics: null,
    currentSession: undefined,
  });

  // Local component state
  const [timeRemaining, setTimeRemaining] = useState(sessionConfig?.timeLimit || 3600); // 1 hour default
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Session initialization
  useEffect(() => {
    initializeExpertSession();
    setupBackHandler();

    return () => {
      cleanupSession();
    };
  }, []);

  // Initialize expert mode session
  const initializeExpertSession = useCallback(async () => {
    try {
      dispatch({ type: 'SESSION_START', payload: sessionConfig || getDefaultConfig() });

      // TODO: Initialize session with backend API
      // const session = await ExpertSessionService.createSession({
      //   sessionType: 'expert_mode',
      //   config: sessionConfig || getDefaultConfig(),
      //   initialModule,
      // });

      // Mock session for now
      const mockSession: ExpertSession = {
        id: `expert_${Date.now()}`,
        userId: 'current_user', // TODO: Get from auth context
        sessionType: initialModule,
        startedAt: new Date(),
        totalDurationSeconds: 0,
        status: 'active',
        config: sessionConfig || getDefaultConfig(),
        currentModule: initialModule,
        progress: {
          totalTasks: 10,
          completedTasks: 0,
          overallScore: 0,
          moduleScores: {},
        },
      };

      // Set session in state
      // setState({ ...state, currentSession: mockSession, isLoading: false });

    } catch (error) {
      handleError({
        code: 'SESSION_INIT_FAILED',
        message: 'Failed to initialize expert mode session',
        type: 'service',
        retryable: true,
        context: { error },
      });
    }
  }, [sessionConfig, initialModule]);

  // Get default session configuration
  const getDefaultConfig = (): ExpertSessionConfig => ({
    timeLimit: 3600, // 1 hour
    difficulty: 'intermediate',
    enableAIAssistance: true,
    enableCollaboration: true,
    autoSave: true,
  });

  // Setup Android back button handler
  const setupBackHandler = useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  // Handle back button press
  const handleBackPress = useCallback((): boolean => {
    handleExitSession('user_exit');
    return true; // Prevent default behavior
  }, []);

  // Module switching handler
  const handleModuleChange = useCallback((newModule: 'vibe_coding' | 'code_review') => {
    if (newModule === state.activeModule) return;

    // Announce module switch for accessibility
    // AccessibilityInfo.announceForAccessibility(
    //   accessibility.announcements.moduleSwitch.replace('{module}',
    //     newModule === 'vibe_coding' ? 'Vibe Coding' : 'Code Review'
    //   )
    // );

    dispatch({
      type: 'MODULE_SWITCH',
      payload: { from: state.activeModule, to: newModule },
    });
  }, [state.activeModule]);

  // Timer event handlers
  const handleTimeUpdate = useCallback((remaining: number) => {
    setTimeRemaining(remaining);

    // Auto-save progress every 5 minutes
    if (remaining % 300 === 0) {
      saveSessionProgress();
    }
  }, []);

  const handleTimeUp = useCallback(() => {
    Alert.alert(
      '⏰ Time\'s Up!',
      'Your expert mode session has ended. Your progress has been saved.',
      [
        {
          text: 'Review Results',
          onPress: () => handleExitSession('completed'),
        },
      ],
      { cancelable: false }
    );
  }, []);

  // Session management
  const saveSessionProgress = useCallback(async () => {
    try {
      // TODO: Implement session save
      // await ExpertSessionService.saveProgress(state.currentSession);
    } catch (error) {
      console.warn('Failed to save session progress:', error);
    }
  }, [state.currentSession]);

  const handleExitSession = useCallback((reason: 'completed' | 'timeout' | 'user_exit') => {
    if (reason === 'user_exit') {
      Alert.alert(
        'Exit Expert Mode',
        'Are you sure you want to exit? Your progress will be saved.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => {
              dispatch({ type: 'SESSION_END', payload: { reason } });
              navigation.navigate(returnRoute as never);
            },
          },
        ]
      );
    } else {
      dispatch({ type: 'SESSION_END', payload: { reason } });
      navigation.navigate(returnRoute as never);
    }
  }, [navigation, returnRoute]);

  // Error handling
  const handleError = useCallback((error: ExpertModeError) => {
    dispatch({ type: 'ERROR_OCCURRED', payload: error });
  }, []);

  const handleRetry = useCallback(() => {
    if (state.error?.retryable) {
      dispatch({ type: 'SESSION_START', payload: sessionConfig || getDefaultConfig() });
      initializeExpertSession();
    }
  }, [state.error, sessionConfig, initializeExpertSession]);

  // Cleanup on unmount
  const cleanupSession = useCallback(() => {
    saveSessionProgress();
  }, [saveSessionProgress]);

  // Loading state
  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3563e9" style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Initializing Expert Mode...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (state.error) {
    return (
      <ExpertModeErrorBoundary
        error={state.error}
        onRetry={handleRetry}
        onExit={() => navigation.navigate(returnRoute as never)}
      />
    );
  }

  // Calculate module progress
  const moduleProgress = {
    vibe_coding: state.currentSession?.progress.moduleScores?.vibeCoding?.overall || 0,
    code_review: state.currentSession?.progress.moduleScores?.codeReview?.overall || 0,
  };

  // Check if modules are unlocked (for now, both are always unlocked)
  const isModuleUnlocked = {
    vibe_coding: true,
    code_review: true,
  };

  return (
    <ExpertModeErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => handleExitSession('user_exit')}
              accessibilityRole="button"
              accessibilityLabel="Exit Expert Mode"
              accessibilityHint="Double tap to exit expert mode session"
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.expertModeTitle}>LV5 Expert Mode</Text>
              <Text style={styles.sessionInfo}>
                {state.currentSession?.progress.completedTasks || 0}/
                {state.currentSession?.progress.totalTasks || 10} Tasks Completed
              </Text>
            </View>

            <TimerComponent
              initialTime={timeRemaining}
              isRunning={!isSessionPaused}
              onTimeUp={handleTimeUp}
              onTimeUpdate={handleTimeUpdate}
              showWarningAt={300} // 5 minutes warning
              format="mm:ss"
            />
          </View>

          {/* Tab Navigation */}
          <ExpertModeTabNavigation
            activeModule={state.activeModule}
            onModuleChange={handleModuleChange}
            moduleProgress={moduleProgress}
            isModuleUnlocked={isModuleUnlocked}
          />

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Overall Progress</Text>
              <Text style={styles.progressStats}>
                Score: {Math.round(state.currentSession?.progress.overallScore || 0)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={gradientStyles.analytics.colors}
                start={gradientStyles.analytics.start}
                end={gradientStyles.analytics.end}
                style={[
                  styles.progressBar,
                  { width: `${state.currentSession?.progress.overallScore || 0}%` }
                ]}
              />
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <React.Suspense
              fallback={
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3563e9" />
                  <Text style={styles.loadingText}>Loading module...</Text>
                </View>
              }
            >
              {state.activeModule === 'vibe_coding' ? (
                <VibeCodingModule
                  sessionId={state.currentSession?.id || ''}
                  problemData={null}
                  userProgress={state.currentSession?.progress}
                  onModuleComplete={(result) => {
                    // TODO: Handle module completion
                    console.log('Vibe Coding module completed:', result);
                  }}
                  onScoreUpdate={(scoreUpdate) => {
                    // TODO: Update session scores
                    console.log('Score update:', scoreUpdate);
                  }}
                  onError={handleError}
                />
              ) : (
                <CodeReviewModule
                  sessionId={state.currentSession?.id || ''}
                  problemData={null}
                  userProgress={state.currentSession?.progress}
                  onModuleComplete={(result) => {
                    // TODO: Handle module completion
                    console.log('Code Review module completed:', result);
                  }}
                  onScoreUpdate={(scoreUpdate) => {
                    // TODO: Update session scores
                    console.log('Score update:', scoreUpdate);
                  }}
                  onError={handleError}
                />
              )}
            </React.Suspense>
          </View>

          {/* Analytics Dashboard (Optional Toggle) */}
          {showAnalytics && state.analytics && (
            <ExpertMetricsDashboard
              analytics={state.analytics}
              timeRange="session"
              onTimeRangeChange={() => {}}
              isLoading={false}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => setShowAnalytics(!showAnalytics)}
              accessibilityRole="button"
              accessibilityLabel="Toggle Analytics"
            >
              <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsSessionPaused(!isSessionPaused)}
              accessibilityRole="button"
              accessibilityLabel={isSessionPaused ? "Resume Session" : "Pause Session"}
            >
              <Text style={styles.actionButtonText}>
                {isSessionPaused ? '▶️ Resume' : '⏸️ Pause'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ExpertModeErrorBoundary>
  );
};

export default Lv5ExpertModeScreen;