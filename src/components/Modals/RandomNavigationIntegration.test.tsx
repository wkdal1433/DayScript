import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import DifficultySelectionModal, { UserProgressionState, DifficultyLevel } from './DifficultySelectionModal';

describe('DifficultySelectionModal - Random Navigation Integration', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  const mockOnClose = jest.fn();
  const mockOnSelectLevel = jest.fn();

  const defaultProps = {
    isVisible: true,
    onClose: mockOnClose,
    onSelectLevel: mockOnSelectLevel,
    selectedLanguage: 'Python',
    navigation: mockNavigation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Math.random to test both routes predictably
    jest.spyOn(Math, 'random');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Random Navigation for Beginner Level', () => {
    it('should navigate to OXProblem when random selects first route', () => {
      // Mock Math.random to return 0 (first route)
      (Math.random as jest.Mock).mockReturnValue(0);

      render(<DifficultySelectionModal {...defaultProps} />);

      // Select beginner level
      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      // Click start button
      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('OXProblem', {
        difficulty: expect.objectContaining({
          id: 'beginner',
          title: '입문',
        }),
        language: 'Python',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should navigate to MultipleChoiceProblem when random selects second route', () => {
      // Mock Math.random to return 0.6 (second route)
      (Math.random as jest.Mock).mockReturnValue(0.6);

      render(<DifficultySelectionModal {...defaultProps} />);

      // Select beginner level
      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      // Click start button
      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('MultipleChoiceProblem', {
        difficulty: expect.objectContaining({
          id: 'beginner',
          title: '입문',
        }),
        language: 'Python',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should log the selected route for debugging', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      (Math.random as jest.Mock).mockReturnValue(0);

      render(<DifficultySelectionModal {...defaultProps} />);

      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      expect(consoleSpy).toHaveBeenCalledWith('Random problem route selected:', 'OXProblem');
      consoleSpy.mockRestore();
    });
  });

  describe('Locked Level Navigation', () => {
    const customProgressionState: UserProgressionState = {
      unlockedLevels: ['beginner'], // Only beginner unlocked
      completedLevels: [],
      currentLevel: null,
      levelStats: {
        beginner: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
        intermediate: { completionRate: 0, attemptsUsed: 0, maxAttempts: 3, isCompleted: false },
        advanced: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
        challenge: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
      },
    };

    it('should not show start button for locked intermediate level', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
        />
      );

      // Try to select intermediate level (locked)
      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      // Should show unlock modal instead of allowing selection
      expect(screen.getByText('단계 잠금')).toBeTruthy();
      expect(screen.getByText('입문 단계를 완료해야 합니다')).toBeTruthy();

      // Should not navigate
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });

    it('should show back button instead of start button when no valid level selected', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
        />
      );

      // Without selecting any level, should show back button
      expect(screen.getByText('← 뒤로가기')).toBeTruthy();
      expect(screen.queryByText('문제 풀기')).toBeFalsy();
    });
  });

  describe('Navigation Fallback', () => {
    it('should handle missing navigation prop gracefully', () => {
      const propsWithoutNavigation = {
        ...defaultProps,
        navigation: undefined,
      };

      render(<DifficultySelectionModal {...propsWithoutNavigation} />);

      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      // Should not crash and should close modal
      expect(mockOnClose).toHaveBeenCalled();
      expect(mockOnSelectLevel).toHaveBeenCalled();
    });

    it('should not navigate for other difficulty levels', () => {
      const unlockedProgressionState: UserProgressionState = {
        unlockedLevels: ['beginner', 'intermediate'],
        completedLevels: ['beginner'],
        currentLevel: 'intermediate',
        levelStats: {
          beginner: { completionRate: 100, attemptsUsed: 1, maxAttempts: 999, isCompleted: true },
          intermediate: { completionRate: 0, attemptsUsed: 0, maxAttempts: 3, isCompleted: false },
          advanced: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
          challenge: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
        },
      };

      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={unlockedProgressionState}
        />
      );

      // Select intermediate level
      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      // Should not navigate (only beginner level has navigation implemented)
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Attempts Exhaustion', () => {
    const exhaustedAttemptsState: UserProgressionState = {
      unlockedLevels: ['beginner', 'intermediate'],
      completedLevels: [],
      currentLevel: 'intermediate',
      levelStats: {
        beginner: { completionRate: 100, attemptsUsed: 1, maxAttempts: 999, isCompleted: true },
        intermediate: { completionRate: 0, attemptsUsed: 3, maxAttempts: 3, isCompleted: false },
        advanced: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
        challenge: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
      },
    };

    it('should not show start button when intermediate attempts are exhausted', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={exhaustedAttemptsState}
        />
      );

      // Try to select intermediate level with exhausted attempts
      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      // Should show unlock modal about exhausted attempts
      expect(screen.getByText('중급 단계의 테스트 기회를 모두 사용했습니다.')).toBeTruthy();

      // Should not show start button even though level is selected
      expect(screen.queryByText('문제 풀기')).toBeFalsy();
      expect(screen.getByText('← 뒤로가기')).toBeTruthy();
    });
  });

  describe('Integration with State-Based Access Control', () => {
    it('should respect unlock conditions when showing start button', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      // Select unlocked beginner level
      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      // Should show start button for unlocked level
      expect(screen.getByText('문제 풀기')).toBeTruthy();
    });

    it('should pass correct parameters to navigation', () => {
      (Math.random as jest.Mock).mockReturnValue(0.3);

      render(<DifficultySelectionModal {...defaultProps} selectedLanguage="JavaScript" />);

      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('MultipleChoiceProblem', {
        difficulty: expect.objectContaining({
          id: 'beginner',
          title: '입문',
          isUnlocked: true,
        }),
        language: 'JavaScript',
      });
    });
  });
});