// Session management for problem-solving tests
import { ProblemData } from '../screens/Practice/Lv1OXProblemScreen.types';
import { MultipleChoiceProblemData } from '../screens/Practice/Lv2MultipleChoiceProblemScreen.types';
import { getRandomOXProblems } from './problems/oxProblemsData';
import { getRandomMultipleChoiceProblems } from './problems/multipleChoiceProblemsData';

export type ProblemType = 'OX' | 'MULTIPLE_CHOICE';

export interface TestSession {
  id: string;
  type: ProblemType;
  problems: (ProblemData | MultipleChoiceProblemData)[];
  currentProblemIndex: number;
  totalProblems: number;
  startTime: number;
  answers: Array<{
    problemId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  isCompleted: boolean;
}

export interface SessionStats {
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  totalTimeSpent: number;
  averageTimePerProblem: number;
}

class SessionManager {
  private currentSession: TestSession | null = null;

  // Create a new test session
  createSession(type: ProblemType, problemCount: number = 10): TestSession {
    console.log(`🎮 SessionManager: Creating session for type '${type}' with ${problemCount} problems`);
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let problems: (ProblemData | MultipleChoiceProblemData)[];

    try {
      switch (type) {
        case 'OX':
          console.log('📝 Loading OX problems...');
          problems = getRandomOXProblems(problemCount);
          console.log(`✅ Loaded ${problems.length} OX problems`);
          break;
        case 'MULTIPLE_CHOICE':
          console.log('📝 Loading Multiple Choice problems...');
          problems = getRandomMultipleChoiceProblems(problemCount);
          console.log(`✅ Loaded ${problems.length} Multiple Choice problems`);
          break;
        default:
          throw new Error(`Unsupported problem type: ${type}`);
      }

      if (!problems || problems.length === 0) {
        console.error(`❌ No problems loaded for type: ${type}`);
        throw new Error(`No problems available for type: ${type}`);
      }

      this.currentSession = {
        id: sessionId,
        type,
        problems,
        currentProblemIndex: 0,
        totalProblems: problems.length,
        startTime: Date.now(),
        answers: [],
        isCompleted: false,
      };

      console.log(`🎯 Session created successfully:`, {
        id: sessionId,
        type,
        problemCount: problems.length,
        firstProblem: problems[0]?.id
      });

      return this.currentSession;
    } catch (error) {
      console.error('💥 Error creating session:', error);
      throw error;
    }
  }

  // Get current session
  getCurrentSession(): TestSession | null {
    return this.currentSession;
  }

  // Get current problem
  getCurrentProblem(): ProblemData | MultipleChoiceProblemData | null {
    if (!this.currentSession || this.currentSession.isCompleted) {
      return null;
    }

    const { problems, currentProblemIndex } = this.currentSession;
    return problems[currentProblemIndex] || null;
  }

  // Submit answer for current problem
  submitAnswer(userAnswer: string, isCorrect: boolean): boolean {
    if (!this.currentSession || this.currentSession.isCompleted) {
      return false;
    }

    const currentProblem = this.getCurrentProblem();
    if (!currentProblem) {
      return false;
    }

    const timeSpent = Date.now() - this.currentSession.startTime;
    const averageTimeForThisProblem = timeSpent / (this.currentSession.answers.length + 1);

    this.currentSession.answers.push({
      problemId: currentProblem.id,
      userAnswer,
      isCorrect,
      timeSpent: averageTimeForThisProblem,
    });

    return true;
  }

  // Move to next problem
  goToNextProblem(): boolean {
    if (!this.currentSession || this.currentSession.isCompleted) {
      return false;
    }

    this.currentSession.currentProblemIndex++;

    // Check if session is completed
    if (this.currentSession.currentProblemIndex >= this.currentSession.totalProblems) {
      this.currentSession.isCompleted = true;
      return false; // No more problems
    }

    return true; // Has next problem
  }

  // Get session progress
  getProgress(): { current: number; total: number; percentage: number } {
    if (!this.currentSession) {
      return { current: 0, total: 0, percentage: 0 };
    }

    const current = this.currentSession.currentProblemIndex + 1;
    const total = this.currentSession.totalProblems;
    const percentage = Math.round((current / total) * 100);

    return { current, total, percentage };
  }

  // Get session statistics
  getSessionStats(): SessionStats | null {
    if (!this.currentSession) {
      return null;
    }

    const correctAnswers = this.currentSession.answers.filter(answer => answer.isCorrect).length;
    const totalAnswers = this.currentSession.answers.length;
    const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
    const totalTimeSpent = Date.now() - this.currentSession.startTime;
    const averageTimePerProblem = totalAnswers > 0 ? totalTimeSpent / totalAnswers : 0;

    return {
      correctAnswers,
      totalAnswers,
      accuracy,
      totalTimeSpent,
      averageTimePerProblem,
    };
  }

  // Check if session is completed
  isSessionCompleted(): boolean {
    return this.currentSession?.isCompleted || false;
  }

  // Check if current problem is the last one (without advancing index)
  isCurrentProblemLast(): boolean {
    if (!this.currentSession) {
      return false;
    }
    return this.currentSession.currentProblemIndex >= this.currentSession.totalProblems - 1;
  }

  // Reset/clear current session
  clearSession(): void {
    this.currentSession = null;
  }

  // Get remaining problems count
  getRemainingProblems(): number {
    if (!this.currentSession) {
      return 0;
    }
    return this.currentSession.totalProblems - this.currentSession.currentProblemIndex;
  }

  // Get all problems in current session (for debugging)
  getAllProblems(): (ProblemData | MultipleChoiceProblemData)[] {
    return this.currentSession?.problems || [];
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Export utility functions
export const createNewSession = (type: ProblemType, count: number = 10) => {
  return sessionManager.createSession(type, count);
};

export const getCurrentSession = () => {
  return sessionManager.getCurrentSession();
};

export const getCurrentProblem = () => {
  return sessionManager.getCurrentProblem();
};

export const submitAnswer = (userAnswer: string, isCorrect: boolean) => {
  return sessionManager.submitAnswer(userAnswer, isCorrect);
};

export const goToNextProblem = () => {
  return sessionManager.goToNextProblem();
};

export const getSessionProgress = () => {
  return sessionManager.getProgress();
};

export const getSessionStats = () => {
  return sessionManager.getSessionStats();
};

export const isSessionCompleted = () => {
  return sessionManager.isSessionCompleted();
};

export const clearCurrentSession = () => {
  sessionManager.clearSession();
};

export const isCurrentProblemLast = () => {
  return sessionManager.isCurrentProblemLast();
};