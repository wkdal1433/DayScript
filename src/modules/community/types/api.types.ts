import { CommunityPost, Comment, CommunityUser, PostFilter } from './community.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PostListResponse extends PaginatedResponse<CommunityPost> {}
export interface CommentListResponse extends PaginatedResponse<Comment> {}

export interface PostListRequest {
  filter: PostFilter;
  page?: number;
  limit?: number;
}

export interface CommentListRequest {
  postId: string;
  page?: number;
  limit?: number;
}

export interface VoteResponse {
  success: boolean;
  newLikes: number;
  newDislikes: number;
  userVote?: 'like' | 'dislike' | null;
}