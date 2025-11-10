/**
 * 공통 로딩 스피너 컴포넌트
 * 일관된 로딩 상태 표시를 위한 컴포넌트
 */

import React from 'react';
import { View, ActivityIndicator, Text, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../core/constants';

export interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = COLORS.primary[500],
  message,
  fullScreen = false,
  style,
  textStyle,
  testID,
}) => {
  const containerStyles: ViewStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    ...(fullScreen && {
      flex: 1,
      backgroundColor: COLORS.background.primary,
    }),
    ...(message && {
      gap: SPACING[3],
    }),
  };

  const messageStyles: TextStyle = {
    ...TYPOGRAPHY.textStyles.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  };

  return (
    <View style={[containerStyles, style]} testID={testID}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={[messageStyles, textStyle]}>
          {message}
        </Text>
      )}
    </View>
  );
};