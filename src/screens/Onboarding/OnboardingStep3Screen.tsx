import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { COLORS } from '../../constants/colors';
import { NextButton } from '../../components/ui/NextButton';

// Figma 216-264 - Step 3: Review & Study Features - 100% Pixel Perfect
export const OnboardingStep3Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  onSkip,
  currentStep = 3,
  totalSteps = 4,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {/* Step Indicator - Top Center */}
      <Text style={styles.stepIndicatorText}>3 / 4</Text>

      {/* Main Content Container - Perfect Center Alignment */}
      <View style={styles.mainContentContainer}>
        {/* Central Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* Background Gradient Circle */}
          <View style={styles.backgroundCircle} />

          {/* Sparkle Elements - ✨ */}
          <View style={styles.sparkleContainer}>
            <Text style={[styles.sparkle, styles.sparkle1]}>✨</Text>
            <Text style={[styles.sparkle, styles.sparkle2]}>✨</Text>
            <Text style={[styles.sparkle, styles.sparkle3]}>✨</Text>
          </View>

          {/* Small Decorative Circles */}
          <View style={[styles.smallCircle, styles.smallCircle1]} />
          <View style={[styles.smallCircle, styles.smallCircle2]} />
          <View style={[styles.smallCircle, styles.smallCircle3]} />
          <View style={[styles.smallCircle, styles.smallCircle4]} />

          {/* Code Editor Visual Element */}
          <View style={styles.codeEditorContainer}>
            {/* Progress bars and checkmarks */}
            <View style={styles.progressLine} />
            <View style={[styles.progressLine, styles.progressLineShort]} />
            <View style={styles.checkmarkContainer}>
              <View style={styles.checkmark} />
            </View>
            <View style={styles.progressLine} />
          </View>
        </View>

        {/* Main Heading - 2 Lines as per Figma */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>틀린 문제는</Text>
          <Text style={styles.mainHeading}>완벽하게 복습!</Text>
        </View>

        {/* Description - 3 Lines as per Figma */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>오답노트 자동 관리와</Text>
          <Text style={styles.descriptionText}>반복 학습 시스템으로</Text>
          <Text style={styles.descriptionText}>약점을 강점으로 만드세요</Text>
        </View>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.activeDot]} />
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
    transform: [{ translateX: -13.5 }], // Center align "3 / 4" text
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted, // #9CA3AF - Muted text color
    textAlign: 'center',
    lineHeight: 15,
  },

  // Decorative Elements Container
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
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
    backgroundColor: '#F8E8EE', // Pastel pink gradient approximation
    opacity: 0.8,
  },

  // Sparkle Container - Centered relative positioning
  sparkleContainer: {
    position: 'absolute',
    left: 45, // Adjusted for centered layout (140-95)
    top: 44, // Adjusted for centered layout (224-180)
    width: 124,
    height: 108,
    opacity: 0.6,
  },

  // Base Sparkle Style
  sparkle: {
    position: 'absolute',
    color: '#FFD700', // Gold color for sparkles
    fontWeight: '400',
  },

  // Sparkle 1 - x: 0, y: 0, 16px
  sparkle1: {
    left: 0,
    top: 0,
    fontSize: 16,
  },

  // Sparkle 2 - x: 110, y: 12, 14px
  sparkle2: {
    left: 110,
    top: 12,
    fontSize: 14,
  },

  // Sparkle 3 - x: 30, y: 94, 12px
  sparkle3: {
    left: 30,
    top: 94,
    fontSize: 12,
  },

  // Small Decorative Circles
  smallCircle: {
    position: 'absolute',
    borderRadius: 50,
  },

  // Small Circle 1 - Relative positioning for centered layout
  smallCircle1: {
    left: -11, // Adjusted for centered layout (84-95)
    top: 74, // Adjusted for centered layout (254-180)
    width: 12,
    height: 12,
    backgroundColor: COLORS.primaryBorder, // #FDCEDF
    opacity: 0.4,
  },

  // Small Circle 2 - Relative positioning for centered layout
  smallCircle2: {
    left: 198, // Adjusted for centered layout (293-95)
    top: 88, // Adjusted for centered layout (268-180)
    width: 14,
    height: 14,
    backgroundColor: COLORS.primary, // #F2BED1
    opacity: 0.4,
  },

  // Small Circle 3 - Relative positioning for centered layout
  smallCircle3: {
    left: 15, // Adjusted for centered layout (110-95)
    top: 130, // Adjusted for centered layout (310-180)
    width: 10,
    height: 10,
    backgroundColor: '#FF8FB3', // Accent pink
    opacity: 0.3,
  },

  // Small Circle 4 - Relative positioning for centered layout
  smallCircle4: {
    left: 174, // Adjusted for centered layout (269-95)
    top: 119, // Adjusted for centered layout (299-180)
    width: 12,
    height: 12,
    backgroundColor: '#F8E8EE', // Pastel pink
    opacity: 0.5,
  },

  // Code Editor Container - Relative positioning for centered layout
  codeEditorContainer: {
    position: 'absolute',
    left: 62, // Adjusted for centered layout (157-95)
    top: 76, // Adjusted for centered layout (256-180)
    width: 76,
    height: 54,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  // Progress Lines
  progressLine: {
    height: 2,
    backgroundColor: COLORS.primaryBorder, // #FDCEDF
    marginBottom: 4,
    borderRadius: 1,
  },

  progressLineShort: {
    width: '80%',
  },

  // Checkmark Container
  checkmarkContainer: {
    width: 16,
    height: 16,
    backgroundColor: '#10B981', // Success green
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 4,
  },

  // Checkmark
  checkmark: {
    width: 6,
    height: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: COLORS.white,
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },

  // Content Container - Main Text Area
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -80, // Adjust for visual balance
  },

  // Heading Container
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

  // Description Container
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

  // Progress Dots Container - x: 159, y: 660, 60x8
  progressDots: {
    position: 'absolute',
    bottom: 120, // Match steps 1-2 positioning
    left: '50%',
    transform: [{ translateX: -30 }], // Center 60px width
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
    height: 8,
  },

  // Individual Dot
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },

  // Inactive Dot
  inactiveDot: {
    backgroundColor: COLORS.border, // #E5E7EB - Border color
  },

  // Active Dot - Unified Primary Pink
  activeDot: {
    backgroundColor: COLORS.primary, // #F2BED1 - Unified primary pink
    width: 24, // Active dot is wider
    marginRight: 8,
  },

  // Bottom Navigation Container
  bottomNavigation: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
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
    color: COLORS.textMuted, // #9CA3AF - Muted text
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