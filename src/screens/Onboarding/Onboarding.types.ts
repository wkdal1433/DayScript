export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  imagePlaceholder: string;
  buttonText: string;
}

export interface OnboardingStepScreenProps {
  onNext: () => void;
  onSkip?: () => void;
  currentStep: number;
  totalSteps: number;
}

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export interface OnboardingButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
}

export type OnboardingNavigationProp = {
  navigate: (screen: string) => void;
  reset: (config: any) => void;
};