/**
 * 공통 상수 통합 내보내기
 * 디자인 토큰 시스템의 중앙 집중화
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Re-export commonly used constants for convenience
export { COLORS, SEMANTIC_COLORS, getColor } from './colors';
export { TYPOGRAPHY, getTextStyle } from './typography';
export { SPACING, COMPONENT_SPACING, BORDER_RADIUS, SHADOWS, getSpacing, getBorderRadius, getShadow } from './spacing';