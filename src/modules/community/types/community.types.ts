export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  commentCount: number;
  tags: string[];
  problemId?: string;
  solved?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Comment {
  id: string;
  postId: string;
  parentCommentId?: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
  rank: string;
  solvedProblems: number;
  joinedAt: string;
}

export type PostCategory = 'problems' | 'solutions' | 'career' | 'ai-trends';

export interface PostFilter {
  category?: PostCategory;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  sortBy?: 'recent' | 'popular' | 'trending';
  problemId?: string;
}

export interface VoteData {
  type: 'like' | 'dislike';
  targetId: string;
  targetType: 'post' | 'comment';
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category: PostCategory;
  tags: string[];
  problemId?: string;
}

export interface CreateCommentRequest {
  postId: string;
  parentCommentId?: string;
  content: string;
}