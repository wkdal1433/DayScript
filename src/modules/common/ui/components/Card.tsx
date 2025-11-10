/**
 * 공통 카드 컴포넌트
 * 일관된 카드 레이아웃을 위한 재사용 컴포넌트
 */

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, getShadow } from '../../core/constants';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  borderRadius = 'medium',
  style,
  testID,
}) => {
  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      backgroundColor: COLORS.background.primary,
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        ...getShadow('sm'),
      },
      elevated: {
        ...getShadow('lg'),
      },
      outlined: {
        borderWidth: 1,
        borderColor: COLORS.border.default,
        ...getShadow('none'),
      },
      filled: {
        backgroundColor: COLORS.background.secondary,
        ...getShadow('none'),
      },
    };

    // Padding styles
    const paddingStyles: Record<string, ViewStyle> = {
      none: {},
      small: {
        padding: SPACING[3],
      },
      medium: {
        padding: SPACING[5],
      },
      large: {
        padding: SPACING[6],
      },
    };

    // Margin styles
    const marginStyles: Record<string, ViewStyle> = {
      none: {},
      small: {
        margin: SPACING[2],
      },
      medium: {
        margin: SPACING[4],
      },
      large: {
        margin: SPACING[6],
      },
    };

    // Border radius styles
    const borderRadiusStyles: Record<string, ViewStyle> = {
      none: {
        borderRadius: BORDER_RADIUS.none,
      },
      small: {
        borderRadius: BORDER_RADIUS.sm,
      },
      medium: {
        borderRadius: BORDER_RADIUS.md,
      },
      large: {
        borderRadius: BORDER_RADIUS.lg,
      },
    };

    return {
      ...baseStyles,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...marginStyles[margin],
      ...borderRadiusStyles[borderRadius],
    };
  };

  return (
    <View style={[getCardStyles(), style]} testID={testID}>
      {children}
    </View>
  );
};