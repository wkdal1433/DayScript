import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { COLORS } from '../../constants/colors';
import { NextButton } from '../../components/ui/NextButton';

// Figma 216-310 - Step 2: Interview Practice Features - 100% Pixel Perfect
export const OnboardingStep2Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  onSkip,
  currentStep = 2,
  totalSteps = 4,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {/* Step Indicator - Top Center */}
      <Text style={styles.stepIndicatorText}>2 / 4</Text>

      {/* Main Content Container - Perfect Center Alignment */}
      <View style={styles.mainContentContainer}>
        {/* Central Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* Background Gradient Circle */}
          <View style={styles.backgroundCircle} />

          {/* Small Decorative Circles */}
          <View style={[styles.smallCircle, styles.smallCircle1]} />
          <View style={[styles.smallCircle, styles.smallCircle2]} />
          <View style={[styles.smallCircle, styles.smallCircle3]} />
          <View style={[styles.smallCircle, styles.smallCircle4]} />

          {/* Code Editor Visual Element */}
          <View style={styles.codeEditorContainer}>
            {/* Simulated code lines */}
            <View style={styles.codeLine} />
            <View style={[styles.codeLine, styles.codeLineShort]} />
            <View style={styles.codeLine} />
            <View style={[styles.codeLine, styles.codeLineShort]} />
          </View>
        </View>

        {/* Main Heading - 2 Lines as per Figma */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>실제 면접처럼</Text>
          <Text style={styles.mainHeading}>연습하세요!</Text>
        </View>

        {/* Description - 3 Lines as per Figma */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>디버깅 챌린지와</Text>
          <Text style={styles.descriptionText}>라이브 코딩 인터뷰로</Text>
          <Text style={styles.descriptionText}>실전 감각을 키워보세요</Text>
        </View>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>

        <NextButton
          onPress={onNext}
          title="다음"
          variant="primary"
          style={styles.nextButton}
          textStyle={styles.nextText}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main Container - Perfect Center Alignment
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // #F9F5F6 - Unified design system
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  // Main Content Container - Perfect Center Alignment for all content
  mainContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -60, // Fine-tune vertical positioning
  },

  // Step Indicator Text - Top Center Position
  stepIndicatorText: {
    position: 'absolute',
    top: 48,
    left: '50%',
    transform: [{ translateX: -13 }], // Center align "2 / 4" text
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted, // #9CA3AF - Muted text color
    textAlign: 'center',
    lineHeight: 15,
  },

  // Central Illustration Container - Centered Layout
  illustrationContainer: {
    width: 200,
    height: 200,
    marginBottom: 40,
    position: 'relative',
  },

  // Large Background Circle - Centered
  backgroundCircle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F8E8EE', // Linear gradient approximation
    opacity: 0.8,
  },

  // Small Decorative Circles
  smallCircle: {
    position: 'absolute',
    borderRadius: 50,
  },

  // Small Circle 1 - Relative positioning
  smallCircle1: {
    left: -15, // Adjusted for centered layout
    top: 65,
    width: 10,
    height: 10,
    backgroundColor: '#FDCEDF',
    opacity: 0.4,
  },

  // Small Circle 2 - Relative positioning
  smallCircle2: {
    left: 203, // Adjusted for centered layout
    top: 83,
    width: 14,
    height: 14,
    backgroundColor: '#F2BED1',
    opacity: 0.4,
  },

  // Small Circle 3 - Relative positioning
  smallCircle3: {
    left: 19, // Adjusted for centered layout
    top: 134,
    width: 12,
    height: 12,
    backgroundColor: '#FF8FB3',
    opacity: 0.3,
  },

  // Small Circle 4 - Relative positioning
  smallCircle4: {
    left: 170, // Adjusted for centered layout
    top: 125,
    width: 10,
    height: 10,
    backgroundColor: '#F8E8EE',
    opacity: 0.5,
  },

  // Code Editor Container - Centered positioning
  codeEditorContainer: {
    position: 'absolute',
    left: 75, // Adjusted for centered layout
    top: 60,
    width: 50,
    height: 103,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  // Code Lines
  codeLine: {
    height: 2,
    backgroundColor: '#FF8FB3',
    marginBottom: 6,
    borderRadius: 1,
  },

  codeLineShort: {
    width: '70%',
  },

  // Heading Container - Perfect Center Alignment
  headingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  // Main Heading - Inter Bold 24px, Center Aligned
  mainHeading: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary, // #393E46 - Primary text
    textAlign: 'center',
    lineHeight: 29, // 1.21 line height from Figma
  },

  // Description Container - Perfect Center Alignment
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  // Description Text - Inter Regular 15px
  descriptionText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textMuted, // #6B7280 - Muted text
    textAlign: 'center',
    lineHeight: 18, // 1.21 line height from Figma
    marginBottom: 4,
  },

  // Progress Dots Container - Bottom Center Position
  progressDots: {
    position: 'absolute',
    bottom: 120, // Above bottom buttons
    left: '50%',
    transform: [{ translateX: -36 }], // Center 72px width
    flexDirection: 'row',
    alignItems: 'center',
    width: 72,
    height: 8,
  },

  // Individual Dot
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  // Inactive Dot
  inactiveDot: {
    backgroundColor: COLORS.border, // #E5E7EB - Border color
  },

  // Active Dot - Unified Primary Pink
  activeDot: {
    backgroundColor: COLORS.primary, // #F2BED1 - Unified primary pink
    width: 24, // Active dot is wider
  },

  // Bottom Navigation Container - Bottom Fixed Position
  bottomNavigation: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Skip Button - Left Side
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  // Skip Text - Inter Bold 14px
  skipText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textMuted, // #9CA3AF - Muted text color
    lineHeight: 17,
  },

  // Next Button - Unified Size (92x40) with Enhanced Gradient
  nextButton: {
    width: 92, // Unified width matching Step1
    height: 40, // Unified height matching Step1
    paddingVertical: 0, // Remove padding to control exact size
    paddingHorizontal: 0,
    borderRadius: 20,
    shadowRadius: 12, // blur(12px) from Figma
  },

  // Next Text - Inter Bold 14px, White
  nextText: {
    fontSize: 14,
    lineHeight: 17,
  },
});