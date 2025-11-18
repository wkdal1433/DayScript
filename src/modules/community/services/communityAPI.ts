import {
  CommunityPost,
  Comment,
  CreatePostRequest,
  CreateCommentRequest,
  PostFilter,
  VoteData,
} from '../types/community.types';
import {
  ApiResponse,
  PostListResponse,
  CommentListResponse,
  PostListRequest,
  CommentListRequest,
  VoteResponse,
} from '../types/api.types';

class CommunityAPI {
  private baseURL = 'http://localhost:3000/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPosts(request: PostListRequest): Promise<ApiResponse<PostListResponse>> {
    const params = new URLSearchParams();

    if (request.filter.category) params.append('category', request.filter.category);
    if (request.filter.tags?.length) params.append('tags', request.filter.tags.join(','));
    if (request.filter.difficulty) params.append('difficulty', request.filter.difficulty);
    if (request.filter.sortBy) params.append('sortBy', request.filter.sortBy);
    if (request.filter.problemId) params.append('problemId', request.filter.problemId);
    if (request.page) params.append('page', request.page.toString());
    if (request.limit) params.append('limit', request.limit.toString());

    return this.request<PostListResponse>(`/posts?${params}`);
  }

  async getPost(postId: string): Promise<ApiResponse<CommunityPost>> {
    return this.request<CommunityPost>(`/posts/${postId}`);
  }

  async createPost(post: CreatePostRequest): Promise<ApiResponse<CommunityPost>> {
    return this.request<CommunityPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updatePost(
    postId: string,
    updates: Partial<CreatePostRequest>
  ): Promise<ApiResponse<CommunityPost>> {
    return this.request<CommunityPost>(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async getComments(request: CommentListRequest): Promise<ApiResponse<CommentListResponse>> {
    const params = new URLSearchParams();
    params.append('postId', request.postId);
    if (request.page) params.append('page', request.page.toString());
    if (request.limit) params.append('limit', request.limit.toString());

    return this.request<CommentListResponse>(`/comments?${params}`);
  }

  async createComment(comment: CreateCommentRequest): Promise<ApiResponse<Comment>> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async updateComment(
    commentId: string,
    content: string
  ): Promise<ApiResponse<Comment>> {
    return this.request<Comment>(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async vote(voteData: VoteData): Promise<ApiResponse<VoteResponse>> {
    return this.request<VoteResponse>('/vote', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  }

  async getPostsByProblemId(problemId: string): Promise<ApiResponse<PostListResponse>> {
    return this.getPosts({
      filter: { problemId },
      page: 1,
      limit: 20,
    });
  }

  async getTrendingPosts(category?: string): Promise<ApiResponse<PostListResponse>> {
    const params = new URLSearchParams();
    params.append('sortBy', 'trending');
    if (category) params.append('category', category);
    params.append('limit', '10');

    return this.request<PostListResponse>(`/posts?${params}`);
  }
}

export const communityAPI = new CommunityAPI();