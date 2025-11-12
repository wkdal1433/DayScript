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
    console.log(`🔍 [OFFLINE MODE] Getting quiz by ID: ${id}`);

    // CRITICAL FIX: 네트워크 요청 제거, Mock 데이터에서 검색
    const allMockQuizzes = [
      ...this.getMockQuizData('LV1'),
      ...this.getMockQuizData('LV2'),
      ...this.getMockQuizData('LV3')
    ];

    const foundQuiz = allMockQuizzes.find(quiz => quiz.id === id);
    if (!foundQuiz) {
      console.log(`❌ Quiz with ID ${id} not found in mock data`);
      return null;
    }

    try {
      return QuizFactory.createQuiz(foundQuiz.type, foundQuiz);
    } catch (error) {
      console.error('Error creating quiz object:', error);
      return null;
    }
  }

  async getQuizzesByLevel(level: QuizLevel): Promise<QuizBase[]> {
    console.log(`🎯 [OFFLINE MODE] Loading quizzes for level: ${level}`);

    // CRITICAL FIX: 네트워크 요청 완전 비활성화, 무조건 Mock 데이터 사용
    return this.getOfflineQuizzes(level);
  }

  async getQuizzesByType(type: QuizType): Promise<QuizBase[]> {
    console.log(`🏷️ [OFFLINE MODE] Getting quizzes by type: ${type}`);

    // CRITICAL FIX: 네트워크 요청 제거, Mock 데이터에서 타입별 필터링
    const allMockQuizzes = [
      ...this.getMockQuizData('LV1'),
      ...this.getMockQuizData('LV2'),
      ...this.getMockQuizData('LV3')
    ];

    const filteredQuizzes = allMockQuizzes.filter(quiz => quiz.type === type);

    try {
      return filteredQuizzes.map((data: any) => QuizFactory.createQuiz(data.type, data));
    } catch (error) {
      console.error('Error creating quiz objects:', error);
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
    console.log(`🔍 [OFFLINE MODE] Searching quizzes:`, query);

    // CRITICAL FIX: 네트워크 요청 제거, Mock 데이터에서 검색
    const allMockQuizzes = [
      ...this.getMockQuizData('LV1'),
      ...this.getMockQuizData('LV2'),
      ...this.getMockQuizData('LV3')
    ];

    let filteredQuizzes = allMockQuizzes;

    // 간단한 필터링 로직
    if (query.level) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.level === query.level);
    }
    if (query.type) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.type === query.type);
    }
    if (query.category) {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.category?.includes(query.category));
    }

    // 제한 적용
    if (query.limit) {
      filteredQuizzes = filteredQuizzes.slice(query.offset || 0, (query.offset || 0) + query.limit);
    }

    try {
      return filteredQuizzes.map((data: any) => QuizFactory.createQuiz(data.type, data));
    } catch (error) {
      console.error('Error creating quiz objects:', error);
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
    console.log(`💾 [OFFLINE MODE] Saving quiz result for userId: ${result.userId}`);

    // CRITICAL FIX: localStorage 제거, 단순 로깅으로 대체 (서버 구현 전까지)
    console.log('Quiz result saved (mock):', result);
  }

  async getQuizResults(userId: string, quizId?: string): Promise<QuizResult[]> {
    console.log(`📊 [OFFLINE MODE] Getting quiz results for userId: ${userId}`);

    // CRITICAL FIX: localStorage 제거, 빈 배열 반환 (서버 구현 전까지)
    return [];
  }

  async getQuizResultsByLevel(userId: string, level: QuizLevel): Promise<QuizResult[]> {
    console.log(`📊 [OFFLINE MODE] Getting quiz results for userId: ${userId}, level: ${level}`);

    // CRITICAL FIX: 네트워크 요청 제거, 빈 배열 반환
    return [];
  }

  // 진행 상황 관리
  async getQuizProgress(userId: string): Promise<QuizProgress[]> {
    console.log(`📋 [OFFLINE MODE] Getting quiz progress for userId: ${userId}`);

    // CRITICAL FIX: 네트워크 요청 제거, 빈 배열 반환
    return [];
  }

  async updateQuizProgress(progress: QuizProgress): Promise<void> {
    console.log(`🔄 [OFFLINE MODE] Updating quiz progress:`, progress);

    // CRITICAL FIX: 네트워크 요청 제거, 단순 로깅으로 대체
    console.log('Quiz progress updated (mock):', progress);
  }

  // 오답노트 관리
  async getWrongAnswers(userId: string): Promise<QuizResult[]> {
    console.log(`🚫 [OFFLINE MODE] Getting wrong answers for userId: ${userId}`);

    // CRITICAL FIX: 네트워크 요청 제거, 빈 배열 반환
    return [];
  }

  async addToWrongAnswers(result: QuizResult): Promise<void> {
    console.log(`➕ [OFFLINE MODE] Adding to wrong answers:`, result);

    // CRITICAL FIX: 네트워크 요청 제거, 단순 로깅으로 대체
    console.log('Added to wrong answers (mock):', result);
  }

  async removeFromWrongAnswers(userId: string, quizId: string): Promise<void> {
    console.log(`➖ [OFFLINE MODE] Removing from wrong answers - userId: ${userId}, quizId: ${quizId}`);

    // CRITICAL FIX: 네트워크 요청 제거, 단순 로깅으로 대체
    console.log('Removed from wrong answers (mock):', { userId, quizId });
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
    console.log(`🎲 [MOCK DATA] Loading mock quizzes for level: ${level}`);

    // CRITICAL FIX: localStorage 완전 제거, 하드코딩된 Mock 데이터 사용
    const mockQuizzesData = this.getMockQuizData(level);

    try {
      return mockQuizzesData.map((data: any) => QuizFactory.createQuiz(data.type, data));
    } catch (error) {
      console.error('Error creating quiz objects from mock data:', error);
      return [];
    }
  }

  private getMockQuizData(level: QuizLevel): any[] {
    console.log(`🔧 Generating mock quiz data for level: ${level}`);

    // React Native 환경에서 안전한 Mock 데이터 반환
    const mockData = {
      'LV1': [
        {
          id: 'mock_ox_001',
          type: 'OX',
          title: 'Python에서 리스트는',
          subtitle: '가변(mutable) 자료형이다.',
          correctAnswer: 'O',
          explanation: '리스트는 생성 후에도 요소를 추가, 삭제, 수정할 수 있는 가변 자료형입니다.',
          category: 'Python 기초',
          level: 'LV1',
          difficulty: 'easy',
          tags: ['python', 'basic'],
          timeLimit: 30000,
          points: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'mock_ox_002',
          type: 'OX',
          title: 'JavaScript에서 var 키워드는',
          subtitle: '블록 스코프를 갖는다.',
          correctAnswer: 'X',
          explanation: 'var 키워드는 함수 스코프를 가지며, let과 const가 블록 스코프를 갖습니다.',
          category: 'JavaScript 기초',
          level: 'LV1',
          difficulty: 'easy',
          tags: ['javascript', 'basic'],
          timeLimit: 30000,
          points: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'mock_ox_003',
          type: 'OX',
          title: 'HTML에서 <div> 태그는',
          subtitle: '인라인 요소이다.',
          correctAnswer: 'X',
          explanation: '<div> 태그는 블록 레벨 요소로, 전체 너비를 차지하고 새 줄에서 시작합니다.',
          category: 'HTML 기초',
          level: 'LV1',
          difficulty: 'easy',
          tags: ['html', 'basic'],
          timeLimit: 30000,
          points: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      'LV2': [
        {
          id: 'mock_mc_001',
          type: 'MULTIPLE_CHOICE',
          question: 'Python에서 가변 자료형은?',
          choices: [
            { id: 'a', text: 'tuple' },
            { id: 'b', text: 'string' },
            { id: 'c', text: 'list' },
            { id: 'd', text: 'int' }
          ],
          correctAnswer: 'c',
          explanation: 'list는 가변 자료형으로 요소를 추가, 삭제, 수정할 수 있습니다.',
          category: 'Python 심화',
          level: 'LV2',
          difficulty: 'medium',
          tags: ['python', 'intermediate'],
          timeLimit: 45000,
          points: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      'LV3': []
    };

    return mockData[level] || [];
  }
}