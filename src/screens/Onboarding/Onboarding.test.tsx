/**
 * Simple smoke test for Onboarding components
 * Tests that components can be imported and instantiated
 */

import React from 'react';
import { OnboardingFlow } from './OnboardingFlow';
import { OnboardingStep1Screen } from './OnboardingStep1Screen';
import { OnboardingStep2Screen } from './OnboardingStep2Screen';
import { OnboardingStep3Screen } from './OnboardingStep3Screen';
import { OnboardingStep4Screen } from './OnboardingStep4Screen';
import { StepIndicator } from './components/StepIndicator';
import { OnboardingButton } from './components/OnboardingButton';
import { CLIPrompt } from './components/CLIPrompt';

describe('Onboarding Components', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    reset: jest.fn(),
  };

  const mockProps = {
    onNext: jest.fn(),
    currentStep: 1,
    totalSteps: 4,
  };

  test('OnboardingFlow renders without crashing', () => {
    const component = (
      <OnboardingFlow
        navigation={mockNavigation}
        onComplete={jest.fn()}
      />
    );
    expect(component).toBeTruthy();
  });

  test('OnboardingStep1Screen renders without crashing', () => {
    const component = <OnboardingStep1Screen {...mockProps} />;
    expect(component).toBeTruthy();
  });

  test('OnboardingStep2Screen renders without crashing', () => {
    const component = <OnboardingStep2Screen {...mockProps} />;
    expect(component).toBeTruthy();
  });

  test('OnboardingStep3Screen renders without crashing', () => {
    const component = <OnboardingStep3Screen {...mockProps} />;
    expect(component).toBeTruthy();
  });

  test('OnboardingStep4Screen renders without crashing', () => {
    const component = <OnboardingStep4Screen {...mockProps} />;
    expect(component).toBeTruthy();
  });

  test('StepIndicator renders without crashing', () => {
    const component = (
      <StepIndicator currentStep={2} totalSteps={4} />
    );
    expect(component).toBeTruthy();
  });

  test('OnboardingButton renders without crashing', () => {
    const component = (
      <OnboardingButton
        onPress={jest.fn()}
        title="Test Button"
        variant="primary"
      />
    );
    expect(component).toBeTruthy();
  });

  test('CLIPrompt renders without crashing', () => {
    const component = (
      <CLIPrompt command="test command" delay={0} />
    );
    expect(component).toBeTruthy();
  });
});