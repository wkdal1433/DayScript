import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { COLORS } from '../../constants/colors';
import { EnhancedNextButton } from '../../components/ui/NextButton';
import { AppLogo } from '../../components/common/ui/AppLogo';

// Figma 216-222 - Step 4: Final Get Started Screen - 100% Pixel Perfect
export const OnboardingStep4Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  onSkip,
  currentStep = 4,
  totalSteps = 4,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {/* Step Indicator - Top Center */}
      <Text style={styles.stepIndicatorText}>4 / 4</Text>

      {/* Main Content Container - Perfect Center Alignment */}
      <View style={styles.mainContentContainer}>
        {/* Central Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* DayScript Logo - Main Central Element */}
          <View style={styles.logoContainer}>
            <AppLogo size={200} />
          </View>

          {/* Star Elements - ⭐ */}
          <View style={styles.starContainer}>
            <Text style={[styles.star, styles.star1]}>⭐</Text>
            <Text style={[styles.star, styles.star2]}>⭐</Text>
            <Text style={[styles.star, styles.star3]}>⭐</Text>
            <Text style={[styles.star, styles.star4]}>⭐</Text>
          </View>

          {/* Small Decorative Circles */}
          <View style={[styles.smallCircle, styles.smallCircle1]} />
          <View style={[styles.smallCircle, styles.smallCircle2]} />
          <View style={[styles.smallCircle, styles.smallCircle3]} />
        </View>

        {/* Main Heading - 2 Lines as per Figma */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainHeading}>지금 바로</Text>
          <Text style={styles.mainHeading}>시작해볼까요?</Text>
        </View>

        {/* Description - 3 Lines as per Figma */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>레벨 1부터 차근차근</Text>
          <Text style={styles.descriptionText}>당신만의 속도로</Text>
          <Text style={styles.descriptionText}>성장해나가세요!</Text>
        </View>

        {/* Main Action Button - Centered */}
        <View style={styles.actionButtonContainer}>
          <EnhancedNextButton
            onPress={onNext}
            title="카카오로 바로 시작하기"
            variant="primary"
            style={styles.startButton}
            textStyle={styles.startButtonText}
          />
        </View>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressDots}>
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Bottom Help Text */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.helpText}>언제든 설정에서 튜토리얼을 다시 볼 수 있어요</Text>
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
    marginTop: -40, // Fine-tune vertical positioning for Step 4
  },

  // Step Indicator Text - Top Center Position
  stepIndicatorText: {
    position: 'absolute',
    top: 48,
    left: '50%',
    transform: [{ translateX: -13.5 }], // Center align "4 / 4" text
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
    width: 250,
    height: 250,
    marginBottom: 40,
    position: 'relative',
  },

  // Logo Container - Centered positioning
  logoContainer: {
    position: 'absolute',
    left: 25, // Center the 200px logo within 250px container
    top: 25,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999, // Highest z-index to ensure logo is always on top
  },

  // Star Container - Relative positioning for centered layout
  starContainer: {
    position: 'absolute',
    left: 0, // Adjusted for larger container
    top: 25, // Adjusted for larger container
    width: 246,
    height: 162,
    opacity: 0.6,
    zIndex: 1, // Below logo
  },

  // Base Star Style
  star: {
    position: 'absolute',
    color: '#FFD700', // Gold color for stars
    fontWeight: '400',
  },

  // Star 1 - x: 0, y: 0, 20px
  star1: {
    left: 0,
    top: 0,
    fontSize: 20,
  },

  // Star 2 - x: 230, y: 24, 16px
  star2: {
    left: 230,
    top: 24,
    fontSize: 16,
  },

  // Star 3 - x: 30, y: 146, 14px
  star3: {
    left: 30,
    top: 146,
    fontSize: 14,
  },

  // Star 4 - x: 210, y: 132, 18px
  star4: {
    left: 210,
    top: 132,
    fontSize: 18,
  },

  // Small Decorative Circles
  smallCircle: {
    position: 'absolute',
    borderRadius: 50,
  },

  // Small Circle 1 - Relative positioning for centered layout
  smallCircle1: {
    left: -10, // Adjusted for larger container
    top: 95, // Adjusted for larger container
    width: 10,
    height: 10,
    backgroundColor: COLORS.primaryBorder, // #FDCEDF
    opacity: 0.4,
  },

  // Small Circle 2 - Relative positioning for centered layout
  smallCircle2: {
    left: 254, // Adjusted for larger container
    top: 114, // Adjusted for larger container
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary, // #F2BED1
    opacity: 0.4,
  },

  // Small Circle 3 - Relative positioning for centered layout
  smallCircle3: {
    left: 16, // Adjusted for larger container
    top: 176, // Adjusted for larger container
    width: 8,
    height: 8,
    backgroundColor: '#FF8FB3', // Accent pink
    opacity: 0.3,
  },

  // Code Editor Container - Relative positioning for centered layout
  codeEditorContainer: {
    position: 'absolute',
    left: 65, // Adjusted for centered layout (160-95)
    top: 50, // Adjusted for centered layout (210-160)
    width: 70,
    height: 113,
    opacity: 0.3,
  },

  // Trophy Container
  trophyContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },

  trophyBase: {
    width: 40,
    height: 15,
    backgroundColor: '#FF8FB3',
    borderRadius: 2,
  },

  trophyBody: {
    width: 40,
    height: 70,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    marginTop: -2,
  },

  trophyTop: {
    width: 20,
    height: 20,
    backgroundColor: '#E0F2FE',
    borderRadius: 10,
    marginTop: -35,
    zIndex: 1,
  },

  // Code Line Container
  codeLineContainer: {
    width: '100%',
  },

  // Code Lines
  codeLine: {
    height: 3,
    backgroundColor: COLORS.primaryBorder, // #FDCEDF
    marginBottom: 2,
    borderRadius: 1,
  },

  codeLineShort: {
    width: '80%',
  },

  // Content Container - Main Text Area
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -50, // Adjust for visual balance
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

  // Action Button Container - Centered in main content
  actionButtonContainer: {
    marginTop: 30,
    width: 280, // Increased width to accommodate longer text
    height: 56,
    alignItems: 'center',
  },

  // Start Button - Enhanced styling for EnhancedNextButton
  startButton: {
    width: '100%',
    height: '100%',
    borderRadius: 28, // Half of height for rounded shape
  },

  // Start Button Text - Enhanced text styling
  startButtonText: {
    fontSize: 18,
    lineHeight: 22, // 1.21 line height from Figma
  },

  // Progress Dots Container - Consistent with Step 1-2 positioning
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
    marginRight: 0,
  },

  // Bottom Text Container - Centered between progress dots and bottom
  bottomTextContainer: {
    position: 'absolute',
    bottom: 60, // Positioned halfway between progress dots (120) and screen bottom (0)
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Help Text - Inter Regular 11px
  helpText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.textMuted, // #9CA3AF - Muted text
    textAlign: 'center',
    lineHeight: 13, // 1.21 line height from Figma
  },
});