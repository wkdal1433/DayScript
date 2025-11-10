/**
 * 공통 에러 바운더리 컴포넌트
 * 에러 처리 및 복구를 위한 고차 컴포넌트
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../core/constants';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry);
      }

      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>😵</Text>
            <Text style={styles.errorTitle}>앗! 문제가 발생했어요</Text>
            <Text style={styles.errorMessage}>
              예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.
            </Text>
            {__DEV__ && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>디버그 정보:</Text>
                <Text style={styles.debugText}>{this.state.error.message}</Text>
                <Text style={styles.debugText}>{this.state.error.stack}</Text>
              </View>
            )}
            <Button
              title="다시 시도"
              onPress={this.handleRetry}
              variant="primary"
              style={styles.retryButton}
            />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING[6],
  },
  errorContainer: {
    backgroundColor: COLORS.background.secondary,
    padding: SPACING[6],
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: SPACING[4],
  },
  errorTitle: {
    ...TYPOGRAPHY.textStyles.h3,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING[3],
  },
  errorMessage: {
    ...TYPOGRAPHY.textStyles.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING[5],
  },
  debugContainer: {
    backgroundColor: COLORS.error[50],
    padding: SPACING[4],
    borderRadius: BORDER_RADIUS.sm,
    width: '100%',
    marginBottom: SPACING[5],
  },
  debugTitle: {
    ...TYPOGRAPHY.textStyles.labelSmall,
    color: COLORS.error[700],
    marginBottom: SPACING[2],
    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
  },
  debugText: {
    ...TYPOGRAPHY.textStyles.captionSmall,
    color: COLORS.error[600],
    fontFamily: TYPOGRAPHY.fontFamily.mono,
  },
  retryButton: {
    minWidth: 120,
  },
});