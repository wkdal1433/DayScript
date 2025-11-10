/**
 * Common 모듈 통합 내보내기
 * SOLID 원칙 중 ISP(인터페이스 분리) 적용 - 필요한 것만 노출
 */

// Core exports
export * from './core/constants';
export * from './core/types';
export * from './core/utils';

// UI exports
export * from './ui/components';

// Re-export commonly used items for convenience
export {
  COLORS,
  SEMANTIC_COLORS,
  TYPOGRAPHY,
  SPACING,
  COMPONENT_SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from './core/constants';

export type {
  ID,
  Timestamp,
  User,
  UserProgress,
  ApiResponse,
  LoadingState,
  AsyncState,
  AppError,
} from './core/types';

export {
  formatTime,
  formatDate,
  formatScore,
  formatPercentage,
  truncateText,
  isRequired,
  isEmail,
  validateForm,
} from './core/utils';