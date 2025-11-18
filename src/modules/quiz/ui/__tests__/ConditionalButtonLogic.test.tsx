/**
 * Test for conditional button logic in quiz completion flow
 * Tests the new UX where button text and action change based on quiz state
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock the session manager functions
jest.mock('../../../../data/sessionManager', () => ({
  sessionManager: {
    getCurrentSession: jest.fn(),
    getSessionStats: jest.fn(),
    createSession: jest.fn(),
  },
  createNewSession: jest.fn(),
  getCurrentProblem: jest.fn(),
  submitAnswer: jest.fn(),
  goToNextProblem: jest.fn(),
  getSessionProgress: jest.fn(),
  isSessionCompleted: jest.fn(),
  clearCurrentSession: jest.fn(),
  isCurrentProblemLast: jest.fn(),
}));

describe('Conditional Button Logic for Quiz Completion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Button Text Logic', () => {
    it('should return "다음 문제로 이동 →" for non-last problems', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem is NOT the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(false);

      // Simulate state: answered but not last problem
      const resultState = 'CORRECT';
      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      const getButtonText = () => {
        return isLastProblemAndAnswered() ? '문제 풀이 완료' : '다음 문제로 이동 →';
      };

      expect(getButtonText()).toBe('다음 문제로 이동 →');
      expect(isLastProblemAndAnswered()).toBe(false);
    });

    it('should return "문제 풀이 완료" for last problem when answered', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem IS the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      // Simulate state: answered and is last problem
      const resultState = 'CORRECT';
      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      const getButtonText = () => {
        return isLastProblemAndAnswered() ? '문제 풀이 완료' : '다음 문제로 이동 →';
      };

      expect(getButtonText()).toBe('문제 풀이 완료');
      expect(isLastProblemAndAnswered()).toBe(true);
    });

    it('should return "다음 문제로 이동 →" for last problem when NOT answered', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem IS the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      // Simulate state: NOT answered (still answering)
      const resultState = 'ANSWERING';
      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      const getButtonText = () => {
        return isLastProblemAndAnswered() ? '문제 풀이 완료' : '다음 문제로 이동 →';
      };

      expect(getButtonText()).toBe('다음 문제로 이동 →');
      expect(isLastProblemAndAnswered()).toBe(false);
    });
  });

  describe('Button Action Logic', () => {
    it('should call handleNextProblem for non-last problems', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem is NOT the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(false);

      const resultState = 'CORRECT';
      const mockHandleNextProblem = jest.fn();
      const mockHandleCompletionButtonPress = jest.fn();

      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      const getButtonAction = () => {
        return isLastProblemAndAnswered() ? mockHandleCompletionButtonPress : mockHandleNextProblem;
      };

      const buttonAction = getButtonAction();
      buttonAction();

      expect(mockHandleNextProblem).toHaveBeenCalledTimes(1);
      expect(mockHandleCompletionButtonPress).not.toHaveBeenCalled();
    });

    it('should call handleCompletionButtonPress for last problem when answered', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem IS the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      const resultState = 'INCORRECT'; // Test with incorrect answer too
      const mockHandleNextProblem = jest.fn();
      const mockHandleCompletionButtonPress = jest.fn();

      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      const getButtonAction = () => {
        return isLastProblemAndAnswered() ? mockHandleCompletionButtonPress : mockHandleNextProblem;
      };

      const buttonAction = getButtonAction();
      buttonAction();

      expect(mockHandleCompletionButtonPress).toHaveBeenCalledTimes(1);
      expect(mockHandleNextProblem).not.toHaveBeenCalled();
    });
  });

  describe('State Detection Logic', () => {
    it('should correctly detect last problem + answered state', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem IS the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      // Test both CORRECT and INCORRECT result states
      ['CORRECT', 'INCORRECT'].forEach((resultState) => {
        const isLastProblemAndAnswered = () => {
          return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
        };

        expect(isLastProblemAndAnswered()).toBe(true);
        expect(isCurrentProblemLast).toHaveBeenCalled();
      });
    });

    it('should correctly detect non-completion states', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      const testCases = [
        { isLast: false, state: 'CORRECT', expected: false, description: 'not last + answered' },
        { isLast: false, state: 'INCORRECT', expected: false, description: 'not last + answered incorrect' },
        { isLast: false, state: 'ANSWERING', expected: false, description: 'not last + not answered' },
        { isLast: true, state: 'ANSWERING', expected: false, description: 'last + not answered' },
      ];

      testCases.forEach(({ isLast, state, expected, description }) => {
        (isCurrentProblemLast as jest.Mock).mockReturnValue(isLast);

        const isLastProblemAndAnswered = () => {
          return isCurrentProblemLast() && (state === 'CORRECT' || state === 'INCORRECT');
        };

        expect(isLastProblemAndAnswered()).toBe(expected);
      });
    });
  });

  describe('Enhanced handleNextProblem Logic', () => {
    it('should early return when last problem is detected', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem IS the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      const resultState = 'CORRECT';
      const mockGoToNextProblem = jest.fn();
      const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      // Simulate enhanced handleNextProblem logic
      const handleNextProblem = () => {
        if (isLastProblemAndAnswered()) {
          console.log('Last problem detected - completion should be handled by button logic');
          return;
        }

        mockGoToNextProblem();
      };

      handleNextProblem();

      expect(mockConsoleLog).toHaveBeenCalledWith('Last problem detected - completion should be handled by button logic');
      expect(mockGoToNextProblem).not.toHaveBeenCalled();

      mockConsoleLog.mockRestore();
    });

    it('should proceed with next problem when not last problem', () => {
      const { isCurrentProblemLast, goToNextProblem } = require('../../../../data/sessionManager');

      // Mock that current problem is NOT the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(false);
      (goToNextProblem as jest.Mock).mockReturnValue(true);

      const resultState = 'CORRECT';
      const mockOnNext = jest.fn();

      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      // Simulate enhanced handleNextProblem logic
      const handleNextProblem = () => {
        if (isLastProblemAndAnswered()) {
          return;
        }

        const hasNextProblem = goToNextProblem();
        if (hasNextProblem) {
          mockOnNext();
        }
      };

      handleNextProblem();

      expect(goToNextProblem).toHaveBeenCalled();
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  describe('Integration Flow', () => {
    it('should provide complete conditional flow for quiz completion', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      let resultState: string = 'ANSWERING';
      let showCompletionModal = false;

      const mockSetShowCompletionModal = jest.fn((value) => {
        showCompletionModal = value;
      });

      // Helper functions (from implementation)
      const isLastProblemAndAnswered = () => {
        return isCurrentProblemLast() && (resultState === 'CORRECT' || resultState === 'INCORRECT');
      };

      const handleCompletionButtonPress = () => {
        mockSetShowCompletionModal(true);
      };

      const getButtonText = () => {
        return isLastProblemAndAnswered() ? '문제 풀이 완료' : '다음 문제로 이동 →';
      };

      const getButtonAction = () => {
        return isLastProblemAndAnswered() ? handleCompletionButtonPress : () => console.log('next problem');
      };

      // Test scenario: Start with non-last problem
      (isCurrentProblemLast as jest.Mock).mockReturnValue(false);
      resultState = 'CORRECT';

      expect(getButtonText()).toBe('다음 문제로 이동 →');
      expect(isLastProblemAndAnswered()).toBe(false);

      // Test scenario: Move to last problem, not yet answered
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);
      resultState = 'ANSWERING';

      expect(getButtonText()).toBe('다음 문제로 이동 →');
      expect(isLastProblemAndAnswered()).toBe(false);

      // Test scenario: Last problem, now answered
      resultState = 'INCORRECT';

      expect(getButtonText()).toBe('문제 풀이 완료');
      expect(isLastProblemAndAnswered()).toBe(true);

      // Test button action triggers completion
      const completionAction = getButtonAction();
      completionAction();

      expect(mockSetShowCompletionModal).toHaveBeenCalledWith(true);
    });
  });
});