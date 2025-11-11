import { PostCategory } from '../types/community.types';

export const COMMUNITY_CATEGORIES = {
  PROBLEMS: 'problems' as const,
  SOLUTIONS: 'solutions' as const,
  CAREER: 'career' as const,
  AI_TRENDS: 'ai-trends' as const,
} as const;

export const CATEGORY_LABELS = {
  [COMMUNITY_CATEGORIES.PROBLEMS]: '문제/질문',
  [COMMUNITY_CATEGORIES.SOLUTIONS]: '풀이/팁',
  [COMMUNITY_CATEGORIES.CAREER]: '취업/정보',
  [COMMUNITY_CATEGORIES.AI_TRENDS]: 'AI 트렌드',
} as const;

export const CATEGORY_ICONS = {
  [COMMUNITY_CATEGORIES.PROBLEMS]: '❓',
  [COMMUNITY_CATEGORIES.SOLUTIONS]: '💡',
  [COMMUNITY_CATEGORIES.CAREER]: '💼',
  [COMMUNITY_CATEGORIES.AI_TRENDS]: '🤖',
} as const;

export const SORT_OPTIONS = {
  RECENT: 'recent' as const,
  POPULAR: 'popular' as const,
  TRENDING: 'trending' as const,
} as const;

export const SORT_LABELS = {
  [SORT_OPTIONS.RECENT]: '최신순',
  [SORT_OPTIONS.POPULAR]: '인기순',
  [SORT_OPTIONS.TRENDING]: '트렌드순',
} as const;

export const DIFFICULTY_OPTIONS = {
  EASY: 'easy' as const,
  MEDIUM: 'medium' as const,
  HARD: 'hard' as const,
} as const;

export const DIFFICULTY_LABELS = {
  [DIFFICULTY_OPTIONS.EASY]: '쉬움',
  [DIFFICULTY_OPTIONS.MEDIUM]: '보통',
  [DIFFICULTY_OPTIONS.HARD]: '어려움',
} as const;

export const DEFAULT_TAGS = [
  'Python',
  'Java',
  'C++',
  'JavaScript',
  '알고리즘',
  '자료구조',
  '동적계획법',
  '그래프',
  '트리',
  '정렬',
  '탐색',
  '문자열',
  '수학',
  '구현',
  '시뮬레이션',
  '브루트포스',
  '그리디',
  '분할정복',
  '백트래킹',
  'DFS',
  'BFS',
];