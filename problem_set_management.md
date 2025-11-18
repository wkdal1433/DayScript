# 문제 세트 관리 로직 설계

## 1. 현재 프론트엔드 구조 분석

### 기존 Mock 데이터 구조
현재 다음과 같은 문제 타입들이 구현되어 있음:

**OX 문제 (LV1 - 입문)**
- 위치: `src/data/problems/oxProblemsData.ts`
- 구조: `ProblemData` 인터페이스
- 특징: 이진 선택 (O/X), 이모지, 간단한 설명

**객관식 문제 (LV2 - 초급)**
- 위치: `src/data/problems/multipleChoiceProblemsData.ts`
- 구조: `MultipleChoiceProblemData` 인터페이스
- 특징: 4지선다, 선택지별 정답 여부

**빈칸 채우기 문제 (LV3 - 중급)**
- 위치: 구현 완료 (Lv3FillInTheBlankProblemScreen)
- 구조: `FillInTheBlankProblemData` 인터페이스
- 특징: 코드 블록, 다중 빈칸, 힌트 시스템

## 2. 문제 세트 관리 서비스 설계

### ProblemSetManager 클래스
```typescript
interface ProblemSetConfig {
  levelId: LevelId;
  problemType: ProblemType;
  count: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  categories?: string[];
  excludeIds?: string[];
  seed?: number; // 재현 가능한 랜덤
}

interface ProblemSet {
  id: string;
  config: ProblemSetConfig;
  problems: Problem[];
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
}

class ProblemSetManager {
  // 문제 세트 생성
  async generateProblemSet(config: ProblemSetConfig): Promise<ProblemSet> {
    // 1. 조건에 맞는 문제 풀에서 필터링
    // 2. 난이도 분산 적용
    // 3. 카테고리 균형 조정
    // 4. 중복 제거
    // 5. 랜덤 셔플 (시드 기반)
  }

  // 적응형 문제 선택
  async getAdaptiveProblemSet(
    userId: string,
    config: ProblemSetConfig
  ): Promise<ProblemSet> {
    // 1. 사용자 성취도 분석
    // 2. 약점 영역 식별
    // 3. 난이도 조정
    // 4. 맞춤형 문제 세트 생성
  }

  // 문제 세트 검증
  validateProblemSet(problemSet: ProblemSet): ValidationResult {
    // 1. 문제 수 검증
    // 2. 난이도 분포 검증
    // 3. 카테고리 분포 검증
    // 4. 중복 문제 검증
  }
}
```

## 3. 레벨별 문제 선택 전략

### 입문 (Beginner) - OX 문제
```typescript
const beginnerStrategy: ProblemSelectionStrategy = {
  levelId: 'beginner',
  problemType: 'OX',
  selectionCriteria: {
    difficulty: [1, 2, 3], // 1-10 스케일
    categoryDistribution: {
      'Python 기초': 40,
      'JavaScript 기초': 30,
      'HTML 기초': 20,
      'CSS 기초': 10
    },
    requiredCount: 20,
    timeLimit: 900000, // 15분
    shuffleMethod: 'weighted_random'
  }
};
```

### 초급 (Elementary) - 객관식 문제
```typescript
const elementaryStrategy: ProblemSelectionStrategy = {
  levelId: 'elementary',
  problemType: 'MULTIPLE_CHOICE',
  selectionCriteria: {
    difficulty: [2, 3, 4],
    categoryDistribution: {
      '기초 문법': 25,
      'JavaScript 배열': 25,
      'CSS 레이아웃': 25,
      'React Hooks': 25
    },
    requiredCount: 20,
    timeLimit: 900000,
    adaptiveAdjustment: true
  }
};
```

### 중급 (Intermediate) - 빈칸 채우기
```typescript
const intermediateStrategy: ProblemSelectionStrategy = {
  levelId: 'intermediate',
  problemType: 'FILL_IN_BLANK',
  selectionCriteria: {
    difficulty: [3, 4, 5, 6],
    categoryDistribution: {
      '제어문': 30,
      '함수': 30,
      '객체지향': 25,
      '에러 처리': 15
    },
    requiredCount: 25,
    timeLimit: 1200000, // 20분
    maxAttempts: 3,
    hintSystem: true
  }
};
```

## 4. 적응형 문제 선택 알고리즘

### 사용자 성취도 분석
```typescript
interface UserPerformanceAnalysis {
  userId: string;
  levelId: LevelId;
  categoryPerformance: {
    [category: string]: {
      accuracy: number;
      averageTime: number;
      attemptCount: number;
      lastAttemptDate: Date;
    }
  };
  overallTrends: {
    improvementRate: number;
    consistencyScore: number;
    timeManagementScore: number;
  };
  recommendedDifficulty: number;
}

class AdaptiveProblemSelector {
  analyzeUserPerformance(userId: string, levelId: LevelId): UserPerformanceAnalysis {
    // 1. 최근 세션 데이터 분석
    // 2. 카테고리별 성과 계산
    // 3. 학습 트렌드 분석
    // 4. 추천 난이도 계산
  }

  adjustProblemSelection(
    baseConfig: ProblemSetConfig,
    performance: UserPerformanceAnalysis
  ): ProblemSetConfig {
    // 1. 약점 영역에 더 많은 문제 배정
    // 2. 강점 영역은 난이도 상향 조정
    // 3. 시간 관리 능력에 따른 문제 수 조정
    // 4. 일관성 점수에 따른 복습 문제 포함
  }
}
```

## 5. 문제 풀 관리 시스템

### 문제 풀 구조
```typescript
interface ProblemPool {
  levelId: LevelId;
  problemType: ProblemType;
  problems: Map<string, Problem>;

  // 인덱싱
  byDifficulty: Map<number, string[]>;
  byCategory: Map<string, string[]>;
  byTags: Map<string, string[]>;

  // 메타데이터
  totalCount: number;
  lastUpdated: Date;
  version: number;
}

class ProblemPoolManager {
  private pools: Map<string, ProblemPool> = new Map();

  // 문제 풀 초기화 (앱 시작 시)
  async initializePools(): Promise<void> {
    // 1. 데이터베이스에서 모든 활성 문제 로드
    // 2. 레벨별, 타입별로 그룹화
    // 3. 인덱스 생성
    // 4. 메모리에 캐시
  }

  // 조건에 맞는 문제 검색
  findProblems(criteria: ProblemSearchCriteria): Problem[] {
    // 1. 다중 인덱스 교집합 연산
    // 2. 필터링 및 정렬
    // 3. 중복 제거
    // 4. 결과 반환
  }

  // 문제 풀 업데이트
  async updatePool(levelId: LevelId, problemType: ProblemType): Promise<void> {
    // 1. 변경된 문제 감지
    // 2. 증분 업데이트
    // 3. 인덱스 재구성
    // 4. 캐시 무효화
  }
}
```

## 6. 세션 생성 및 관리

### 세션 생성 플로우
```typescript
class SessionCreationService {
  async createSession(request: CreateSessionRequest): Promise<TestSession> {
    // 1. 사용자 권한 검증
    const canAccess = await this.validateLevelAccess(
      request.userId,
      request.levelId
    );

    // 2. 적응형 문제 세트 생성
    const userPerformance = await this.analyzeUserPerformance(
      request.userId,
      request.levelId
    );

    const problemSetConfig = this.adjustConfigForUser(
      request.baseConfig,
      userPerformance
    );

    const problemSet = await this.problemSetManager.generateProblemSet(
      problemSetConfig
    );

    // 3. 세션 객체 생성
    const session = await this.createSessionEntity({
      userId: request.userId,
      levelId: request.levelId,
      problemType: request.problemType,
      problems: problemSet.problems,
      startTime: new Date(),
      timeLimit: problemSetConfig.timeLimit
    });

    // 4. 세션 상태 추적 시작
    await this.sessionTracker.startTracking(session.id);

    return session;
  }

  private async validateLevelAccess(
    userId: string,
    levelId: LevelId
  ): Promise<boolean> {
    const progression = await this.userProgressionService.getProgression(userId);
    return progression.unlockedLevels.includes(levelId);
  }
}
```

## 7. 문제 난이도 자동 조정

### 동적 난이도 조정 시스템
```typescript
interface DifficultyAdjustmentMetrics {
  problemId: string;
  currentDifficulty: number;

  // 통계 데이터
  attemptCount: number;
  correctRate: number;
  averageTime: number;
  skipRate: number;

  // 조정 인자
  targetAccuracy: number; // 목표 정답률 (70-80%)
  adjustmentThreshold: number; // 조정 임계치
  lastAdjustedAt: Date;
}

class DifficultyAdjustmentEngine {
  async analyzeProblemPerformance(): Promise<void> {
    // 1. 모든 문제의 최근 성과 데이터 수집
    // 2. 정답률이 목표 범위를 벗어난 문제 식별
    // 3. 난이도 조정 제안 생성
    // 4. 점진적 난이도 업데이트
  }

  calculateNewDifficulty(
    currentDifficulty: number,
    metrics: DifficultyAdjustmentMetrics
  ): number {
    // 1. 정답률 기반 조정
    const accuracyAdjustment = this.calculateAccuracyAdjustment(
      metrics.correctRate,
      metrics.targetAccuracy
    );

    // 2. 시간 기반 조정
    const timeAdjustment = this.calculateTimeAdjustment(
      metrics.averageTime
    );

    // 3. 건너뛰기율 기반 조정
    const skipAdjustment = this.calculateSkipAdjustment(
      metrics.skipRate
    );

    // 4. 가중 평균으로 최종 난이도 계산
    return this.calculateWeightedDifficulty(
      currentDifficulty,
      [accuracyAdjustment, timeAdjustment, skipAdjustment]
    );
  }
}
```

## 8. 성능 최적화 전략

### 캐싱 전략
```typescript
interface CacheStrategy {
  // L1: 메모리 캐시 (빠른 액세스)
  memoryCache: {
    activeSessions: Map<string, TestSession>;
    popularProblems: Map<string, Problem>;
    userProgressions: Map<string, UserProgression>;
  };

  // L2: Redis 캐시 (중간 속도)
  redisCache: {
    problemSets: string; // 키 패턴: "problemset:{levelId}:{type}:{hash}"
    userStats: string;   // 키 패턴: "stats:{userId}:{levelId}"
  };

  // L3: 데이터베이스 (영구 저장)
  database: {
    problems: string;
    sessions: string;
    progressions: string;
  };
}

class CacheManager {
  async getProblemSet(config: ProblemSetConfig): Promise<ProblemSet | null> {
    // 1. 메모리 캐시 확인
    // 2. Redis 캐시 확인
    // 3. 데이터베이스에서 생성
    // 4. 상위 레벨 캐시에 저장
  }

  async invalidateUserCache(userId: string): Promise<void> {
    // 1. 메모리에서 사용자 관련 데이터 제거
    // 2. Redis에서 사용자 관련 키 삭제
    // 3. 의존성 있는 캐시 항목 무효화
  }
}
```

이 설계는 현재 프론트엔드 구조와 완벽히 호환되면서, 확장 가능하고 성능 최적화된 문제 세트 관리 시스템을 제공합니다.