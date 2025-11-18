import React, { useState, useRef } from 'react';
import { ScrollView, Dimensions } from 'react-native';
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
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: screenWidth } = Dimensions.get('window');

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Scroll to next screen
      scrollViewRef.current?.scrollTo({
        x: (nextStep - 1) * screenWidth,
        animated: true,
      });
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

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      // Scroll to previous screen
      scrollViewRef.current?.scrollTo({
        x: (prevStep - 1) * screenWidth,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newStep = Math.round(offsetX / screenWidth) + 1;

    if (newStep !== currentStep && newStep >= 1 && newStep <= totalSteps) {
      setCurrentStep(newStep);
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

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onMomentumScrollEnd={handleScroll}
      contentContainerStyle={{ width: screenWidth * totalSteps }}
    >
      {/* Step 1 */}
      <OnboardingStep1Screen
        onNext={handleNext}
        onSkip={handleSkip}
        currentStep={1}
        totalSteps={totalSteps}
        style={{ width: screenWidth }}
      />

      {/* Step 2 */}
      <OnboardingStep2Screen
        onNext={handleNext}
        onSkip={handleSkip}
        currentStep={2}
        totalSteps={totalSteps}
        style={{ width: screenWidth }}
      />

      {/* Step 3 */}
      <OnboardingStep3Screen
        onNext={handleNext}
        onSkip={handleSkip}
        currentStep={3}
        totalSteps={totalSteps}
        style={{ width: screenWidth }}
      />

      {/* Step 4 */}
      <OnboardingStep4Screen
        onNext={handleNext}
        onSkip={handleSkip}
        currentStep={4}
        totalSteps={totalSteps}
        style={{ width: screenWidth }}
      />
    </ScrollView>
  );
};