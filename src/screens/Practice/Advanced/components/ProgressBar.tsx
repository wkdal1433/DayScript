import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { ProgressBarProps } from '../Lv4DebuggingScreen.types';
import { COLORS } from '../../../../constants/colors';

/**
 * ProgressBar Component
 * 진행률을 시각적으로 표시하는 애니메이션 프로그레스 바
 * SOLID 원칙: 단일 책임 - 진행률 표시만 담당
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isSuccess = false,
  isError = false,
  animationDuration = 500,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [progress, animationDuration]);

  // 프로그레스 바 색상 결정
  const getProgressColor = () => {
    if (isError) return '#EF4444';
    if (isSuccess) return '#10B981';
    return '#BE185D';
  };

  // 배경 색상 결정
  const getBackgroundColor = () => {
    if (isError) return '#FEE2E2';
    if (isSuccess) return '#DCFCE7';
    return '#F8E8EE';
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={{
      width: '100%',
      height: 8,
      backgroundColor: getBackgroundColor(),
      borderRadius: 4,
      overflow: 'hidden',
      marginVertical: 8,
    }}>
      <Animated.View
        style={{
          height: '100%',
          width: progressWidth,
          backgroundColor: getProgressColor(),
          borderRadius: 4,
        }}
      />
    </View>
  );
};

export default ProgressBar;