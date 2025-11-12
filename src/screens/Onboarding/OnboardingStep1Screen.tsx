import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { onboardingStyles } from './Onboarding.styles';
import { StepIndicator } from './components/StepIndicator';
import { OnboardingButton } from './components/OnboardingButton';
import { CLIPrompt } from './components/CLIPrompt';

// Figma 216-193 - Step 1: App Introduction
export const OnboardingStep1Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  currentStep = 1,
  totalSteps = 4,
}) => {
  return (
    <SafeAreaView style={onboardingStyles.container}>
      {/* Main Content */}
      <View style={onboardingStyles.contentContainer}>
        {/* Image/Illustration Area */}
        <View style={onboardingStyles.imageContainer}>
          <Text style={onboardingStyles.imagePlaceholder}>
            📱 DayScript
          </Text>
        </View>

        {/* Text Content */}
        <View style={onboardingStyles.textContainer}>
          <Text style={onboardingStyles.title}>
            DayScript에 오신 것을 환영합니다!
          </Text>
          <Text style={onboardingStyles.description}>
            개발자를 위한 스마트한 코딩 학습 플랫폼입니다.{'\n'}
            터미널과 코드 에디터의 경험을 모바일로 가져왔어요.
          </Text>

          {/* CLI Themed Element */}
          <CLIPrompt
            command="welcome --to=DayScript"
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
            title="시작하기"
            variant="primary"
          />

          <OnboardingButton
            onPress={onNext} // Skip to next for now
            title="건너뛰기"
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};