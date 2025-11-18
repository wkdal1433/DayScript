import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
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
      {/* Multi-layered gradient effect for primary buttons */}
      {variant === 'primary' && !disabled && (
        <>
          <View style={styles.primaryButtonTransition} />
          <View style={styles.primaryButtonInner} />
        </>
      )}
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

  // Primary Button - Outer Gradient Container (#FCE7F3 Border Glow)
  primaryButton: {
    position: 'relative',
    // Outer container creates #FCE7F3 border glow effect
    backgroundColor: '#FCE7F3', // Target border color
    borderWidth: 0, // Smooth gradient without hard border
    // Enhanced multi-layer shadow for seamless gradient transition
    shadowColor: '#FCE7F3',
    shadowOpacity: 1.0, // Maximum opacity for strongest border glow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 35, // Extended outer glow radius
    elevation: 22, // Higher elevation for enhanced depth
    borderRadius: 24, // Consistent radius for all layers
  },

  // Primary Button Inner Core (Main Pink Center - #F2BED1)
  primaryButtonInner: {
    position: 'absolute',
    top: 4, // Perfect inset for centered pink core
    left: 4,
    right: 4,
    bottom: 4,
    backgroundColor: '#F2BED1', // Main pink center color maintained
    borderRadius: 20, // Scaled radius for perfect proportion
    // Enhanced center glow to blend with transition layer
    shadowColor: '#F2BED1',
    shadowOpacity: 0.9, // High opacity for strong center presence
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20, // Optimized for smooth center-to-transition blend
    elevation: 20, // Highest elevation for center dominance
    // Subtle border for enhanced visual definition
    borderWidth: 0.5,
    borderColor: 'rgba(252, 231, 243, 0.3)', // Very subtle transition hint
  },

  // Gradient Transition Layer (Seamless Center-to-Border Blend)
  primaryButtonTransition: {
    position: 'absolute',
    top: 2, // Optimized inset for smoother transition
    left: 2,
    right: 2,
    bottom: 2,
    backgroundColor: 'rgba(242, 190, 209, 0.5)', // Enhanced opacity for smoother blend
    borderRadius: 22,
    // Critical intermediate shadow for gradient smoothness
    shadowColor: 'rgba(252, 231, 243, 0.8)', // #FCE7F3 with transparency
    shadowOpacity: 0.8, // Increased for better transition visibility
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 28, // Optimized radius for seamless blend
    elevation: 16, // Balanced elevation between outer and inner layers
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

  // Primary Text (White) - Perfect Readability on Layered Gradient
  primaryText: {
    color: COLORS.white, // Crisp white text maintained
    zIndex: 15, // Elevated above all gradient layers
    // Enhanced text shadow for maximum readability
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // Slightly stronger shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3, // Increased radius for better definition
    // Additional text properties for enhanced visibility
    fontWeight: '700', // Bold for better contrast
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
      // Enhanced gradient effects inherited from base NextButton
      shadowRadius: 35, // Larger shadow for enhanced button
      elevation: 25, // Higher elevation for prominence
      // The layered gradient effect is automatically applied by NextButton
    },
    props.style,
  ];

  const enhancedTextStyle = [
    {
      fontSize: 18,
      lineHeight: 22,
      // Enhanced text shadow for better readability on layered background
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
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