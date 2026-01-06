-- ============================================================================
-- DayScript Database Migration
-- File: 005_create_challenges.sql
-- Description: Create Challenger Mode (PR review scenarios and code reviews)
-- Version: 1.0.0
-- Date: 2025-11-20
-- ============================================================================

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE scenario_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE review_action_type AS ENUM (
    'comment',
    'approve',
    'request_changes',
    'suggest_fix',
    'add_emoji_reaction'
);

-- ============================================================================
-- PR_SCENARIOS TABLE
-- ============================================================================

CREATE TABLE pr_scenarios (
    scenario_id         BIGSERIAL PRIMARY KEY,

    -- Scenario Metadata
    title               VARCHAR(200) NOT NULL,
    description         TEXT NOT NULL,
    difficulty          scenario_difficulty NOT NULL,
    language            programming_language NOT NULL,

    -- PR Data (JSONB for flexibility)
    pr_data             JSONB NOT NULL,

    -- Grading Criteria
    correct_actions     JSONB NOT NULL,
    required_comments   INTEGER DEFAULT 0 CHECK (required_comments >= 0),
    min_issues_found    INTEGER DEFAULT 1 CHECK (min_issues_found >= 0),
    max_time_minutes    INTEGER DEFAULT 15 CHECK (max_time_minutes > 0),

    -- Rewards
    experience_reward   INTEGER DEFAULT 100 CHECK (experience_reward >= 0),
    bonus_exp_fast      INTEGER DEFAULT 50 CHECK (bonus_exp_fast >= 0),
    bonus_exp_perfect   INTEGER DEFAULT 100 CHECK (bonus_exp_perfect >= 0),

    -- Tags & Categories
    tags                TEXT[],
    category            VARCHAR(50),

    -- Issue Types Covered
    bug_types           TEXT[],
    code_smell_types    TEXT[],

    -- Statistics (Denormalized)
    attempt_count       INTEGER DEFAULT 0 CHECK (attempt_count >= 0),
    success_count       INTEGER DEFAULT 0 CHECK (success_count >= 0),
    average_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (average_accuracy BETWEEN 0 AND 100),
    average_time_seconds INTEGER DEFAULT 0 CHECK (average_time_seconds >= 0),

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
COMMENT ON TABLE pr_scenarios IS 'Challenger Mode - PR 리뷰 시나리오';
COMMENT ON COLUMN pr_scenarios.pr_data IS 'PR 정보: {"title": "...", "files": [{"name": "...", "diff": "...", "issues": [...]}]}';
COMMENT ON COLUMN pr_scenarios.correct_actions IS '정답 액션: [{"type": "comment", "line": 42, "file": "app.js", "message_contains": "null check"}]';
COMMENT ON COLUMN pr_scenarios.bug_types IS '포함된 버그 유형: ["null_pointer", "race_condition", "memory_leak"]';
COMMENT ON COLUMN pr_scenarios.code_smell_types IS '코드 스멜: ["long_method", "duplicate_code", "magic_number"]';

-- Indexes
CREATE INDEX idx_pr_scenarios_difficulty ON pr_scenarios(difficulty, language);
CREATE INDEX idx_pr_scenarios_published ON pr_scenarios(is_published, difficulty)
    WHERE is_published = true;
CREATE INDEX idx_pr_scenarios_tags ON pr_scenarios USING GIN(tags);
CREATE INDEX idx_pr_scenarios_bug_types ON pr_scenarios USING GIN(bug_types);
CREATE INDEX idx_pr_scenarios_popularity ON pr_scenarios(attempt_count DESC, average_accuracy DESC)
    WHERE is_published = true;

-- ============================================================================
-- CODE_REVIEWS TABLE
-- ============================================================================

CREATE TABLE code_reviews (
    review_id           BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    scenario_id         BIGINT NOT NULL REFERENCES pr_scenarios(scenario_id) ON DELETE CASCADE,

    -- Review Actions (JSONB Array)
    review_actions      JSONB NOT NULL,

    -- Performance Metrics
    time_taken_seconds  INTEGER NOT NULL CHECK (time_taken_seconds > 0),
    issues_found        INTEGER DEFAULT 0 CHECK (issues_found >= 0),
    false_positives     INTEGER DEFAULT 0 CHECK (false_positives >= 0),
    comments_made       INTEGER DEFAULT 0 CHECK (comments_made >= 0),

    -- Grading Results
    accuracy            DECIMAL(5,2) NOT NULL CHECK (accuracy BETWEEN 0 AND 100),
    is_passed           BOOLEAN NOT NULL,
    score               INTEGER NOT NULL CHECK (score >= 0),

    -- Bonuses
    speed_bonus         INTEGER DEFAULT 0 CHECK (speed_bonus >= 0),
    perfect_bonus       INTEGER DEFAULT 0 CHECK (perfect_bonus >= 0),
    total_experience    INTEGER NOT NULL CHECK (total_experience >= 0),

    -- Feedback
    ai_feedback         TEXT,
    missed_issues       JSONB,

    -- Metadata
    reviewed_at         TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_false_positives CHECK (false_positives <= comments_made)
);

-- Comments
COMMENT ON TABLE code_reviews IS '사용자별 PR 리뷰 제출 기록';
COMMENT ON COLUMN code_reviews.review_actions IS '[{"type": "comment", "line": 42, "file": "app.js", "message": "..."}, {"type": "approve"}]';
COMMENT ON COLUMN code_reviews.accuracy IS '정확도: (올바른 지적 / 전체 지적) * 100';
COMMENT ON COLUMN code_reviews.missed_issues IS '놓친 이슈: [{"type": "bug", "line": 15, "severity": "high", "description": "..."}]';
COMMENT ON COLUMN code_reviews.ai_feedback IS 'AI 생성 피드백 및 학습 조언';

-- Indexes
CREATE INDEX idx_code_reviews_user_scenario ON code_reviews(user_id, scenario_id);
CREATE INDEX idx_code_reviews_user_date ON code_reviews(user_id, reviewed_at DESC);
CREATE INDEX idx_code_reviews_scenario ON code_reviews(scenario_id);
CREATE INDEX idx_code_reviews_passed ON code_reviews(is_passed, reviewed_at)
    WHERE is_passed = true;
CREATE INDEX idx_code_reviews_high_score ON code_reviews(score DESC, reviewed_at DESC);

-- ============================================================================
-- CHALLENGER_RANKINGS TABLE
-- ============================================================================

CREATE TABLE challenger_rankings (
    ranking_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Overall Statistics
    total_reviews       INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
    passed_reviews      INTEGER DEFAULT 0 CHECK (passed_reviews >= 0),
    pass_rate           DECIMAL(5,2) DEFAULT 0.00 CHECK (pass_rate BETWEEN 0 AND 100),

    -- Performance Metrics
    average_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (average_accuracy BETWEEN 0 AND 100),
    average_time_seconds INTEGER DEFAULT 0 CHECK (average_time_seconds >= 0),
    total_issues_found  INTEGER DEFAULT 0 CHECK (total_issues_found >= 0),

    -- Difficulty Breakdown
    easy_completed      INTEGER DEFAULT 0 CHECK (easy_completed >= 0),
    medium_completed    INTEGER DEFAULT 0 CHECK (medium_completed >= 0),
    hard_completed      INTEGER DEFAULT 0 CHECK (hard_completed >= 0),
    expert_completed    INTEGER DEFAULT 0 CHECK (expert_completed >= 0),

    -- Ranking
    total_score         INTEGER DEFAULT 0 CHECK (total_score >= 0),
    current_rank        INTEGER,
    highest_rank        INTEGER,
    rank_achieved_at    TIMESTAMP,

    -- Streaks
    current_streak      INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak      INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    last_review_date    DATE,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id),
    CONSTRAINT passed_not_exceed_total CHECK (passed_reviews <= total_reviews)
);

-- Comments
COMMENT ON TABLE challenger_rankings IS 'Challenger Mode 사용자별 순위 및 통계';
COMMENT ON COLUMN challenger_rankings.total_score IS '전체 획득 점수 (순위 계산 기준)';
COMMENT ON COLUMN challenger_rankings.current_rank IS '현재 순위 (Materialized View에서 업데이트)';

-- Indexes
CREATE INDEX idx_challenger_rankings_rank ON challenger_rankings(current_rank)
    WHERE current_rank IS NOT NULL;
CREATE INDEX idx_challenger_rankings_score ON challenger_rankings(total_score DESC);
CREATE INDEX idx_challenger_rankings_accuracy ON challenger_rankings(average_accuracy DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at
CREATE TRIGGER update_pr_scenarios_updated_at BEFORE UPDATE ON pr_scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenger_rankings_updated_at BEFORE UPDATE ON challenger_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update scenario statistics
CREATE OR REPLACE FUNCTION update_scenario_statistics()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pr_scenarios
    SET
        attempt_count = attempt_count + 1,
        success_count = success_count + CASE WHEN NEW.is_passed THEN 1 ELSE 0 END,
        average_accuracy = (
            SELECT COALESCE(AVG(accuracy), 0.0)
            FROM code_reviews
            WHERE scenario_id = NEW.scenario_id
        ),
        average_time_seconds = (
            SELECT COALESCE(AVG(time_taken_seconds), 0)
            FROM code_reviews
            WHERE scenario_id = NEW.scenario_id
        )
    WHERE scenario_id = NEW.scenario_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_scenario_stats
    AFTER INSERT ON code_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_scenario_statistics();

-- Auto-update challenger rankings
CREATE OR REPLACE FUNCTION update_challenger_ranking()
RETURNS TRIGGER AS $$
DECLARE
    v_pass_rate DECIMAL(5,2);
    v_avg_accuracy DECIMAL(5,2);
    v_avg_time INTEGER;
    v_total_issues INTEGER;
BEGIN
    -- Calculate aggregated statistics
    SELECT
        CASE
            WHEN COUNT(*) = 0 THEN 0.00
            ELSE (COUNT(*) FILTER (WHERE is_passed = true)::DECIMAL / COUNT(*)) * 100
        END,
        COALESCE(AVG(accuracy), 0.00),
        COALESCE(AVG(time_taken_seconds), 0)::INTEGER,
        COALESCE(SUM(issues_found), 0)
    INTO v_pass_rate, v_avg_accuracy, v_avg_time, v_total_issues
    FROM code_reviews
    WHERE user_id = NEW.user_id;

    -- Upsert challenger ranking
    INSERT INTO challenger_rankings (
        user_id,
        total_reviews,
        passed_reviews,
        pass_rate,
        average_accuracy,
        average_time_seconds,
        total_issues_found,
        total_score,
        last_review_date
    )
    VALUES (
        NEW.user_id,
        1,
        CASE WHEN NEW.is_passed THEN 1 ELSE 0 END,
        v_pass_rate,
        v_avg_accuracy,
        v_avg_time,
        v_total_issues,
        NEW.total_experience,
        CURRENT_DATE
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_reviews = challenger_rankings.total_reviews + 1,
        passed_reviews = challenger_rankings.passed_reviews + CASE WHEN NEW.is_passed THEN 1 ELSE 0 END,
        pass_rate = v_pass_rate,
        average_accuracy = v_avg_accuracy,
        average_time_seconds = v_avg_time,
        total_issues_found = v_total_issues,
        total_score = challenger_rankings.total_score + NEW.total_experience,
        last_review_date = CURRENT_DATE,
        updated_at = NOW();

    -- Update difficulty breakdown
    UPDATE challenger_rankings
    SET
        easy_completed = easy_completed + CASE WHEN s.difficulty = 'easy' AND NEW.is_passed THEN 1 ELSE 0 END,
        medium_completed = medium_completed + CASE WHEN s.difficulty = 'medium' AND NEW.is_passed THEN 1 ELSE 0 END,
        hard_completed = hard_completed + CASE WHEN s.difficulty = 'hard' AND NEW.is_passed THEN 1 ELSE 0 END,
        expert_completed = expert_completed + CASE WHEN s.difficulty = 'expert' AND NEW.is_passed THEN 1 ELSE 0 END
    FROM pr_scenarios s
    WHERE challenger_rankings.user_id = NEW.user_id
        AND s.scenario_id = NEW.scenario_id;

    -- Update streak
    UPDATE challenger_rankings
    SET
        current_streak = CASE
            WHEN last_review_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
            WHEN last_review_date = CURRENT_DATE THEN current_streak
            ELSE 1
        END,
        longest_streak = GREATEST(
            longest_streak,
            CASE
                WHEN last_review_date = CURRENT_DATE - INTERVAL '1 day' THEN current_streak + 1
                WHEN last_review_date = CURRENT_DATE THEN current_streak
                ELSE 1
            END
        )
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_challenger_ranking
    AFTER INSERT ON code_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_challenger_ranking();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Calculate review accuracy
CREATE OR REPLACE FUNCTION calculate_review_accuracy(
    p_review_actions JSONB,
    p_correct_actions JSONB,
    p_false_positives INTEGER
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_correct_count INTEGER := 0;
    v_total_user_actions INTEGER;
    v_total_correct_actions INTEGER;
    v_accuracy DECIMAL(5,2);
BEGIN
    -- Count user actions (excluding approvals)
    SELECT COUNT(*)
    INTO v_total_user_actions
    FROM jsonb_array_elements(p_review_actions) AS action
    WHERE action->>'type' != 'approve';

    -- Count expected correct actions
    SELECT COUNT(*)
    INTO v_total_correct_actions
    FROM jsonb_array_elements(p_correct_actions);

    -- Count matching actions (simplified - real implementation would be more complex)
    -- This is a placeholder - actual matching logic would compare line numbers, files, etc.
    v_correct_count := v_total_user_actions - p_false_positives;

    -- Calculate accuracy
    IF v_total_user_actions = 0 THEN
        v_accuracy := 0.00;
    ELSE
        v_accuracy := (v_correct_count::DECIMAL / GREATEST(v_total_user_actions, v_total_correct_actions)) * 100;
        v_accuracy := LEAST(v_accuracy, 100.00);
    END IF;

    RETURN v_accuracy;
END;
$$ LANGUAGE plpgsql;

-- Get user's challenger progress
CREATE OR REPLACE FUNCTION get_challenger_progress(p_user_id BIGINT)
RETURNS TABLE (
    total_reviews INTEGER,
    pass_rate DECIMAL(5,2),
    average_accuracy DECIMAL(5,2),
    current_rank INTEGER,
    current_streak INTEGER,
    easy_completed INTEGER,
    medium_completed INTEGER,
    hard_completed INTEGER,
    expert_completed INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cr.total_reviews,
        cr.pass_rate,
        cr.average_accuracy,
        cr.current_rank,
        cr.current_streak,
        cr.easy_completed,
        cr.medium_completed,
        cr.hard_completed,
        cr.expert_completed
    FROM challenger_rankings cr
    WHERE cr.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample PR scenario
INSERT INTO pr_scenarios (
    title,
    description,
    difficulty,
    language,
    pr_data,
    correct_actions,
    required_comments,
    min_issues_found,
    experience_reward,
    tags,
    category,
    bug_types,
    is_published
) VALUES (
    'Null Pointer 버그 찾기',
    '사용자 인증 코드에서 null pointer exception을 유발할 수 있는 버그를 찾아보세요.',
    'easy',
    'JavaScript',
    '{
        "title": "Add user authentication",
        "description": "Implemented login and signup features",
        "files": [
            {
                "name": "auth.js",
                "diff": "+ function login(user) {\n+   return user.email.toLowerCase();\n+ }",
                "issues": [
                    {
                        "line": 2,
                        "type": "null_pointer",
                        "severity": "high",
                        "description": "user.email can be null or undefined"
                    }
                ]
            }
        ]
    }'::JSONB,
    '[
        {
            "type": "comment",
            "line": 2,
            "file": "auth.js",
            "message_contains": "null check"
        }
    ]'::JSONB,
    1,
    1,
    100,
    ARRAY['authentication', 'null-safety', 'bug-detection'],
    'Security',
    ARRAY['null_pointer'],
    true
);

-- Get admin user and create sample review
DO $$
DECLARE
    admin_user_id BIGINT;
    sample_scenario_id BIGINT;
BEGIN
    SELECT user_id INTO admin_user_id FROM users WHERE username = 'admin';
    SELECT scenario_id INTO sample_scenario_id FROM pr_scenarios WHERE title = 'Null Pointer 버그 찾기' LIMIT 1;

    IF admin_user_id IS NOT NULL AND sample_scenario_id IS NOT NULL THEN
        -- Insert sample code review
        INSERT INTO code_reviews (
            user_id,
            scenario_id,
            review_actions,
            time_taken_seconds,
            issues_found,
            false_positives,
            comments_made,
            accuracy,
            is_passed,
            score,
            total_experience,
            ai_feedback
        ) VALUES (
            admin_user_id,
            sample_scenario_id,
            '[
                {
                    "type": "comment",
                    "line": 2,
                    "file": "auth.js",
                    "message": "user 객체가 null일 수 있으므로 null check가 필요합니다."
                },
                {
                    "type": "request_changes"
                }
            ]'::JSONB,
            180,
            1,
            0,
            1,
            100.00,
            true,
            100,
            150,
            '완벽한 리뷰입니다! null safety 체크를 정확히 지적했습니다.'
        );
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Challenger Mode tables created successfully' AS status;

SELECT table_name, COUNT(*) as row_count
FROM information_schema.tables t
LEFT JOIN (
    SELECT 'pr_scenarios' as table_name, COUNT(*) as count FROM pr_scenarios
    UNION ALL
    SELECT 'code_reviews', COUNT(*) FROM code_reviews
    UNION ALL
    SELECT 'challenger_rankings', COUNT(*) FROM challenger_rankings
) c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
    AND t.table_name IN ('pr_scenarios', 'code_reviews', 'challenger_rankings')
GROUP BY t.table_name, c.count
ORDER BY t.table_name;
