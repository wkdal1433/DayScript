import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { styles } from './CircularProgress.styles';
import { CircularProgressProps } from './CircularProgress.types';

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 120,
  strokeWidth = 8,
  progress = 0,
  duration = 1400,
  color = '#88C7A1',
  backgroundColor = '#E5E5E5',
  isReduceMotionEnabled = false,
  onComplete,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;

  // Ensure safe container size that accounts for stroke width
  const containerSize = size;
  const circleSize = size - strokeWidth; // Prevent border overflow

  useEffect(() => {
    if (isReduceMotionEnabled) {
      // For accessibility: immediately set to final value without animation
      animatedProgress.setValue(progress);
      if (progress >= 100 && onComplete) {
        onComplete();
      }
    } else {
      // Animate from current value to target progress
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration,
        useNativeDriver: false,
      }).start((finished) => {
        if (finished && progress >= 100 && onComplete) {
          onComplete();
        }
      });
    }
  }, [progress, duration, isReduceMotionEnabled, onComplete, animatedProgress]);

  // Calculate rotation angle for progress animation
  const progressRotation = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, {
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2, // Ensure circular boundary
    }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.backgroundCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />

      {/* Progress Circle Container with Overflow Hidden */}
      <View style={[styles.progressContainer, {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2, // Ensure circular clipping
      }]}>
        {/* First Half (0-50%) */}
        <View style={[styles.halfCircle, styles.leftHalf]}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderRightColor: color,
                transform: [
                  {
                    rotate: animatedProgress.interpolate({
                      inputRange: [0, 50],
                      outputRange: ['0deg', '180deg'],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
          />
        </View>

        {/* Second Half (50-100%) */}
        <View style={[styles.halfCircle, styles.rightHalf]}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                borderWidth: strokeWidth,
                borderColor: 'transparent',
                borderRightColor: color,
                transform: [
                  {
                    rotate: animatedProgress.interpolate({
                      inputRange: [50, 100],
                      outputRange: ['0deg', '180deg'],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
                opacity: animatedProgress.interpolate({
                  inputRange: [0, 50, 50.01, 100],
                  outputRange: [0, 0, 1, 1],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

export default CircularProgress;