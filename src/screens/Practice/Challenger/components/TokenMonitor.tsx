import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { TokenMonitorProps } from '../VibeSessionScreen.types';
import { styles } from '../VibeSessionScreen.styles';

/**
 * TokenMonitor Component
 *
 * 실시간 토큰 사용량과 효율성 지표를 표시하는 컴포넌트입니다.
 * 사용자가 프롬프트 작성 시 토큰 효율성을 고려할 수 있도록 도움을 제공합니다.
 *
 * SOLID 원칙:
 * - Single Responsibility: 토큰 모니터링 표시만 담당
 * - Interface Segregation: 토큰 관련 정보만 props로 받음
 */
const TokenMonitor: React.FC<TokenMonitorProps> = ({
  usage,
  onRecommendationPress,
  showDetailedStats = false,
}) => {

  // Calculate usage percentage
  const usagePercentage = (usage.currentSession / usage.sessionLimit) * 100;

  // Get efficiency color based on score
  const getEfficiencyColor = (score: number): string => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Get usage status color
  const getUsageColor = (percentage: number): string => {
    if (percentage < 50) return '#10B981'; // Green
    if (percentage < 80) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Format token numbers for display
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toString();
  };

  return (
    <View
      style={styles.tokenMonitor}
      accessibilityLabel="토큰 사용량 모니터"
    >
      {/* Current Usage */}
      <View style={styles.tokenInfo}>
        <Text style={styles.tokenText}>🎯 토큰 사용량:</Text>
        <Text
          style={[
            styles.tokenUsage,
            { color: getUsageColor(usagePercentage) }
          ]}
          accessibilityLabel={`현재 ${usage.currentSession}개, 전체 ${usage.sessionLimit}개 중 ${Math.round(usagePercentage)}% 사용`}
        >
          {formatTokens(usage.currentSession)} / {formatTokens(usage.sessionLimit)}
        </Text>
        <Text style={styles.tokenText}>
          ({Math.round(usagePercentage)}%)
        </Text>
      </View>

      {/* Efficiency Score */}
      <View style={styles.tokenInfo}>
        <Text style={styles.tokenText}>⚡ 효율성:</Text>
        <Text
          style={[
            styles.efficiencyScore,
            { color: getEfficiencyColor(usage.efficiencyScore) }
          ]}
          accessibilityLabel={`효율성 점수 ${Math.round(usage.efficiencyScore)}점`}
        >
          {Math.round(usage.efficiencyScore)}점
        </Text>
      </View>

      {/* Show recommendations if available */}
      {usage.recommendations.length > 0 && onRecommendationPress && (
        <TouchableOpacity
          onPress={() => onRecommendationPress(usage.recommendations[0])}
          accessibilityRole="button"
          accessibilityLabel="토큰 효율성 팁 보기"
          accessibilityHint="토큰 사용을 개선하는 방법을 확인할 수 있습니다"
        >
          <Text style={[styles.tokenText, { color: '#3B82F6' }]}>
            💡 팁 보기
          </Text>
        </TouchableOpacity>
      )}

      {/* Detailed Stats (if enabled) */}
      {showDetailedStats && (
        <View style={{ marginTop: 4 }}>
          <Text style={styles.tokenText}>
            평균: {formatTokens(usage.averagePerPrompt)} •
            예상 잔여: {formatTokens(usage.estimatedRemaining)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TokenMonitor;