// Community Module Entry Point
// This file exports all the public interfaces and components of the community module

// Screens
export { CommunityHomeScreen } from './screens/CommunityHomeScreen';
export { ProblemDiscussionScreen } from './screens/ProblemDiscussionScreen';
export { PostListScreen } from './screens/PostListScreen';
export { CreatePostScreen } from './screens/CreatePostScreen';
export { PostDetailScreen } from './screens/PostDetailScreen';

// Components
export { CategoryTabs } from './components/CategoryTabs';
export { PostCard } from './components/PostCard';
export { CommentSection } from './components/CommentSection';

// Services
export { communityAPI } from './services/communityAPI';
export { useCommunityStore } from './services/communityStore';
export { DatabaseManager } from './services/database';

// Types
export type {
  CommunityPost,
  Comment,
  CommunityUser,
  PostCategory,
  PostFilter,
  VoteData,
  CreatePostRequest,
  CreateCommentRequest,
} from './types/community.types';

export type {
  ApiResponse,
  PaginatedResponse,
  PostListResponse,
  CommentListResponse,
  PostListRequest,
  CommentListRequest,
  VoteResponse,
} from './types/api.types';

// Constants
export {
  COMMUNITY_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  SORT_OPTIONS,
  SORT_LABELS,
  DIFFICULTY_OPTIONS,
  DIFFICULTY_LABELS,
  DEFAULT_TAGS,
} from './constants/categories';

export { communityStyles } from './constants/community.styles';

// Navigation Integration Helper
export const CommunityNavigationConfig = {
  screens: {
    CommunityHome: {
      screen: 'CommunityHomeScreen',
      path: '/community',
    },
    PostList: {
      screen: 'PostListScreen',
      path: '/community/:category',
    },
    PostDetail: {
      screen: 'PostDetailScreen',
      path: '/community/post/:postId',
    },
    ProblemDiscussion: {
      screen: 'ProblemDiscussionScreen',
      path: '/community/problem/:problemId',
    },
    CreatePost: {
      screen: 'CreatePostScreen',
      path: '/community/create',
    },
  },
};

// Problem Integration Utility
export const navigateToProblemDiscussion = (
  navigation: any,
  problemId: string,
  problemTitle?: string
) => {
  navigation.navigate('ProblemDiscussion', {
    problemId,
    problemTitle,
  });
};

// Category Navigation Utility
export const navigateToCategory = (
  navigation: any,
  category: PostCategory,
  filter?: Partial<PostFilter>
) => {
  navigation.navigate('PostList', {
    category,
    initialFilter: filter,
  });
};