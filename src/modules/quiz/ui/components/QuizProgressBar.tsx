/**
 * 퀴즈 진행률 표시 컴포넌트
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 진행률 표시만 담당
 */

import React from 'react';
import { View, Text } from 'react-native';
import { progressBarStyles } from '../styles/QuizProgressBar.styles';

export interface QuizProgressBarProps {
  current: number;
  total: number;
  score: number;
  streak: number;
  showDetails?: boolean;
  showStreak?: boolean;
}

export function QuizProgressBar({
  current,
  total,
  score,
  streak,
  showDetails = true,
  showStreak = true,
}: QuizProgressBarProps) {
  const progressPercentage = total > 0 ? (current / total) * 100 : 0;

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 10) return '🔥'; // Hot streak
    if (streak >= 5) return '⚡'; // Good streak
    if (streak >= 3) return '✨'; // Starting streak
    return ''; // No streak
  };

  const getProgressColor = (): string => {
    if (progressPercentage >= 80) return '#10B981'; // green
    if (progressPercentage >= 60) return '#3B82F6'; // blue
    if (progressPercentage >= 40) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  return (
    <View style={progressBarStyles.container}>
      {/* 상단 정보 행 */}
      <View style={progressBarStyles.infoRow}>
        <View style={progressBarStyles.leftInfo}>
          <Text style={progressBarStyles.progressText}>
            {current} / {total}
          </Text>
          <Text style={progressBarStyles.progressLabel}>문제</Text>
        </View>

        {showDetails && (
          <View style={progressBarStyles.centerInfo}>
            <Text style={progressBarStyles.scoreText}>{score}</Text>
            <Text style={progressBarStyles.scoreLabel}>점수</Text>
          </View>
        )}

        {showStreak && streak > 0 && (
          <View style={progressBarStyles.rightInfo}>
            <Text style={progressBarStyles.streakText}>
              {getStreakEmoji(streak)} {streak}
            </Text>
            <Text style={progressBarStyles.streakLabel}>연속</Text>
          </View>
        )}
      </View>

      {/* 진행률 바 */}
      <View style={progressBarStyles.progressBarContainer}>
        <View style={progressBarStyles.progressBarBackground}>
          <View
            style={[
              progressBarStyles.progressBarFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>

        {/* 퍼센티지 표시 */}
        <Text style={progressBarStyles.percentageText}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* 세부 통계 (옵션) */}
      {showDetails && (
        <View style={progressBarStyles.detailsRow}>
          <View style={progressBarStyles.detailItem}>
            <Text style={progressBarStyles.detailValue}>
              {Math.round((current / total) * 100) || 0}%
            </Text>
            <Text style={progressBarStyles.detailLabel}>진행률</Text>
          </View>

          <View style={progressBarStyles.detailItem}>
            <Text style={progressBarStyles.detailValue}>
              {total - current}
            </Text>
            <Text style={progressBarStyles.detailLabel}>남은 문제</Text>
          </View>

          {streak > 2 && (
            <View style={progressBarStyles.detailItem}>
              <Text style={[
                progressBarStyles.detailValue,
                progressBarStyles.streakValue
              ]}>
                {streak}연속
              </Text>
              <Text style={progressBarStyles.detailLabel}>정답</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}