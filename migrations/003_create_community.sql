-- ============================================================================
-- DayScript Database Migration
-- File: 003_create_community.sql
-- Description: Create community posts, comments, and voting system
-- Version: 1.0.0
-- Date: 2025-11-20
-- ============================================================================

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE post_category AS ENUM ('problems', 'questions', 'tips', 'showcase', 'general');
CREATE TYPE vote_type AS ENUM ('like', 'dislike');
CREATE TYPE votable_type AS ENUM ('post', 'comment');

-- ============================================================================
-- COMMUNITY_POSTS TABLE
-- ============================================================================

CREATE TABLE community_posts (
    post_id             BIGSERIAL PRIMARY KEY,
    author_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Content
    category            post_category NOT NULL,
    title               VARCHAR(200) NOT NULL,
    content             TEXT NOT NULL,

    -- Associated Problem (Optional)
    related_problem_id  BIGINT REFERENCES quiz_problems(problem_id) ON DELETE SET NULL,

    -- Statistics (Denormalized for performance)
    view_count          INTEGER DEFAULT 0 CHECK (view_count >= 0),
    like_count          INTEGER DEFAULT 0 CHECK (like_count >= 0),
    dislike_count       INTEGER DEFAULT 0 CHECK (dislike_count >= 0),
    comment_count       INTEGER DEFAULT 0 CHECK (comment_count >= 0),

    -- Status
    is_pinned           BOOLEAN DEFAULT false,
    is_locked           BOOLEAN DEFAULT false,
    is_deleted          BOOLEAN DEFAULT false,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    deleted_at          TIMESTAMP,

    CONSTRAINT title_length CHECK (CHAR_LENGTH(title) >= 5)
);

-- Comments
COMMENT ON TABLE community_posts IS '커뮤니티 게시글';
COMMENT ON COLUMN community_posts.related_problem_id IS '연관된 문제 ID (선택)';
COMMENT ON COLUMN community_posts.is_pinned IS '공지사항 고정 여부';
COMMENT ON COLUMN community_posts.is_locked IS '댓글 잠금 여부';

-- Indexes
CREATE INDEX idx_posts_category_date ON community_posts(category, created_at DESC)
    WHERE is_deleted = false;
CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_problem ON community_posts(related_problem_id)
    WHERE related_problem_id IS NOT NULL;
CREATE INDEX idx_posts_popular ON community_posts(like_count DESC, view_count DESC)
    WHERE is_deleted = false;
CREATE INDEX idx_posts_pinned ON community_posts(is_pinned, created_at DESC)
    WHERE is_pinned = true AND is_deleted = false;

-- ============================================================================
-- POST_COMMENTS TABLE
-- ============================================================================

CREATE TABLE post_comments (
    comment_id          BIGSERIAL PRIMARY KEY,
    post_id             BIGINT NOT NULL REFERENCES community_posts(post_id) ON DELETE CASCADE,
    author_id           BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    parent_comment_id   BIGINT REFERENCES post_comments(comment_id) ON DELETE CASCADE,

    -- Content
    content             TEXT NOT NULL,

    -- Statistics
    like_count          INTEGER DEFAULT 0 CHECK (like_count >= 0),

    -- Status
    is_deleted          BOOLEAN DEFAULT false,

    -- Metadata
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW(),
    deleted_at          TIMESTAMP,

    CONSTRAINT content_length CHECK (CHAR_LENGTH(content) >= 1)
);

-- Comments
COMMENT ON TABLE post_comments IS '게시글 댓글 (대댓글 지원)';
COMMENT ON COLUMN post_comments.parent_comment_id IS '대댓글인 경우 부모 댓글 ID';

-- Indexes
CREATE INDEX idx_comments_post ON post_comments(post_id, created_at)
    WHERE is_deleted = false;
CREATE INDEX idx_comments_author ON post_comments(author_id);
CREATE INDEX idx_comments_parent ON post_comments(parent_comment_id)
    WHERE parent_comment_id IS NOT NULL;

-- ============================================================================
-- POST_VOTES TABLE
-- ============================================================================

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

-- Comments
COMMENT ON TABLE post_votes IS '게시글/댓글 좋아요/싫어요';
COMMENT ON COLUMN post_votes.votable_type IS 'post 또는 comment';
COMMENT ON COLUMN post_votes.votable_id IS 'post_id 또는 comment_id';

-- Indexes
CREATE INDEX idx_votes_user ON post_votes(user_id);
CREATE INDEX idx_votes_votable ON post_votes(votable_type, votable_id);
CREATE INDEX idx_votes_type ON post_votes(vote_type);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Update updated_at
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts
        SET comment_count = comment_count + 1
        WHERE post_id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts
        SET comment_count = GREATEST(0, comment_count - 1)
        WHERE post_id = OLD.post_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_comment_count
    AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comment_count();

-- Auto-update vote counts
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment count
        IF NEW.votable_type = 'post' THEN
            IF NEW.vote_type = 'like' THEN
                UPDATE community_posts SET like_count = like_count + 1 WHERE post_id = NEW.votable_id;
            ELSE
                UPDATE community_posts SET dislike_count = dislike_count + 1 WHERE post_id = NEW.votable_id;
            END IF;
        ELSIF NEW.votable_type = 'comment' THEN
            IF NEW.vote_type = 'like' THEN
                UPDATE post_comments SET like_count = like_count + 1 WHERE comment_id = NEW.votable_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement count
        IF OLD.votable_type = 'post' THEN
            IF OLD.vote_type = 'like' THEN
                UPDATE community_posts SET like_count = GREATEST(0, like_count - 1) WHERE post_id = OLD.votable_id;
            ELSE
                UPDATE community_posts SET dislike_count = GREATEST(0, dislike_count - 1) WHERE post_id = OLD.votable_id;
            END IF;
        ELSIF OLD.votable_type = 'comment' THEN
            IF OLD.vote_type = 'like' THEN
                UPDATE post_comments SET like_count = GREATEST(0, like_count - 1) WHERE comment_id = OLD.votable_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND OLD.vote_type != NEW.vote_type THEN
        -- Vote type changed (like -> dislike or vice versa)
        IF NEW.votable_type = 'post' THEN
            IF OLD.vote_type = 'like' AND NEW.vote_type = 'dislike' THEN
                UPDATE community_posts
                SET like_count = GREATEST(0, like_count - 1),
                    dislike_count = dislike_count + 1
                WHERE post_id = NEW.votable_id;
            ELSIF OLD.vote_type = 'dislike' AND NEW.vote_type = 'like' THEN
                UPDATE community_posts
                SET dislike_count = GREATEST(0, dislike_count - 1),
                    like_count = like_count + 1
                WHERE post_id = NEW.votable_id;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vote_counts
    AFTER INSERT OR UPDATE OR DELETE ON post_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_vote_counts();

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
        -- Insert sample posts
        INSERT INTO community_posts (author_id, category, title, content, related_problem_id) VALUES
        (admin_user_id, 'tips', 'Python 리스트 컴프리헨션 활용법', '리스트 컴프리헨션을 사용하면 코드를 더 간결하고 읽기 쉽게 만들 수 있습니다...', NULL),
        (admin_user_id, 'questions', '알고리즘 시간복잡도 질문', 'O(n log n)과 O(n^2)의 차이가 실제로 얼마나 큰가요?', NULL),
        (admin_user_id, 'showcase', '첫 100문제 달성!', '드디어 100문제를 풀었습니다! 다들 화이팅!', NULL);

        -- Insert sample comment
        INSERT INTO post_comments (post_id, author_id, content)
        SELECT post_id, admin_user_id, '좋은 정보 감사합니다!'
        FROM community_posts
        WHERE title = 'Python 리스트 컴프리헨션 활용법'
        LIMIT 1;
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 'Community tables created successfully' AS status;

SELECT table_name, COUNT(*) as row_count
FROM information_schema.tables t
LEFT JOIN (
    SELECT 'community_posts' as table_name, COUNT(*) as count FROM community_posts
    UNION ALL
    SELECT 'post_comments', COUNT(*) FROM post_comments
    UNION ALL
    SELECT 'post_votes', COUNT(*) FROM post_votes
) c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
    AND t.table_name IN ('community_posts', 'post_comments', 'post_votes')
GROUP BY t.table_name, c.count
ORDER BY t.table_name;
