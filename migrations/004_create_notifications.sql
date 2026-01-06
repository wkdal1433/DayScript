-- ============================================================================
-- DayScript Database Migration
-- File: 004_create_notifications.sql
-- Description: Create notifications and notification preferences system
-- Version: 1.0.0
-- Date: 2025-11-20
-- ============================================================================

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE notification_type AS ENUM (
    'quest_complete',
    'level_up',
    'achievement_unlocked',
    'comment_reply',
    'post_like',
    'new_follower',
    'reminder_study',
    'streak_milestone',
    'community_mention',
    'system_announcement'
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
    notification_id     BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Notification Content
    type                notification_type NOT NULL,
    title               VARCHAR(100) NOT NULL,
    message             TEXT NOT NULL,

    -- Action Data
    action_url          TEXT,
    action_data         JSONB,

    -- Status
    is_read             BOOLEAN DEFAULT false,
    is_sent             BOOLEAN DEFAULT false,
    read_at             TIMESTAMP,
    sent_at             TIMESTAMP,

    -- Priority
    priority            INTEGER DEFAULT 0 CHECK (priority BETWEEN 0 AND 10),

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    expires_at          TIMESTAMP,

    CONSTRAINT title_length CHECK (CHAR_LENGTH(title) >= 1),
    CONSTRAINT message_length CHECK (CHAR_LENGTH(message) >= 1)
);

-- Comments
COMMENT ON TABLE notifications IS '사용자 알림 시스템';
COMMENT ON COLUMN notifications.action_url IS '딥링크 URL (예: dayscript://quiz/123)';
COMMENT ON COLUMN notifications.action_data IS '추가 액션 데이터 (JSON): {"quest_id": 123, "reward": 50}';
COMMENT ON COLUMN notifications.priority IS '알림 우선순위 (0=lowest, 10=highest)';
COMMENT ON COLUMN notifications.expires_at IS '알림 만료 시간 (시스템 공지 등)';

-- Indexes
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC)
    WHERE is_read = false;
CREATE INDEX idx_notifications_unsent ON notifications(user_id, type)
    WHERE is_sent = false;
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);
CREATE INDEX idx_notifications_priority ON notifications(priority DESC, created_at DESC)
    WHERE is_read = false;
CREATE INDEX idx_notifications_expires ON notifications(expires_at)
    WHERE expires_at IS NOT NULL;

-- ============================================================================
-- NOTIFICATION_PREFERENCES TABLE
-- ============================================================================

CREATE TABLE notification_preferences (
    preference_id               BIGSERIAL PRIMARY KEY,
    user_id                     BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Quest & Progress Notifications
    push_quest_complete         BOOLEAN DEFAULT true,
    push_level_up               BOOLEAN DEFAULT true,
    push_achievement_unlocked   BOOLEAN DEFAULT true,
    push_streak_milestone       BOOLEAN DEFAULT true,

    -- Community Notifications
    push_comment_reply          BOOLEAN DEFAULT true,
    push_post_like              BOOLEAN DEFAULT true,
    push_new_follower           BOOLEAN DEFAULT false,
    push_community_mention      BOOLEAN DEFAULT true,

    -- System Notifications
    push_reminder_study         BOOLEAN DEFAULT true,
    push_system_announcement    BOOLEAN DEFAULT true,

    -- Email Notifications
    email_quest_complete        BOOLEAN DEFAULT false,
    email_level_up              BOOLEAN DEFAULT true,
    email_achievement_unlocked  BOOLEAN DEFAULT true,
    email_weekly_summary        BOOLEAN DEFAULT true,

    -- Notification Settings
    do_not_disturb_start        TIME,
    do_not_disturb_end          TIME,
    notification_sound          BOOLEAN DEFAULT true,
    notification_vibration      BOOLEAN DEFAULT true,

    -- Metadata
    created_at                  TIMESTAMP DEFAULT NOW(),
    updated_at                  TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Comments
COMMENT ON TABLE notification_preferences IS '사용자별 알림 설정';
COMMENT ON COLUMN notification_preferences.do_not_disturb_start IS '방해금지 모드 시작 시간 (예: 22:00)';
COMMENT ON COLUMN notification_preferences.do_not_disturb_end IS '방해금지 모드 종료 시간 (예: 08:00)';
COMMENT ON COLUMN notification_preferences.email_weekly_summary IS '주간 학습 리포트 이메일 수신 여부';

-- Indexes
CREATE INDEX idx_notification_prefs_user ON notification_preferences(user_id);

-- ============================================================================
-- NOTIFICATION_DELIVERY_LOG TABLE
-- ============================================================================

CREATE TABLE notification_delivery_log (
    log_id              BIGSERIAL PRIMARY KEY,
    notification_id     BIGINT NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,

    -- Delivery Info
    delivery_method     VARCHAR(20) NOT NULL CHECK (delivery_method IN ('push', 'email', 'in_app')),
    delivery_status     VARCHAR(20) NOT NULL CHECK (delivery_status IN ('pending', 'sent', 'failed', 'clicked')),

    -- Delivery Metadata
    sent_at             TIMESTAMP,
    clicked_at          TIMESTAMP,
    error_message       TEXT,

    -- Device Info (for push)
    device_token        TEXT,
    device_platform     VARCHAR(20),

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_delivery_timing CHECK (
        clicked_at IS NULL OR sent_at IS NOT NULL
    )
);

-- Comments
COMMENT ON TABLE notification_delivery_log IS '알림 전송 로그 및 추적';
COMMENT ON COLUMN notification_delivery_log.delivery_method IS 'push, email, in_app';
COMMENT ON COLUMN notification_delivery_log.delivery_status IS 'pending, sent, failed, clicked';
COMMENT ON COLUMN notification_delivery_log.device_platform IS 'ios, android, web';

-- Indexes
CREATE INDEX idx_delivery_log_notification ON notification_delivery_log(notification_id);
CREATE INDEX idx_delivery_log_status ON notification_delivery_log(delivery_status, created_at);
CREATE INDEX idx_delivery_log_method ON notification_delivery_log(delivery_method, sent_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at
CREATE TRIGGER update_notification_prefs_updated_at BEFORE UPDATE ON notification_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set read_at timestamp
CREATE OR REPLACE FUNCTION set_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_read = true AND OLD.is_read = false THEN
        NEW.read_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_notification_read_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION set_notification_read_at();

-- Auto-set sent_at timestamp
CREATE OR REPLACE FUNCTION set_notification_sent_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_sent = true AND OLD.is_sent = false THEN
        NEW.sent_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_notification_sent_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION set_notification_sent_at();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Create notification for user
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id BIGINT,
    p_type notification_type,
    p_title VARCHAR(100),
    p_message TEXT,
    p_action_url TEXT DEFAULT NULL,
    p_action_data JSONB DEFAULT NULL,
    p_priority INTEGER DEFAULT 0
)
RETURNS BIGINT AS $$
DECLARE
    v_notification_id BIGINT;
    v_preference_enabled BOOLEAN;
    v_pref_column TEXT;
BEGIN
    -- Build preference column name
    v_pref_column := 'push_' || p_type::TEXT;

    -- Check user preference
    EXECUTE format('SELECT %I FROM notification_preferences WHERE user_id = $1', v_pref_column)
    INTO v_preference_enabled
    USING p_user_id;

    -- If preference not set, default to true
    IF v_preference_enabled IS NULL THEN
        v_preference_enabled := true;
    END IF;

    -- Only create notification if user has enabled this type
    IF v_preference_enabled THEN
        INSERT INTO notifications (
            user_id, type, title, message, action_url, action_data, priority
        ) VALUES (
            p_user_id, p_type, p_title, p_message, p_action_url, p_action_data, p_priority
        )
        RETURNING notification_id INTO v_notification_id;

        RETURN v_notification_id;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Mark all notifications as read for user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE notifications
    SET is_read = true
    WHERE user_id = p_user_id AND is_read = false;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Get unread notification count
CREATE OR REPLACE FUNCTION get_unread_count(p_user_id BIGINT)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM notifications
    WHERE user_id = p_user_id AND is_read = false;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM notifications
    WHERE expires_at IS NOT NULL AND expires_at < NOW();

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Get admin user_id
DO $$
DECLARE
    admin_user_id BIGINT;
BEGIN
    SELECT user_id INTO admin_user_id FROM users WHERE username = 'admin';

    IF admin_user_id IS NOT NULL THEN
        -- Insert default notification preferences
        INSERT INTO notification_preferences (user_id) VALUES (admin_user_id)
        ON CONFLICT (user_id) DO NOTHING;

        -- Insert sample notifications
        INSERT INTO notifications (user_id, type, title, message, action_url, action_data, priority) VALUES
        (admin_user_id, 'system_announcement', '🎉 DayScript에 오신 것을 환영합니다!', '매일 한 문제씩 풀면서 코딩 실력을 향상시켜보세요.', 'dayscript://home', NULL, 10),
        (admin_user_id, 'reminder_study', '📚 오늘의 학습을 시작할 시간이에요', '하루 30분 투자로 실력을 쌓아가세요!', 'dayscript://quiz', NULL, 5),
        (admin_user_id, 'achievement_unlocked', '🏆 첫 문제 해결 달성!', '첫 번째 문제를 성공적으로 풀었습니다. 경험치 +50', 'dayscript://achievements', '{"achievement_id": 1, "reward": 50}'::JSONB, 7);

        -- Mark first notification as read
        UPDATE notifications
        SET is_read = true
        WHERE user_id = admin_user_id AND type = 'system_announcement';
    END IF;
END $$;

-- ============================================================================
-- SCHEDULED JOBS (Comment - requires pg_cron extension)
-- ============================================================================

-- Example: Clean up expired notifications daily at 3 AM
-- SELECT cron.schedule('cleanup-expired-notifications', '0 3 * * *', $$SELECT cleanup_expired_notifications()$$);

-- Example: Send daily study reminders at 8 PM
-- SELECT cron.schedule('daily-study-reminder', '0 20 * * *', $$
--     INSERT INTO notifications (user_id, type, title, message, priority)
--     SELECT
--         u.user_id,
--         'reminder_study',
--         '📚 오늘의 학습을 시작하세요',
--         '하루 30분 투자로 실력을 쌓아가세요!',
--         5
--     FROM users u
--     INNER JOIN user_settings us ON u.user_id = us.user_id
--     INNER JOIN notification_preferences np ON u.user_id = np.user_id
--     WHERE u.is_active = true
--         AND us.quest_reminder = true
--         AND np.push_reminder_study = true
--         AND (u.last_study_date IS NULL OR u.last_study_date < CURRENT_DATE);
-- $$);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Notification tables created successfully' AS status;

SELECT table_name, COUNT(*) as row_count
FROM information_schema.tables t
LEFT JOIN (
    SELECT 'notifications' as table_name, COUNT(*) as count FROM notifications
    UNION ALL
    SELECT 'notification_preferences', COUNT(*) FROM notification_preferences
    UNION ALL
    SELECT 'notification_delivery_log', COUNT(*) FROM notification_delivery_log
) c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
    AND t.table_name IN ('notifications', 'notification_preferences', 'notification_delivery_log')
GROUP BY t.table_name, c.count
ORDER BY t.table_name;
