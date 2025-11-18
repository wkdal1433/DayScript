import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

export interface NextButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export const NextButton: React.FC<NextButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const buttonStyle = [
    styles.baseButton,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyleCombined = [
    styles.baseText,
    variant === 'primary' ? styles.primaryText : styles.secondaryText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base Button Styles
  baseButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  // Primary Button (Enhanced Pink Gradient with Border Glow)
  primaryButton: {
    backgroundColor: '#FF8FB3', // Pink gradient approximation
    // Enhanced shadow for gradient border effect
    shadowColor: '#F2BED1',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
    elevation: 8,
    // Additional border glow effect
    borderWidth: 1.5,
    borderColor: 'rgba(242, 190, 209, 0.8)',
  },

  // Secondary Button (Light/Transparent)
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder, // #FDCEDF
    shadowOpacity: 0.08,
  },

  // Disabled Button
  disabledButton: {
    backgroundColor: COLORS.border, // #E5E7EB
    shadowOpacity: 0,
    elevation: 0,
  },

  // Base Text Styles
  baseText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Primary Text (White on Pink)
  primaryText: {
    color: COLORS.white, // White text on pink button
  },

  // Secondary Text (Colored)
  secondaryText: {
    color: COLORS.textPrimary, // #393E46 - Primary text color
  },

  // Disabled Text
  disabledText: {
    color: COLORS.textMuted, // #9CA3AF - Muted text
  },
});

// Enhanced variant with larger size for main action buttons
export const EnhancedNextButton: React.FC<NextButtonProps> = (props) => {
  const enhancedStyle = [
    {
      paddingVertical: 18,
      paddingHorizontal: 36,
      borderRadius: 28,
      minWidth: 200,
      shadowRadius: 20,
      elevation: 10,
      // Enhanced gradient border glow for EnhancedNextButton
      shadowColor: props.variant === 'primary' ? '#F2BED1' : '#000',
      shadowOpacity: props.variant === 'primary' ? 0.8 : 0.15,
      shadowOffset: { width: 0, height: 0 },
      borderWidth: props.variant === 'primary' ? 2 : 0,
      borderColor: props.variant === 'primary' ? 'rgba(242, 190, 209, 0.9)' : 'transparent',
    },
    props.style,
  ];

  const enhancedTextStyle = [
    {
      fontSize: 18,
      lineHeight: 22,
    },
    props.textStyle,
  ];

  return (
    <NextButton
      {...props}
      style={StyleSheet.flatten(enhancedStyle)}
      textStyle={StyleSheet.flatten(enhancedTextStyle)}
    />
  );
};