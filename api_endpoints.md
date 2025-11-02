# API 엔드포인트 사양 정의

## 1. 사용자 진행 상태 관리 API

### GET /api/users/{userId}/progression
**목적**: 사용자의 현재 진행 상태 조회

**Request**:
```typescript
// Path Parameters
userId: string

// Query Parameters (optional)
includeStats?: boolean = true
includeLevelDetails?: boolean = false
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": "progression_uuid",
    "userId": "user_uuid",
    "unlockedLevels": ["beginner", "elementary"],
    "completedLevels": ["beginner"],
    "currentLevel": "elementary",
    "levelStats": {
      "beginner": {
        "completionRate": 100,
        "attemptsUsed": 1,
        "maxAttempts": 999,
        "isCompleted": true,
        "bestScore": 95,
        "averageScore": 95,
        "totalTimeSpent": 900000
      },
      "elementary": {
        "completionRate": 0,
        "attemptsUsed": 0,
        "maxAttempts": 999,
        "isCompleted": false,
        "bestScore": 0,
        "averageScore": 0,
        "totalTimeSpent": 0
      }
    },
    "updatedAt": "2024-01-15T10:30:00Z",
    "version": 1
  }
}
```

### POST /api/users/{userId}/progression/complete-level
**목적**: 레벨 완료 처리 및 다음 레벨 자동 해제

**Request**:
```typescript
{
  "levelId": "beginner",
  "sessionId": "session_uuid",
  "finalScore": 95,
  "completionTime": 900000, // 밀리초
  "totalCorrectAnswers": 19,
  "totalQuestions": 20
}
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "updatedProgression": {
      "unlockedLevels": ["beginner", "elementary"],
      "completedLevels": ["beginner"],
      "currentLevel": "elementary"
    },
    "levelUnlocked": "elementary",
    "achievements": ["first_level_complete"],
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Level completed successfully. Elementary level unlocked!"
}
```

### PUT /api/users/{userId}/progression
**목적**: 진행 상태 업데이트 (관리자/시스템용)

**Request**:
```typescript
{
  "unlockedLevels": ["beginner", "elementary", "intermediate"],
  "completedLevels": ["beginner", "elementary"],
  "currentLevel": "intermediate",
  "version": 2 // 낙관적 잠금
}
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": "progression_uuid",
    "updatedProgression": {...},
    "version": 3,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## 2. 테스트 세션 관리 API

### POST /api/sessions
**목적**: 새로운 테스트 세션 생성

**Request**:
```typescript
{
  "userId": "user_uuid",
  "levelId": "beginner",
  "problemType": "OX",
  "problemCount": 10,
  "timeLimit": 900000 // 선택적, 밀리초
}
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "sessionId": "session_uuid",
    "levelId": "beginner",
    "problemType": "OX",
    "problems": [
      {
        "id": "problem_uuid",
        "title": "Python에서 리스트는",
        "subtitle": "가변(mutable) 자료형이다.",
        "category": "Python 기초",
        "correctAnswer": "O", // 클라이언트에서는 숨김
        "choices": null // OX 문제는 null
      }
    ],
    "currentProblemIndex": 0,
    "totalProblems": 10,
    "startTime": "2024-01-15T10:30:00Z",
    "timeLimit": 900000,
    "status": "active"
  }
}
```

### GET /api/sessions/{sessionId}
**목적**: 세션 상태 조회

**Response**:
```typescript
{
  "success": true,
  "data": {
    "id": "session_uuid",
    "status": "active",
    "currentProblemIndex": 3,
    "totalProblems": 10,
    "timeRemaining": 720000,
    "answers": [
      {
        "problemId": "problem_1",
        "userAnswer": "O",
        "isCorrect": true,
        "timeSpent": 15000,
        "submittedAt": "2024-01-15T10:31:00Z"
      }
    ]
  }
}
```

### POST /api/sessions/{sessionId}/submit-answer
**목적**: 답안 제출 및 검증

**Request**:
```typescript
{
  "problemId": "problem_uuid",
  "userAnswer": "O",
  "timeSpent": 15000
}
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctAnswer": "O",
    "explanation": "리스트는 생성 후에도 요소를 추가, 삭제, 수정할 수 있는 가변 자료형입니다.",
    "nextProblem": {
      "id": "next_problem_uuid",
      "title": "다음 문제",
      "subtitle": "...",
      "category": "Python 기초"
    },
    "sessionProgress": {
      "currentIndex": 4,
      "totalProblems": 10,
      "correctAnswers": 3,
      "timeRemaining": 720000
    }
  }
}
```

### POST /api/sessions/{sessionId}/complete
**목적**: 세션 완료 처리

**Request**:
```typescript
{
  "reason": "finished" | "timeout" | "abandoned",
  "finalAnswers": [
    {
      "problemId": "problem_uuid",
      "userAnswer": "O",
      "timeSpent": 15000
    }
  ]
}
```

**Response**:
```typescript
{
  "success": true,
  "data": {
    "sessionResult": {
      "finalScore": 85,
      "correctAnswers": 17,
      "totalQuestions": 20,
      "totalTimeSpent": 720000,
      "accuracy": 85
    },
    "levelProgress": {
      "isLevelCompleted": true,
      "newLevelUnlocked": "elementary",
      "progressionUpdated": true
    },
    "detailedResults": [
      {
        "problemId": "problem_1",
        "isCorrect": true,
        "userAnswer": "O",
        "correctAnswer": "O",
        "timeSpent": 15000
      }
    ]
  }
}
```

## 3. 문제 관리 API

### GET /api/problems
**목적**: 문제 목록 조회 (관리자용)

**Query Parameters**:
```typescript
levelId?: LevelId
problemType?: ProblemType
category?: string
page?: number = 1
limit?: number = 20
includeInactive?: boolean = false
```

### GET /api/problems/random
**목적**: 랜덤 문제 세트 생성

**Query Parameters**:
```typescript
levelId: LevelId
problemType: ProblemType
count: number = 10
excludeIds?: string[] // 이미 푼 문제 제외
```

### POST /api/problems
**목적**: 새로운 문제 생성 (관리자용)

## 4. 통계 및 분석 API

### GET /api/users/{userId}/statistics
**목적**: 사용자 학습 통계 조회

**Response**:
```typescript
{
  "success": true,
  "data": {
    "overall": {
      "totalSessionsCompleted": 15,
      "totalTimeSpent": 14400000,
      "averageAccuracy": 87,
      "levelsCompleted": 2,
      "totalProblemsAttempted": 150
    },
    "byLevel": {
      "beginner": {
        "sessionsCompleted": 5,
        "bestScore": 95,
        "averageScore": 89,
        "totalTimeSpent": 4500000,
        "lastAttemptAt": "2024-01-15T10:30:00Z"
      }
    },
    "recentActivity": [
      {
        "date": "2024-01-15",
        "sessionCount": 2,
        "totalTime": 1800000,
        "averageScore": 92
      }
    ]
  }
}
```

## 5. 에러 응답 형식

### 표준 에러 응답
```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid level progression",
    "details": {
      "field": "levelId",
      "reason": "Previous level not completed"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 주요 에러 코드
- `INVALID_PROGRESSION`: 진행 순서 위반
- `SESSION_EXPIRED`: 세션 만료
- `INSUFFICIENT_ATTEMPTS`: 시도 횟수 초과
- `CONCURRENT_MODIFICATION`: 동시 수정 충돌
- `VALIDATION_ERROR`: 입력 값 검증 실패
- `UNAUTHORIZED_ACCESS`: 권한 없음

## 6. 보안 고려사항

### 인증 및 권한
- 모든 API는 JWT 토큰 기반 인증 필요
- `Authorization: Bearer <token>` 헤더 필수
- 사용자는 자신의 데이터만 접근 가능

### 데이터 검증
- 서버 측에서 모든 답안 검증 수행
- 클라이언트에서 전송된 정답은 무시
- 시간 측정도 서버에서 재검증

### Rate Limiting
- 세션 생성: 사용자당 5개/분
- 답안 제출: 세션당 60개/분
- 진행 상태 조회: 사용자당 100개/분

이 API 설계는 프론트엔드의 요구사항을 완전히 지원하면서, 확장성과 보안을 보장합니다.