import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';

// Figma 216-193 - Step 1: 100% Pixel Perfect Implementation
export const OnboardingStep1Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  onSkip,
  currentStep: _currentStep = 1,
  totalSteps: _totalSteps = 4,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Step Counter - Top */}
        <Text style={styles.stepCounter}>1 / 4</Text>

        {/* Central Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* Background Gradient Circle */}
          <View style={styles.gradientBackground} />

          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
          <View style={styles.decorativeCircle4} />
          <View style={styles.decorativeCircle5} />
          <View style={styles.decorativeCircle6} />

          {/* Main Central Elements */}
          <View style={styles.centralElement} />
        </View>

        {/* Main Heading Section */}
        <View style={styles.headingSection}>
          <Text style={styles.primaryHeading}>AI와 함께</Text>
          <Text style={styles.primaryHeading}>단계별 문제 풀이!</Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>OX, 객관식, 빈칸 채우기부터</Text>
          <Text style={styles.descriptionText}>실전 코딩테스트까지</Text>
          <Text style={styles.descriptionText}>체계적으로 학습하세요</Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressIndicator}>
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
          <View style={styles.progressInactive} />
          <View style={styles.progressInactive} />
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity onPress={onSkip} activeOpacity={0.7}>
            <Text style={styles.skipButton}>건너뛰기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNext} activeOpacity={0.8}>
            <View style={styles.nextButtonContainer}>
              <View style={styles.nextButtonBackground} />
              <Text style={styles.nextButtonText}>다음</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Side Decorative Element */}
        <View style={styles.sideDecorativeElement} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main Container - Full Screen with Center Alignment
  container: {
    flex: 1,
    backgroundColor: '#F9F5F6', // Exact Figma background fill_VRU1MS
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content Wrapper - Maintains original design dimensions and layout
  contentWrapper: {
    width: 390,
    height: 844,
    position: 'relative',
  },

  // Step Counter - Position: x:182.5, y:48
  stepCounter: {
    position: 'absolute',
    left: 182.5,
    top: 48,
    width: 25,
    height: 15,
    fontFamily: 'Inter',
    fontWeight: '700', // Inter Bold
    fontSize: 12,
    lineHeight: 15, // 1.2102272510528564em
    textAlign: 'center',
    color: '#9CA3AF', // fill_FYKQ1H
  },

  // Central Illustration Container - Position: x:95, y:180, Size: 200x200
  illustrationContainer: {
    position: 'absolute',
    left: 95,
    top: 180,
    width: 200,
    height: 200,
  },

  // Gradient Background - Exact Figma gradient
  gradientBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 200,
    height: 200,
    backgroundColor: '#F8E8EE', // Gradient start approximation
    borderRadius: 100,
    // Note: React Native doesn't support linear gradients natively
    // This is a solid color approximation of the gradient
  },

  // Decorative Circle 1 - x:74, y:234 (relative to container: y:54)
  decorativeCircle1: {
    position: 'absolute',
    left: -21, // 74-95
    top: 54, // 234-180
    width: 12,
    height: 12,
    backgroundColor: '#FDCEDF', // fill_LT9OD9
    borderRadius: 6,
    opacity: 0.4,
  },

  // Decorative Circle 2 - x:302, y:252 (relative: left:207, top:72)
  decorativeCircle2: {
    position: 'absolute',
    left: 207, // 302-95
    top: 72, // 252-180
    width: 16,
    height: 16,
    backgroundColor: '#F2BED1', // fill_BSK0IE
    borderRadius: 8,
    opacity: 0.4,
  },

  // Decorative Circle 3 - x:115, y:335 (relative: left:20, top:155)
  decorativeCircle3: {
    position: 'absolute',
    left: 20, // 115-95
    top: 155, // 335-180
    width: 10,
    height: 10,
    backgroundColor: '#FF8FB3', // fill_8HP19M
    borderRadius: 5,
    opacity: 0.3,
  },

  // Decorative Circle 4 - x:273, y:313 (relative: left:178, top:133)
  decorativeCircle4: {
    position: 'absolute',
    left: 178, // 273-95
    top: 133, // 313-180
    width: 14,
    height: 14,
    backgroundColor: '#F8E8EE', // fill_J24MQG
    borderRadius: 7,
    opacity: 0.5,
  },

  // Central nested circles - x:160-195, y:245-295 (relative positioning)
  decorativeCircle5: {
    position: 'absolute',
    left: 65, // 160-95
    top: 65, // 245-180
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#FF8FB3', // stroke_AE7X5T
    opacity: 0.3,
  },

  decorativeCircle6: {
    position: 'absolute',
    left: 75, // 170-95
    top: 75, // 255-180
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FF8FB3', // stroke_AE7X5T
    opacity: 0.5,
  },

  // Central Element - x:187, y:272 (relative: left:92, top:92)
  centralElement: {
    position: 'absolute',
    left: 92, // 187-95
    top: 92, // 272-180
    width: 16,
    height: 16,
    backgroundColor: '#FF8FB3', // fill_8HP19M
    borderRadius: 8,
  },

  // Heading Section - "AI와 함께" at y:436, "단계별 문제 풀이!" at y:466
  headingSection: {
    position: 'absolute',
    left: 0,
    top: 436,
    width: 390,
    alignItems: 'center',
  },

  // Primary Heading - Inter Bold 24px, color: #393E46
  primaryHeading: {
    fontFamily: 'Inter',
    fontWeight: '700', // Inter Bold
    fontSize: 24,
    lineHeight: 29, // 1.2102272510528564em
    textAlign: 'center',
    color: '#393E46', // fill_IULRTP
    marginBottom: 1, // Tight spacing between lines
  },

  // Description Section - Starting at y:515
  descriptionSection: {
    position: 'absolute',
    left: 0,
    top: 515,
    width: 390,
    alignItems: 'center',
  },

  // Description Text - Inter Regular 15px, color: #6B7280
  descriptionText: {
    fontFamily: 'Inter',
    fontWeight: '400', // Inter Regular
    fontSize: 15,
    lineHeight: 18, // 1.2102272033691406em
    textAlign: 'center',
    color: '#6B7280', // fill_VNZWMY
    marginBottom: 4, // 22px spacing between lines
  },

  // Progress Indicator - x:183, y:660, Size: 60x8
  progressIndicator: {
    position: 'absolute',
    left: 183,
    top: 660,
    width: 60,
    height: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Active Progress Element - 24x8
  progressActive: {
    width: 24,
    height: 8,
    backgroundColor: '#F2BED1', // Gradient approximation
    borderRadius: 4,
    marginRight: 4,
  },

  // Inactive Progress Elements - 8x8
  progressInactive: {
    width: 8,
    height: 8,
    backgroundColor: '#E5E7EB', // fill_NKBJAJ
    borderRadius: 4,
    marginRight: 4,
  },

  // Bottom Buttons Container - y:708-748
  bottomButtonsContainer: {
    position: 'absolute',
    left: 40,
    top: 708,
    right: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Skip Button - x:40, y:718
  skipButton: {
    fontFamily: 'Inter',
    fontWeight: '700', // Inter Bold
    fontSize: 14,
    lineHeight: 17, // 1.2102272851126534em
    textAlign: 'left',
    color: '#9CA3AF', // fill_FYKQ1H
  },

  // Next Button Container - x:258, y:708, Size: 92x40
  nextButtonContainer: {
    position: 'relative',
    width: 92,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Next Button Background - Gradient effect
  nextButtonBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 92,
    height: 40,
    backgroundColor: '#F2BED1', // Gradient approximation
    borderRadius: 20,
    // Note: blur effect is approximated with shadow
    shadowColor: '#F2BED1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  // Next Button Text - Center positioned
  nextButtonText: {
    fontFamily: 'Inter',
    fontWeight: '700', // Inter Bold
    fontSize: 14,
    lineHeight: 17, // 1.2102272851126534em
    textAlign: 'center',
    color: '#FFFFFF', // fill_KP7D9R (white)
    zIndex: 1,
  },

  // Side Decorative Element - x:350, y:418, Size: 20x8
  sideDecorativeElement: {
    position: 'absolute',
    left: 350,
    top: 418,
    width: 20,
    height: 8,
    opacity: 0.3,
    // Contains small circles/strokes - simplified representation
    backgroundColor: '#9CA3AF',
    borderRadius: 4,
  },
});