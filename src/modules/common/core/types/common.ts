/**
 * 애플리케이션 전역 공통 타입 정의
 * DRY 원칙을 따른 타입 재사용
 */

// 기본 식별자 타입
export type ID = string;

// 날짜/시간 관련 타입
export type Timestamp = number;
export type DateString = string;

// 화면 크기 관련 타입
export interface Dimensions {
  width: number;
  height: number;
}

// 위치 관련 타입
export interface Position {
  x: number;
  y: number;
}

export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// 네비게이션 관련 타입
export interface NavigationRoute {
  name: string;
  params?: Record<string, any>;
}

export interface NavigationState {
  index: number;
  routes: NavigationRoute[];
}

// 사용자 관련 타입
export interface User {
  id: ID;
  username: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProgress {
  userId: ID;
  level: number;
  experience: number;
  completedQuizzes: ID[];
  achievements: Achievement[];
  lastActivityAt: Timestamp;
}

// 성취 관련 타입
export interface Achievement {
  id: ID;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: Timestamp;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

// 점수 관련 타입
export interface Score {
  value: number;
  maxValue: number;
  percentage: number;
}

export interface ScoreHistory {
  quizId: ID;
  score: Score;
  completedAt: Timestamp;
  timeTaken: number; // seconds
  hintsUsed: number;
}

// API 응답 관련 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: Timestamp;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// 에러 관련 타입
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Timestamp;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// 로딩 상태 타입
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AsyncState<T = any> {
  status: LoadingState;
  data: T | null;
  error: AppError | null;
  lastUpdated: Timestamp | null;
}

// 폼 관련 타입
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  disabled?: boolean;
}

export interface FormState<T = Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// 검색 및 필터링 타입
export interface SearchOptions {
  query: string;
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

// 설정 관련 타입
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

// 캐시 관련 타입
export interface CacheItem<T = any> {
  key: string;
  data: T;
  expiresAt: Timestamp;
  createdAt: Timestamp;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  strategy?: 'lru' | 'fifo' | 'lifo';
}

// 분석 관련 타입
export interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: Timestamp;
  userId?: ID;
  sessionId: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage: number;
  networkRequests: number;
}

// 유틸리티 타입
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 이벤트 관련 타입
export interface EventListener<T = any> {
  (event: T): void;
}

export interface EventEmitter {
  on<T>(event: string, listener: EventListener<T>): void;
  off<T>(event: string, listener: EventListener<T>): void;
  emit<T>(event: string, data: T): void;
}

// 상태 관리 타입
export interface Action<T = any> {
  type: string;
  payload?: T;
}

export interface Store<T = any> {
  getState(): T;
  dispatch(action: Action): void;
  subscribe(listener: () => void): () => void;
}