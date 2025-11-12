import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { onboardingStyles } from './Onboarding.styles';
import { StepIndicator } from './components/StepIndicator';
import { OnboardingButton } from './components/OnboardingButton';
import { CLIPrompt } from './components/CLIPrompt';

// Figma 216-264 - Step 3: Progress Tracking
export const OnboardingStep3Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  currentStep = 3,
  totalSteps = 4,
}) => {
  return (
    <SafeAreaView style={onboardingStyles.container}>
      {/* Main Content */}
      <View style={onboardingStyles.contentContainer}>
        {/* Image/Illustration Area */}
        <View style={onboardingStyles.imageContainer}>
          <Text style={onboardingStyles.imagePlaceholder}>
            📊 진도 관리
          </Text>
        </View>

        {/* Text Content */}
        <View style={onboardingStyles.textContainer}>
          <Text style={onboardingStyles.title}>
            나만의 학습 진도 관리
          </Text>
          <Text style={onboardingStyles.description}>
            일일 목표 설정과 학습 진도를 체계적으로 추적하세요.{'\n'}
            랭킹 시스템으로 다른 개발자들과 경쟁하며{'\n'}
            꾸준한 성장을 이어가보세요.
          </Text>

          {/* CLI Themed Element */}
          <CLIPrompt
            command="dayscript progress --show-stats"
            delay={500}
          />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={onboardingStyles.bottomContainer}>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <View style={onboardingStyles.buttonContainer}>
          <OnboardingButton
            onPress={onNext}
            title="다음"
            variant="primary"
          />

          <OnboardingButton
            onPress={onNext}
            title="건너뛰기"
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};