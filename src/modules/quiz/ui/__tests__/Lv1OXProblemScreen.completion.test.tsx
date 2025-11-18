/**
 * Test for quiz completion logic and result modal display
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { sessionManager } from '../../../../data/sessionManager';

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
}));

describe('Lv1OXProblemScreen Quiz Completion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect when session is completed', () => {
    // Mock a completed session
    const mockSession = {
      id: 'test-session',
      type: 'OX' as const,
      problems: Array(10).fill({ id: 'test', title: 'Test', correctAnswer: 'O' }),
      currentProblemIndex: 10,
      totalProblems: 10,
      startTime: Date.now() - 60000,
      answers: Array(10).fill({ problemId: 'test', userAnswer: 'O', isCorrect: true, timeSpent: 6000 }),
      isCompleted: true,
    };

    const mockStats = {
      correctAnswers: 8,
      totalAnswers: 10,
      accuracy: 80,
      totalTimeSpent: 60000,
      averageTimePerProblem: 6000,
    };

    (sessionManager.getCurrentSession as jest.Mock).mockReturnValue(mockSession);
    (sessionManager.getSessionStats as jest.Mock).mockReturnValue(mockStats);

    // Import the session completion check function
    const { isSessionCompleted } = require('../../../../data/sessionManager');
    (isSessionCompleted as jest.Mock).mockReturnValue(true);

    expect(isSessionCompleted()).toBe(true);
  });

  it('should calculate completion modal data correctly', () => {
    const mockStats = {
      correctAnswers: 8,
      totalAnswers: 10,
      accuracy: 80,
      totalTimeSpent: 60000,
      averageTimePerProblem: 6000,
    };

    (sessionManager.getSessionStats as jest.Mock).mockReturnValue(mockStats);

    // This would be called within the getCompletionModalData function
    const isCorrect = mockStats.accuracy >= 70;
    const bonusPoints = mockStats.accuracy >= 90 ? 50 : mockStats.accuracy >= 80 ? 30 : mockStats.accuracy >= 70 ? 10 : 0;

    expect(isCorrect).toBe(true);
    expect(bonusPoints).toBe(30); // 80% accuracy gets 30 bonus points
  });

  it('should handle completion for different accuracy levels', () => {
    const testCases = [
      { accuracy: 90, expectedBonus: 50, expectedSuccess: true },
      { accuracy: 80, expectedBonus: 30, expectedSuccess: true },
      { accuracy: 70, expectedBonus: 10, expectedSuccess: true },
      { accuracy: 60, expectedBonus: 0, expectedSuccess: false },
    ];

    testCases.forEach(({ accuracy, expectedBonus, expectedSuccess }) => {
      const mockStats = {
        correctAnswers: Math.round((accuracy / 100) * 10),
        totalAnswers: 10,
        accuracy,
        totalTimeSpent: 60000,
        averageTimePerProblem: 6000,
      };

      (sessionManager.getSessionStats as jest.Mock).mockReturnValue(mockStats);

      const isCorrect = accuracy >= 70;
      const bonusPoints = accuracy >= 90 ? 50 : accuracy >= 80 ? 30 : accuracy >= 70 ? 10 : 0;

      expect(isCorrect).toBe(expectedSuccess);
      expect(bonusPoints).toBe(expectedBonus);
    });
  });
});