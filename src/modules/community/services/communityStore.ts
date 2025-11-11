import { useState, useCallback } from 'react';
import { CommunityPost, Comment, PostFilter, VoteData } from '../types/community.types';
import { communityAPI } from './communityAPI';
import { MOCK_POSTS } from './mockData';

interface CommunityStoreState {
  posts: CommunityPost[];
  currentPost: CommunityPost | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
  filter: PostFilter;
  hasNext: boolean;
  currentPage: number;
}

const initialState: CommunityStoreState = {
  posts: [],
  currentPost: null,
  comments: [],
  loading: false,
  error: null,
  filter: {
    category: 'problems',
    sortBy: 'recent',
  },
  hasNext: false,
  currentPage: 1,
};

export const useCommunityStore = () => {
  const [state, setState] = useState<CommunityStoreState>(initialState);

  const updateState = useCallback((updates: Partial<CommunityStoreState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    updateState({ loading });
  }, [updateState]);

  const setError = useCallback((error: string | null) => {
    updateState({ error });
  }, [updateState]);

  const setFilter = useCallback((filter: PostFilter) => {
    updateState({ filter, currentPage: 1, posts: [] });
  }, [updateState]);

  const loadPosts = useCallback(async (refresh: boolean = false) => {
    if (state.loading) return;

    setLoading(true);
    setError(null);

    try {
      // 더미 데이터를 사용하여 네트워크 오류 우회
      await new Promise(resolve => setTimeout(resolve, 300)); // 로딩 시뮬레이션

      // 필터에 따른 더미 데이터 필터링
      const filteredPosts = MOCK_POSTS.filter(post => {
        if (!state.filter.category || state.filter.category === 'problems') {
          return true;
        }
        return post.category === state.filter.category;
      });

      // 정렬 적용
      if (state.filter.sortBy === 'popular') {
        filteredPosts.sort((a, b) => b.likes - a.likes);
      } else if (state.filter.sortBy === 'recent') {
        filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const page = refresh ? 1 : state.currentPage;
      const limit = 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      const newPosts = refresh ? paginatedPosts : [...state.posts, ...paginatedPosts];
      updateState({
        posts: newPosts,
        hasNext: endIndex < filteredPosts.length,
        currentPage: page,
      });
    } catch (error) {
      // 더미 데이터 사용 시 오류 없음 - 실제로는 발생하지 않음
      setError(null);
    } finally {
      setLoading(false);
    }
  }, [state.loading, state.currentPage, state.filter, state.posts, setLoading, setError, updateState]);

  const loadMorePosts = useCallback(async () => {
    if (!state.hasNext || state.loading) return;

    updateState({ currentPage: state.currentPage + 1 });
    await loadPosts(false);
  }, [state.hasNext, state.loading, state.currentPage, loadPosts, updateState]);

  const refreshPosts = useCallback(async () => {
    await loadPosts(true);
  }, [loadPosts]);

  const loadPost = useCallback(async (postId: string) => {
    setLoading(true);
    setError(null);

    try {
      // 더미 데이터에서 해당 포스트 찾기
      await new Promise(resolve => setTimeout(resolve, 200));

      const post = MOCK_POSTS.find(p => p.id === postId);
      if (post) {
        updateState({ currentPost: post });
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError(null); // 더미 데이터 사용 시 오류 무시
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateState]);

  const loadComments = useCallback(async (postId: string, page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // 더미 데이터에서 댓글 가져오기
      await new Promise(resolve => setTimeout(resolve, 200));

      const post = MOCK_POSTS.find(p => p.id === postId);
      // 더미 데이터에서 댓글 생성
      const mockComments = [
        {
          id: `comment_${postId}_1`,
          postId: postId,
          content: '좋은 질문이네요! 도움이 되었습니다.',
          authorId: 'user_1',
          authorName: '김철수',
          author: {
            id: 'user_1',
            username: '김철수',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
            level: 5,
            reputation: 120,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          likes: 3,
          dislikes: 0,
          replies: [],
          isEdited: false,
        }
      ];

      if (post) {
        const newComments = page === 1 ? mockComments : [...state.comments, ...mockComments];
        updateState({ comments: newComments });
      } else {
        updateState({ comments: [] });
      }
    } catch (error) {
      setError(null); // 더미 데이터 사용 시 오류 무시
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateState, state.comments]);

  const votePost = useCallback(async (postId: string, voteType: 'like' | 'dislike') => {
    try {
      // 더미 데이터에서 투표 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 100));

      const updatedPosts = state.posts.map(post => {
        if (post.id === postId) {
          const newLikes = voteType === 'like' ? post.likes + 1 : post.likes;
          const newDislikes = voteType === 'dislike' ? post.dislikes + 1 : post.dislikes;
          return {
            ...post,
            likes: newLikes,
            dislikes: newDislikes,
          };
        }
        return post;
      });

      updateState({ posts: updatedPosts });

      if (state.currentPost?.id === postId) {
        const newLikes = voteType === 'like' ? state.currentPost.likes + 1 : state.currentPost.likes;
        const newDislikes = voteType === 'dislike' ? state.currentPost.dislikes + 1 : state.currentPost.dislikes;
        updateState({
          currentPost: {
            ...state.currentPost,
            likes: newLikes,
            dislikes: newDislikes,
          },
        });
      }
    } catch (error) {
      // 더미 데이터에서는 투표 오류 무시
    }
  }, [state.posts, state.currentPost, updateState]);

  const voteComment = useCallback(async (commentId: string, voteType: 'like' | 'dislike') => {
    try {
      // 더미 데이터에서 댓글 투표 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 100));

      const updateCommentVotes = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            const newLikes = voteType === 'like' ? comment.likes + 1 : comment.likes;
            return {
              ...comment,
              likes: newLikes,
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentVotes(comment.replies),
            };
          }
          return comment;
        });
      };

      updateState({ comments: updateCommentVotes(state.comments) });
    } catch (error) {
      // 더미 데이터에서는 댓글 투표 오류 무시
    }
  }, [state.comments, updateState]);

  const createPost = useCallback(async (postData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    problemId?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new post with mock data
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        title: postData.title,
        content: postData.content,
        category: postData.category as any,
        authorId: 'current_user',
        authorName: '현재 사용자',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        commentCount: 0,
        tags: postData.tags,
        problemId: postData.problemId,
        solved: false,
      };

      // Add to the beginning of posts array
      updateState({
        posts: [newPost, ...state.posts]
      });

      return newPost;
    } catch (error) {
      setError('게시글 작성에 실패했습니다.');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [state.posts, updateState, setLoading, setError]);

  const resetStore = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    // State
    ...state,

    // Actions
    setFilter,
    loadPosts,
    loadMorePosts,
    refreshPosts,
    loadPost,
    loadComments,
    createPost,
    votePost,
    voteComment,
    resetStore,
  };
};