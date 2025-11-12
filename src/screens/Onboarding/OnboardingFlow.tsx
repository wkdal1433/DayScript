import React, { useState } from 'react';
import { OnboardingStep1Screen } from './OnboardingStep1Screen';
import { OnboardingStep2Screen } from './OnboardingStep2Screen';
import { OnboardingStep3Screen } from './OnboardingStep3Screen';
import { OnboardingStep4Screen } from './OnboardingStep4Screen';
import { OnboardingNavigationProp } from './Onboarding.types';

interface OnboardingFlowProps {
  navigation: OnboardingNavigationProp;
  onComplete?: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  navigation,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to main app (Home screen)
      if (onComplete) {
        onComplete();
      } else {
        // Reset navigation stack to Home
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    }
  };

  const handleSkip = () => {
    // Skip to main app immediately
    if (onComplete) {
      onComplete();
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };

  const renderCurrentStep = () => {
    const commonProps = {
      onNext: handleNext,
      onSkip: handleSkip,
      currentStep,
      totalSteps,
    };

    switch (currentStep) {
      case 1:
        return <OnboardingStep1Screen {...commonProps} />;
      case 2:
        return <OnboardingStep2Screen {...commonProps} />;
      case 3:
        return <OnboardingStep3Screen {...commonProps} />;
      case 4:
        return <OnboardingStep4Screen {...commonProps} />;
      default:
        return <OnboardingStep1Screen {...commonProps} />;
    }
  };

  return renderCurrentStep();
};