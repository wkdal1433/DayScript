/**
 * Quiz Repository 인터페이스
 * SOLID 원칙 중 DIP(의존 역전) 적용 - 구체적 구현이 아닌 추상화에 의존
 */

import { QuizBase, QuizLevel, QuizType, QuizResult, QuizProgress } from './QuizBase';

export interface IQuizRepository {
  // Quiz 조회
  getQuizById(id: string): Promise<QuizBase | null>;
  getQuizzesByLevel(level: QuizLevel): Promise<QuizBase[]>;
  getQuizzesByType(type: QuizType): Promise<QuizBase[]>;
  getRandomQuiz(level: QuizLevel, excludeIds?: string[]): Promise<QuizBase | null>;

  // Quiz 필터링 및 검색
  searchQuizzes(query: QuizSearchQuery): Promise<QuizBase[]>;
  getQuizzesByCategory(category: string): Promise<QuizBase[]>;
  getQuizzesByTags(tags: string[]): Promise<QuizBase[]>;

  // 결과 관리
  saveQuizResult(result: QuizResult): Promise<void>;
  getQuizResults(userId: string, quizId?: string): Promise<QuizResult[]>;
  getQuizResultsByLevel(userId: string, level: QuizLevel): Promise<QuizResult[]>;

  // 진행 상황 관리
  getQuizProgress(userId: string): Promise<QuizProgress[]>;
  updateQuizProgress(progress: QuizProgress): Promise<void>;

  // 오답노트 관리
  getWrongAnswers(userId: string): Promise<QuizResult[]>;
  addToWrongAnswers(result: QuizResult): Promise<void>;
  removeFromWrongAnswers(userId: string, quizId: string): Promise<void>;

  // 복습 시스템
  getReviewQuizzes(userId: string): Promise<QuizBase[]>;
  getSpacedRepetitionQuizzes(userId: string): Promise<QuizBase[]>;
}

export interface QuizSearchQuery {
  level?: QuizLevel;
  type?: QuizType;
  category?: string;
  tags?: string[];
  difficulty?: string;
  timeLimit?: {
    min?: number;
    max?: number;
  };
  points?: {
    min?: number;
    max?: number;
  };
  keyword?: string;
  limit?: number;
  offset?: number;
}

export interface QuizFilter {
  levels: QuizLevel[];
  types: QuizType[];
  categories: string[];
  tags: string[];
  difficultyRange: [number, number];
  pointsRange: [number, number];
  hasTimeLimit: boolean;
}

export interface QuizSortOption {
  field: 'difficulty' | 'points' | 'timeLimit' | 'category' | 'createdAt';
  order: 'asc' | 'desc';
}

// 캐시 및 성능 최적화를 위한 인터페이스
export interface IQuizCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  invalidate(pattern: string): Promise<void>;
  clear(): Promise<void>;
}

// 통계 및 분석을 위한 인터페이스
export interface IQuizAnalytics {
  getQuizStatistics(quizId: string): Promise<QuizStatistics>;
  getUserPerformance(userId: string): Promise<UserPerformance>;
  getProgressAnalytics(userId: string): Promise<ProgressAnalytics>;
}

export interface QuizStatistics {
  quizId: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTime: number;
  difficultyRating: number;
  popularityScore: number;
}

export interface UserPerformance {
  userId: string;
  overallAccuracy: number;
  averageTime: number;
  strongCategories: string[];
  weakCategories: string[];
  improvementAreas: string[];
  currentStreak: number;
  longestStreak: number;
}

export interface ProgressAnalytics {
  userId: string;
  levelProgress: Record<QuizLevel, number>;
  weeklyProgress: number[];
  monthlyProgress: number[];
  learningVelocity: number;
  estimatedCompletionTime: number;
}