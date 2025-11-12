import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { OnboardingStepScreenProps } from './Onboarding.types';
import { onboardingStyles } from './Onboarding.styles';
import { StepIndicator } from './components/StepIndicator';
import { OnboardingButton } from './components/OnboardingButton';
import { CLIPrompt } from './components/CLIPrompt';

// Figma 216-222 - Step 4: Get Started
export const OnboardingStep4Screen: React.FC<OnboardingStepScreenProps> = ({
  onNext,
  currentStep = 4,
  totalSteps = 4,
}) => {
  return (
    <SafeAreaView style={onboardingStyles.container}>
      {/* Main Content */}
      <View style={onboardingStyles.contentContainer}>
        {/* Image/Illustration Area */}
        <View style={onboardingStyles.imageContainer}>
          <Text style={onboardingStyles.imagePlaceholder}>
            🚀 준비 완료!
          </Text>
        </View>

        {/* Text Content */}
        <View style={onboardingStyles.textContainer}>
          <Text style={onboardingStyles.title}>
            이제 시작할 준비가 되었습니다!
          </Text>
          <Text style={onboardingStyles.description}>
            터미널에서 시작하는 코딩 여정에 함께해보세요.{'\n'}
            DayScript와 함께 매일 조금씩 성장하는{'\n'}
            개발자가 되어보세요!
          </Text>

          {/* CLI Themed Element */}
          <CLIPrompt
            command="dayscript start --journey=begin"
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
            onPress={onNext} // This should navigate to main app
            title="DayScript 시작하기"
            variant="primary"
          />

          <OnboardingButton
            onPress={onNext}
            title="나중에"
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};