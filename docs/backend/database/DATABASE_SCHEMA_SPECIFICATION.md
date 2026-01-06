# 🗄️ DayScript Integrated Backend Database Schema Specification

> **목표**: 프런트엔드 모든 기능(P0~P3)을 지원하는 확장 가능한 통합 데이터베이스 스키마

**버전**: 1.0.0
**최종 업데이트**: 2025-11-20
**데이터베이스**: PostgreSQL 14+ (권장) / MySQL 8.0+
**설계 원칙**: 정규화, 확장성, 성능, 데이터 무결성

---

## 📋 목차

1. [개요](#개요)
2. [데이터베이스 아키텍처](#데이터베이스-아키텍처)
3. [핵심 테이블 스키마](#핵심-테이블-스키마)
4. [관계도 (ERD)](#관계도-erd)
5. [인덱스 전략](#인덱스-전략)
6. [확장성 고려사항](#확장성-고려사항)
7. [API 엔드포인트 매핑](#api-엔드포인트-매핑)
8. [마이그레이션 전략](#마이그레이션-전략)

---

## 개요

### 설계 목표
- ✅ 프론트엔드 15개 화면의 모든 데이터 요구사항 지원
- ✅ P0~P3 우선순위 기능 전체 커버
- ✅ 향후 기능 확장 가능한 유연한 구조
- ✅ 대용량 데이터 처리 가능한 성능 최적화

### 주요 기능 커버리지
| 기능 영역 | 지원 테이블 | 레벨 | 상태 |
|---------|-----------|------|------|
| 사용자 관리 | users, user_settings | All | ✅ 완료 |
| 학습 진도 | user_progress, problem_attempts | All | ✅ 완료 |
| 문제 은행 | quiz_problems | LV1-LV6 | ✅ 완료 |
| LV1: OX 퀴즈 | quiz_problems (type='OX') | LV1 | ✅ 완료 |
| LV2: 객관식 | quiz_problems (type='MULTIPLE_CHOICE') | LV2 | ✅ 완료 |
| LV3: 빈칸 채우기 | quiz_problems (type='FILL_IN_BLANK') | LV3 | ✅ 완료 |
| LV4: 디버깅 | quiz_problems (type='DEBUGGING') | LV4 | ✅ 완료 |
| LV5: Challenger (PR Review) | pr_scenarios, code_reviews | LV5 | ✅ 완료 |
| LV6: Vibe Coding | vibe_sessions, vibe_messages, problem_attempts | LV6 | ✅ 완료 |
| 커뮤니티 | community_posts, post_comments, post_votes | All | ✅ 완료 |
| 알림 시스템 | notifications, notification_preferences | All | ✅ 완료 |
| 오답노트 | mistake_notes | All | ✅ 완료 |
| 성취 시스템 | achievements, user_achievements | All | ✅ 완료 |
| 랭킹 | user_rankings (materialized view) | All | ✅ 완료 |

---

## 데이터베이스 아키텍처

### LV5/LV6 분리 아키텍처 명세

**핵심 설계 원칙:**
DayScript는 Problem Domain Engine을 중심으로 LV1부터 LV6까지 통합 관리하되, LV5와 LV6을 명확히 분리합니다.

#### 레벨별 아키텍처 구조

| 레벨 | 타입 | 핵심 테이블 | 평가 지표 | 특징 |
|------|------|------------|----------|------|
| **LV1** | OX | quiz_problems | is_correct, score | 단순 참/거짓 판단 |
| **LV2** | MULTIPLE_CHOICE | quiz_problems | is_correct, score | 객관식 선택 |
| **LV3** | FILL_IN_BLANK | quiz_problems | is_correct, score | 빈칸 채우기 |
| **LV4** | DEBUGGING | quiz_problems, problem_attempts | test_cases_passed, code_quality_score | 코드 디버깅 |
| **LV5** | CODE_REVIEW | pr_scenarios, code_reviews | accuracy, correct_actions | PR 리뷰 (Challenger) |
| **LV6** | VIBE_CODING | vibe_sessions, problem_attempts | token_usage, prompt_quality, code_quality_score | AI 대화형 코딩 |

#### LV5 vs LV6 명확한 분리

**LV5: Challenger Mode (PR Review)**
- **목적**: 실전 코드 리뷰 능력 배양
- **방식**: 주어진 PR의 변경사항을 분석하고 approve/request_changes/reject 결정
- **핵심 테이블**:
  - `pr_scenarios`: PR 시나리오 데이터
  - `code_reviews`: 사용자 리뷰 제출 기록
  - `pr_scenario_solutions`: 정답 기준
- **평가 지표**:
  - `correct_actions`: 올바른 지적 개수
  - `accuracy`: 정확도 (%)
  - `time_taken_seconds`: 소요 시간
- **데이터 흐름**: pr_scenarios → 사용자 리뷰 → code_reviews → 채점

**LV6: Vibe Coding (AI-Powered Coding)**
- **목적**: AI와 대화하며 코드 작성 능력 배양
- **방식**: 자연어 프롬프트로 AI와 대화하며 문제 해결
- **핵심 테이블**:
  - `quiz_problems (type='VIBE_CODING')`: 문제 정의
  - `vibe_sessions`: 세션 메타데이터 및 평가
  - `vibe_messages`: 대화 내역 상세 로그
  - `problem_attempts`: 통합 기록 (vibe_session_id FK 포함)
- **평가 지표**:
  - `token_usage`: 사용한 AI 토큰 수
  - `prompt_quality_score`: 프롬프트 품질
  - `code_quality_score`: 최종 코드 품질
  - `test_cases_passed`: 통과한 테스트 케이스 수
- **데이터 흐름**: quiz_problems → vibe_sessions → vibe_messages → problem_attempts

#### 통합 기록 관리: problem_attempts 테이블

모든 레벨(LV1-LV6)의 풀이 기록은 `problem_attempts` 테이블에 저장되며, LV6의 경우 `vibe_session_id` FK를 통해 상세 대화 내역과 연결됩니다.

**공통 필드** (모든 레벨):
- `user_answer`, `is_correct`, `score`, `time_taken_seconds`, `hints_used_count`

**LV4/LV6 전용 필드**:
- `code_quality_score`: 코드 품질 점수
- `test_cases_passed`, `test_cases_total`: 테스트 결과

**LV6 전용 필드**:
- `token_usage`: AI 토큰 사용량
- `vibe_session_id`: 상세 대화 세션 참조

### 테이블 그룹 구조 (LV5/LV6 분리 반영)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DayScript Database                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────┐  ┌──────────────────────────┐  ┌──────────────┐          │
│  │ User Module  │  │   Problem Engine Module   │  │Community Mod │          │
│  ├──────────────┤  ├──────────────────────────┤  ├──────────────┤          │
│  │ users        │  │ quiz_problems (LV1-LV6) │  │community_posts│          │
│  │user_settings │  │ - OX (LV1)              │  │post_comments │          │
│  │user_progress │  │ - MULTIPLE_CHOICE (LV2) │  │post_votes    │          │
│  │user_rankings │  │ - FILL_IN_BLANK (LV3)   │  │              │          │
│  └──────────────┘  │ - DEBUGGING (LV4)       │  └──────────────┘          │
│                     │ - CODE_REVIEW (LV5)     │                             │
│                     │ - VIBE_CODING (LV6)     │                             │
│                     │ problem_attempts        │                             │
│                     │ mistake_notes           │                             │
│                     └──────────────────────────┘                             │
│                                                                               │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐              │
│  │Notif Module  │  │ LV5: Challenger  │  │ LV6: Vibe Coding │              │
│  ├──────────────┤  ├──────────────────┤  ├──────────────────┤              │
│  │notifications │  │ pr_scenarios     │  │ vibe_sessions    │              │
│  │notif_prefs   │  │ code_reviews     │  │ vibe_messages    │              │
│  │              │  │ pr_scenario_sol  │  │ (+ attempts)     │              │
│  └──────────────┘  └──────────────────┘  └──────────────────┘              │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────┐              │
│  │              Achievement & Quest Module                   │              │
│  ├──────────────────────────────────────────────────────────┤              │
│  │ achievements, user_achievements                          │              │
│  │ daily_quests, user_daily_quests                          │              │
│  └──────────────────────────────────────────────────────────┘              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 핵심 테이블 스키마

### 1. users (사용자)
**목적**: 사용자 인증 및 기본 프로필 정보 관리

```sql
CREATE TABLE users (
    -- Primary Key
    user_id             BIGSERIAL PRIMARY KEY,

    -- Authentication
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    oauth_provider      VARCHAR(50),  -- 'kakao', 'google', 'github', null
    oauth_provider_id   VARCHAR(255),

    -- Profile
    username            VARCHAR(50) UNIQUE NOT NULL,
    display_name        VARCHAR(100) NOT NULL,
    avatar_url          TEXT,
    bio                 TEXT,

    -- Learning Stats (Denormalized for performance)
    current_level       INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),
    total_experience    INTEGER DEFAULT 0,
    current_rank        INTEGER,
    streak_days         INTEGER DEFAULT 0,
    last_study_date     DATE,

    -- Status
    is_active           BOOLEAN DEFAULT true,
    is_verified         BOOLEAN DEFAULT false,
    email_verified_at   TIMESTAMP,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    last_login_at       TIMESTAMP,
    deleted_at          TIMESTAMP,  -- Soft delete

    -- Indexes will be defined separately
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS '사용자 계정 및 프로필 정보';
COMMENT ON COLUMN users.streak_days IS '연속 학습 일수 (일일 퀘스트 기반)';
COMMENT ON COLUMN users.current_rank IS '전체 사용자 중 순위 (Materialized View에서 업데이트)';
```

---

### 2. user_settings (사용자 설정)
**목적**: 개인화 설정 및 앱 환경 설정 관리

```sql
CREATE TABLE user_settings (
    setting_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Learning Settings
    daily_goal_minutes  INTEGER DEFAULT 30,
    preferred_language  VARCHAR(20) DEFAULT 'Python',  -- 'Python', 'JavaScript', 'Java'
    difficulty_level    INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),

    -- Notification Settings
    push_enabled        BOOLEAN DEFAULT true,
    quest_reminder      BOOLEAN DEFAULT true,
    reminder_time       TIME DEFAULT '20:00:00',
    community_notif     BOOLEAN DEFAULT true,
    achievement_notif   BOOLEAN DEFAULT true,

    -- App Settings
    theme_mode          VARCHAR(10) DEFAULT 'light',  -- 'light', 'dark', 'auto'
    font_size           VARCHAR(10) DEFAULT 'medium', -- 'small', 'medium', 'large'
    language            VARCHAR(10) DEFAULT 'ko',     -- 'ko', 'en'

    -- Privacy Settings
    profile_public      BOOLEAN DEFAULT true,
    show_rank           BOOLEAN DEFAULT true,
    show_streak         BOOLEAN DEFAULT true,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

COMMENT ON TABLE user_settings IS '사용자별 개인화 설정';
```

---

### 3. user_progress (학습 진도)
**목적**: 사용자별 레벨 진행 상황 및 학습 통계

```sql
CREATE TABLE user_progress (
    progress_id         BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Level Progress
    unlocked_levels     INTEGER[] DEFAULT ARRAY[1],  -- Array of unlocked level numbers
    completed_levels    INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    current_level       INTEGER DEFAULT 1,

    -- Overall Statistics (레벨별 통계는 user_level_statistics 테이블로 분리)
    total_problems_attempted  INTEGER DEFAULT 0,
    total_problems_solved     INTEGER DEFAULT 0,
    total_hints_used          INTEGER DEFAULT 0,
    total_study_time_minutes  INTEGER DEFAULT 0,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

COMMENT ON TABLE user_progress IS '사용자별 학습 진도 (레벨별 상세 통계는 user_level_statistics 참조)';

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
```

---

### 3-1. user_level_statistics (레벨별 상세 통계)
**목적**: 레벨별 학습 통계 (확장 가능한 구조)

```sql
CREATE TABLE user_level_statistics (
    stat_id             BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    level               INTEGER NOT NULL CHECK (level BETWEEN 1 AND 10),  -- 확장 가능

    -- Performance Metrics
    accuracy            DECIMAL(5,2) DEFAULT 0.00,
    problems_attempted  INTEGER DEFAULT 0,
    problems_solved     INTEGER DEFAULT 0,
    average_time_seconds INTEGER DEFAULT 0,
    
    -- Progress Tracking
    best_score          DECIMAL(5,2) DEFAULT 0.00,
    last_attempt_at     TIMESTAMP,
    
    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, level),
    CONSTRAINT valid_accuracy CHECK (accuracy BETWEEN 0 AND 100),
    CONSTRAINT valid_best_score CHECK (best_score BETWEEN 0 AND 100)
);

COMMENT ON TABLE user_level_statistics IS '레벨별 학습 통계 (레벨 확장 시 스키마 변경 불필요)';

CREATE INDEX idx_level_stats_user ON user_level_statistics(user_id, level);
CREATE INDEX idx_level_stats_performance ON user_level_statistics(user_id, accuracy DESC);
```

---

### 4. quiz_problems (문제)
**목적**: 통합 문제 은행 (LV1-LV6 전체 지원)

**레벨별 문제 타입 매핑:**
- **LV1**: OX - 단순 참/거짓 문제
- **LV2**: MULTIPLE_CHOICE - 객관식 문제
- **LV3**: FILL_IN_BLANK - 빈칸 채우기 문제
- **LV4**: DEBUGGING - 코드 디버깅 문제 (test_cases 필수)
- **LV5**: CODE_REVIEW - PR 리뷰 문제 (pr_scenarios 테이블과 연동)
- **LV6**: VIBE_CODING - AI 대화형 코딩 문제 (vibe_sessions 테이블과 연동)

```sql
CREATE TYPE problem_type AS ENUM (
    'OX',              -- LV1: True/False
    'MULTIPLE_CHOICE', -- LV2: Multiple Choice
    'FILL_IN_BLANK',   -- LV3: Fill in the Blank
    'DEBUGGING',       -- LV4: Code Debugging
    'CODE_REVIEW',     -- LV5: PR Review (pr_scenarios 참조)
    'VIBE_CODING'      -- LV6: AI-Powered Coding (vibe_sessions 참조)
);

CREATE TYPE problem_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE programming_language AS ENUM ('Python', 'JavaScript', 'Java', 'TypeScript', 'C++', 'Go');

CREATE TABLE quiz_problems (
    problem_id          BIGSERIAL PRIMARY KEY,

    -- Problem Classification
    level               INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),  -- Extended to LV6
    type                problem_type NOT NULL,
    difficulty          problem_difficulty NOT NULL,
    language            programming_language NOT NULL,

    -- Content
    title               TEXT NOT NULL,
    description         TEXT NOT NULL,
    question            TEXT NOT NULL,

    -- Answer Data (JSON for flexibility)
    correct_answer      JSONB NOT NULL,
    -- LV1 OX: {"answer": "O"}
    -- LV2 MC: {"answer": "A", "options": ["A", "B", "C", "D"]}
    -- LV3 BLANK: {"answer": "while", "blanks": [{"position": 1, "answer": "while"}]}
    -- LV4 DEBUG: {"fixed_code": "...", "test_results": [...]}
    -- LV5 CODE_REVIEW: Stored in pr_scenarios table
    -- LV6 VIBE: {"test_results": [...], "quality_threshold": 80}

    options             JSONB,  -- LV2: Multiple choice options
    code_snippet        TEXT,   -- LV3, LV4, LV6: Code to work with
    test_cases          JSONB,  -- LV4, LV6: Test cases (input/output pairs)

    -- Hints (Progressive disclosure)
    hint_1              TEXT,
    hint_2              TEXT,
    hint_3              TEXT,

    -- Metadata
    tags                TEXT[],  -- ['array', 'sorting', 'medium']
    category            VARCHAR(50),
    estimated_time_minutes INTEGER DEFAULT 5 CHECK (estimated_time_minutes > 0),

    -- Statistics (Denormalized)
    attempt_count       INTEGER DEFAULT 0 CHECK (attempt_count >= 0),
    success_count       INTEGER DEFAULT 0 CHECK (success_count >= 0),
    average_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (average_accuracy BETWEEN 0 AND 100),

    -- Status
    is_published        BOOLEAN DEFAULT false,
    is_premium          BOOLEAN DEFAULT false,

    -- Metadata
    created_by          BIGINT REFERENCES users(user_id),
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    CONSTRAINT success_not_exceed_attempt CHECK (success_count <= attempt_count)
);

COMMENT ON TABLE quiz_problems IS '통합 문제 은행 (LV1-LV6)';
COMMENT ON COLUMN quiz_problems.level IS '문제 레벨 (1=OX, 2=객관식, 3=빈칸, 4=디버깅, 5=PR리뷰, 6=Vibe코딩)';
COMMENT ON COLUMN quiz_problems.type IS '문제 타입 ENUM (레벨과 1:1 매핑)';
COMMENT ON COLUMN quiz_problems.test_cases IS 'LV4 (Debugging) & LV6 (Vibe Coding): 테스트 케이스 [{input, output}]';
COMMENT ON COLUMN quiz_problems.code_snippet IS 'LV3, LV4, LV6: 문제 코드 스니펫';

CREATE INDEX idx_quiz_level_type ON quiz_problems(level, type);
CREATE INDEX idx_quiz_language ON quiz_problems(language);
CREATE INDEX idx_quiz_difficulty ON quiz_problems(difficulty);
CREATE INDEX idx_quiz_tags ON quiz_problems USING GIN(tags);
CREATE INDEX idx_quiz_published ON quiz_problems(is_published) WHERE is_published = true;
CREATE INDEX idx_quiz_level_lang_pub ON quiz_problems(level, language, is_published);
```

---

### 5. problem_attempts (문제 풀이 기록)
**목적**: 사용자별 문제 풀이 이력 및 분석 데이터 (모든 레벨 지원)

```sql
CREATE TABLE problem_attempts (
    attempt_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    problem_id          BIGINT NOT NULL REFERENCES quiz_problems(problem_id) ON DELETE CASCADE,

    -- Attempt Data (All Levels: LV1-LV6)
    user_answer         JSONB NOT NULL,
    is_correct          BOOLEAN NOT NULL,
    score               DECIMAL(5,2) DEFAULT 0.00 CHECK (score BETWEEN 0 AND 100),

    -- Performance Metrics (All Levels)
    time_taken_seconds  INTEGER NOT NULL CHECK (time_taken_seconds > 0),
    hints_used_count    INTEGER DEFAULT 0 CHECK (hints_used_count >= 0),
    hints_used          INTEGER[],  -- Array of hint numbers used [1, 2]

    -- LV4 (Debugging) & LV6 (Vibe Coding) Specific Metrics
    code_quality_score  DECIMAL(5,2) CHECK (code_quality_score IS NULL OR code_quality_score BETWEEN 0 AND 100),
    token_usage         INTEGER CHECK (token_usage IS NULL OR token_usage > 0),
    test_cases_passed   INTEGER CHECK (test_cases_passed IS NULL OR test_cases_passed >= 0),
    test_cases_total    INTEGER CHECK (test_cases_total IS NULL OR test_cases_total >= 0),

    -- LV6 Specific: Link to detailed session (optional)
    vibe_session_id     BIGINT REFERENCES vibe_sessions(session_id) ON DELETE SET NULL,

    -- Metadata
    attempted_at        TIMESTAMP DEFAULT NOW(),

    CONSTRAINT test_cases_valid CHECK (
        test_cases_passed IS NULL OR test_cases_total IS NULL OR test_cases_passed <= test_cases_total
    )
);

COMMENT ON TABLE problem_attempts IS '사용자별 문제 풀이 기록 (LV1-LV6 전체 지원)';
COMMENT ON COLUMN problem_attempts.code_quality_score IS 'LV4 (Debugging) & LV6 (Vibe Coding): 코드 품질 점수 (0-100)';
COMMENT ON COLUMN problem_attempts.token_usage IS 'LV6 (Vibe Coding) 전용: AI 토큰 사용량';
COMMENT ON COLUMN problem_attempts.test_cases_passed IS 'LV4 (Debugging) & LV6 (Vibe Coding): 통과한 테스트 케이스 수';
COMMENT ON COLUMN problem_attempts.vibe_session_id IS 'LV6 전용: 상세 대화 내역이 저장된 vibe_sessions 참조';

CREATE INDEX idx_attempts_user_problem ON problem_attempts(user_id, problem_id);
CREATE INDEX idx_attempts_user_date ON problem_attempts(user_id, attempted_at DESC);
CREATE INDEX idx_attempts_problem ON problem_attempts(problem_id);
CREATE INDEX idx_attempts_vibe_session ON problem_attempts(vibe_session_id)
    WHERE vibe_session_id IS NOT NULL;
```

---

### 6. mistake_notes (오답노트)
**목적**: 사용자별 틀린 문제 관리 및 복습 시스템

```sql
CREATE TABLE mistake_notes (
    note_id             BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    problem_id          BIGINT NOT NULL REFERENCES quiz_problems(problem_id) ON DELETE CASCADE,

    -- Mistake Analysis
    wrong_count         INTEGER DEFAULT 1,
    first_attempt_id    BIGINT REFERENCES problem_attempts(attempt_id),
    last_attempt_id     BIGINT REFERENCES problem_attempts(attempt_id),

    -- User Notes
    user_note           TEXT,
    is_bookmarked       BOOLEAN DEFAULT false,

    -- Review Status
    review_status       VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'in_progress', 'mastered'
    next_review_date    DATE,
    
    -- Spaced Repetition (Ebbinghaus Curve)
    review_interval_days INTEGER DEFAULT 1,  -- 1, 3, 7, 14, 30, 60...
    review_count        INTEGER DEFAULT 0,
    last_reviewed_at    TIMESTAMP,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    mastered_at         TIMESTAMP,

    UNIQUE(user_id, problem_id)
);

COMMENT ON TABLE mistake_notes IS '사용자별 오답노트 및 복습 관리 (Spaced Repetition 지원)';
COMMENT ON COLUMN mistake_notes.review_interval_days IS '다음 복습까지 간격 (일) - Ebbinghaus 망각곡선 기반';

CREATE INDEX idx_mistake_user_level ON mistake_notes(user_id, problem_id);
CREATE INDEX idx_mistake_review_date ON mistake_notes(user_id, next_review_date)
    WHERE review_status != 'mastered';
CREATE INDEX idx_mistake_review_due ON mistake_notes(next_review_date)
    WHERE review_status = 'in_progress' AND next_review_date <= CURRENT_DATE;
```

---

### 7. community_posts (커뮤니티 게시글)
**목적**: 사용자 간 지식 공유 및 토론 플랫폼

```sql
CREATE TYPE post_category AS ENUM ('problems', 'questions', 'tips', 'showcase', 'general');

CREATE TABLE community_posts (
    post_id             BIGSERIAL PRIMARY KEY,
    author_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Content
    category            post_category NOT NULL,
    title               VARCHAR(200) NOT NULL,
    content             TEXT NOT NULL,

    -- Associated Problem (Optional)
    related_problem_id  BIGINT REFERENCES quiz_problems(problem_id) ON DELETE SET NULL,
    is_problem_question BOOLEAN DEFAULT false,  -- 문제 질문글 여부

    -- Statistics (Denormalized for performance)
    view_count          INTEGER DEFAULT 0,
    like_count          INTEGER DEFAULT 0,
    dislike_count       INTEGER DEFAULT 0,
    comment_count       INTEGER DEFAULT 0,

    -- Status
    is_pinned           BOOLEAN DEFAULT false,
    is_locked           BOOLEAN DEFAULT false,
    is_deleted          BOOLEAN DEFAULT false,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    deleted_at          TIMESTAMP
);

COMMENT ON TABLE community_posts IS '커뮤니티 게시글';
COMMENT ON COLUMN community_posts.is_problem_question IS '특정 문제에 대한 질문글 여부 (필터링용)';

CREATE INDEX idx_posts_category_date ON community_posts(category, created_at DESC)
    WHERE is_deleted = false;
CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_problem ON community_posts(related_problem_id)
    WHERE related_problem_id IS NOT NULL;
CREATE INDEX idx_posts_problem_questions ON community_posts(related_problem_id, created_at DESC)
    WHERE is_problem_question = true AND is_deleted = false;
CREATE INDEX idx_posts_popular ON community_posts(like_count DESC, view_count DESC)
    WHERE is_deleted = false;
```

---

### 8. post_comments (댓글)
**목적**: 게시글 댓글 및 대댓글 시스템

```sql
CREATE TABLE post_comments (
    comment_id          BIGSERIAL PRIMARY KEY,
    post_id             BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    author_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    parent_comment_id   BIGINT REFERENCES post_comments(comment_id) ON DELETE CASCADE,

    -- Content
    content             TEXT NOT NULL,

    -- Statistics
    like_count          INTEGER DEFAULT 0,

    -- Status
    is_deleted          BOOLEAN DEFAULT false,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    deleted_at          TIMESTAMP
);

COMMENT ON TABLE post_comments IS '게시글 댓글 (대댓글 지원)';

CREATE INDEX idx_comments_post ON post_comments(post_id, created_at)
    WHERE is_deleted = false;
CREATE INDEX idx_comments_author ON post_comments(author_id);
CREATE INDEX idx_comments_parent ON post_comments(parent_comment_id)
    WHERE parent_comment_id IS NOT NULL;
```

---

### 9. post_votes (좋아요/싫어요)
**목적**: 게시글 및 댓글에 대한 투표 시스템

```sql
CREATE TYPE vote_type AS ENUM ('like', 'dislike');
CREATE TYPE votable_type AS ENUM ('post', 'comment');

CREATE TABLE post_votes (
    vote_id             BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Polymorphic Association
    votable_type        votable_type NOT NULL,
    votable_id          BIGINT NOT NULL,

    -- Vote Data
    vote_type           vote_type NOT NULL,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, votable_type, votable_id)
);

COMMENT ON TABLE post_votes IS '게시글/댓글 좋아요/싫어요';

CREATE INDEX idx_votes_user ON post_votes(user_id);
CREATE INDEX idx_votes_votable ON post_votes(votable_type, votable_id);
```

---

### 10. notifications (알림)
**목적**: 사용자 알림 시스템 (Push + In-App)

```sql
CREATE TYPE notification_type AS ENUM (
    'quest_complete', 'level_up', 'achievement_unlocked',
    'comment_reply', 'post_like', 'new_follower',
    'reminder_study', 'streak_milestone',
    'community_mention', 'system_announcement'
);

CREATE TABLE notifications (
    notification_id     BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Notification Content
    type                notification_type NOT NULL,
    title               VARCHAR(100) NOT NULL,
    message             TEXT NOT NULL,

    -- Action Data (Deep Link)
    action_url          TEXT,  -- e.g., "dayscript://post/123"
    action_data         JSONB,  -- Additional context

    -- Status
    is_read             BOOLEAN DEFAULT false,
    is_sent             BOOLEAN DEFAULT false,  -- For push notifications

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    read_at             TIMESTAMP,
    sent_at             TIMESTAMP
);

COMMENT ON TABLE notifications IS '사용자 알림 (Push + In-App)';

CREATE INDEX idx_notif_user_unread ON notifications(user_id, created_at DESC)
    WHERE is_read = false;
CREATE INDEX idx_notif_user_all ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notif_unsent ON notifications(is_sent, created_at)
    WHERE is_sent = false;
```

---

### 11. notification_preferences (알림 설정)
**목적**: 사용자별 알림 타입 세부 설정

```sql
CREATE TABLE notification_preferences (
    pref_id             BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Push Notification Settings
    push_quest_complete     BOOLEAN DEFAULT true,
    push_level_up           BOOLEAN DEFAULT true,
    push_achievement        BOOLEAN DEFAULT true,
    push_comment_reply      BOOLEAN DEFAULT true,
    push_post_like          BOOLEAN DEFAULT false,
    push_reminder_study     BOOLEAN DEFAULT true,

    -- In-App Notification Settings
    inapp_all               BOOLEAN DEFAULT true,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

COMMENT ON TABLE notification_preferences IS '사용자별 알림 설정';
```

---

### 12. pr_scenarios (LV5: Challenger 모드 - PR 시나리오)
**목적**: LV5 전용 - Challenger 모드 PR 리뷰 시나리오 데이터

**LV5 아키텍처 특징:**
- PR Review 실전 시나리오 제공
- 코드 변경사항 분석 및 리뷰 결정
- LV6 (Vibe Coding)과 분리된 독립 모듈

```sql
CREATE TYPE scenario_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');

CREATE TABLE pr_scenarios (
    scenario_id         BIGSERIAL PRIMARY KEY,

    -- Scenario Info
    title               VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    context             TEXT,
    difficulty          scenario_difficulty NOT NULL,
    estimated_time_minutes INTEGER DEFAULT 25,

    -- Requirements
    requirements        JSONB,  -- Array of requirement strings
    tags                TEXT[],

    -- Scenario Data
    pr_data             JSONB NOT NULL,  -- Complete PR data including commits
    -- Example: {"commits": [...], "files": [...], "diff": [...]}

    -- Statistics
    attempt_count       INTEGER DEFAULT 0,
    success_rate        DECIMAL(5,2) DEFAULT 0.00,

    -- Status
    is_published        BOOLEAN DEFAULT false,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE pr_scenarios IS 'LV5 Challenger 모드 PR 시나리오';

CREATE INDEX idx_scenarios_difficulty ON pr_scenarios(difficulty)
    WHERE is_published = true;
```

---

### 12-1. pr_scenario_solutions (PR 시나리오 정답)
**목적**: PR 시나리오별 정답 기준 저장

```sql
CREATE TABLE pr_scenario_solutions (
    solution_id         BIGSERIAL PRIMARY KEY,
    scenario_id         BIGINT NOT NULL REFERENCES pr_scenarios(scenario_id) ON DELETE CASCADE,
    
    -- Hunk/Commit Identification
    hunk_id             VARCHAR(100) NOT NULL,  -- 특정 코드 변경 부분 식별자
    file_path           VARCHAR(500),
    line_number         INTEGER,
    
    -- Correct Decision
    correct_decision    review_decision NOT NULL,
    explanation         TEXT NOT NULL,
    severity            VARCHAR(20),  -- 'critical', 'major', 'minor', 'info'
    
    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(scenario_id, hunk_id)
);

COMMENT ON TABLE pr_scenario_solutions IS 'PR 시나리오 정답 기준 (채점용)';

CREATE INDEX idx_scenario_solutions ON pr_scenario_solutions(scenario_id);
```

---

### 13. code_reviews (LV5: 코드 리뷰 제출 기록)
**목적**: LV5 전용 - Challenger 모드 PR 리뷰 제출 및 평가 기록

```sql
CREATE TYPE review_decision AS ENUM ('approve', 'request_changes', 'reject', 'flag');

CREATE TABLE code_reviews (
    review_id           BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scenario_id         BIGINT NOT NULL REFERENCES pr_scenarios(scenario_id) ON DELETE CASCADE,

    -- Review Data
    review_actions      JSONB NOT NULL,  -- Array of review actions per commit/hunk
    decisions           JSONB NOT NULL,  -- Decisions made for each item

    -- Scoring
    total_score         DECIMAL(5,2) NOT NULL,
    correct_actions     INTEGER NOT NULL,
    total_actions       INTEGER NOT NULL,
    accuracy            DECIMAL(5,2) GENERATED ALWAYS AS
        (CASE WHEN total_actions > 0
         THEN (correct_actions::DECIMAL / total_actions * 100)
         ELSE 0 END) STORED,

    -- Performance
    time_taken_seconds  INTEGER NOT NULL,

    -- Metadata
    submitted_at        TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE code_reviews IS 'Challenger 모드 코드 리뷰 제출 기록';

CREATE INDEX idx_reviews_user ON code_reviews(user_id, submitted_at DESC);
CREATE INDEX idx_reviews_scenario ON code_reviews(scenario_id);
```

---

### 14. achievements (성취 시스템)
**목적**: 성취 뱃지 정의 및 획득 조건

```sql
CREATE TYPE achievement_category AS ENUM ('learning', 'community', 'streak', 'mastery', 'special');

CREATE TABLE achievements (
    achievement_id      BIGSERIAL PRIMARY KEY,

    -- Achievement Info
    category            achievement_category NOT NULL,
    title               VARCHAR(100) NOT NULL,
    description         TEXT NOT NULL,
    icon_url            TEXT,

    -- Requirements
    requirement_type    VARCHAR(50) NOT NULL,  -- 'problem_count', 'streak_days', 'accuracy', etc.
    requirement_value   INTEGER NOT NULL,
    requirement_data    JSONB,  -- Additional requirement data

    -- Reward
    experience_reward   INTEGER DEFAULT 0,

    -- Status
    is_active           BOOLEAN DEFAULT true,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE achievements IS '성취 뱃지 정의';

CREATE INDEX idx_achievements_category ON achievements(category) WHERE is_active = true;
```

---

### 15. user_achievements (사용자 성취)
**목적**: 사용자별 성취 획득 기록

```sql
CREATE TABLE user_achievements (
    user_achievement_id BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id      BIGINT NOT NULL REFERENCES achievements(achievement_id) ON DELETE CASCADE,

    -- Progress
    current_progress    INTEGER DEFAULT 0,
    is_unlocked         BOOLEAN DEFAULT false,

    -- Metadata
    unlocked_at         TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, achievement_id)
);

COMMENT ON TABLE user_achievements IS '사용자별 성취 획득 기록';

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(user_id, unlocked_at DESC)
    WHERE is_unlocked = true;
```

---

### 16. daily_quests (일일 퀘스트)
**목적**: 일일 학습 목표 및 퀘스트 시스템

```sql
CREATE TYPE quest_type AS ENUM ('problem_solve', 'accuracy', 'community', 'streak');

CREATE TABLE daily_quests (
    quest_id            BIGSERIAL PRIMARY KEY,

    -- Quest Info
    quest_type          quest_type NOT NULL,
    title               VARCHAR(100) NOT NULL,
    description         TEXT NOT NULL,

    -- Requirements
    target_value        INTEGER NOT NULL,  -- e.g., 3 problems, 80% accuracy

    -- Reward
    experience_reward   INTEGER DEFAULT 50,

    -- Status
    is_active           BOOLEAN DEFAULT true,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE daily_quests IS '일일 퀘스트 정의';
```

---

### 17. user_daily_quests (사용자 일일 퀘스트)
**목적**: 사용자별 일일 퀘스트 진행 상황

```sql
CREATE TABLE user_daily_quests (
    user_quest_id       BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    quest_id            BIGINT NOT NULL REFERENCES daily_quests(quest_id) ON DELETE CASCADE,

    -- Progress
    current_progress    INTEGER DEFAULT 0,
    is_completed        BOOLEAN DEFAULT false,

    -- Metadata
    quest_date          DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at        TIMESTAMP,
    created_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, quest_id, quest_date)
);

COMMENT ON TABLE user_daily_quests IS '사용자별 일일 퀘스트 진행 상황';

CREATE INDEX idx_user_quests_date ON user_daily_quests(user_id, quest_date);
CREATE INDEX idx_user_quests_pending ON user_daily_quests(user_id, quest_date)
    WHERE is_completed = false;
```

---

### 18. vibe_sessions (LV6: Vibe Coding 세션)
**목적**: LV6 전용 - AI 대화형 코딩 세션 추적 및 평가

**LV6 아키텍처 특징:**
- AI와의 대화를 통한 코드 작성
- 토큰 사용량 및 프롬프트 품질 측정
- LV5 (Challenger PR Review)와 분리된 독립 모듈
- `problem_attempts` 테이블과 연동하여 통합 기록 관리

```sql
CREATE TABLE vibe_sessions (
    session_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    problem_id          BIGINT NOT NULL REFERENCES quiz_problems(problem_id) ON DELETE CASCADE,
    
    -- Session Metrics
    total_tokens_used   INTEGER DEFAULT 0,
    prompt_count        INTEGER DEFAULT 0,
    average_prompt_length INTEGER DEFAULT 0,
    
    -- Quality Scores
    ai_score            DECIMAL(5,2),  -- AI가 판단한 response quality
    code_quality_score  DECIMAL(5,2),  -- 최종 코드 품질 점수
    prompt_quality_score DECIMAL(5,2), -- 프롬프트 품질 점수
    
    -- Code Metrics
    generated_code_lines INTEGER DEFAULT 0,
    test_cases_passed   INTEGER DEFAULT 0,
    test_cases_total    INTEGER DEFAULT 0,
    
    -- Session Status
    is_completed        BOOLEAN DEFAULT false,
    completion_status   VARCHAR(20),  -- 'success', 'timeout', 'abandoned'
    
    -- Metadata
    started_at          TIMESTAMP DEFAULT NOW(),
    completed_at        TIMESTAMP,
    
    CONSTRAINT valid_ai_score CHECK (ai_score IS NULL OR ai_score BETWEEN 0 AND 100),
    CONSTRAINT valid_code_quality CHECK (code_quality_score IS NULL OR code_quality_score BETWEEN 0 AND 100)
);

COMMENT ON TABLE vibe_sessions IS 'LV5 Vibe Coding 모드 세션 기록 및 평가';

CREATE INDEX idx_vibe_sessions_user ON vibe_sessions(user_id, started_at DESC);
CREATE INDEX idx_vibe_sessions_problem ON vibe_sessions(problem_id);
CREATE INDEX idx_vibe_sessions_completed ON vibe_sessions(user_id, completed_at DESC)
    WHERE is_completed = true;
```

---

### 19. vibe_messages (LV6: Vibe Coding 대화 기록)
**목적**: LV6 전용 - Vibe Coding 세션 내 사용자-AI 대화 상세 로그

```sql
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

CREATE TABLE vibe_messages (
    message_id          BIGSERIAL PRIMARY KEY,
    session_id          BIGINT NOT NULL REFERENCES vibe_sessions(session_id) ON DELETE CASCADE,
    
    -- Message Data
    role                message_role NOT NULL,
    content             TEXT NOT NULL,
    tokens_used         INTEGER DEFAULT 0,
    
    -- Message Metrics
    prompt_length       INTEGER,  -- user 메시지인 경우
    response_time_ms    INTEGER,  -- assistant 응답 시간
    
    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    
    -- Message 순서 보장
    sequence_number     INTEGER NOT NULL
);

COMMENT ON TABLE vibe_messages IS 'Vibe Coding 세션 대화 기록';

CREATE INDEX idx_vibe_messages_session ON vibe_messages(session_id, sequence_number);
CREATE INDEX idx_vibe_messages_role ON vibe_messages(session_id, role);
```

---

## 관계도 (ERD)

### 핵심 관계 다이어그램

```
┌─────────────┐
│   users     │◄──────┐
└─────────────┘       │
       │              │
       │ 1:1          │ 1:N
       ▼              │
┌─────────────┐       │
│user_settings│       │
└─────────────┘       │
                      │
┌─────────────┐       │
│user_progress│◄──────┤
└─────────────┘       │
       │              │
       │ 1:N          │
       ▼              │
┌─────────────┐       │
│problem_att  │       │
│  empts      │       │
└─────────────┘       │
       │              │
       │ N:1          │
       ▼              │
┌─────────────┐       │
│quiz_problems│       │
└─────────────┘       │
       │              │
       │ 1:N          │
       ▼              │
┌─────────────┐       │
│mistake_notes│◄──────┤
└─────────────┘       │
                      │
┌─────────────┐       │
│community_   │◄──────┤
│   posts     │       │
└─────────────┘       │
       │              │
       │ 1:N          │
       ▼              │
┌─────────────┐       │
│post_comments│◄──────┤
└─────────────┘       │
                      │
┌─────────────┐       │
│notifications│◄──────┤
└─────────────┘       │
                      │
┌─────────────┐       │
│code_reviews │◄──────┘
└─────────────┘
       │
       │ N:1
       ▼
┌─────────────┐
│pr_scenarios │
└─────────────┘
```

---

## 인덱스 전략

### 기본 인덱스 (자동 생성)
- 모든 Primary Key
- 모든 UNIQUE 제약조건
- 모든 Foreign Key

### 추가 성능 인덱스

```sql
-- User Performance
CREATE INDEX idx_users_email_active ON users(email) WHERE is_active = true;
CREATE INDEX idx_users_rank ON users(current_rank) WHERE current_rank IS NOT NULL;

-- Problem Search
CREATE INDEX idx_problems_level_lang ON quiz_problems(level, language, is_published);
CREATE INDEX idx_problems_difficulty ON quiz_problems(difficulty) WHERE is_published = true;

-- Community Hot Posts
CREATE INDEX idx_posts_hot ON community_posts(like_count DESC, created_at DESC)
    WHERE is_deleted = false AND created_at > NOW() - INTERVAL '7 days';

-- Notification Performance
CREATE INDEX idx_notif_priority ON notifications(user_id, type, created_at DESC)
    WHERE is_read = false;

-- Analytics
CREATE INDEX idx_attempts_stats ON problem_attempts(problem_id, is_correct, attempted_at);
```

---

## 확장성 고려사항

### 1. 수평 확장 (Sharding) 준비
```sql
-- User ID를 기준으로 샤딩 가능하도록 설계
-- 모든 사용자 관련 테이블은 user_id를 포함

-- Shard Key 후보
- users: user_id
- community_posts: author_id + post_id
- problem_attempts: user_id + attempt_id
```

### 2. 읽기 성능 최적화 (Materialized Views)

```sql
-- 실시간 랭킹 조회 최적화
CREATE MATERIALIZED VIEW user_rankings AS
SELECT
    user_id,
    username,
    display_name,
    avatar_url,
    total_experience,
    RANK() OVER (ORDER BY total_experience DESC) as rank
FROM users
WHERE is_active = true;

CREATE UNIQUE INDEX idx_rankings_user ON user_rankings(user_id);
CREATE INDEX idx_rankings_rank ON user_rankings(rank);

-- 매 시간 갱신
REFRESH MATERIALIZED VIEW CONCURRENTLY user_rankings;
```

### 3. 파티셔닝 전략

```sql
-- problem_attempts: 날짜별 파티셔닝
CREATE TABLE problem_attempts_2025_11 PARTITION OF problem_attempts
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');

-- notifications: 날짜별 파티셔닝 (자동 삭제)
CREATE TABLE notifications_2025_11 PARTITION OF notifications
    FOR VALUES FROM ('2025-11-01') TO ('2025-12-01');
```

### 4. 캐싱 전략
```
Redis/Memcached 캐싱 대상:
- user_rankings (TTL: 1시간)
- user_progress (TTL: 5분)
- quiz_problems (TTL: 1일)
- daily_quests (TTL: 1일)
- hot_posts (TTL: 10분)
```

---

## API 엔드포인트 매핑

### P0: Critical APIs

| 엔드포인트 | 메서드 | 테이블 | 설명 |
|-----------|--------|--------|------|
| `/api/notifications` | GET | notifications | 알림 목록 조회 |
| `/api/notifications/:id/read` | PATCH | notifications | 읽음 처리 |
| `/api/user/settings` | GET/PATCH | user_settings | 설정 조회/수정 |
| `/api/posts` | POST | community_posts | 게시글 작성 |

### P1: High Priority APIs

| 엔드포인트 | 메서드 | 테이블 | 설명 |
|-----------|--------|--------|------|
| `/api/user/learning-stats` | GET | user_progress | 학습 통계 |
| `/api/user/profile` | GET | users | 프로필 조회 |
| `/api/user/mistakes` | GET | mistake_notes + quiz_problems | 오답노트 |
| `/api/posts/:id/comments` | POST | post_comments | 댓글 작성 |
| `/api/posts/:id/vote` | POST | post_votes | 좋아요/싫어요 |

### P2: Medium Priority APIs

| 엔드포인트 | 메서드 | 테이블 | 설명 |
|-----------|--------|--------|------|
| `/api/search` | GET | community_posts + quiz_problems + users | 통합 검색 |
| `/api/challenges/pr-scenarios` | GET | pr_scenarios | PR 시나리오 |
| `/api/challenges/review-submit` | POST | code_reviews | 리뷰 제출 |
| `/api/analytics/problem-attempt` | POST | problem_attempts | 문제 풀이 기록 |

---

## 마이그레이션 전략

### Phase 1: 기본 인프라 (Week 1)
```sql
1. Create ENUM types
2. Create users, user_settings, user_progress tables
3. Create quiz_problems, problem_attempts tables
4. Create basic indexes
```

### Phase 2: 커뮤니티 기능 (Week 2)
```sql
5. Create community_posts, post_comments, post_votes tables
6. Create notifications, notification_preferences tables
7. Create community indexes
```

### Phase 3: 고급 기능 (Week 3)
```sql
8. Create pr_scenarios, code_reviews tables
9. Create achievements, user_achievements tables
10. Create daily_quests, user_daily_quests tables
11. Create mistake_notes table
```

### Phase 4: 최적화 (Week 4)
```sql
12. Create materialized views
13. Setup partitioning
14. Performance tuning
15. Load testing
```

---

## SQL DDL 스크립트

완전한 DDL 스크립트는 별도 파일로 제공됩니다:
- `migrations/001_create_users.sql`
- `migrations/002_create_quiz.sql`
- `migrations/003_create_community.sql`
- `migrations/004_create_notifications.sql`
- `migrations/005_create_challenges.sql`
- `migrations/006_create_achievements.sql`
- `migrations/007_create_indexes.sql`
- `migrations/008_create_views.sql`

---

## 데이터 무결성 규칙

### Cascade 규칙
```sql
-- 사용자 삭제 시 모든 관련 데이터 삭제 (Cascade)
ON DELETE CASCADE:
- user_settings
- user_progress
- problem_attempts
- mistake_notes
- community_posts
- post_comments
- notifications
- user_achievements

-- 문제 삭제 시 참조 무효화
ON DELETE SET NULL:
- community_posts.related_problem_id

-- 댓글 삭제 시 대댓글도 삭제
ON DELETE CASCADE:
- post_comments.parent_comment_id
```

### 제약 조건
```sql
-- 레벨 범위
CHECK (level BETWEEN 1 AND 5)

-- 정확도 범위
CHECK (accuracy BETWEEN 0 AND 100)

-- 이메일 형식
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')

-- 연속 학습 일수 (음수 불가)
CHECK (streak_days >= 0)
```

---

## 보안 고려사항

### 1. 민감 정보 암호화
```sql
-- 암호화 필요 컬럼
- users.password_hash (bcrypt, cost: 12)
- users.email (at rest encryption 권장)
```

### 2. Soft Delete
```sql
-- 물리적 삭제 대신 논리적 삭제
- users.deleted_at
- community_posts.deleted_at
- post_comments.deleted_at
```

### 3. Row Level Security (RLS)
```sql
-- PostgreSQL RLS 활성화 (선택)
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_progress_policy ON user_progress
    FOR ALL
    TO authenticated_user
    USING (user_id = current_user_id());
```

---

## 모니터링 및 유지보수

### 1. 통계 수집
```sql
-- 정기적인 통계 업데이트
ANALYZE users;
ANALYZE quiz_problems;
ANALYZE problem_attempts;
ANALYZE community_posts;
```

### 2. Vacuum 전략
```sql
-- 자동 vacuum 설정
ALTER TABLE problem_attempts SET (autovacuum_vacuum_scale_factor = 0.05);
ALTER TABLE notifications SET (autovacuum_vacuum_scale_factor = 0.1);
```

### 3. 백업 전략
```
- 일일 전체 백업 (Daily Full Backup)
- 시간별 증분 백업 (Hourly Incremental)
- WAL 아카이빙 (Point-in-Time Recovery)
- 주간 오프사이트 백업
```

---

## 성능 벤치마크 목표

| 작업 | 목표 응답 시간 | 동시 사용자 |
|------|---------------|------------|
| 사용자 로그인 | < 200ms | 1000+ |
| 문제 목록 조회 | < 300ms | 500+ |
| 문제 풀이 제출 | < 500ms | 200+ |
| 커뮤니티 목록 | < 400ms | 300+ |
| 알림 조회 | < 100ms | 1000+ |

---

**작성자**: Claude Code Database Architect
**버전**: 1.0.0
**검토 일자**: 2025-11-20
**다음 리뷰**: 2025-12-20

---

## 부록

### A. 샘플 데이터 생성 스크립트
`scripts/seed_data.sql` 참조

### B. API 통합 테스트 시나리오
`docs/api_integration_tests.md` 참조

### C. 성능 튜닝 가이드
`docs/performance_tuning.md` 참조
