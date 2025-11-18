/**
 * 공통 버튼 컴포넌트
 * SOLID 원칙을 따른 재사용 가능한 UI 컴포넌트
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, getShadow } from '../../core/constants';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  testID,
}) => {
  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BORDER_RADIUS.md,
      ...getShadow('sm'),
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: SPACING[2],
        paddingHorizontal: SPACING[3],
        minHeight: 32,
      },
      medium: {
        paddingVertical: SPACING[3],
        paddingHorizontal: SPACING[4],
        minHeight: 44,
      },
      large: {
        paddingVertical: SPACING[4],
        paddingHorizontal: SPACING[6],
        minHeight: 56,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: COLORS.primary[500],
      },
      secondary: {
        backgroundColor: COLORS.secondary[100],
        borderWidth: 1,
        borderColor: COLORS.secondary[300],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary[500],
      },
      text: {
        backgroundColor: 'transparent',
        ...getShadow('none'),
      },
      success: {
        backgroundColor: COLORS.success[500],
      },
      warning: {
        backgroundColor: COLORS.warning[500],
      },
      error: {
        backgroundColor: COLORS.error[500],
      },
    };

    // Disabled styles
    const disabledStyles: ViewStyle = disabled
      ? {
          backgroundColor: COLORS.neutral[300],
          borderColor: COLORS.neutral[300],
          ...getShadow('none'),
        }
      : {};

    // Full width styles
    const fullWidthStyles: ViewStyle = fullWidth ? { alignSelf: 'stretch' } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyles,
      ...fullWidthStyles,
    };
  };

  const getTextStyles = (): TextStyle => {
    const sizeTextStyles: Record<string, TextStyle> = {
      small: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      medium: {
        fontSize: TYPOGRAPHY.fontSize.base,
        fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      },
      large: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.semiBold,
      },
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: COLORS.text.inverse,
      },
      secondary: {
        color: COLORS.text.primary,
      },
      outline: {
        color: COLORS.primary[500],
      },
      text: {
        color: COLORS.primary[500],
      },
      success: {
        color: COLORS.text.inverse,
      },
      warning: {
        color: COLORS.text.inverse,
      },
      error: {
        color: COLORS.text.inverse,
      },
    };

    const disabledTextStyles: TextStyle = disabled
      ? {
          color: COLORS.text.disabled,
        }
      : {};

    return {
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      ...disabledTextStyles,
    };
  };

  const iconSpacing = leftIcon || rightIcon ? SPACING[2] : 0;

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' || variant === 'secondary'
            ? COLORS.primary[500]
            : COLORS.text.inverse}
        />
      ) : (
        <>
          {leftIcon && (
            <Text style={{ marginRight: iconSpacing }}>
              {leftIcon}
            </Text>
          )}
          <Text style={[getTextStyles(), textStyle]}>
            {title}
          </Text>
          {rightIcon && (
            <Text style={{ marginLeft: iconSpacing }}>
              {rightIcon}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};