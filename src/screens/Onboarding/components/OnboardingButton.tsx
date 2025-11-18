import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { OnboardingButtonProps } from '../Onboarding.types';
import { onboardingStyles } from '../Onboarding.styles';

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[
        variant === 'primary'
          ? onboardingStyles.primaryButton
          : onboardingStyles.secondaryButton,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          variant === 'primary'
            ? onboardingStyles.primaryButtonText
            : onboardingStyles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};