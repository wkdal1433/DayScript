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
      <View style={styles.stepIndicatorContainer}>
        <Text style={styles.stepIndicatorText}>3 / 4</Text>
      </View>

      {/* Decorative Elements - Exact Figma Positions */}
      <View style={styles.decorativeElements}>
        {/* Large Background Circle with Gradient */}
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

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
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
  // Main Container - 390x844 Frame
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // #F9F5F6 - Unified design system
    width: '100%',
    height: '100%',
  },

  // Step Indicator Container - Top Center
  stepIndicatorContainer: {
    position: 'absolute',
    top: 48, // y: 48 from Figma
    left: '50%',
    transform: [{ translateX: -13.5 }], // Center the "3 / 4" text (27px width / 2)
    zIndex: 10,
  },

  // Step Indicator Text - Inter Bold 12px
  stepIndicatorText: {
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

  // Large Background Circle - x: 95, y: 180, 200x200
  backgroundCircle: {
    position: 'absolute',
    left: 95,
    top: 180,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F8E8EE', // Pastel pink gradient approximation
    opacity: 0.8,
  },

  // Sparkle Container - x: 140, y: 224, 124x108
  sparkleContainer: {
    position: 'absolute',
    left: 140,
    top: 224,
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

  // Small Circle 1 - x: 84, y: 254, 12x12
  smallCircle1: {
    left: 84,
    top: 254,
    width: 12,
    height: 12,
    backgroundColor: COLORS.primaryBorder, // #FDCEDF
    opacity: 0.4,
  },

  // Small Circle 2 - x: 293, y: 268, 14x14
  smallCircle2: {
    left: 293,
    top: 268,
    width: 14,
    height: 14,
    backgroundColor: COLORS.primary, // #F2BED1
    opacity: 0.4,
  },

  // Small Circle 3 - x: 110, y: 310, 10x10
  smallCircle3: {
    left: 110,
    top: 310,
    width: 10,
    height: 10,
    backgroundColor: '#FF8FB3', // Accent pink
    opacity: 0.3,
  },

  // Small Circle 4 - x: 269, y: 299, 12x12
  smallCircle4: {
    left: 269,
    top: 299,
    width: 12,
    height: 12,
    backgroundColor: '#F8E8EE', // Pastel pink
    opacity: 0.5,
  },

  // Code Editor Container - x: 157, y: 256, 76x54
  codeEditorContainer: {
    position: 'absolute',
    left: 157,
    top: 256,
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
    left: 159,
    top: 660,
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

  // Active Dot - Pink Gradient Approximation
  activeDot: {
    backgroundColor: '#FF8FB3', // Active dot - gradient pink
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

  // Next Button - Right Side with Pink Gradient Background
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowRadius: 12, // blur(12px) from Figma
  },

  // Next Text - Inter Bold 14px, White
  nextText: {
    fontSize: 14,
    lineHeight: 17,
  },
});