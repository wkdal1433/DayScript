-- ============================================================================
-- DayScript Database Migration
-- File: 001_create_users_and_settings.sql
-- Description: Create users and user settings tables
-- Version: 1.0.0
-- Date: 2025-11-20
-- ============================================================================

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
    -- Primary Key
    user_id             BIGSERIAL PRIMARY KEY,

    -- Authentication
    email               VARCHAR(255) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    oauth_provider      VARCHAR(50),
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
    deleted_at          TIMESTAMP,

    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,50}$'),
    CONSTRAINT streak_positive CHECK (streak_days >= 0),
    CONSTRAINT experience_positive CHECK (total_experience >= 0)
);

-- Comments
COMMENT ON TABLE users IS '사용자 계정 및 프로필 정보';
COMMENT ON COLUMN users.streak_days IS '연속 학습 일수 (일일 퀘스트 기반)';
COMMENT ON COLUMN users.current_rank IS '전체 사용자 중 순위 (Materialized View에서 업데이트)';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp';

-- Indexes
CREATE INDEX idx_users_email ON users(email) WHERE is_active = true;
CREATE INDEX idx_users_username ON users(username) WHERE is_active = true;
CREATE INDEX idx_users_rank ON users(current_rank) WHERE current_rank IS NOT NULL;
CREATE INDEX idx_users_active ON users(is_active, created_at DESC);

-- ============================================================================
-- USER_SETTINGS TABLE
-- ============================================================================

CREATE TABLE user_settings (
    setting_id          BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Learning Settings
    daily_goal_minutes  INTEGER DEFAULT 30 CHECK (daily_goal_minutes > 0),
    preferred_language  VARCHAR(20) DEFAULT 'Python',
    difficulty_level    INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),

    -- Notification Settings
    push_enabled        BOOLEAN DEFAULT true,
    quest_reminder      BOOLEAN DEFAULT true,
    reminder_time       TIME DEFAULT '20:00:00',
    community_notif     BOOLEAN DEFAULT true,
    achievement_notif   BOOLEAN DEFAULT true,

    -- App Settings
    theme_mode          VARCHAR(10) DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'auto')),
    font_size           VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
    language            VARCHAR(10) DEFAULT 'ko' CHECK (language IN ('ko', 'en')),

    -- Privacy Settings
    profile_public      BOOLEAN DEFAULT true,
    show_rank           BOOLEAN DEFAULT true,
    show_streak         BOOLEAN DEFAULT true,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Comments
COMMENT ON TABLE user_settings IS '사용자별 개인화 설정';
COMMENT ON COLUMN user_settings.preferred_language IS '선호 프로그래밍 언어: Python, JavaScript, Java';
COMMENT ON COLUMN user_settings.reminder_time IS '일일 학습 리마인더 시간';

-- Indexes
CREATE INDEX idx_user_settings_user ON user_settings(user_id);

-- ============================================================================
-- USER_PROGRESS TABLE
-- ============================================================================

CREATE TABLE user_progress (
    progress_id         BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Level Progress
    unlocked_levels     INTEGER[] DEFAULT ARRAY[1],
    completed_levels    INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    current_level       INTEGER DEFAULT 1 CHECK (current_level BETWEEN 1 AND 5),

    -- Statistics by Level
    level_1_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (level_1_accuracy BETWEEN 0 AND 100),
    level_2_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (level_2_accuracy BETWEEN 0 AND 100),
    level_3_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (level_3_accuracy BETWEEN 0 AND 100),
    level_4_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (level_4_accuracy BETWEEN 0 AND 100),
    level_5_accuracy    DECIMAL(5,2) DEFAULT 0.00 CHECK (level_5_accuracy BETWEEN 0 AND 100),

    -- Overall Statistics
    total_problems_attempted  INTEGER DEFAULT 0 CHECK (total_problems_attempted >= 0),
    total_problems_solved     INTEGER DEFAULT 0 CHECK (total_problems_solved >= 0),
    total_hints_used          INTEGER DEFAULT 0 CHECK (total_hints_used >= 0),
    total_study_time_minutes  INTEGER DEFAULT 0 CHECK (total_study_time_minutes >= 0),

    -- Weekly Progress (JSON for flexibility)
    weekly_data         JSONB DEFAULT '[]'::JSONB,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id),
    CONSTRAINT solved_not_exceed_attempted CHECK (total_problems_solved <= total_problems_attempted)
);

-- Comments
COMMENT ON TABLE user_progress IS '사용자별 학습 진도 및 통계';
COMMENT ON COLUMN user_progress.weekly_data IS '주간 학습 데이터 (7일치 배열) - [{"date": "2025-11-20", "problemsSolved": 5}]';
COMMENT ON COLUMN user_progress.unlocked_levels IS '잠금 해제된 레벨 목록';
COMMENT ON COLUMN user_progress.completed_levels IS '완료한 레벨 목록';

-- Indexes
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_level ON user_progress(current_level);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Optional - for development)
-- ============================================================================

-- Insert default admin user (password: 'admin123' - change in production!)
INSERT INTO users (email, password_hash, username, display_name, current_level, total_experience)
VALUES (
    'admin@dayscript.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5kB7KKMHB7JHm', -- bcrypt hash of 'admin123'
    'admin',
    'DayScript Admin',
    5,
    10000
);

-- Insert default settings for admin
INSERT INTO user_settings (user_id)
SELECT user_id FROM users WHERE username = 'admin';

-- Insert default progress for admin
INSERT INTO user_progress (
    user_id,
    unlocked_levels,
    completed_levels,
    current_level
)
SELECT
    user_id,
    ARRAY[1,2,3,4,5],
    ARRAY[1,2,3,4],
    5
FROM users WHERE username = 'admin';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify tables created
SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
    AND table_name IN ('users', 'user_settings', 'user_progress')
ORDER BY table_name;

-- Verify indexes created
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('users', 'user_settings', 'user_progress')
ORDER BY tablename, indexname;
