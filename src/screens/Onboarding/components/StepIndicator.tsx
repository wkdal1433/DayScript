import React from 'react';
import { View } from 'react-native';
import { StepIndicatorProps } from '../Onboarding.types';
import { onboardingStyles } from '../Onboarding.styles';

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={onboardingStyles.indicatorContainer}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            onboardingStyles.indicatorDot,
            index + 1 <= currentStep
              ? onboardingStyles.indicatorDotActive
              : onboardingStyles.indicatorDotInactive,
          ]}
        />
      ))}
    </View>
  );
};