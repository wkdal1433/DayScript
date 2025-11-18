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
          id: 'ox_001',
          type: 'OX',
          question: 'CPU는 한 번에 여러 개의 프로세스를 동시에 실행할 수 있다.',
          correctAnswer: false,
          explanation: 'CPU는 실제로는 한 번에 하나의 프로세스만 실행할 수 있습니다. 멀티태스킹은 CPU가 매우 빠른 속도로 여러 프로세스 간에 전환하면서 동시에 실행되는 것처럼 보이게 하는 것입니다.',
          category: '컴퓨터 시스템',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['cpu', 'process', 'system'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '멀티태스킹과 실제 동시 실행의 차이를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: 'CPU 코어가 하나일 때를 가정해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_002',
          type: 'OX',
          question: 'RAM은 휘발성 메모리로, 전원이 꺼지면 저장된 데이터가 사라진다.',
          correctAnswer: true,
          explanation: 'RAM(Random Access Memory)은 휘발성 메모리입니다. 전원이 공급되지 않으면 저장된 모든 데이터가 사라지므로, 중요한 데이터는 하드디스크 같은 비휘발성 저장장치에 저장해야 합니다.',
          category: '컴퓨터 하드웨어',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['memory', 'ram', 'hardware'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '휘발성과 비휘발성 메모리의 차이를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '컴퓨터를 껐다 켤 때 어떤 일이 일어나는지 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_003',
          type: 'OX',
          question: 'HTTP는 보안 프로토콜로 데이터를 암호화하여 전송한다.',
          correctAnswer: false,
          explanation: 'HTTP(HyperText Transfer Protocol)는 암호화되지 않은 프로토콜입니다. 데이터 보안을 위해서는 HTTPS(HTTP Secure)를 사용해야 하며, 이는 SSL/TLS를 통해 데이터를 암호화합니다.',
          category: '네트워크',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['http', 'security', 'network'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: 'HTTP와 HTTPS의 차이점을 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: 'SSL/TLS가 필요한 이유를 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_004',
          type: 'OX',
          question: 'Python에서 리스트는 가변(mutable) 자료형이다.',
          correctAnswer: true,
          explanation: 'Python의 리스트는 가변 자료형입니다. 리스트를 생성한 후에도 요소를 추가(append), 삭제(remove), 수정할 수 있습니다. 반면 튜플은 불변(immutable) 자료형입니다.',
          category: 'Python 기초',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['python', 'list', 'mutable'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '가변과 불변 자료형의 차이를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '리스트와 튜플의 차이점을 비교해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_005',
          type: 'OX',
          question: 'JavaScript에서 var 키워드는 블록 스코프를 갖는다.',
          correctAnswer: false,
          explanation: 'JavaScript의 var 키워드는 함수 스코프를 가집니다. 블록 스코프를 가지는 것은 ES6에서 도입된 let과 const 키워드입니다. var는 블록 내에서 선언되어도 해당 함수 전체에서 접근 가능합니다.',
          category: 'JavaScript 기초',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['javascript', 'scope', 'var'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '함수 스코프와 블록 스코프의 차이를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: 'ES6의 let, const와 var의 차이점을 비교해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_006',
          type: 'OX',
          question: 'HTML에서 <div> 태그는 인라인 요소이다.',
          correctAnswer: false,
          explanation: '<div> 태그는 블록 레벨 요소입니다. 블록 레벨 요소는 전체 너비를 차지하고 새로운 줄에서 시작합니다. 인라인 요소의 예로는 <span>, <a>, <strong> 등이 있습니다.',
          category: 'HTML 기초',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['html', 'element', 'block'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '블록 레벨 요소와 인라인 요소의 차이를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '<span> 태그와 <div> 태그의 차이점을 비교해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_007',
          type: 'OX',
          question: 'SQL에서 PRIMARY KEY는 중복된 값을 가질 수 있다.',
          correctAnswer: false,
          explanation: 'PRIMARY KEY는 테이블에서 각 행을 고유하게 식별하는 키입니다. 따라서 중복된 값을 가질 수 없으며, NULL 값도 허용하지 않습니다. 이를 통해 데이터의 무결성을 보장합니다.',
          category: '데이터베이스',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['sql', 'primary-key', 'database'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: 'PRIMARY KEY의 기본 특성을 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '데이터 무결성과 고유성의 관계를 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_008',
          type: 'OX',
          question: 'Git에서 commit은 로컬 저장소에만 변경사항을 저장한다.',
          correctAnswer: true,
          explanation: 'Git의 commit 명령은 변경사항을 로컬 저장소에만 저장합니다. 원격 저장소에 변경사항을 업로드하려면 push 명령을 별도로 실행해야 합니다. 이는 Git의 분산 버전 관리 시스템의 특징입니다.',
          category: '버전 관리',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['git', 'commit', 'version-control'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: 'commit과 push의 차이점을 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '로컬 저장소와 원격 저장소의 관계를 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_009',
          type: 'OX',
          question: 'CSS에서 margin과 padding은 동일한 역할을 한다.',
          correctAnswer: false,
          explanation: 'margin과 padding은 서로 다른 역할을 합니다. padding은 요소의 내용과 테두리 사이의 공간을 의미하고, margin은 요소와 다른 요소들 사이의 공간을 의미합니다. 즉, padding은 내부 여백, margin은 외부 여백입니다.',
          category: 'CSS 기초',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['css', 'margin', 'padding'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '내부 여백과 외부 여백의 차이를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: 'CSS Box Model을 떠올려보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_010',
          type: 'OX',
          question: '객체지향 프로그래밍에서 상속은 코드 재사용성을 높이는 방법이다.',
          correctAnswer: true,
          explanation: '상속은 객체지향 프로그래밍의 핵심 개념으로, 부모 클래스의 속성과 메서드를 자식 클래스가 물려받아 사용할 수 있게 합니다. 이를 통해 중복 코드를 줄이고 코드 재사용성을 높일 수 있습니다.',
          category: '객체지향 프로그래밍',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['oop', 'inheritance', 'programming'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: '부모 클래스와 자식 클래스의 관계를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '코드 중복을 줄이는 방법을 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_011',
          type: 'OX',
          question: '알고리즘의 시간복잡도 O(1)은 상수 시간 복잡도를 의미한다.',
          correctAnswer: true,
          explanation: 'O(1)은 Big O 표기법에서 상수 시간 복잡도를 나타냅니다. 이는 입력 크기에 관계없이 항상 일정한 시간이 걸리는 알고리즘을 의미합니다. 예를 들어, 배열에서 특정 인덱스의 값에 접근하는 것은 O(1)입니다.',
          category: '알고리즘',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['algorithm', 'time-complexity', 'big-o'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: 'Big O 표기법의 의미를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '입력 크기와 실행 시간의 관계를 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_012',
          type: 'OX',
          question: 'REST API에서 GET 메서드는 서버의 데이터를 수정할 수 있다.',
          correctAnswer: false,
          explanation: 'REST API의 GET 메서드는 idempotent(멱등)하며, 서버의 상태를 변경하지 않는 안전한 메서드입니다. 데이터를 조회하는 용도로만 사용해야 하며, 데이터 수정은 PUT, PATCH, POST 등의 메서드를 사용해야 합니다.',
          category: 'API',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['rest-api', 'http-methods', 'web'],
          timeLimit: 30,
          points: 10,
          hints: [
            { id: 'h1', content: 'HTTP 메서드의 용도를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '안전한 메서드와 그렇지 않은 메서드를 구분해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_011',
          type: 'OX',
          title: '알고리즘의 시간복잡도 O(1)은',
          subtitle: '상수 시간 복잡도를 의미한다.',
          question: '알고리즘의 시간복잡도 O(1)은 상수 시간 복잡도를 의미한다.',
          correctAnswer: true,
          explanation: 'O(1)은 Big O 표기법에서 상수 시간 복잡도를 나타냅니다. 이는 입력 크기에 관계없이 항상 일정한 시간이 걸리는 알고리즘을 의미합니다. 예를 들어, 배열에서 특정 인덱스의 값에 접근하는 것은 O(1)입니다.',
          category: '알고리즘',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['algorithm', 'time-complexity', 'big-o'],
          timeLimit: 30,
          points: 10,
          emoji: '⏱️',
          hints: [
            { id: 'h1', content: 'Big O 표기법의 의미를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '입력 크기와 실행 시간의 관계를 생각해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
        },
        {
          id: 'ox_012',
          type: 'OX',
          title: 'REST API에서 GET 메서드는',
          subtitle: '서버의 데이터를 수정할 수 있다.',
          question: 'REST API에서 GET 메서드는 서버의 데이터를 수정할 수 있다.',
          correctAnswer: false,
          explanation: 'REST API의 GET 메서드는 idempotent(멱등)하며, 서버의 상태를 변경하지 않는 안전한 메서드입니다. 데이터를 조회하는 용도로만 사용해야 하며, 데이터 수정은 PUT, PATCH, POST 등의 메서드를 사용해야 합니다.',
          category: 'API',
          level: 'LV1',
          difficulty: 'BEGINNER',
          tags: ['rest-api', 'http-methods', 'web'],
          timeLimit: 30,
          points: 10,
          emoji: '🔗',
          hints: [
            { id: 'h1', content: 'HTTP 메서드의 용도를 생각해보세요.', level: 'BASIC', pointsPenalty: 2 },
            { id: 'h2', content: '안전한 메서드와 그렇지 않은 메서드를 구분해보세요.', level: 'INTERMEDIATE', pointsPenalty: 3 }
          ]
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