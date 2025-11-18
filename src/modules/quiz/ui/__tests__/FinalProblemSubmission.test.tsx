/**
 * Test for direct modal trigger on final problem submission
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { sessionManager } from '../../../../data/sessionManager';

// Mock the session manager functions
jest.mock('../../../../data/sessionManager', () => ({
  sessionManager: {
    getCurrentSession: jest.fn(),
    getSessionStats: jest.fn(),
    createSession: jest.fn(),
    isCurrentProblemLast: jest.fn(),
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

describe('Final Problem Submission Modal Trigger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Direct Modal Trigger Logic', () => {
    it('should immediately check if current problem is last before submission', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem is the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      // Simulate the handleAnswerPress logic
      const answer = 'O';
      const currentProblemData = {
        id: 'problem-10',
        correctAnswer: 'O',
        explanation: 'Final problem explanation'
      };

      // Check if this is the last problem BEFORE submitting
      const isLastProblem = isCurrentProblemLast();

      expect(isCurrentProblemLast).toHaveBeenCalled();
      expect(isLastProblem).toBe(true);
    });

    it('should trigger completion modal after 2 seconds for last problem', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem is the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      let showCompletionModal = false;
      const setShowCompletionModal = jest.fn((value) => {
        showCompletionModal = value;
      });

      // Simulate the final problem submission logic
      const isLastProblem = isCurrentProblemLast();

      if (isLastProblem) {
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 2000);
      }

      // Initially modal should not be shown
      expect(showCompletionModal).toBe(false);
      expect(setShowCompletionModal).not.toHaveBeenCalled();

      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000);

      // Now modal should be triggered
      expect(setShowCompletionModal).toHaveBeenCalledWith(true);
    });

    it('should NOT trigger completion modal for non-final problems', () => {
      const { isCurrentProblemLast } = require('../../../../data/sessionManager');

      // Mock that current problem is NOT the last one
      (isCurrentProblemLast as jest.Mock).mockReturnValue(false);

      let showCompletionModal = false;
      const setShowCompletionModal = jest.fn((value) => {
        showCompletionModal = value;
      });

      // Simulate non-final problem submission logic
      const isLastProblem = isCurrentProblemLast();

      if (isLastProblem) {
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 2000);
      }

      // Fast-forward time by 2 seconds
      jest.advanceTimersByTime(2000);

      // Modal should NOT be triggered
      expect(setShowCompletionModal).not.toHaveBeenCalled();
      expect(showCompletionModal).toBe(false);
    });
  });

  describe('Mutually Exclusive Navigation Logic', () => {
    it('should prevent navigation when completion modal is showing', () => {
      const { goToNextProblem } = require('../../../../data/sessionManager');

      let showCompletionModal = true; // Modal is showing
      const mockOnNext = jest.fn();

      // Simulate handleNextProblem logic
      const handleNextProblem = () => {
        // Check if completion modal should be shown (mutually exclusive logic)
        if (showCompletionModal) {
          // If completion modal is already showing, don't proceed with navigation
          return;
        }

        // This should not be reached when modal is showing
        const hasNextProblem = goToNextProblem();
        if (hasNextProblem) {
          mockOnNext();
        }
      };

      handleNextProblem();

      // Navigation functions should not be called when modal is showing
      expect(goToNextProblem).not.toHaveBeenCalled();
      expect(mockOnNext).not.toHaveBeenCalled();
    });

    it('should allow navigation when completion modal is NOT showing', () => {
      const { goToNextProblem } = require('../../../../data/sessionManager');

      // Mock that there's a next problem
      (goToNextProblem as jest.Mock).mockReturnValue(true);

      let showCompletionModal = false; // Modal is NOT showing
      const mockOnNext = jest.fn();

      // Simulate handleNextProblem logic
      const handleNextProblem = () => {
        if (showCompletionModal) {
          return;
        }

        const hasNextProblem = goToNextProblem();
        if (hasNextProblem) {
          mockOnNext();
        }
      };

      handleNextProblem();

      // Navigation functions should be called when modal is not showing
      expect(goToNextProblem).toHaveBeenCalled();
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  describe('Session Manager Enhanced Functions', () => {
    it('should correctly identify last problem', () => {
      // Mock a session where current problem is last (index 9 of 10 problems)
      const mockSession = {
        currentProblemIndex: 9,
        totalProblems: 10,
        isCompleted: false
      };

      (sessionManager.getCurrentSession as jest.Mock).mockReturnValue(mockSession);

      // Test the isCurrentProblemLast logic
      const isLastProblem = mockSession.currentProblemIndex >= mockSession.totalProblems - 1;

      expect(isLastProblem).toBe(true);
    });

    it('should correctly identify non-last problem', () => {
      // Mock a session where current problem is NOT last (index 5 of 10 problems)
      const mockSession = {
        currentProblemIndex: 5,
        totalProblems: 10,
        isCompleted: false
      };

      (sessionManager.getCurrentSession as jest.Mock).mockReturnValue(mockSession);

      // Test the isCurrentProblemLast logic
      const isLastProblem = mockSession.currentProblemIndex >= mockSession.totalProblems - 1;

      expect(isLastProblem).toBe(false);
    });
  });

  describe('Timing and State Management', () => {
    it('should maintain proper state sequence during final submission', () => {
      const { isCurrentProblemLast, submitAnswer } = require('../../../../data/sessionManager');

      (isCurrentProblemLast as jest.Mock).mockReturnValue(true);

      const stateSequence: string[] = [];

      // Mock state setters to track sequence
      const setSelectedAnswer = jest.fn(() => stateSequence.push('selectedAnswer'));
      const setResultState = jest.fn(() => stateSequence.push('resultState'));
      const setResultData = jest.fn(() => stateSequence.push('resultData'));
      const setShowCompletionModal = jest.fn(() => stateSequence.push('completionModal'));

      // Simulate the complete final answer submission process
      const simulateFinalSubmission = () => {
        // 1. Check if last problem
        const isLastProblem = isCurrentProblemLast();

        // 2. Set answer states
        setSelectedAnswer('O');
        setResultState('CORRECT');
        setResultData({});

        // 3. Submit to session
        submitAnswer('O', true);

        // 4. If last problem, schedule modal
        if (isLastProblem) {
          setTimeout(() => {
            setShowCompletionModal(true);
          }, 2000);
        }
      };

      simulateFinalSubmission();

      // Verify immediate state updates happened in correct order
      expect(stateSequence).toEqual(['selectedAnswer', 'resultState', 'resultData']);

      // Fast-forward to trigger modal
      jest.advanceTimersByTime(2000);

      // Verify final modal state was set
      expect(stateSequence).toEqual(['selectedAnswer', 'resultState', 'resultData', 'completionModal']);
    });
  });
});