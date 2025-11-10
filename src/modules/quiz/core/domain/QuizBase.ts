/**
 * Quiz 도메인 기본 추상 클래스
 * SOLID 원칙 중 OCP(개방-폐쇄)와 LSP(리스코프 치환) 적용
 */

export abstract class QuizBase {
  abstract readonly id: string;
  abstract readonly type: QuizType;
  abstract readonly level: QuizLevel;
  abstract readonly difficulty: QuizDifficulty;
  abstract readonly question: string;
  abstract readonly category: string;
  abstract readonly tags: string[];
  abstract readonly timeLimit?: number; // seconds
  abstract readonly points: number;

  // 공통 메서드
  public isTimeLimited(): boolean {
    return this.timeLimit !== undefined && this.timeLimit > 0;
  }

  public abstract validateAnswer(userAnswer: any): boolean;
  public abstract getHints(): QuizHint[];
  public abstract getExplanation(): string;
}

export enum QuizType {
  OX = 'OX',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  DEBUGGING = 'DEBUGGING',
  CODE_REVIEW = 'CODE_REVIEW',
  VIBE_CODING = 'VIBE_CODING'
}

export enum QuizLevel {
  LV1 = 'LV1',
  LV2 = 'LV2',
  LV3 = 'LV3',
  LV4 = 'LV4',
  LV5 = 'LV5'
}

export enum QuizDifficulty {
  BEGINNER = 'BEGINNER',
  ELEMENTARY = 'ELEMENTARY',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  CHALLENGER = 'CHALLENGER'
}

export interface QuizHint {
  id: string;
  content: string;
  level: HintLevel;
  unlockCondition?: string;
  pointsPenalty?: number;
}

export enum HintLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  SOLUTION = 'SOLUTION'
}

export interface QuizResult {
  quizId: string;
  userId: string;
  isCorrect: boolean;
  userAnswer: any;
  timeSpent: number; // seconds
  hintsUsed: string[];
  pointsEarned: number;
  timestamp: Date;
  explanation?: string;
}

export interface QuizProgress {
  userId: string;
  level: QuizLevel;
  totalQuizzes: number;
  completedQuizzes: number;
  correctAnswers: number;
  totalPoints: number;
  averageTime: number;
  lastActivity: Date;
}