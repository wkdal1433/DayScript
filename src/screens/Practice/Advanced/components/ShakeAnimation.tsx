import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { ShakeAnimationProps } from '../Lv4DebuggingScreen.types';

/**
 * ShakeAnimation Component
 * 실패 시 흔들림 효과를 제공하는 애니메이션 컴포넌트
 * SOLID 원칙: 단일 책임 - 흔들림 애니메이션만 담당
 */
const ShakeAnimation: React.FC<ShakeAnimationProps> = ({
  shouldShake,
  intensity = 10,
  duration = 600,
  children,
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shouldShake) {
      // 좌우로 흔들리는 애니메이션
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: intensity,
          duration: duration / 8,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -intensity,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: intensity * 0.7,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -intensity * 0.5,
          duration: duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: duration / 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shouldShake, intensity, duration]);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: shakeAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ShakeAnimation;