import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { onboardingStyles } from './Onboarding.styles';
import { StepIndicator } from './components/StepIndicator';
import { OnboardingButton } from './components/OnboardingButton';
import { CLIPrompt } from './components/CLIPrompt';

// Figma 216-310 - Step 2: Learning Features
export const OnboardingStep2Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  currentStep = 2,
  totalSteps = 4,
}) => {
  return (
    <SafeAreaView style={onboardingStyles.container}>
      {/* Main Content */}
      <View style={onboardingStyles.contentContainer}>
        {/* Image/Illustration Area */}
        <View style={onboardingStyles.imageContainer}>
          <Text style={onboardingStyles.imagePlaceholder}>
            📚 학습 시스템
          </Text>
        </View>

        {/* Text Content */}
        <View style={onboardingStyles.textContainer}>
          <Text style={onboardingStyles.title}>
            체계적인 코딩 학습
          </Text>
          <Text style={onboardingStyles.description}>
            레벨별 문제 해결부터 실전 코딩까지!{'\n'}
            OX 퀴즈, 객관식, 빈칸 채우기, 디버깅, 전문가 모드까지{'\n'}
            단계적으로 실력을 향상시켜보세요.
          </Text>

          {/* CLI Themed Element */}
          <CLIPrompt
            command="dayscript learn --level=beginner"
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