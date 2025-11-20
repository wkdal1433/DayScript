/**
 * CircularProgress Component
 *
 * 원형 프로그레스 바 애니메이션 컴포넌트
 * 0%에서 100%까지 부드럽게 채워지는 효과
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../../constants';

export interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  progress?: number; // 0-100
  duration?: number;
  delay?: number;
  color?: string;
  backgroundColor?: string;
  showBackground?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 80,
  strokeWidth = 6,
  progress = 100,
  duration = 1500,
  delay = 100,
  color = COLORS.success,
  backgroundColor = COLORS.border,
  showBackground = true,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // 애니메이션 시퀀스
    const animationSequence = Animated.sequence([
      // 1. 스케일업 애니메이션
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 300,
        delay: delay,
        useNativeDriver: false,
      }),

      // 2. 프로그레스 바 채우기 애니메이션
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: duration,
        useNativeDriver: false,
      }),
    ]);

    animationSequence.start();

    return () => {
      animationSequence.stop();
    };
  }, [progress]);

  // 애니메이티드 stroke-dashoffset 계산 (시계 방향으로 채워짐)
  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scale: scaleAnimation }],
      }}
    >
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        {showBackground && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.2}
          />
        )}

        {/* 애니메이티드 프로그레스 원 */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // 12시에서 시작, 시계 방향으로 채워짐
        />
      </Svg>
    </Animated.View>
  );
};

// 성공용 프리셋
export const SuccessProgress: React.FC<Omit<CircularProgressProps, 'color' | 'progress'>> = (props) => (
  <CircularProgress
    {...props}
    color={COLORS.success}
    progress={100}
  />
);

export default CircularProgress;