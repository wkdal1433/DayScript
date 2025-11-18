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
      <View style={styles.stepIndicatorContainer}>
        <Text style={styles.stepIndicatorText}>2 / 4</Text>
      </View>

      {/* Decorative Elements - Exact Figma Positions */}
      <View style={styles.decorativeElements}>
        {/* Large Background Circle with Gradient */}
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

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
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
    transform: [{ translateX: -13 }], // Center the "2 / 4" text (26px width / 2)
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
    backgroundColor: '#F8E8EE', // Linear gradient approximation
    opacity: 0.8,
  },

  // Small Decorative Circles
  smallCircle: {
    position: 'absolute',
    borderRadius: 50,
  },

  // Small Circle 1 - x: 80, y: 245, 10x10
  smallCircle1: {
    left: 80,
    top: 245,
    width: 10,
    height: 10,
    backgroundColor: '#FDCEDF',
    opacity: 0.4,
  },

  // Small Circle 2 - x: 298, y: 263, 14x14
  smallCircle2: {
    left: 298,
    top: 263,
    width: 14,
    height: 14,
    backgroundColor: '#F2BED1',
    opacity: 0.4,
  },

  // Small Circle 3 - x: 114, y: 314, 12x12
  smallCircle3: {
    left: 114,
    top: 314,
    width: 12,
    height: 12,
    backgroundColor: '#FF8FB3',
    opacity: 0.3,
  },

  // Small Circle 4 - x: 265, y: 305, 10x10
  smallCircle4: {
    left: 265,
    top: 305,
    width: 10,
    height: 10,
    backgroundColor: '#F8E8EE',
    opacity: 0.5,
  },

  // Code Editor Container - x: 170, y: 240, 50x103
  codeEditorContainer: {
    position: 'absolute',
    left: 170,
    top: 240,
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

  // Progress Dots Container - x: 159, y: 660, 72x8
  progressDots: {
    position: 'absolute',
    left: 159,
    top: 660,
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

  // Active Dot - Pink Gradient Approximation
  activeDot: {
    backgroundColor: '#FF8FB3', // Gradient center color
    width: 24, // Active dot is wider
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
    color: COLORS.textMuted, // #9CA3AF - Muted text color
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