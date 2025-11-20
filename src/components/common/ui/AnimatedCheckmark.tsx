/**
 * AnimatedCheckmark Component
 *
 * 생동감있는 체크마크 애니메이션
 * 체크마크가 실제로 그어지는 것처럼 보이는 효과 구현 (단계별 라인 그리기)
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { COLORS } from '../../../constants';

export interface AnimatedCheckmarkProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
}

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  size = 60,
  color = COLORS.success,
  strokeWidth = 4,
  duration = 0,
  delay = 0,
}) => {
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.spring(scaleAnimation, {
            toValue: 1,
            tension: 100,
            friction: 6,
            useNativeDriver: false,
          }),
        ]).start();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: opacityAnimation,
        transform: [{ scale: scaleAnimation }],
      }}
    >
      <Text
        style={{
          fontSize: size * 0.6,
          color: color,
          fontWeight: 'bold',
        }}
      >
        ✓
      </Text>
    </Animated.View>
  );
};

// 다양한 프리셋 컴포넌트들
export const SuccessCheckmark: React.FC<Omit<AnimatedCheckmarkProps, 'color' | 'size'>> = (props) => (
  <AnimatedCheckmark
    {...props}
    size={60}
    color={COLORS.success}
  />
);

export const SmallCheckmark: React.FC<Omit<AnimatedCheckmarkProps, 'size'>> = (props) => (
  <AnimatedCheckmark
    {...props}
    size={32}
  />
);

export const LargeCheckmark: React.FC<Omit<AnimatedCheckmarkProps, 'size'>> = (props) => (
  <AnimatedCheckmark
    {...props}
    size={80}
  />
);

export default AnimatedCheckmark;