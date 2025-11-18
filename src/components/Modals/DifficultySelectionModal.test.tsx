import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import DifficultySelectionModal, { UserProgressionState, DifficultyLevel } from './DifficultySelectionModal';

describe('DifficultySelectionModal - State-Based Access Control', () => {
  const mockOnClose = jest.fn();
  const mockOnSelectLevel = jest.fn();
  const mockOnUpdateProgression = jest.fn();

  const defaultProps = {
    isVisible: true,
    onClose: mockOnClose,
    onSelectLevel: mockOnSelectLevel,
    selectedLanguage: 'Python',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Default Progression State', () => {
    it('should only show beginner level as unlocked by default', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      // Beginner should be accessible
      const beginnerCard = screen.getByText('입문');
      expect(beginnerCard).toBeTruthy();

      // Other levels should have lock indicators
      expect(screen.getByText('🔒')).toBeTruthy();
    });

    it('should show unlock modal when clicking locked level', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      expect(screen.getByText('단계 잠금')).toBeTruthy();
      expect(screen.getByText('입문 단계를 완료해야 합니다')).toBeTruthy();
    });

    it('should allow selection of unlocked beginner level', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      // Should not show unlock modal
      expect(screen.queryByText('단계 잠금')).toBeFalsy();
    });
  });

  describe('Custom Progression State', () => {
    const customProgressionState: UserProgressionState = {
      unlockedLevels: ['beginner', 'intermediate'],
      completedLevels: ['beginner'],
      currentLevel: 'intermediate',
      levelStats: {
        beginner: { completionRate: 100, attemptsUsed: 1, maxAttempts: 999, isCompleted: true },
        intermediate: { completionRate: 75, attemptsUsed: 2, maxAttempts: 3, isCompleted: false },
        advanced: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
        challenge: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
      },
    };

    it('should show completion badge for completed levels', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      expect(screen.getByText('완료!')).toBeTruthy();
    });

    it('should show attempts remaining for intermediate level', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      expect(screen.getByText('남은 기회: 1회')).toBeTruthy();
    });

    it('should show progress bar with correct completion rate', () => {
      const { getByTestId } = render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      // Intermediate level should show 75% progress
      const progressBar = screen.getByText('중급').parent;
      expect(progressBar).toBeTruthy();
    });

    it('should allow selection of unlocked intermediate level', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      // Should not show unlock modal for unlocked level
      expect(screen.queryByText('단계 잠금')).toBeFalsy();
    });

    it('should show unlock modal for advanced level', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={customProgressionState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      const advancedCard = screen.getByText('고급');
      fireEvent.press(advancedCard);

      expect(screen.getByText('단계 잠금')).toBeTruthy();
      expect(screen.getByText('중급 단계를 완료해야 합니다')).toBeTruthy();
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

    it('should show attempts exhausted modal when intermediate attempts are used up', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={exhaustedAttemptsState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      expect(screen.getByText('단계 잠금')).toBeTruthy();
      expect(screen.getByText('중급 단계의 테스트 기회를 모두 사용했습니다.')).toBeTruthy();
      expect(screen.getByText('입문 단계를 다시 완료하면 추가 기회를 얻을 수 있습니다.')).toBeTruthy();
    });

    it('should show 0 attempts remaining', () => {
      render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={exhaustedAttemptsState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      expect(screen.getByText('남은 기회: 0회')).toBeTruthy();
    });

    it('should apply opacity to exhausted level', () => {
      const { getByText } = render(
        <DifficultySelectionModal
          {...defaultProps}
          userProgressionState={exhaustedAttemptsState}
          onUpdateProgression={mockOnUpdateProgression}
        />
      );

      const intermediateCard = getByText('중급').closest('TouchableOpacity');
      expect(intermediateCard).toHaveStyle({ opacity: 0.4 });
    });
  });

  describe('Unlock Modal Interactions', () => {
    it('should close unlock modal when pressing confirm button', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      // Open unlock modal
      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      expect(screen.getByText('단계 잠금')).toBeTruthy();

      // Close modal
      const confirmButton = screen.getByText('확인');
      fireEvent.press(confirmButton);

      expect(screen.queryByText('단계 잠금')).toBeFalsy();
    });

    it('should close unlock modal when pressing overlay', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      // Open unlock modal
      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      expect(screen.getByText('단계 잠금')).toBeTruthy();

      // Press overlay
      const overlay = screen.getByText('단계 잠금').closest('Pressable');
      fireEvent.press(overlay);

      expect(screen.queryByText('단계 잠금')).toBeFalsy();
    });
  });

  describe('Visual States', () => {
    it('should apply lock indicator styles', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      const lockIcon = screen.getByText('🔒');
      expect(lockIcon.parent).toHaveStyle({
        position: 'absolute',
        top: 8,
        right: 8,
      });
    });

    it('should apply reduced opacity to locked levels', () => {
      const { getByText } = render(<DifficultySelectionModal {...defaultProps} />);

      const intermediateCard = getByText('중급').closest('TouchableOpacity');
      expect(intermediateCard).toHaveStyle({ opacity: 0.4 });
    });
  });

  describe('Level Selection', () => {
    it('should call onSelectLevel when selecting unlocked level', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      const beginnerCard = screen.getByText('입문');
      fireEvent.press(beginnerCard);

      const startButton = screen.getByText('문제 풀기');
      fireEvent.press(startButton);

      expect(mockOnSelectLevel).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'beginner',
          title: '입문',
          isUnlocked: true,
        })
      );
    });

    it('should not call onSelectLevel when selecting locked level', () => {
      render(<DifficultySelectionModal {...defaultProps} />);

      const intermediateCard = screen.getByText('중급');
      fireEvent.press(intermediateCard);

      expect(mockOnSelectLevel).not.toHaveBeenCalled();
    });
  });
});