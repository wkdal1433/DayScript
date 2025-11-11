/**
 * Database schema integration for Community Module
 * This file defines the database tables and their relationships
 * Based on the provided DB schema requirements
 */

export interface CommunityPostEntity {
  id: string;
  title: string;
  content: string;
  category: 'problems' | 'solutions' | 'career' | 'ai-trends';
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  commentCount: number;
  tags: string; // JSON string array
  problemId?: string;
  solved?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  viewCount: number;
  isDeleted: boolean;
}

export interface CommentEntity {
  id: string;
  postId: string;
  parentCommentId?: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  isDeleted: boolean;
  depth: number; // For nested comments hierarchy
}

export interface VoteEntity {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  voteType: 'like' | 'dislike';
  createdAt: Date;
}

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reputation: number;
  rank: string;
  solvedProblems: number;
  joinedAt: Date;
  isActive: boolean;
}

/**
 * SQL DDL for creating the database tables
 */
export const createTablesSQL = `
-- CommunityPost Table
CREATE TABLE IF NOT EXISTS community_posts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category ENUM('problems', 'solutions', 'career', 'ai-trends') NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    tags JSON,
    problem_id VARCHAR(50),
    solved BOOLEAN DEFAULT FALSE,
    difficulty ENUM('easy', 'medium', 'hard'),
    view_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,

    INDEX idx_category (category),
    INDEX idx_author_id (author_id),
    INDEX idx_problem_id (problem_id),
    INDEX idx_created_at (created_at),
    INDEX idx_difficulty (difficulty),
    INDEX idx_solved (solved)
);

-- Comment Table
CREATE TABLE IF NOT EXISTS community_comments (
    id VARCHAR(36) PRIMARY KEY,
    post_id VARCHAR(36) NOT NULL,
    parent_comment_id VARCHAR(36),
    author_id VARCHAR(36) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    depth INT DEFAULT 0,

    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES community_comments(id) ON DELETE CASCADE,

    INDEX idx_post_id (post_id),
    INDEX idx_parent_comment_id (parent_comment_id),
    INDEX idx_author_id (author_id),
    INDEX idx_created_at (created_at)
);

-- Vote Table
CREATE TABLE IF NOT EXISTS community_votes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    target_id VARCHAR(36) NOT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    vote_type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_user_vote (user_id, target_id, target_type),
    INDEX idx_target (target_id, target_type),
    INDEX idx_user_id (user_id)
);

-- User Table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(500),
    reputation INT DEFAULT 0,
    rank VARCHAR(50) DEFAULT 'Beginner',
    solved_problems INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,

    INDEX idx_email (email),
    INDEX idx_reputation (reputation),
    INDEX idx_rank (rank)
);
`;

/**
 * Repository interfaces for database operations
 */
export interface ICommunityPostRepository {
  create(post: Omit<CommunityPostEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommunityPostEntity>;
  findById(id: string): Promise<CommunityPostEntity | null>;
  findByFilter(filter: {
    category?: string;
    authorId?: string;
    problemId?: string;
    tags?: string[];
    difficulty?: string;
    limit?: number;
    offset?: number;
    orderBy?: string;
  }): Promise<CommunityPostEntity[]>;
  update(id: string, updates: Partial<CommunityPostEntity>): Promise<CommunityPostEntity>;
  delete(id: string): Promise<boolean>;
  incrementViewCount(id: string): Promise<void>;
  updateCommentCount(id: string, delta: number): Promise<void>;
}

export interface ICommentRepository {
  create(comment: Omit<CommentEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<CommentEntity>;
  findById(id: string): Promise<CommentEntity | null>;
  findByPostId(postId: string, includeReplies?: boolean): Promise<CommentEntity[]>;
  findReplies(parentCommentId: string): Promise<CommentEntity[]>;
  update(id: string, updates: Partial<CommentEntity>): Promise<CommentEntity>;
  delete(id: string): Promise<boolean>;
  getCommentsTree(postId: string): Promise<CommentEntity[]>;
}

export interface IVoteRepository {
  create(vote: Omit<VoteEntity, 'id' | 'createdAt'>): Promise<VoteEntity>;
  findUserVote(userId: string, targetId: string, targetType: 'post' | 'comment'): Promise<VoteEntity | null>;
  update(id: string, voteType: 'like' | 'dislike'): Promise<VoteEntity>;
  delete(id: string): Promise<boolean>;
  getVoteCounts(targetId: string, targetType: 'post' | 'comment'): Promise<{likes: number, dislikes: number}>;
}

/**
 * Database connection and initialization functions
 */
export class DatabaseManager {
  private static instance: DatabaseManager;
  private connection: any; // Replace with actual database connection type

  private constructor() {
    // Initialize database connection
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public async initialize(): Promise<void> {
    try {
      // Execute table creation SQL
      await this.executeSQL(createTablesSQL);
      console.log('Community database tables initialized successfully');
    } catch (error) {
      console.error('Failed to initialize community database:', error);
      throw error;
    }
  }

  public async executeSQL(sql: string): Promise<any> {
    // Execute SQL query implementation
    // This will depend on your database driver (MySQL, PostgreSQL, SQLite, etc.)
    return this.connection.execute(sql);
  }

  public async query(sql: string, params?: any[]): Promise<any> {
    // Execute parameterized query
    return this.connection.query(sql, params);
  }

  public async transaction<T>(callback: (connection: any) => Promise<T>): Promise<T> {
    // Execute transaction
    const transaction = await this.connection.beginTransaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

/**
 * Migration utilities for database schema updates
 */
export const migrations = [
  {
    version: '1.0.0',
    description: 'Initial community tables',
    sql: createTablesSQL,
  },
  {
    version: '1.1.0',
    description: 'Add view count and problem linking',
    sql: `
      ALTER TABLE community_posts ADD COLUMN view_count INT DEFAULT 0;
      ALTER TABLE community_posts ADD INDEX idx_view_count (view_count);
    `,
  },
  {
    version: '1.2.0',
    description: 'Add comment depth for nested replies',
    sql: `
      ALTER TABLE community_comments ADD COLUMN depth INT DEFAULT 0;
      ALTER TABLE community_comments ADD INDEX idx_depth (depth);
    `,
  },
];

/**
 * Seed data for testing and development
 */
export const seedData = {
  posts: [
    {
      title: '배열에서 최댓값 찾는 효율적인 방법',
      content: 'for문 vs Math.max() vs reduce() 중 어떤 방법이 가장 효율적일까요?',
      category: 'problems',
      tags: ['JavaScript', '배열', '알고리즘'],
      difficulty: 'easy',
    },
    {
      title: 'Dynamic Programming 입문 가이드',
      content: 'DP의 기본 개념과 문제 해결 접근법을 정리해보았습니다.',
      category: 'solutions',
      tags: ['알고리즘', '동적계획법', 'DP'],
      difficulty: 'medium',
    },
    {
      title: '2024 신입 개발자 면접 후기',
      content: '카카오, 네이버, 라인 면접 경험을 공유합니다.',
      category: 'career',
      tags: ['면접', '취업', '신입'],
    },
    {
      title: 'ChatGPT 코딩 테스트 활용법',
      content: 'AI를 활용한 효율적인 알고리즘 문제 해결 방법',
      category: 'ai-trends',
      tags: ['AI', 'ChatGPT', '코딩테스트'],
    },
  ],
};