import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { styles } from './CircularProgress.styles';
import { CircularProgressProps } from './CircularProgress.types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 120,
  strokeWidth = 8,
  progress = 0,
  duration = 1400,
  color = '#6BCB77',
  backgroundColor = 'rgba(107,203,119,0.2)',
  isReduceMotionEnabled = false,
  onComplete,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    if (isReduceMotionEnabled) {
      // For accessibility: immediately set to final value without animation
      animatedProgress.setValue(progress);
      if (progress >= 100 && onComplete) {
        onComplete();
      }
    } else {
      // Animate with ease-out timing for satisfying completion feel
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration,
        easing: Easing.out(Easing.quad), // Ease-out for satisfaction
        useNativeDriver: false,
      }).start((finished) => {
        if (finished && progress >= 100 && onComplete) {
          onComplete();
        }
      });
    }
  }, [progress, duration, isReduceMotionEnabled, onComplete, animatedProgress]);

  // Calculate stroke-dashoffset for arc animation
  const strokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svgContainer}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth + 2} // Slightly thicker than background
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`} // Start from top (-90deg)
        />
      </Svg>
    </View>
  );
};

export default CircularProgress;