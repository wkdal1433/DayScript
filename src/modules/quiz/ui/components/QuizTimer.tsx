/**
 * 퀴즈 타이머 컴포넌트
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 시간 표시 및 알림만 담당
 */

import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { timerStyles } from '../styles/QuizTimer.styles';

export interface QuizTimerProps {
  timeRemaining: number; // seconds
  totalTime: number; // seconds
  onTimeUp: () => void;
  showWarning?: boolean;
  warningThreshold?: number; // seconds
}

export function QuizTimer({
  timeRemaining,
  totalTime,
  onTimeUp,
  showWarning = true,
  warningThreshold = 30,
}: QuizTimerProps) {
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [isWarning, setIsWarning] = useState(false);

  // 시간 초과 처리
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  // 경고 상태 관리
  useEffect(() => {
    const shouldWarn = showWarning && timeRemaining <= warningThreshold && timeRemaining > 0;
    setIsWarning(shouldWarn);

    if (shouldWarn) {
      // 펄스 애니메이션 시작
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [timeRemaining, showWarning, warningThreshold, pulseAnimation]);

  // 시간 포맷팅 (mm:ss)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 진행률 계산
  const progressPercentage = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0;

  // 색상 결정
  const getTimerColor = (): string => {
    if (timeRemaining <= 0) return '#EF4444'; // red - 시간 초과
    if (isWarning) return '#F59E0B'; // amber - 경고
    if (timeRemaining <= totalTime * 0.25) return '#F97316'; // orange - 25% 이하
    if (timeRemaining <= totalTime * 0.5) return '#EAB308'; // yellow - 50% 이하
    return '#10B981'; // green - 충분한 시간
  };

  const getProgressColor = (): string => {
    const percentage = progressPercentage;
    if (percentage >= 90) return '#EF4444'; // red
    if (percentage >= 75) return '#F59E0B'; // amber
    if (percentage >= 50) return '#EAB308'; // yellow
    return '#10B981'; // green
  };

  return (
    <View style={timerStyles.container}>
      {/* 타이머 디스플레이 */}
      <View style={timerStyles.timerContainer}>
        <Animated.View
          style={[
            timerStyles.timerDisplay,
            {
              transform: [{ scale: pulseAnimation }],
              borderColor: getTimerColor(),
            },
            isWarning && timerStyles.warningTimer,
          ]}
        >
          <Text style={[
            timerStyles.timerText,
            { color: getTimerColor() },
            isWarning && timerStyles.warningText,
          ]}>
            {formatTime(timeRemaining)}
          </Text>
        </Animated.View>

        {/* 시간 라벨 */}
        <Text style={timerStyles.timerLabel}>남은 시간</Text>
      </View>

      {/* 진행률 링 */}
      <View style={timerStyles.progressContainer}>
        <View style={timerStyles.progressRing}>
          <View
            style={[
              timerStyles.progressFill,
              {
                transform: [{ rotate: `${(progressPercentage * 3.6)}deg` }],
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>

        {/* 진행률 텍스트 */}
        <Text style={timerStyles.progressText}>
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* 경고 메시지 */}
      {isWarning && (
        <Animated.View
          style={[
            timerStyles.warningMessage,
            { opacity: pulseAnimation },
          ]}
        >
          <Text style={timerStyles.warningMessageText}>
            ⚠️ 시간이 얼마 남지 않았습니다!
          </Text>
        </Animated.View>
      )}

      {/* 시간 초과 알림 */}
      {timeRemaining <= 0 && (
        <View style={timerStyles.timeUpMessage}>
          <Text style={timerStyles.timeUpText}>⏰ 시간 초과!</Text>
        </View>
      )}
    </View>
  );
}