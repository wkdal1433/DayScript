/**
 * 목업 분석 서비스 구현체
 * SOLID 원칙 중 ISP(인터페이스 분리) 적용
 */

import {
  IQuizAnalytics,
  QuizStatistics,
  UserPerformance,
  ProgressAnalytics
} from '../../quiz/core/domain/IQuizRepository';
import { QuizLevel } from '../../quiz/core/domain/QuizBase';

export class MockAnalytics implements IQuizAnalytics {
  private mockData = new Map<string, any>();

  async getQuizStatistics(quizId: string): Promise<QuizStatistics> {
    // 목업 데이터 생성
    const key = `quiz_stats_${quizId}`;
    let stats = this.mockData.get(key);

    if (!stats) {
      stats = {
        quizId,
        totalAttempts: Math.floor(Math.random() * 1000) + 100,
        correctAttempts: Math.floor(Math.random() * 600) + 50,
        averageTime: Math.floor(Math.random() * 120) + 30, // 30-150초
        difficultyRating: Math.random() * 5 + 1, // 1-6점
        popularityScore: Math.random() * 100, // 0-100점
      };

      // 정답률 계산
      stats.correctAttempts = Math.min(stats.correctAttempts, stats.totalAttempts);

      this.mockData.set(key, stats);
    }

    return stats;
  }

  async getUserPerformance(userId: string): Promise<UserPerformance> {
    const key = `user_performance_${userId}`;
    let performance = this.mockData.get(key);

    if (!performance) {
      const accuracy = Math.random() * 0.4 + 0.6; // 60-100%

      performance = {
        userId,
        overallAccuracy: accuracy,
        averageTime: Math.floor(Math.random() * 60) + 30, // 30-90초
        strongCategories: this.generateRandomCategories(2),
        weakCategories: this.generateRandomCategories(1),
        improvementAreas: this.generateRandomCategories(2),
        currentStreak: Math.floor(Math.random() * 20),
        longestStreak: Math.floor(Math.random() * 50) + 20,
      };

      this.mockData.set(key, performance);
    }

    return performance;
  }

  async getProgressAnalytics(userId: string): Promise<ProgressAnalytics> {
    const key = `progress_analytics_${userId}`;
    let analytics = this.mockData.get(key);

    if (!analytics) {
      analytics = {
        userId,
        levelProgress: {
          [QuizLevel.LV1]: Math.random() * 100,
          [QuizLevel.LV2]: Math.random() * 80,
          [QuizLevel.LV3]: Math.random() * 60,
          [QuizLevel.LV4]: Math.random() * 40,
          [QuizLevel.LV5]: Math.random() * 20,
        },
        weeklyProgress: this.generateRandomProgress(7),
        monthlyProgress: this.generateRandomProgress(30),
        learningVelocity: Math.random() * 10 + 5, // 5-15 문제/일
        estimatedCompletionTime: Math.floor(Math.random() * 30) + 10, // 10-40일
      };

      this.mockData.set(key, analytics);
    }

    return analytics;
  }

  private generateRandomCategories(count: number): string[] {
    const categories = [
      '변수와 자료형',
      '조건문',
      '반복문',
      '함수',
      '클래스',
      '모듈',
      '파일 처리',
      '예외 처리',
      '데이터 구조',
      '알고리즘',
    ];

    const shuffled = categories.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private generateRandomProgress(days: number): number[] {
    const progress = [];
    let current = Math.random() * 50 + 25; // 25-75 시작점

    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 10; // -5 ~ +5 변화
      current = Math.max(0, Math.min(100, current + change));
      progress.push(Math.round(current));
    }

    return progress;
  }

  // 사용자별 통계 업데이트 (실제 구현에서는 API 호출)
  async updateUserStatistics(userId: string, quizResult: any): Promise<void> {
    const performanceKey = `user_performance_${userId}`;
    const performance = await this.getUserPerformance(userId);

    // 간단한 통계 업데이트 로직
    if (quizResult.isCorrect) {
      performance.currentStreak += 1;
      performance.longestStreak = Math.max(performance.longestStreak, performance.currentStreak);
    } else {
      performance.currentStreak = 0;
    }

    this.mockData.set(performanceKey, performance);
  }

  // 캐시 클리어
  clearCache(): void {
    this.mockData.clear();
  }
}