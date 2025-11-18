import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { COLORS } from '../../constants/colors';
import { EnhancedNextButton } from '../../components/ui/NextButton';

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
      <View style={styles.stepIndicatorContainer}>
        <Text style={styles.stepIndicatorText}>4 / 4</Text>
      </View>

      {/* Decorative Elements - Exact Figma Positions */}
      <View style={styles.decorativeElements}>
        {/* Large Background Circle with Gradient */}
        <View style={styles.backgroundCircle} />

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

        {/* Code Editor Visual Element */}
        <View style={styles.codeEditorContainer}>
          {/* Trophy/Achievement visual */}
          <View style={styles.trophyContainer}>
            <View style={styles.trophyBase} />
            <View style={styles.trophyBody} />
            <View style={styles.trophyTop} />
          </View>
          {/* Code lines */}
          <View style={styles.codeLineContainer}>
            <View style={styles.codeLine} />
            <View style={[styles.codeLine, styles.codeLineShort]} />
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
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
      </View>

      {/* Main Action Button */}
      <View style={styles.actionButtonContainer}>
        <EnhancedNextButton
          onPress={onNext}
          title="시작하기 →"
          variant="primary"
          style={styles.startButton}
          textStyle={styles.startButtonText}
        />
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
    transform: [{ translateX: -13.5 }], // Center the "4 / 4" text (27px width / 2)
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

  // Large Background Circle - x: 95, y: 160, 200x200
  backgroundCircle: {
    position: 'absolute',
    left: 95,
    top: 160,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F8E8EE', // Pastel pink gradient approximation
    opacity: 0.8,
  },

  // Star Container - x: 100, y: 180, 196x132
  starContainer: {
    position: 'absolute',
    left: 100,
    top: 180,
    width: 196,
    height: 132,
    opacity: 0.6,
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

  // Star 2 - x: 180, y: 24, 16px
  star2: {
    left: 180,
    top: 24,
    fontSize: 16,
  },

  // Star 3 - x: 30, y: 116, 14px
  star3: {
    left: 30,
    top: 116,
    fontSize: 14,
  },

  // Star 4 - x: 160, y: 102, 18px
  star4: {
    left: 160,
    top: 102,
    fontSize: 18,
  },

  // Small Decorative Circles
  smallCircle: {
    position: 'absolute',
    borderRadius: 50,
  },

  // Small Circle 1 - x: 80, y: 235, 10x10
  smallCircle1: {
    left: 80,
    top: 235,
    width: 10,
    height: 10,
    backgroundColor: COLORS.primaryBorder, // #FDCEDF
    opacity: 0.4,
  },

  // Small Circle 2 - x: 299, y: 254, 12x12
  smallCircle2: {
    left: 299,
    top: 254,
    width: 12,
    height: 12,
    backgroundColor: COLORS.primary, // #F2BED1
    opacity: 0.4,
  },

  // Small Circle 3 - x: 106, y: 296, 8x8
  smallCircle3: {
    left: 106,
    top: 296,
    width: 8,
    height: 8,
    backgroundColor: '#FF8FB3', // Accent pink
    opacity: 0.3,
  },

  // Code Editor Container - x: 160, y: 210, 70x113
  codeEditorContainer: {
    position: 'absolute',
    left: 160,
    top: 210,
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

  // Action Button Container - x: 75, y: 590, 240x56
  actionButtonContainer: {
    position: 'absolute',
    left: 75,
    top: 590,
    width: 240,
    height: 56,
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

  // Progress Dots Container - x: 159, y: 696, 60x8
  progressDots: {
    position: 'absolute',
    left: 159,
    top: 696,
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
    marginRight: 0,
  },

  // Bottom Text Container - x: 89.5, y: 759, 211x13
  bottomTextContainer: {
    position: 'absolute',
    left: 89.5,
    top: 759,
    width: 211,
    height: 13,
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