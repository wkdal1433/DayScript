-- ============================================================================
-- DayScript Database Migration
-- File: 002_create_quiz_and_problems.sql
-- Description: Create quiz problems and attempt tracking tables
-- Version: 1.0.0
-- Date: 2025-11-20
-- ============================================================================

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE problem_type AS ENUM (
    'OX',
    'MULTIPLE_CHOICE',
    'FILL_IN_BLANK',
    'DEBUGGING',
    'CODE_REVIEW',
    'VIBE_CODING'
);

CREATE TYPE problem_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE programming_language AS ENUM ('Python', 'JavaScript', 'Java', 'TypeScript', 'C++', 'Go');

-- ============================================================================
-- QUIZ_PROBLEMS TABLE
-- ============================================================================

CREATE TABLE quiz_problems (
    problem_id          BIGSERIAL PRIMARY KEY,

    -- Problem Classification
    level               INTEGER NOT NULL CHECK (level BETWEEN 1 AND 6),
    type                problem_type NOT NULL,
    difficulty          problem_difficulty NOT NULL,
    language            programming_language NOT NULL,

    -- Content
    title               TEXT NOT NULL,
    description         TEXT NOT NULL,
    question            TEXT NOT NULL,

    -- Answer Data (JSON for flexibility)
    correct_answer      JSONB NOT NULL,
    options             JSONB,
    code_snippet        TEXT,
    test_cases          JSONB,

    -- Hints (Progressive disclosure)
    hint_1              TEXT,
    hint_2              TEXT,
    hint_3              TEXT,

    -- Metadata
    tags                TEXT[],
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

-- Comments
COMMENT ON TABLE quiz_problems IS '모든 레벨의 문제 은행';
COMMENT ON COLUMN quiz_problems.correct_answer IS 'JSON format: OX: {"answer": "O"}, MC: {"answer": "A"}';
COMMENT ON COLUMN quiz_problems.test_cases IS 'LV4/LV5 전용: [{"input": "...", "output": "..."}]';
COMMENT ON COLUMN quiz_problems.code_snippet IS 'LV3/LV4/LV5 문제에 사용되는 코드';

-- Indexes
CREATE INDEX idx_quiz_level_type ON quiz_problems(level, type);
CREATE INDEX idx_quiz_language ON quiz_problems(language);
CREATE INDEX idx_quiz_difficulty ON quiz_problems(difficulty);
CREATE INDEX idx_quiz_tags ON quiz_problems USING GIN(tags);
CREATE INDEX idx_quiz_published ON quiz_problems(is_published) WHERE is_published = true;
CREATE INDEX idx_quiz_level_lang_pub ON quiz_problems(level, language, is_published);

-- ============================================================================
-- PROBLEM_ATTEMPTS TABLE
-- ============================================================================

CREATE TABLE problem_attempts (
    attempt_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    problem_id          BIGINT NOT NULL REFERENCES quiz_problems(problem_id) ON DELETE CASCADE,

    -- Attempt Data
    user_answer         JSONB NOT NULL,
    is_correct          BOOLEAN NOT NULL,
    score               DECIMAL(5,2) DEFAULT 0.00 CHECK (score BETWEEN 0 AND 100),

    -- Performance Metrics
    time_taken_seconds  INTEGER NOT NULL CHECK (time_taken_seconds > 0),
    hints_used_count    INTEGER DEFAULT 0 CHECK (hints_used_count >= 0),
    hints_used          INTEGER[],

    -- LV4/LV6 Specific (Code Quality Metrics)
    code_quality_score  DECIMAL(5,2) CHECK (code_quality_score IS NULL OR code_quality_score BETWEEN 0 AND 100),
    token_usage         INTEGER CHECK (token_usage IS NULL OR token_usage > 0),
    test_cases_passed   INTEGER CHECK (test_cases_passed IS NULL OR test_cases_passed >= 0),
    test_cases_total    INTEGER CHECK (test_cases_total IS NULL OR test_cases_total >= 0),

    -- LV6 Specific: Link to detailed Vibe Coding session (will be added in migration 007)
    -- vibe_session_id will be added after vibe_sessions table is created

    -- Metadata
    attempted_at        TIMESTAMP DEFAULT NOW(),

    CONSTRAINT test_cases_valid CHECK (
        test_cases_passed IS NULL OR test_cases_total IS NULL OR test_cases_passed <= test_cases_total
    )
);

-- Comments
COMMENT ON TABLE problem_attempts IS '사용자별 문제 풀이 기록 (LV1-LV6 전체 지원)';
COMMENT ON COLUMN problem_attempts.code_quality_score IS 'LV4 (Debugging) & LV6 (Vibe Coding): 코드 품질 점수 (0-100)';
COMMENT ON COLUMN problem_attempts.token_usage IS 'LV6 (Vibe Coding) 전용: AI 토큰 사용량';
COMMENT ON COLUMN problem_attempts.test_cases_passed IS 'LV4 (Debugging) & LV6 (Vibe Coding): 통과한 테스트 케이스 수';

-- Indexes
CREATE INDEX idx_attempts_user_problem ON problem_attempts(user_id, problem_id);
CREATE INDEX idx_attempts_user_date ON problem_attempts(user_id, attempted_at DESC);
CREATE INDEX idx_attempts_problem ON problem_attempts(problem_id);
CREATE INDEX idx_attempts_correct ON problem_attempts(is_correct, attempted_at);

-- ============================================================================
-- MISTAKE_NOTES TABLE
-- ============================================================================

CREATE TABLE mistake_notes (
    note_id             BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    problem_id          BIGINT NOT NULL REFERENCES quiz_problems(problem_id) ON DELETE CASCADE,

    -- Mistake Analysis
    wrong_count         INTEGER DEFAULT 1 CHECK (wrong_count > 0),
    first_attempt_id    BIGINT REFERENCES problem_attempts(attempt_id),
    last_attempt_id     BIGINT REFERENCES problem_attempts(attempt_id),

    -- User Notes
    user_note           TEXT,
    is_bookmarked       BOOLEAN DEFAULT false,

    -- Review Status
    review_status       VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'in_progress', 'mastered')),
    next_review_date    DATE,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    mastered_at         TIMESTAMP,

    UNIQUE(user_id, problem_id)
);

-- Comments
COMMENT ON TABLE mistake_notes IS '사용자별 오답노트 및 복습 관리';
COMMENT ON COLUMN mistake_notes.review_status IS 'pending: 복습 예정, in_progress: 복습 중, mastered: 완전 이해';

-- Indexes
CREATE INDEX idx_mistake_user ON mistake_notes(user_id);
CREATE INDEX idx_mistake_problem ON mistake_notes(problem_id);
CREATE INDEX idx_mistake_review_date ON mistake_notes(user_id, next_review_date)
    WHERE review_status != 'mastered';
CREATE INDEX idx_mistake_bookmarked ON mistake_notes(user_id, is_bookmarked)
    WHERE is_bookmarked = true;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at
CREATE TRIGGER update_quiz_problems_updated_at BEFORE UPDATE ON quiz_problems
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mistake_notes_updated_at BEFORE UPDATE ON mistake_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update problem statistics
CREATE OR REPLACE FUNCTION update_problem_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update attempt count and success count
    UPDATE quiz_problems
    SET
        attempt_count = attempt_count + 1,
        success_count = success_count + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END,
        average_accuracy = (
            SELECT COALESCE(AVG(CASE WHEN is_correct THEN 100.0 ELSE 0.0 END), 0.0)
            FROM problem_attempts
            WHERE problem_id = NEW.problem_id
        )
    WHERE problem_id = NEW.problem_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_problem_stats
    AFTER INSERT ON problem_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_problem_statistics();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample problems for Level 1 (OX)
INSERT INTO quiz_problems (
    level, type, difficulty, language,
    title, description, question, correct_answer,
    hint_1, hint_2, hint_3,
    tags, category, is_published
) VALUES
(
    1, 'OX', 'easy', 'Python',
    'Python의 리스트는 변경 가능한가?',
    'Python의 기본 자료구조인 리스트의 특성에 대한 문제입니다.',
    'Python의 리스트(list)는 변경 가능한(mutable) 자료형이다.',
    '{"answer": "O"}'::JSONB,
    '리스트는 요소를 추가하거나 삭제할 수 있습니다.',
    'append(), remove() 등의 메서드를 사용할 수 있습니다.',
    'mutable vs immutable의 차이를 생각해보세요.',
    ARRAY['list', 'mutable', 'basic'],
    'Data Structures',
    true
),
(
    1, 'OX', 'easy', 'JavaScript',
    'var와 let의 차이',
    'JavaScript의 변수 선언 키워드에 대한 문제입니다.',
    'JavaScript에서 var와 let은 동일한 스코프 규칙을 따른다.',
    '{"answer": "X"}'::JSONB,
    'var는 함수 스코프, let은 블록 스코프입니다.',
    'ES6에서 let이 도입된 이유를 생각해보세요.',
    '{}로 감싼 블록 내에서의 동작을 비교해보세요.',
    ARRAY['variable', 'scope', 'ES6'],
    'Language Basics',
    true
);

-- Insert sample problems for Level 2 (Multiple Choice)
INSERT INTO quiz_problems (
    level, type, difficulty, language,
    title, description, question, correct_answer, options,
    hint_1, tags, is_published
) VALUES
(
    2, 'MULTIPLE_CHOICE', 'medium', 'Python',
    '시간복잡도가 O(n log n)인 정렬 알고리즘',
    '정렬 알고리즘의 시간복잡도에 대한 문제입니다.',
    '다음 중 평균 시간복잡도가 O(n log n)인 정렬 알고리즘은?',
    '{"answer": "C"}'::JSONB,
    '{"A": "버블 정렬", "B": "선택 정렬", "C": "병합 정렬", "D": "삽입 정렬"}'::JSONB,
    '분할 정복 알고리즘을 사용하는 정렬을 찾아보세요.',
    ARRAY['algorithm', 'sorting', 'complexity'],
    true
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Quiz tables created successfully' AS status;

SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public'
    AND table_name IN ('quiz_problems', 'problem_attempts', 'mistake_notes')
ORDER BY table_name;
