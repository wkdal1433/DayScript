-- CreateEnum
CREATE TYPE "ProblemType" AS ENUM ('OX', 'MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'DEBUGGING', 'CODE_REVIEW', 'VIBE_CODING');

-- CreateEnum
CREATE TYPE "ProblemDifficulty" AS ENUM ('easy', 'medium', 'hard', 'expert');

-- CreateEnum
CREATE TYPE "ProgrammingLanguage" AS ENUM ('Python', 'JavaScript', 'Java', 'TypeScript', 'CPP', 'Go');

-- CreateEnum
CREATE TYPE "PostCategory" AS ENUM ('problems', 'questions', 'tips', 'showcase', 'general');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('like', 'dislike');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('quest_complete', 'level_up', 'achievement_unlocked', 'comment_reply', 'post_like', 'new_follower', 'reminder_study', 'streak_milestone', 'community_mention', 'system_announcement');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('approve', 'request_changes', 'reject', 'flag');

-- CreateEnum
CREATE TYPE "ScenarioDifficulty" AS ENUM ('easy', 'medium', 'hard', 'expert');

-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "oauth_provider" VARCHAR(50),
    "oauth_provider_id" TEXT,
    "username" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT,
    "bio" TEXT,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "total_experience" INTEGER NOT NULL DEFAULT 0,
    "current_rank" INTEGER,
    "streak_days" INTEGER NOT NULL DEFAULT 0,
    "last_study_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "setting_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "daily_goal_minutes" INTEGER NOT NULL DEFAULT 30,
    "preferredLanguage" VARCHAR(20) NOT NULL DEFAULT 'Python',
    "difficulty_level" INTEGER NOT NULL DEFAULT 1,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "quest_reminder" BOOLEAN NOT NULL DEFAULT true,
    "reminder_time" TIME NOT NULL DEFAULT '20:00:00'::time,
    "community_notif" BOOLEAN NOT NULL DEFAULT true,
    "achievement_notif" BOOLEAN NOT NULL DEFAULT true,
    "themeMode" VARCHAR(10) NOT NULL DEFAULT 'light',
    "fontSize" VARCHAR(10) NOT NULL DEFAULT 'medium',
    "language" VARCHAR(10) NOT NULL DEFAULT 'ko',
    "profile_public" BOOLEAN NOT NULL DEFAULT true,
    "show_rank" BOOLEAN NOT NULL DEFAULT true,
    "show_streak" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("setting_id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "progress_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "unlocked_levels" INTEGER[] DEFAULT ARRAY[1]::INTEGER[],
    "completed_levels" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "total_problems_attempted" INTEGER NOT NULL DEFAULT 0,
    "total_problems_solved" INTEGER NOT NULL DEFAULT 0,
    "total_hints_used" INTEGER NOT NULL DEFAULT 0,
    "total_study_time_minutes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateTable
CREATE TABLE "user_level_statistics" (
    "stat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "accuracy" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "problems_attempted" INTEGER NOT NULL DEFAULT 0,
    "problems_solved" INTEGER NOT NULL DEFAULT 0,
    "average_time_seconds" INTEGER NOT NULL DEFAULT 0,
    "best_score" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "last_attempt_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_level_statistics_pkey" PRIMARY KEY ("stat_id")
);

-- CreateTable
CREATE TABLE "quiz_problems" (
    "problem_id" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "type" "ProblemType" NOT NULL,
    "difficulty" "ProblemDifficulty" NOT NULL,
    "language" "ProgrammingLanguage" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correct_answer" JSONB NOT NULL,
    "options" JSONB,
    "code_snippet" TEXT,
    "test_cases" JSONB,
    "hint_1" TEXT,
    "hint_2" TEXT,
    "hint_3" TEXT,
    "tags" TEXT[],
    "category" VARCHAR(50),
    "estimated_time_minutes" INTEGER NOT NULL DEFAULT 5,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "success_count" INTEGER NOT NULL DEFAULT 0,
    "average_accuracy" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_problems_pkey" PRIMARY KEY ("problem_id")
);

-- CreateTable
CREATE TABLE "problem_attempts" (
    "attempt_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "user_answer" JSONB NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "score" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "time_taken_seconds" INTEGER NOT NULL,
    "hints_used_count" INTEGER NOT NULL DEFAULT 0,
    "hints_used" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "code_quality_score" DECIMAL(5,2),
    "token_usage" INTEGER,
    "test_cases_passed" INTEGER,
    "test_cases_total" INTEGER,
    "vibe_session_id" TEXT,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "problem_attempts_pkey" PRIMARY KEY ("attempt_id")
);

-- CreateTable
CREATE TABLE "mistake_notes" (
    "note_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "wrong_count" INTEGER NOT NULL DEFAULT 1,
    "first_attempt_id" TEXT,
    "last_attempt_id" TEXT,
    "user_note" TEXT,
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "review_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "next_review_date" DATE,
    "review_interval_days" INTEGER NOT NULL DEFAULT 1,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mastered_at" TIMESTAMP(3),

    CONSTRAINT "mistake_notes_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "pr_scenarios" (
    "scenario_id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "context" TEXT,
    "difficulty" "ScenarioDifficulty" NOT NULL,
    "estimated_time_minutes" INTEGER NOT NULL DEFAULT 25,
    "requirements" JSONB,
    "tags" TEXT[],
    "pr_data" JSONB NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "success_rate" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pr_scenarios_pkey" PRIMARY KEY ("scenario_id")
);

-- CreateTable
CREATE TABLE "pr_scenario_solutions" (
    "solution_id" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "hunk_id" VARCHAR(100) NOT NULL,
    "file_path" VARCHAR(500),
    "line_number" INTEGER,
    "correct_decision" "ReviewDecision" NOT NULL,
    "explanation" TEXT NOT NULL,
    "severity" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pr_scenario_solutions_pkey" PRIMARY KEY ("solution_id")
);

-- CreateTable
CREATE TABLE "code_reviews" (
    "review_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "review_actions" JSONB NOT NULL,
    "overall_decision" "ReviewDecision" NOT NULL,
    "comments" TEXT,
    "correct_actions" INTEGER NOT NULL,
    "total_actions" INTEGER NOT NULL,
    "accuracy" DECIMAL(5,2) NOT NULL,
    "time_taken_seconds" INTEGER NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "vibe_sessions" (
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "problem_id" TEXT NOT NULL,
    "initial_prompt" TEXT NOT NULL,
    "final_code" TEXT,
    "token_usage" INTEGER NOT NULL,
    "prompt_quality_score" DECIMAL(5,2) NOT NULL,
    "code_quality_score" DECIMAL(5,2),
    "test_cases_passed" INTEGER,
    "test_cases_total" INTEGER,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "vibe_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "vibe_messages" (
    "message_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "role" VARCHAR(20) NOT NULL,
    "content" TEXT NOT NULL,
    "token_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vibe_messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "category" "PostCategory" NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "related_problem_id" TEXT,
    "is_problem_question" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "dislike_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_locked" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "comment_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "parent_comment_id" TEXT,
    "content" TEXT NOT NULL,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "post_votes" (
    "vote_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "vote_type" "VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_votes_pkey" PRIMARY KEY ("vote_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "message" TEXT NOT NULL,
    "action_url" TEXT,
    "action_data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "pref_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "push_quest_complete" BOOLEAN NOT NULL DEFAULT true,
    "push_level_up" BOOLEAN NOT NULL DEFAULT true,
    "push_achievement" BOOLEAN NOT NULL DEFAULT true,
    "push_comment_reply" BOOLEAN NOT NULL DEFAULT true,
    "push_post_like" BOOLEAN NOT NULL DEFAULT false,
    "push_reminder_study" BOOLEAN NOT NULL DEFAULT true,
    "inapp_all" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("pref_id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "achievement_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "category" VARCHAR(50) NOT NULL,
    "requirement" JSONB NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "user_achievement_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "achievement_id" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "unlocked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("user_achievement_id")
);

-- CreateTable
CREATE TABLE "daily_quests" (
    "quest_id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "quest_type" VARCHAR(50) NOT NULL,
    "target_value" INTEGER NOT NULL,
    "reward_xp" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_quests_pkey" PRIMARY KEY ("quest_id")
);

-- CreateTable
CREATE TABLE "user_daily_quests" (
    "user_quest_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "quest_date" DATE NOT NULL,
    "current_value" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_quests_pkey" PRIMARY KEY ("user_quest_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_user_id_key" ON "user_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_key" ON "user_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_level_statistics_user_id_level_idx" ON "user_level_statistics"("user_id", "level");

-- CreateIndex
CREATE INDEX "user_level_statistics_user_id_accuracy_idx" ON "user_level_statistics"("user_id", "accuracy" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_level_statistics_user_id_level_key" ON "user_level_statistics"("user_id", "level");

-- CreateIndex
CREATE INDEX "quiz_problems_level_type_idx" ON "quiz_problems"("level", "type");

-- CreateIndex
CREATE INDEX "quiz_problems_language_idx" ON "quiz_problems"("language");

-- CreateIndex
CREATE INDEX "quiz_problems_difficulty_idx" ON "quiz_problems"("difficulty");

-- CreateIndex
CREATE INDEX "quiz_problems_tags_idx" ON "quiz_problems"("tags");

-- CreateIndex
CREATE INDEX "quiz_problems_is_published_idx" ON "quiz_problems"("is_published");

-- CreateIndex
CREATE INDEX "quiz_problems_level_language_is_published_idx" ON "quiz_problems"("level", "language", "is_published");

-- CreateIndex
CREATE INDEX "problem_attempts_user_id_problem_id_idx" ON "problem_attempts"("user_id", "problem_id");

-- CreateIndex
CREATE INDEX "problem_attempts_user_id_attempted_at_idx" ON "problem_attempts"("user_id", "attempted_at" DESC);

-- CreateIndex
CREATE INDEX "problem_attempts_problem_id_idx" ON "problem_attempts"("problem_id");

-- CreateIndex
CREATE INDEX "problem_attempts_vibe_session_id_idx" ON "problem_attempts"("vibe_session_id");

-- CreateIndex
CREATE INDEX "mistake_notes_user_id_problem_id_idx" ON "mistake_notes"("user_id", "problem_id");

-- CreateIndex
CREATE INDEX "mistake_notes_user_id_next_review_date_idx" ON "mistake_notes"("user_id", "next_review_date");

-- CreateIndex
CREATE INDEX "mistake_notes_next_review_date_idx" ON "mistake_notes"("next_review_date");

-- CreateIndex
CREATE UNIQUE INDEX "mistake_notes_user_id_problem_id_key" ON "mistake_notes"("user_id", "problem_id");

-- CreateIndex
CREATE INDEX "pr_scenarios_difficulty_is_published_idx" ON "pr_scenarios"("difficulty", "is_published");

-- CreateIndex
CREATE INDEX "pr_scenario_solutions_scenario_id_idx" ON "pr_scenario_solutions"("scenario_id");

-- CreateIndex
CREATE UNIQUE INDEX "pr_scenario_solutions_scenario_id_hunk_id_key" ON "pr_scenario_solutions"("scenario_id", "hunk_id");

-- CreateIndex
CREATE INDEX "code_reviews_user_id_submitted_at_idx" ON "code_reviews"("user_id", "submitted_at" DESC);

-- CreateIndex
CREATE INDEX "code_reviews_scenario_id_idx" ON "code_reviews"("scenario_id");

-- CreateIndex
CREATE INDEX "vibe_sessions_user_id_started_at_idx" ON "vibe_sessions"("user_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "vibe_messages_session_id_created_at_idx" ON "vibe_messages"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "community_posts_category_created_at_idx" ON "community_posts"("category", "created_at" DESC);

-- CreateIndex
CREATE INDEX "community_posts_author_id_idx" ON "community_posts"("author_id");

-- CreateIndex
CREATE INDEX "community_posts_related_problem_id_idx" ON "community_posts"("related_problem_id");

-- CreateIndex
CREATE INDEX "community_posts_related_problem_id_created_at_idx" ON "community_posts"("related_problem_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "community_posts_like_count_view_count_idx" ON "community_posts"("like_count" DESC, "view_count" DESC);

-- CreateIndex
CREATE INDEX "post_comments_post_id_created_at_idx" ON "post_comments"("post_id", "created_at");

-- CreateIndex
CREATE INDEX "post_comments_author_id_idx" ON "post_comments"("author_id");

-- CreateIndex
CREATE INDEX "post_comments_parent_comment_id_idx" ON "post_comments"("parent_comment_id");

-- CreateIndex
CREATE INDEX "post_votes_user_id_idx" ON "post_votes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_votes_user_id_post_id_key" ON "post_votes"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_votes_user_id_comment_id_key" ON "post_votes"("user_id", "comment_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "notifications_is_sent_created_at_idx" ON "notifications"("is_sent", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- CreateIndex
CREATE INDEX "user_achievements_user_id_idx" ON "user_achievements"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_user_id_achievement_id_key" ON "user_achievements"("user_id", "achievement_id");

-- CreateIndex
CREATE INDEX "user_daily_quests_user_id_quest_date_idx" ON "user_daily_quests"("user_id", "quest_date");

-- CreateIndex
CREATE UNIQUE INDEX "user_daily_quests_user_id_quest_id_quest_date_key" ON "user_daily_quests"("user_id", "quest_id", "quest_date");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_level_statistics" ADD CONSTRAINT "user_level_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_problems" ADD CONSTRAINT "quiz_problems_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_attempts" ADD CONSTRAINT "problem_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_attempts" ADD CONSTRAINT "problem_attempts_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "quiz_problems"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem_attempts" ADD CONSTRAINT "problem_attempts_vibe_session_id_fkey" FOREIGN KEY ("vibe_session_id") REFERENCES "vibe_sessions"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_notes" ADD CONSTRAINT "mistake_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_notes" ADD CONSTRAINT "mistake_notes_problem_id_fkey" FOREIGN KEY ("problem_id") REFERENCES "quiz_problems"("problem_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_notes" ADD CONSTRAINT "mistake_notes_first_attempt_id_fkey" FOREIGN KEY ("first_attempt_id") REFERENCES "problem_attempts"("attempt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_notes" ADD CONSTRAINT "mistake_notes_last_attempt_id_fkey" FOREIGN KEY ("last_attempt_id") REFERENCES "problem_attempts"("attempt_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pr_scenario_solutions" ADD CONSTRAINT "pr_scenario_solutions_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "pr_scenarios"("scenario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_reviews" ADD CONSTRAINT "code_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_reviews" ADD CONSTRAINT "code_reviews_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "pr_scenarios"("scenario_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vibe_sessions" ADD CONSTRAINT "vibe_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vibe_messages" ADD CONSTRAINT "vibe_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "vibe_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_related_problem_id_fkey" FOREIGN KEY ("related_problem_id") REFERENCES "quiz_problems"("problem_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "post_comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "community_posts"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "post_comments"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("achievement_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_quests" ADD CONSTRAINT "user_daily_quests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_daily_quests" ADD CONSTRAINT "user_daily_quests_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "daily_quests"("quest_id") ON DELETE CASCADE ON UPDATE CASCADE;
