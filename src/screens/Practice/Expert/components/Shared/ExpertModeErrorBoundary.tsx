import React, { Component, ErrorInfo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { ExpertModeError, ExpertModeErrorBoundaryState } from '../../Lv5ExpertModeScreen.types';
import { styles } from '../../Lv5ExpertModeScreen.styles';

interface ExpertModeErrorBoundaryProps {
  children?: React.ReactNode;
  error?: ExpertModeError;
  onRetry?: () => void;
  onExit?: () => void;
}

/**
 * ExpertModeErrorBoundary Component
 *
 * Comprehensive error handling for Expert Mode with recovery strategies,
 * user-friendly messages, and accessibility support.
 *
 * SOLID Principles:
 * - Single Responsibility: Handles only error boundary logic and display
 * - Open/Closed: Error types and recovery strategies can be extended
 * - Interface Segregation: Focused error handling interface
 */
class ExpertModeErrorBoundary extends Component<
  ExpertModeErrorBoundaryProps,
  ExpertModeErrorBoundaryState
> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: ExpertModeErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      errorType: 'unknown',
      errorMessage: '',
      sessionId: undefined,
      canRecover: true,
    };
  }

  static getDerivedStateFromError(error: Error): ExpertModeErrorBoundaryState {
    // Update state to trigger error UI
    return {
      hasError: true,
      errorType: ExpertModeErrorBoundary.categorizeError(error),
      errorMessage: error.message,
      canRecover: ExpertModeErrorBoundary.determineRecoverability(error),
    };
  }

  static getDerivedStateFromProps(
    props: ExpertModeErrorBoundaryProps,
    state: ExpertModeErrorBoundaryState
  ): Partial<ExpertModeErrorBoundaryState> | null {
    // Handle external error prop
    if (props.error && !state.hasError) {
      return {
        hasError: true,
        errorType: props.error.type as any,
        errorMessage: props.error.message,
        canRecover: props.error.retryable,
      };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('ExpertMode Error Boundary caught an error:', error, errorInfo);

    // Track error for analytics (if available)
    this.trackError(error, errorInfo);

    // Announce error for accessibility
    AccessibilityInfo.announceForAccessibility(
      `An error occurred in expert mode. ${this.getUserFriendlyMessage(error)}`
    );
  }

  componentDidUpdate(prevProps: ExpertModeErrorBoundaryProps) {
    // Reset error state if external error is cleared
    if (prevProps.error && !this.props.error && this.state.hasError) {
      this.setState({
        hasError: false,
        errorType: 'unknown',
        errorMessage: '',
        canRecover: true,
      });
    }
  }

  private static categorizeError(error: Error): ExpertModeErrorBoundaryState['errorType'] {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return 'network';
    }
    if (message.includes('ai') || message.includes('openai') || message.includes('claude')) {
      return 'ai_service';
    }
    if (message.includes('git') || message.includes('repository')) {
      return 'git_integration';
    }
    if (message.includes('session') || message.includes('expired')) {
      return 'session_expired';
    }
    return 'unknown';
  }

  private static determineRecoverability(error: Error): boolean {
    const message = error.message.toLowerCase();

    // Non-recoverable errors
    if (message.includes('authentication') || message.includes('unauthorized')) {
      return false;
    }
    if (message.includes('quota') || message.includes('limit exceeded')) {
      return false;
    }

    // Recoverable errors
    return true;
  }

  private trackError = (error: Error, errorInfo?: ErrorInfo) => {
    try {
      // TODO: Implement error tracking
      // ErrorTrackingService.trackError({
      //   error: error.message,
      //   stack: error.stack,
      //   componentStack: errorInfo?.componentStack,
      //   context: 'expert_mode',
      //   sessionId: this.state.sessionId,
      // });
    } catch (trackingError) {
      console.warn('Failed to track error:', trackingError);
    }
  };

  private getUserFriendlyMessage = (error: Error): string => {
    const errorType = ExpertModeErrorBoundary.categorizeError(error);

    switch (errorType) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'ai_service':
        return 'AI service is temporarily unavailable. Please try again in a few moments.';
      case 'git_integration':
        return 'Git service is having issues. Please check your repository connection.';
      case 'session_expired':
        return 'Your session has expired. Please restart the expert mode.';
      default:
        return 'An unexpected error occurred. Please try restarting the session.';
    }
  };

  private getErrorIcon = (): string => {
    switch (this.state.errorType) {
      case 'network':
        return '🌐';
      case 'ai_service':
        return '🤖';
      case 'git_integration':
        return '📁';
      case 'session_expired':
        return '⏰';
      default:
        return '⚠️';
    }
  };

  private getRecoveryActions = () => {
    const actions = [];

    if (this.state.canRecover && this.retryCount < this.maxRetries) {
      actions.push({
        title: 'Try Again',
        onPress: this.handleRetry,
        style: 'primary' as const,
      });
    }

    if (this.state.errorType === 'network') {
      actions.push({
        title: 'Check Connection',
        onPress: this.handleCheckConnection,
        style: 'secondary' as const,
      });
    }

    if (this.state.errorType === 'session_expired') {
      actions.push({
        title: 'Restart Session',
        onPress: this.handleRestartSession,
        style: 'primary' as const,
      });
    }

    actions.push({
      title: 'Exit Expert Mode',
      onPress: this.handleExit,
      style: 'secondary' as const,
    });

    return actions;
  };

  private handleRetry = () => {
    if (this.retryCount >= this.maxRetries) {
      Alert.alert(
        'Maximum Retries Reached',
        'Unable to recover from this error. Please exit and try again later.',
        [{ text: 'OK', onPress: this.handleExit }]
      );
      return;
    }

    this.retryCount++;

    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      // Auto recovery attempt
      this.setState({
        hasError: false,
        errorType: 'unknown',
        errorMessage: '',
        canRecover: true,
      });
    }

    AccessibilityInfo.announceForAccessibility('Retrying operation');
  };

  private handleCheckConnection = () => {
    Alert.alert(
      'Network Connection',
      'Please ensure you have a stable internet connection and try again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: this.handleRetry },
      ]
    );
  };

  private handleRestartSession = () => {
    Alert.alert(
      'Restart Expert Mode Session',
      'This will restart your expert mode session. Any unsaved progress may be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: () => {
            this.retryCount = 0;
            this.handleRetry();
          },
        },
      ]
    );
  };

  private handleExit = () => {
    if (this.props.onExit) {
      this.props.onExit();
    }
    AccessibilityInfo.announceForAccessibility('Exiting expert mode');
  };

  render() {
    if (!this.state.hasError && !this.props.error) {
      return this.props.children;
    }

    const recoveryActions = this.getRecoveryActions();

    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.errorContainer}
          accessibilityRole="alert"
          accessibilityLabel="Error screen"
        >
          {/* Error Icon */}
          <Text
            style={styles.errorIcon}
            accessibilityLabel={`Error type: ${this.state.errorType}`}
          >
            {this.getErrorIcon()}
          </Text>

          {/* Error Title */}
          <Text style={styles.errorTitle}>
            Oops! Something went wrong
          </Text>

          {/* User-friendly message */}
          <Text style={styles.errorMessage}>
            {this.getUserFriendlyMessage({ message: this.state.errorMessage } as Error)}
          </Text>

          {/* Technical details (collapsible) */}
          {__DEV__ && (
            <View style={{ marginTop: 16, padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>
                Error Type: {this.state.errorType}
                {'\n'}
                Message: {this.state.errorMessage}
                {'\n'}
                Retry Count: {this.retryCount}/{this.maxRetries}
              </Text>
            </View>
          )}

          {/* Recovery Actions */}
          <View style={{ marginTop: 24, width: '100%' }}>
            {recoveryActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.retryButton,
                  action.style === 'secondary' && styles.actionButtonSecondary,
                  { marginBottom: index < recoveryActions.length - 1 ? 12 : 0 },
                ]}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.title}
                accessibilityHint={`Double tap to ${action.title.toLowerCase()}`}
              >
                <Text
                  style={[
                    styles.retryButtonText,
                    action.style === 'secondary' && styles.actionButtonTextSecondary,
                  ]}
                >
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Help */}
          <Text
            style={{
              fontSize: 12,
              color: '#9CA3AF',
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 18,
            }}
          >
            If this problem persists, please contact support or try restarting the app.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

export default ExpertModeErrorBoundary;