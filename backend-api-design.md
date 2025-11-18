# DayScript 백엔드 API 설계 문서

## 개요

DayScript 학습 플랫폼의 UserProgressionState 로직을 기반으로 한 백엔드 시스템 설계 문서입니다. 순차적 레벨 진행, 문제 유형별 매핑, 사용자 진도 관리를 지원하는 REST API를 설계합니다.

---

## 1. 데이터베이스 스키마 설계

### 1.1 사용자 관리 (Users)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,

    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

### 1.2 학습 레벨 정의 (Learning_Levels)

```sql
CREATE TABLE learning_levels (
    id VARCHAR(20) PRIMARY KEY, -- 'beginner', 'elementary', 'intermediate', 'advanced', 'challenge'
    name VARCHAR(50) NOT NULL,
    subtitle VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    problem_count INT NOT NULL,
    time_estimate VARCHAR(20) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    max_attempts INT NOT NULL DEFAULT 999,
    order_index INT NOT NULL,
    problem_type ENUM('OX', 'MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'DEBUGGING', 'LIVE_CODING') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,

    UNIQUE KEY uk_order_index (order_index)
);

-- 초기 데이터 삽입
INSERT INTO learning_levels VALUES
('beginner', '입문', 'Python 기초 문법', 'O/X 퀴즈로 기본 개념을 확실하게 다져보아요.', '🌱', 20, '15분', '쉬움', 999, 1, 'OX', TRUE),
('elementary', '초급', 'Python 응용 문법', '객관식 문제로 기본 문법을 응용해보아요.', '📚', 20, '15분', '쉬움', 999, 2, 'MULTIPLE_CHOICE', TRUE),
('intermediate', '중급', '제어문과 함수', '빈칸 채우기 퀴즈로 문법과 흐름을 직접 완성해보아요.', '🚀', 25, '20분', '보통', 3, 3, 'FILL_IN_BLANK', TRUE),
('advanced', '고급', '객체지향과 고급 문법', '디버깅 모드에서 오류를 찾고 문제 해결력을 키워보아요.', '💎', 30, '25분', '어려움', 999, 4, 'DEBUGGING', TRUE),
('challenge', '챌린저', '실전 문제 도전', '코드 리뷰와 라이브 코딩으로 실전 감각을 완성해보아요.', '🏆', 15, '10분', '최고난이도', 999, 5, 'LIVE_CODING', TRUE);
```

### 1.3 사용자 진도 관리 (User_Progression)

```sql
CREATE TABLE user_progression (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    level_id VARCHAR(20) NOT NULL,
    is_unlocked BOOLEAN DEFAULT FALSE,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_rate DECIMAL(5,2) DEFAULT 0.00, -- 0.00 ~ 100.00
    attempts_used INT DEFAULT 0,
    max_attempts INT NOT NULL,
    first_unlocked_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    last_attempt_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_level (user_id, level_id),
    INDEX idx_user_id (user_id),
    INDEX idx_level_id (level_id),
    INDEX idx_completion_status (is_completed, completed_at)
);
```

### 1.4 문제 정의 (Problems)

```sql
CREATE TABLE problems (
    id VARCHAR(50) PRIMARY KEY,
    level_id VARCHAR(20) NOT NULL,
    problem_type ENUM('OX', 'MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'DEBUGGING', 'LIVE_CODING') NOT NULL,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(300),
    content TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    emoji VARCHAR(10),
    difficulty_score INT DEFAULT 1, -- 1-10
    estimated_time_seconds INT DEFAULT 60,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE CASCADE,
    INDEX idx_level_type (level_id, problem_type),
    INDEX idx_category (category),
    INDEX idx_difficulty (difficulty_score)
);
```

### 1.5 객관식 문제 선택지 (Problem_Choices)

```sql
CREATE TABLE problem_choices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    problem_id VARCHAR(50) NOT NULL,
    choice_id VARCHAR(5) NOT NULL, -- 'A', 'B', 'C', 'D'
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    display_order INT NOT NULL,

    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    UNIQUE KEY uk_problem_choice (problem_id, choice_id),
    INDEX idx_problem_id (problem_id)
);
```

### 1.6 학습 세션 관리 (Learning_Sessions)

```sql
CREATE TABLE learning_sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    level_id VARCHAR(20) NOT NULL,
    session_type ENUM('PRACTICE', 'TEST', 'REVIEW') DEFAULT 'PRACTICE',
    total_problems INT NOT NULL,
    current_problem_index INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    total_time_seconds INT DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES learning_levels(id) ON DELETE CASCADE,
    INDEX idx_user_sessions (user_id, started_at),
    INDEX idx_level_sessions (level_id, started_at)
);
```

### 1.7 사용자 답안 기록 (User_Answers)

```sql
CREATE TABLE user_answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(100) NOT NULL,
    problem_id VARCHAR(50) NOT NULL,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (session_id) REFERENCES learning_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    INDEX idx_session_answers (session_id, answered_at),
    INDEX idx_user_performance (problem_id, is_correct),
    INDEX idx_answer_time (answered_at)
);
```

---

## 2. REST API 엔드포인트 설계

### 2.1 인증 관리

#### POST /api/auth/register
**사용자 회원가입**

```json
// Request
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123!"
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2024-11-01T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/auth/login
**사용자 로그인**

```json
// Request
{
  "username": "john_doe",
  "password": "securePassword123!"
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "last_login": "2024-11-01T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

### 2.2 사용자 진도 관리

#### GET /api/users/{userId}/progression
**사용자 전체 진도 조회**

```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "user_id": 1,
    "current_level": "elementary",
    "unlocked_levels": ["beginner", "elementary"],
    "completed_levels": ["beginner"],
    "level_stats": {
      "beginner": {
        "completion_rate": 100.00,
        "attempts_used": 1,
        "max_attempts": 999,
        "is_completed": true,
        "completed_at": "2024-11-01T09:30:00Z"
      },
      "elementary": {
        "completion_rate": 45.00,
        "attempts_used": 0,
        "max_attempts": 999,
        "is_completed": false,
        "completed_at": null
      },
      "intermediate": {
        "completion_rate": 0.00,
        "attempts_used": 0,
        "max_attempts": 3,
        "is_completed": false,
        "completed_at": null
      },
      "advanced": {
        "completion_rate": 0.00,
        "attempts_used": 0,
        "max_attempts": 999,
        "is_completed": false,
        "completed_at": null
      },
      "challenge": {
        "completion_rate": 0.00,
        "attempts_used": 0,
        "max_attempts": 999,
        "is_completed": false,
        "completed_at": null
      }
    },
    "total_completion_rate": 40.00,
    "last_updated": "2024-11-01T10:00:00Z"
  }
}
```

#### PUT /api/users/{userId}/progression/levels/{levelId}/complete
**레벨 완료 처리 및 다음 레벨 해금**

```json
// Request
{
  "session_id": "session_1730455200_abc123def",
  "completion_rate": 85.5,
  "total_time_seconds": 900
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "completed_level": {
      "level_id": "beginner",
      "completion_rate": 85.5,
      "completed_at": "2024-11-01T10:15:00Z"
    },
    "unlocked_level": {
      "level_id": "elementary",
      "unlocked_at": "2024-11-01T10:15:00Z"
    },
    "updated_progression": {
      "unlocked_levels": ["beginner", "elementary"],
      "completed_levels": ["beginner"],
      "current_level": "elementary"
    }
  },
  "message": "레벨이 완료되었으며, 다음 레벨이 해금되었습니다."
}
```

### 2.3 학습 레벨 정보

#### GET /api/levels
**전체 학습 레벨 목록 조회**

```json
// Response (200 OK)
{
  "success": true,
  "data": [
    {
      "id": "beginner",
      "name": "입문",
      "subtitle": "Python 기초 문법",
      "description": "O/X 퀴즈로 기본 개념을 확실하게 다져보아요.",
      "emoji": "🌱",
      "problem_count": 20,
      "time_estimate": "15분",
      "difficulty": "쉬움",
      "max_attempts": 999,
      "order_index": 1,
      "problem_type": "OX"
    },
    {
      "id": "elementary",
      "name": "초급",
      "subtitle": "Python 응용 문법",
      "description": "객관식 문제로 기본 문법을 응용해보아요.",
      "emoji": "📚",
      "problem_count": 20,
      "time_estimate": "15분",
      "difficulty": "쉬움",
      "max_attempts": 999,
      "order_index": 2,
      "problem_type": "MULTIPLE_CHOICE"
    }
  ]
}
```

#### GET /api/levels/{levelId}/unlock-status/{userId}
**특정 레벨의 해금 상태 확인**

```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "level_id": "intermediate",
    "is_unlocked": false,
    "unlock_condition": "초급 단계를 완료해야 합니다",
    "required_level": "elementary",
    "required_level_completed": false,
    "attempts_remaining": 3,
    "can_start": false
  }
}
```

### 2.4 문제 관리

#### GET /api/levels/{levelId}/problems
**특정 레벨의 문제 목록 조회**

```json
// Query Parameters: ?count=10&random=true&exclude_answered=false

// Response (200 OK)
{
  "success": true,
  "data": {
    "level_id": "beginner",
    "problem_type": "OX",
    "total_available": 15,
    "problems": [
      {
        "id": "ox_001",
        "title": "Python에서 리스트는",
        "subtitle": "가변(mutable) 자료형이다.",
        "correct_answer": "O",
        "explanation": "리스트는 생성 후에도 요소를 추가, 삭제, 수정할 수 있는 가변 자료형입니다.",
        "category": "Python 기초",
        "emoji": "🤔",
        "difficulty_score": 2,
        "estimated_time_seconds": 30
      }
    ]
  }
}
```

#### GET /api/problems/{problemId}
**특정 문제 상세 조회**

```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "id": "mc_001",
    "level_id": "elementary",
    "problem_type": "MULTIPLE_CHOICE",
    "title": "Python에서 함수를 정의할 때 사용하는",
    "subtitle": "키워드는 무엇일까요?",
    "content": "Python에서 새로운 함수를 정의할 때 사용하는 키워드를 선택하세요.",
    "category": "기초 문법 : 함수 정의",
    "emoji": "🔧",
    "choices": [
      {
        "choice_id": "A",
        "choice_text": "function",
        "display_order": 1
      },
      {
        "choice_id": "B",
        "choice_text": "define",
        "display_order": 2
      },
      {
        "choice_id": "C",
        "choice_text": "def",
        "display_order": 3
      },
      {
        "choice_id": "D",
        "choice_text": "func",
        "display_order": 4
      }
    ],
    "difficulty_score": 1,
    "estimated_time_seconds": 45
  }
}
```

### 2.5 학습 세션 관리

#### POST /api/sessions
**새 학습 세션 생성**

```json
// Request
{
  "user_id": 1,
  "level_id": "beginner",
  "session_type": "PRACTICE",
  "problem_count": 10
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "session_id": "session_1730455200_abc123def",
    "user_id": 1,
    "level_id": "beginner",
    "session_type": "PRACTICE",
    "total_problems": 10,
    "current_problem_index": 0,
    "started_at": "2024-11-01T10:00:00Z",
    "problems": [
      {
        "id": "ox_001",
        "title": "Python에서 리스트는",
        "subtitle": "가변(mutable) 자료형이다."
      }
    ]
  }
}
```

#### GET /api/sessions/{sessionId}
**세션 정보 조회**

```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "session_id": "session_1730455200_abc123def",
    "user_id": 1,
    "level_id": "beginner",
    "session_type": "PRACTICE",
    "total_problems": 10,
    "current_problem_index": 3,
    "is_completed": false,
    "started_at": "2024-11-01T10:00:00Z",
    "progress": {
      "current": 3,
      "total": 10,
      "percentage": 30
    },
    "current_problem": {
      "id": "ox_003",
      "title": "Python에서 튜플은",
      "subtitle": "불변(immutable) 자료형이다."
    }
  }
}
```

#### POST /api/sessions/{sessionId}/answers
**답안 제출**

```json
// Request
{
  "problem_id": "ox_001",
  "user_answer": "O",
  "time_spent_seconds": 25
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "answer_id": 1001,
    "is_correct": true,
    "correct_answer": "O",
    "explanation": "리스트는 생성 후에도 요소를 추가, 삭제, 수정할 수 있는 가변 자료형입니다.",
    "next_problem": {
      "id": "ox_002",
      "title": "JavaScript에서 var 키워드는",
      "subtitle": "블록 스코프를 갖는다."
    },
    "session_progress": {
      "current": 2,
      "total": 10,
      "percentage": 20
    }
  }
}
```

#### PUT /api/sessions/{sessionId}/complete
**세션 완료 처리**

```json
// Request
{
  "total_time_seconds": 450
}

// Response (200 OK)
{
  "success": true,
  "data": {
    "session_id": "session_1730455200_abc123def",
    "completed_at": "2024-11-01T10:07:30Z",
    "session_stats": {
      "correct_answers": 8,
      "total_answers": 10,
      "accuracy": 80.0,
      "total_time_seconds": 450,
      "average_time_per_problem": 45.0
    },
    "level_completion": {
      "level_id": "beginner",
      "completion_rate": 80.0,
      "is_completed": true,
      "next_level_unlocked": "elementary"
    }
  }
}
```

### 2.6 통계 및 분석

#### GET /api/users/{userId}/statistics
**사용자 학습 통계 조회**

```json
// Response (200 OK)
{
  "success": true,
  "data": {
    "user_id": 1,
    "overall_stats": {
      "total_sessions": 15,
      "completed_sessions": 12,
      "total_problems_attempted": 150,
      "total_problems_correct": 120,
      "overall_accuracy": 80.0,
      "total_study_time_seconds": 6750,
      "average_session_time": 562.5,
      "levels_completed": 2,
      "current_streak": 5
    },
    "level_breakdown": {
      "beginner": {
        "sessions_completed": 3,
        "best_accuracy": 90.0,
        "average_accuracy": 85.0,
        "total_time_seconds": 1350,
        "completed_at": "2024-10-28T14:30:00Z"
      },
      "elementary": {
        "sessions_completed": 2,
        "best_accuracy": 75.0,
        "average_accuracy": 72.5,
        "total_time_seconds": 1800,
        "completed_at": "2024-10-30T16:45:00Z"
      }
    },
    "recent_activity": [
      {
        "date": "2024-11-01",
        "sessions": 1,
        "problems_solved": 10,
        "accuracy": 80.0
      }
    ]
  }
}
```

---

## 3. 데이터 검증 및 보안 고려사항

### 3.1 입력 데이터 검증

#### 사용자 입력 검증
```java
// UserRegistrationRequest 검증
@Valid
public class UserRegistrationRequest {
    @NotBlank(message = "사용자명은 필수입니다")
    @Size(min = 3, max = 50, message = "사용자명은 3-50자여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "사용자명은 영문, 숫자, _, -만 가능합니다")
    private String username;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Size(max = 100, message = "이메일은 100자를 초과할 수 없습니다")
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 100, message = "비밀번호는 8-100자여야 합니다")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]",
             message = "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다")
    private String password;
}
```

#### 답안 제출 검증
```java
// AnswerSubmissionRequest 검증
@Valid
public class AnswerSubmissionRequest {
    @NotBlank(message = "문제 ID는 필수입니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "올바르지 않은 문제 ID 형식입니다")
    private String problemId;

    @NotBlank(message = "답안은 필수입니다")
    @Size(max = 1000, message = "답안은 1000자를 초과할 수 없습니다")
    private String userAnswer;

    @Min(value = 1, message = "소요 시간은 1초 이상이어야 합니다")
    @Max(value = 3600, message = "소요 시간은 1시간을 초과할 수 없습니다")
    private Integer timeSpentSeconds;
}
```

### 3.2 인증 및 권한 관리

#### JWT 토큰 기반 인증
```java
@Component
public class JwtTokenProvider {
    private static final String SECRET_KEY = "${jwt.secret}";
    private static final long EXPIRATION_TIME = 86400000; // 24시간

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

#### 권한 기반 접근 제어
```java
@PreAuthorize("hasRole('USER') and #userId == authentication.principal.id")
@GetMapping("/api/users/{userId}/progression")
public ResponseEntity<ApiResponse<UserProgressionDto>> getUserProgression(
    @PathVariable Long userId) {
    // 사용자는 자신의 진도만 조회 가능
}

@PreAuthorize("hasRole('USER') and @sessionService.isSessionOwner(#sessionId, authentication.principal.id)")
@PostMapping("/api/sessions/{sessionId}/answers")
public ResponseEntity<ApiResponse<AnswerResultDto>> submitAnswer(
    @PathVariable String sessionId,
    @Valid @RequestBody AnswerSubmissionRequest request) {
    // 사용자는 자신의 세션에만 답안 제출 가능
}
```

### 3.3 비율 제한 (Rate Limiting)

```java
@RestController
@RateLimiter(name = "api", fallbackMethod = "rateLimitFallback")
public class LearningController {

    // 답안 제출: 분당 30회 제한
    @RateLimiter(name = "answer-submission", fallbackMethod = "answerSubmissionLimitExceeded")
    @PostMapping("/api/sessions/{sessionId}/answers")
    public ResponseEntity<ApiResponse<AnswerResultDto>> submitAnswer(...) {
        // Implementation
    }

    public ResponseEntity<ApiResponse<String>> answerSubmissionLimitExceeded(Exception ex) {
        return ResponseEntity.status(429)
            .body(ApiResponse.error("답안 제출 한도를 초과했습니다. 잠시 후 다시 시도해주세요."));
    }
}
```

### 3.4 데이터 무결성 보장

```java
@Service
@Transactional
public class ProgressionService {

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public UserProgressionDto completeLevelWithUnlock(Long userId, String levelId,
                                                     SessionCompletionRequest request) {
        // 1. 동시성 제어를 위한 비관적 락
        UserProgression progression = progressionRepository
            .findByUserIdAndLevelIdWithLock(userId, levelId)
            .orElseThrow(() -> new EntityNotFoundException("진도 정보를 찾을 수 없습니다"));

        // 2. 비즈니스 규칙 검증
        validateLevelCompletion(progression, request);

        // 3. 레벨 완료 처리
        progression.markAsCompleted(request.getCompletionRate());

        // 4. 다음 레벨 해금 (순차적 진행 보장)
        String nextLevelId = getNextLevelInSequence(levelId);
        if (nextLevelId != null) {
            unlockNextLevel(userId, nextLevelId);
        }

        return convertToDto(progression);
    }

    private void validateLevelCompletion(UserProgression progression,
                                       SessionCompletionRequest request) {
        if (progression.isCompleted()) {
            throw new BusinessException("이미 완료된 레벨입니다");
        }

        if (request.getCompletionRate() < 60.0) {
            throw new BusinessException("60% 이상의 정확도가 필요합니다");
        }

        // 중급 레벨 시도 횟수 검증
        if ("intermediate".equals(progression.getLevelId()) &&
            progression.getAttemptsUsed() >= progression.getMaxAttempts()) {
            throw new BusinessException("최대 시도 횟수를 초과했습니다");
        }
    }
}
```

---

## 4. 클라이언트-서버 동기화 전략

### 4.1 순차적 레벨 해금 동기화

```java
@EventListener
@Async
public class ProgressionEventListener {

    @EventListener
    public void handleLevelCompletion(LevelCompletionEvent event) {
        // 실시간 진도 업데이트 알림
        String message = String.format("레벨 '%s'을 완료했습니다!", event.getLevelName());

        webSocketService.sendToUser(event.getUserId(),
            NotificationDto.builder()
                .type("LEVEL_COMPLETED")
                .message(message)
                .data(event.getProgressionData())
                .build());

        // 다음 레벨 해금 알림
        if (event.getUnlockedLevelId() != null) {
            webSocketService.sendToUser(event.getUserId(),
                NotificationDto.builder()
                    .type("LEVEL_UNLOCKED")
                    .message(String.format("새 레벨 '%s'이 해금되었습니다!", event.getUnlockedLevelName()))
                    .data(Map.of("unlockedLevel", event.getUnlockedLevelId()))
                    .build());
        }
    }
}
```

### 4.2 세션 상태 동기화

```javascript
// 클라이언트 측 세션 동기화 전략
class SessionSyncManager {
    constructor(sessionId, apiClient) {
        this.sessionId = sessionId;
        this.apiClient = apiClient;
        this.syncInterval = 30000; // 30초마다 동기화
        this.lastSyncTime = Date.now();
        this.pendingAnswers = [];
    }

    // 답안 제출 시 즉시 동기화 + 백업
    async submitAnswer(problemId, userAnswer, timeSpent) {
        const answerData = {
            problem_id: problemId,
            user_answer: userAnswer,
            time_spent_seconds: timeSpent,
            submitted_at: new Date().toISOString()
        };

        try {
            // 즉시 서버 전송 시도
            const response = await this.apiClient.post(
                `/api/sessions/${this.sessionId}/answers`,
                answerData
            );

            this.lastSyncTime = Date.now();
            return response.data;
        } catch (error) {
            // 네트워크 오류 시 로컬 저장
            this.pendingAnswers.push(answerData);
            this.saveToLocalStorage();
            throw error;
        }
    }

    // 주기적 동기화 (누락된 답안 재전송)
    async syncPendingAnswers() {
        if (this.pendingAnswers.length === 0) return;

        for (const answer of this.pendingAnswers) {
            try {
                await this.apiClient.post(
                    `/api/sessions/${this.sessionId}/answers`,
                    answer
                );

                // 성공 시 대기열에서 제거
                this.pendingAnswers = this.pendingAnswers.filter(
                    a => a.problem_id !== answer.problem_id
                );
            } catch (error) {
                console.warn('답안 동기화 실패:', answer.problem_id, error);
            }
        }

        this.saveToLocalStorage();
        this.lastSyncTime = Date.now();
    }

    // 세션 복구 (앱 재시작 시)
    async recoverSession() {
        const localData = this.loadFromLocalStorage();
        if (localData) {
            this.pendingAnswers = localData.pendingAnswers || [];
            await this.syncPendingAnswers();
        }

        // 서버에서 최신 세션 상태 조회
        const sessionData = await this.apiClient.get(`/api/sessions/${this.sessionId}`);
        return sessionData.data;
    }
}
```

### 4.3 실시간 진도 업데이트

```java
@Controller
public class ProgressionWebSocketController {

    @MessageMapping("/progression.subscribe")
    @SendToUser("/queue/progression-updates")
    public void subscribeToProgressionUpdates(Principal principal) {
        // 사용자의 현재 진도 상태 전송
        Long userId = getUserIdFromPrincipal(principal);
        UserProgressionDto progression = progressionService.getUserProgression(userId);

        messagingTemplate.convertAndSendToUser(
            principal.getName(),
            "/queue/progression-updates",
            progression
        );
    }

    @EventListener
    public void handleProgressionUpdate(ProgressionUpdateEvent event) {
        // 진도 변경 시 실시간 알림
        messagingTemplate.convertAndSendToUser(
            event.getUsername(),
            "/queue/progression-updates",
            event.getUpdatedProgression()
        );
    }
}
```

### 4.4 오프라인 모드 지원

```javascript
// Service Worker를 활용한 오프라인 데이터 캐싱
class OfflineDataManager {
    constructor() {
        this.dbName = 'DayScriptOfflineDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                // 오프라인 답안 저장소
                if (!this.db.objectStoreNames.contains('offline_answers')) {
                    const answerStore = this.db.createObjectStore('offline_answers', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    answerStore.createIndex('session_id', 'session_id', {unique: false});
                    answerStore.createIndex('submitted_at', 'submitted_at', {unique: false});
                }

                // 캐시된 문제 저장소
                if (!this.db.objectStoreNames.contains('cached_problems')) {
                    const problemStore = this.db.createObjectStore('cached_problems', {
                        keyPath: 'id'
                    });
                    problemStore.createIndex('level_id', 'level_id', {unique: false});
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    // 오프라인 답안 저장
    async storeOfflineAnswer(sessionId, problemId, userAnswer, timeSpent) {
        const transaction = this.db.transaction(['offline_answers'], 'readwrite');
        const store = transaction.objectStore('offline_answers');

        await store.add({
            session_id: sessionId,
            problem_id: problemId,
            user_answer: userAnswer,
            time_spent_seconds: timeSpent,
            submitted_at: new Date().toISOString(),
            synced: false
        });
    }

    // 온라인 복구 시 동기화
    async syncOfflineAnswers(apiClient) {
        const transaction = this.db.transaction(['offline_answers'], 'readwrite');
        const store = transaction.objectStore('offline_answers');
        const index = store.index('synced');

        const unsyncedAnswers = await index.getAll(false);

        for (const answer of unsyncedAnswers) {
            try {
                await apiClient.post(`/api/sessions/${answer.session_id}/answers`, {
                    problem_id: answer.problem_id,
                    user_answer: answer.user_answer,
                    time_spent_seconds: answer.time_spent_seconds
                });

                // 동기화 완료 표시
                answer.synced = true;
                await store.put(answer);
            } catch (error) {
                console.warn('오프라인 답안 동기화 실패:', answer.id, error);
            }
        }
    }
}
```

---

## 5. 추가 고려사항

### 5.1 성능 최적화

- **데이터베이스 인덱싱**: 자주 조회되는 필드에 적절한 인덱스 설정
- **쿼리 최적화**: N+1 문제 방지를 위한 페치 조인 활용
- **캐싱 전략**: Redis를 활용한 문제 데이터 및 사용자 세션 캐싱
- **페이지네이션**: 대용량 데이터 조회 시 페이지 단위 처리

### 5.2 모니터링 및 로깅

- **API 성능 모니터링**: 응답 시간, 에러율, 처리량 추적
- **사용자 행동 분석**: 학습 패턴, 문제 난이도별 정답률 분석
- **시스템 상태 감시**: 데이터베이스 연결, 메모리 사용량 모니터링

### 5.3 확장성 고려

- **마이크로서비스 아키텍처**: 사용자 관리, 문제 관리, 세션 관리 서비스 분리
- **수평적 확장**: 로드 밸런서를 통한 다중 인스턴스 운영
- **데이터베이스 샤딩**: 사용자 수 증가에 따른 데이터베이스 분산

이 설계를 통해 DayScript 플랫폼의 순차적 학습 진행 시스템을 안정적이고 확장 가능하게 구현할 수 있습니다.