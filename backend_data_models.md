# 백엔드 데이터 모델 설계 (User Progression)

## 1. 핵심 엔티티 설계

### User Entity
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;

  // 관계
  progression: UserProgression;
  sessions: TestSession[];
  statistics: UserStatistics;
}
```

### UserProgression Entity (프론트엔드 UserProgressionState 매핑)
```typescript
interface UserProgression {
  id: string;
  userId: string;

  // 진행 상태 (frontend와 동일 구조)
  unlockedLevels: LevelId[];
  completedLevels: LevelId[];
  currentLevel: LevelId | null;

  // 레벨별 상세 통계
  levelStats: UserLevelStats[];

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
  version: number; // 낙관적 잠금용
}
```

### UserLevelStats Entity
```typescript
interface UserLevelStats {
  id: string;
  userProgressionId: string;
  levelId: LevelId;

  completionRate: number;
  attemptsUsed: number;
  maxAttempts: number;
  isCompleted: boolean;

  bestScore: number;
  averageScore: number;
  totalTimeSpent: number; // 밀리초

  firstAttemptAt: Date;
  lastAttemptAt: Date;
  completedAt: Date | null;
}
```

### TestSession Entity (프론트엔드 TestSession 확장)
```typescript
interface TestSession {
  id: string;
  userId: string;

  // 세션 정보
  levelId: LevelId;
  problemType: ProblemType;
  status: SessionStatus; // 'active' | 'completed' | 'abandoned'

  // 문제 정보
  problems: SessionProblem[];
  currentProblemIndex: number;
  totalProblems: number;

  // 시간 추적
  startTime: Date;
  endTime: Date | null;
  timeLimit: number | null;

  // 결과
  answers: SessionAnswer[];
  finalScore: number | null;

  // 메타데이터
  createdAt: Date;
  updatedAt: Date;
}
```

### SessionAnswer Entity
```typescript
interface SessionAnswer {
  id: string;
  sessionId: string;
  problemId: string;

  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // 밀리초
  attemptsCount: number;

  submittedAt: Date;
}
```

## 2. 문제 관리 엔티티

### Problem Entity (기존 mock 데이터 구조화)
```typescript
interface Problem {
  id: string;
  type: ProblemType;
  levelId: LevelId;
  category: string;

  // 문제 내용
  title: string;
  subtitle: string;
  description?: string;

  // 답안 정보
  correctAnswer: string;
  explanation: string;
  hints?: string[];

  // 난이도 및 메타데이터
  difficulty: number; // 1-10
  estimatedTime: number; // 초
  tags: string[];

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 3. 타입 정의

### Enums & Types
```typescript
type LevelId = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'challenge';
type ProblemType = 'OX' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'DEBUG' | 'CODE_REVIEW';
type SessionStatus = 'active' | 'completed' | 'abandoned' | 'expired';

interface LevelConfig {
  id: LevelId;
  order: number;
  name: string;
  maxAttempts: number;
  unlockRequirement: LevelId | null;
  problemTypes: ProblemType[];
}
```

## 4. 관계 매핑

### 관계 설정
- User 1:1 UserProgression
- UserProgression 1:N UserLevelStats
- User 1:N TestSession
- TestSession 1:N SessionAnswer
- Problem 1:N SessionAnswer (through TestSession)

## 5. 인덱스 전략

### 성능 최적화 인덱스
- UserProgression: userId (unique)
- UserLevelStats: (userProgressionId, levelId) (composite unique)
- TestSession: (userId, status, createdAt)
- SessionAnswer: (sessionId, problemId)
- Problem: (type, levelId, isActive)

## 6. 데이터 무결성 제약조건

### 비즈니스 규칙 제약
- unlockedLevels는 순차적이어야 함
- completedLevels ⊆ unlockedLevels
- maxAttempts 초과 불가
- 세션 시간 제한 검증

이 구조는 프론트엔드의 UserProgressionState와 1:1 매핑되면서, 확장성과 데이터 무결성을 보장합니다.