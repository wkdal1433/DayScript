import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { StepIndicator } from './components/StepIndicator';
import { OnboardingButton } from './components/OnboardingButton';
import { CLIPrompt } from './components/CLIPrompt';

// Figma 216-264 - Step 3: Progress Tracking - Pixel Perfect
export const OnboardingStep3Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  onSkip,
  currentStep = 3,
  totalSteps = 4,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Main Content - Frame dimensions: 390x844 */}
      <View style={styles.contentFrame}>
        {/* Hero Image Area - Rectangle 42: 358x280 */}
        <View style={styles.heroImageContainer}>
          <Text style={styles.chartEmoji}>📊</Text>
          <Text style={styles.progressLabel}>진도 관리</Text>
        </View>

        {/* Text Content Area */}
        <View style={styles.textContentContainer}>
          {/* Main Heading - Inter SemiBold 24px */}
          <Text style={styles.mainHeading}>
            나만의 학습 진도 관리 🏆
          </Text>

          {/* Description - Inter Regular 16px */}
          <Text style={styles.description}>
            일일 목표 설정과 학습 진도를 체계적으로 추적하세요.
          </Text>

          {/* Feature List */}
          <View style={styles.featureList}>
            <Text style={styles.featureText}>
              🎆 랭킹 시스템으로 다른 개발자들과 경쟁
            </Text>
            <Text style={styles.featureText}>
              📝 꾸준한 성장을 이어가보세요
            </Text>
          </View>

          {/* CLI Prompt Element */}
          <CLIPrompt
            command="dayscript progress --show-stats"
            delay={500}
          />
        </View>
      </View>

      {/* Bottom Navigation Area */}
      <View style={styles.bottomNavigationContainer}>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <View style={styles.buttonArea}>
          <OnboardingButton
            onPress={onNext}
            title="다음"
            variant="primary"
          />

          <OnboardingButton
            onPress={onSkip || onNext}
            title="건너뛰기"
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main Container - 390x844 Frame
  container: {
    flex: 1,
    backgroundColor: '#F9F5F6', // Background color from Figma
    width: '100%',
    height: '100%',
  },

  // Content Frame - matches Figma layout structure
  contentFrame: {
    flex: 1,
    paddingHorizontal: 16, // 16px side margins
    paddingTop: 60,
    paddingBottom: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero Image Container - Rectangle 42: 358x280
  heroImageContainer: {
    width: 358,
    height: 280,
    backgroundColor: '#F2BED1', // Primary light color
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#E8A5C1',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Chart Emoji - 48px
  chartEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },

  // Progress Label - Inter Medium 18px
  progressLabel: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '500',
    color: '#393E46',
    textAlign: 'center',
  },

  // Text Content Container
  textContentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // Main Heading - Inter SemiBold 24px
  mainHeading: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    color: '#393E46',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 20,
    letterSpacing: -0.5,
  },

  // Description Text - Inter Regular 16px
  description: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#6D7580',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },

  // Feature List Container
  featureList: {
    alignItems: 'center',
    marginBottom: 32,
  },

  // Feature Text - Inter Regular 16px with emoji icons
  featureText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#6D7580',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },

  // Bottom Navigation Container
  bottomNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F9F5F6',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },

  // Button Area
  buttonArea: {
    width: '100%',
  },
});