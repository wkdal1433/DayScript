/**
 * Quiz Repository 구현체
 * SOLID 원칙 중 DIP(의존 역전) 적용 - IQuizRepository 인터페이스 구현
 */

import {
  IQuizRepository,
  QuizSearchQuery,
  IQuizCache,
  IQuizAnalytics,
  QuizStatistics,
  UserPerformance,
  ProgressAnalytics
} from '../core/domain/IQuizRepository';
import {
  QuizBase,
  QuizLevel,
  QuizType,
  QuizResult,
  QuizProgress
} from '../core/domain/QuizBase';
import { QuizFactory } from '../core/domain/QuizTypes';

export class QuizRepositoryImpl implements IQuizRepository {
  private cache: IQuizCache;
  private analytics: IQuizAnalytics;
  private apiBaseUrl: string;

  constructor(
    cache: IQuizCache,
    analytics: IQuizAnalytics,
    apiBaseUrl: string = '/api'
  ) {
    this.cache = cache;
    this.analytics = analytics;
    this.apiBaseUrl = apiBaseUrl;
  }

  // Quiz 조회 메서드들
  async getQuizById(id: string): Promise<QuizBase | null> {
    // 캐시에서 먼저 확인
    const cacheKey = `quiz:${id}`;
    const cachedQuiz = await this.cache.get<any>(cacheKey);

    if (cachedQuiz) {
      return QuizFactory.createQuiz(cachedQuiz.type, cachedQuiz);
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/quizzes/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch quiz: ${response.statusText}`);
      }

      const quizData = await response.json();

      // 캐시에 저장 (1시간)
      await this.cache.set(cacheKey, quizData, 3600);

      return QuizFactory.createQuiz(quizData.type, quizData);
    } catch (error) {
      console.error('Error fetching quiz by ID:', error);
      return null;
    }
  }

  async getQuizzesByLevel(level: QuizLevel): Promise<QuizBase[]> {
    const cacheKey = `quizzes:level:${level}`;
    const cachedQuizzes = await this.cache.get<any[]>(cacheKey);

    if (cachedQuizzes) {
      return cachedQuizzes.map(data => QuizFactory.createQuiz(data.type, data));
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/quizzes?level=${level}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes by level: ${response.statusText}`);
      }

      const quizzesData = await response.json();

      // 캐시에 저장 (30분)
      await this.cache.set(cacheKey, quizzesData, 1800);

      return quizzesData.map((data: any) => QuizFactory.createQuiz(data.type, data));
    } catch (error) {
      console.error('Error fetching quizzes by level:', error);

      // 오프라인 모드: 로컬 목업 데이터 사용
      return this.getOfflineQuizzes(level);
    }
  }

  async getQuizzesByType(type: QuizType): Promise<QuizBase[]> {
    const cacheKey = `quizzes:type:${type}`;
    const cachedQuizzes = await this.cache.get<any[]>(cacheKey);

    if (cachedQuizzes) {
      return cachedQuizzes.map(data => QuizFactory.createQuiz(data.type, data));
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/quizzes?type=${type}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes by type: ${response.statusText}`);
      }

      const quizzesData = await response.json();

      // 캐시에 저장 (30분)
      await this.cache.set(cacheKey, quizzesData, 1800);

      return quizzesData.map((data: any) => QuizFactory.createQuiz(data.type, data));
    } catch (error) {
      console.error('Error fetching quizzes by type:', error);
      return [];
    }
  }

  async getRandomQuiz(level: QuizLevel, excludeIds?: string[]): Promise<QuizBase | null> {
    try {
      const quizzes = await this.getQuizzesByLevel(level);

      let availableQuizzes = quizzes;
      if (excludeIds && excludeIds.length > 0) {
        availableQuizzes = quizzes.filter(quiz => !excludeIds.includes(quiz.id));
      }

      if (availableQuizzes.length === 0) {
        return null;
      }

      const randomIndex = Math.floor(Math.random() * availableQuizzes.length);
      return availableQuizzes[randomIndex];
    } catch (error) {
      console.error('Error getting random quiz:', error);
      return null;
    }
  }

  async searchQuizzes(query: QuizSearchQuery): Promise<QuizBase[]> {
    try {
      const params = new URLSearchParams();

      if (query.level) params.append('level', query.level);
      if (query.type) params.append('type', query.type);
      if (query.category) params.append('category', query.category);
      if (query.keyword) params.append('keyword', query.keyword);
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.offset) params.append('offset', query.offset.toString());

      if (query.tags && query.tags.length > 0) {
        query.tags.forEach(tag => params.append('tags', tag));
      }

      const response = await fetch(`${this.apiBaseUrl}/quizzes/search?${params}`);
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const searchResults = await response.json();
      return searchResults.map((data: any) => QuizFactory.createQuiz(data.type, data));
    } catch (error) {
      console.error('Error searching quizzes:', error);
      return [];
    }
  }

  async getQuizzesByCategory(category: string): Promise<QuizBase[]> {
    return this.searchQuizzes({ category });
  }

  async getQuizzesByTags(tags: string[]): Promise<QuizBase[]> {
    return this.searchQuizzes({ tags });
  }

  // 결과 관리 메서드들
  async saveQuizResult(result: QuizResult): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/quiz-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error(`Failed to save quiz result: ${response.statusText}`);
      }

      // 사용자 관련 캐시 무효화
      await this.cache.invalidate(`results:${result.userId}:*`);
      await this.cache.invalidate(`progress:${result.userId}:*`);
    } catch (error) {
      console.error('Error saving quiz result:', error);

      // 오프라인 모드: 로컬 스토리지에 저장
      this.saveToLocalStorage('quiz_results', result);
    }
  }

  async getQuizResults(userId: string, quizId?: string): Promise<QuizResult[]> {
    const cacheKey = quizId ? `results:${userId}:${quizId}` : `results:${userId}:all`;
    const cachedResults = await this.cache.get<QuizResult[]>(cacheKey);

    if (cachedResults) {
      return cachedResults;
    }

    try {
      const params = new URLSearchParams({ userId });
      if (quizId) params.append('quizId', quizId);

      const response = await fetch(`${this.apiBaseUrl}/quiz-results?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz results: ${response.statusText}`);
      }

      const results = await response.json();

      // 캐시에 저장 (15분)
      await this.cache.set(cacheKey, results, 900);

      return results;
    } catch (error) {
      console.error('Error fetching quiz results:', error);

      // 오프라인 모드: 로컬 스토리지에서 가져오기
      return this.getFromLocalStorage('quiz_results', []);
    }
  }

  async getQuizResultsByLevel(userId: string, level: QuizLevel): Promise<QuizResult[]> {
    const cacheKey = `results:${userId}:level:${level}`;
    const cachedResults = await this.cache.get<QuizResult[]>(cacheKey);

    if (cachedResults) {
      return cachedResults;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/quiz-results?userId=${userId}&level=${level}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz results by level: ${response.statusText}`);
      }

      const results = await response.json();

      // 캐시에 저장 (15분)
      await this.cache.set(cacheKey, results, 900);

      return results;
    } catch (error) {
      console.error('Error fetching quiz results by level:', error);
      return [];
    }
  }

  // 진행 상황 관리
  async getQuizProgress(userId: string): Promise<QuizProgress[]> {
    const cacheKey = `progress:${userId}`;
    const cachedProgress = await this.cache.get<QuizProgress[]>(cacheKey);

    if (cachedProgress) {
      return cachedProgress;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/quiz-progress/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz progress: ${response.statusText}`);
      }

      const progress = await response.json();

      // 캐시에 저장 (10분)
      await this.cache.set(cacheKey, progress, 600);

      return progress;
    } catch (error) {
      console.error('Error fetching quiz progress:', error);
      return [];
    }
  }

  async updateQuizProgress(progress: QuizProgress): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/quiz-progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      });

      if (!response.ok) {
        throw new Error(`Failed to update quiz progress: ${response.statusText}`);
      }

      // 캐시 무효화
      await this.cache.invalidate(`progress:${progress.userId}:*`);
    } catch (error) {
      console.error('Error updating quiz progress:', error);
    }
  }

  // 오답노트 관리
  async getWrongAnswers(userId: string): Promise<QuizResult[]> {
    const cacheKey = `wrong:${userId}`;
    const cachedWrong = await this.cache.get<QuizResult[]>(cacheKey);

    if (cachedWrong) {
      return cachedWrong;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/wrong-answers/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch wrong answers: ${response.statusText}`);
      }

      const wrongAnswers = await response.json();

      // 캐시에 저장 (5분)
      await this.cache.set(cacheKey, wrongAnswers, 300);

      return wrongAnswers;
    } catch (error) {
      console.error('Error fetching wrong answers:', error);
      return [];
    }
  }

  async addToWrongAnswers(result: QuizResult): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/wrong-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to wrong answers: ${response.statusText}`);
      }

      // 캐시 무효화
      await this.cache.invalidate(`wrong:${result.userId}:*`);
    } catch (error) {
      console.error('Error adding to wrong answers:', error);
    }
  }

  async removeFromWrongAnswers(userId: string, quizId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/wrong-answers/${userId}/${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to remove from wrong answers: ${response.statusText}`);
      }

      // 캐시 무효화
      await this.cache.invalidate(`wrong:${userId}:*`);
    } catch (error) {
      console.error('Error removing from wrong answers:', error);
    }
  }

  // 복습 시스템
  async getReviewQuizzes(userId: string): Promise<QuizBase[]> {
    try {
      const wrongAnswers = await this.getWrongAnswers(userId);
      const quizIds = wrongAnswers.map(result => result.quizId);

      const reviewQuizzes: QuizBase[] = [];
      for (const quizId of quizIds) {
        const quiz = await this.getQuizById(quizId);
        if (quiz) {
          reviewQuizzes.push(quiz);
        }
      }

      return reviewQuizzes;
    } catch (error) {
      console.error('Error getting review quizzes:', error);
      return [];
    }
  }

  async getSpacedRepetitionQuizzes(userId: string): Promise<QuizBase[]> {
    // 간격 반복 학습 알고리즘 구현
    // 현재는 기본적인 복습 퀴즈 반환
    return this.getReviewQuizzes(userId);
  }

  // 유틸리티 메서드들
  private async getOfflineQuizzes(level: QuizLevel): Promise<QuizBase[]> {
    // 오프라인 모드에서 사용할 목업 데이터
    const mockQuizzes = this.getFromLocalStorage(`offline_quizzes_${level}`, []);
    return mockQuizzes.map((data: any) => QuizFactory.createQuiz(data.type, data));
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      const existingData = this.getFromLocalStorage(key, []);
      existingData.push(data);
      localStorage.setItem(key, JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private getFromLocalStorage(key: string, defaultValue: any = null): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return defaultValue;
    }
  }
}