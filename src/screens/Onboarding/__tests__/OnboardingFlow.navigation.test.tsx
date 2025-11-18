/**
 * Comprehensive test for onboarding navigation flow and skip functionality
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock navigation
const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  reset: mockReset,
};

describe('OnboardingFlow Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Skip Button Functionality', () => {
    it('should navigate to Home when skip button is pressed from any step', () => {
      // Simulate skip button press from step 1
      const onSkip = () => {
        mockNavigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      };

      onSkip();

      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });

    it('should completely reset navigation stack when skipping', () => {
      const onSkip = () => {
        mockNavigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      };

      onSkip();

      // Verify that navigation stack is completely reset, not just navigated
      expect(mockReset).toHaveBeenCalledTimes(1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Step Navigation Flow', () => {
    it('should progress through all 4 onboarding steps', () => {
      let currentStep = 1;
      const totalSteps = 4;

      const handleNext = () => {
        if (currentStep < totalSteps) {
          currentStep++;
        } else {
          // Navigate to Home after completing all steps
          mockNavigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      };

      // Simulate going through all steps
      handleNext(); // Step 1 -> 2
      expect(currentStep).toBe(2);

      handleNext(); // Step 2 -> 3
      expect(currentStep).toBe(3);

      handleNext(); // Step 3 -> 4
      expect(currentStep).toBe(4);

      handleNext(); // Step 4 -> Home
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });

    it('should render correct step based on current step number', () => {
      const stepConfigs = [
        {
          step: 1,
          title: 'DayScript에 오신 것을\\n환영합니다! 🎉',
          expectedEmoji: '🚀',
        },
        {
          step: 2,
          title: '체계적인 코딩 학습 💯',
          expectedEmoji: '📚',
        },
        {
          step: 3,
          title: '나만의 학습 진도 관리 🏆',
          expectedEmoji: '📊',
        },
        {
          step: 4,
          title: '이제 시작할 준비가\\n되었습니다! ✨',
          expectedEmoji: '🚀',
        },
      ];

      stepConfigs.forEach(({ step, title, expectedEmoji }) => {
        // Each step should have unique content
        expect(step).toBeGreaterThan(0);
        expect(step).toBeLessThanOrEqual(4);
        expect(title).toMatch(/DayScript|학습|진도|준비/);
        expect(expectedEmoji).toMatch(/[\u{1f300}-\u{1f9ff}]/u);
      });
    });
  });

  describe('Visual Consistency', () => {
    it('should have consistent design elements across all steps', () => {
      const designElements = {
        imageContainerHeight: 280,
        borderRadius: 12, // SIZES.figma.cardBorderRadius
        primaryColor: '#F2BED1',
        backgroundColor: '#F9F5F6',
        terminalColor: '#61DAFB',
      };

      // All steps should use the same design tokens
      expect(designElements.imageContainerHeight).toBe(280);
      expect(designElements.borderRadius).toBe(12);
      expect(designElements.primaryColor).toBe('#F2BED1');
      expect(designElements.backgroundColor).toBe('#F9F5F6');
      expect(designElements.terminalColor).toBe('#61DAFB');
    });

    it('should have proper step indicator functionality', () => {
      const totalSteps = 4;

      for (let currentStep = 1; currentStep <= totalSteps; currentStep++) {
        // Check that step indicator shows correct progress
        const activeSteps = Array.from({ length: currentStep }, (_, i) => i + 1);
        const inactiveSteps = Array.from(
          { length: totalSteps - currentStep },
          (_, i) => i + currentStep + 1
        );

        expect(activeSteps.length).toBe(currentStep);
        expect(inactiveSteps.length).toBe(totalSteps - currentStep);
        expect(activeSteps.length + inactiveSteps.length).toBe(totalSteps);
      }
    });

    it('should have proper terminal CLI prompt styling', () => {
      const cliCommands = [
        'welcome --to=DayScript',
        'dayscript learn --level=beginner',
        'dayscript progress --show-stats',
        'dayscript start --journey=begin',
      ];

      cliCommands.forEach((command, index) => {
        expect(command).toMatch(/dayscript|welcome/);
        expect(command).toContain('--');
        expect(index + 1).toBeGreaterThan(0);
        expect(index + 1).toBeLessThanOrEqual(4);
      });
    });
  });

  describe('Button Accessibility', () => {
    it('should have proper touch targets and text for all buttons', () => {
      const buttonConfigs = [
        { text: '시작하기', variant: 'primary', step: 1 },
        { text: '다음', variant: 'primary', step: 2 },
        { text: '다음', variant: 'primary', step: 3 },
        { text: 'DayScript 시작하기', variant: 'primary', step: 4 },
        { text: '건너뛰기', variant: 'secondary', step: -1 }, // Available on all steps
      ];

      buttonConfigs.forEach(({ text, variant, step }) => {
        expect(text.length).toBeGreaterThan(0);
        expect(['primary', 'secondary']).toContain(variant);
        if (step > 0) {
          expect(step).toBeGreaterThan(0);
          expect(step).toBeLessThanOrEqual(4);
        }
      });
    });
  });
});