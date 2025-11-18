/**
 * 공통 색상 시스템
 * Design Token System을 통한 일관성 있는 색상 관리
 */

export const COLORS = {
  // Primary Colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main Primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary Colors
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Success Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Main Success
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Warning Colors
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Main Warning
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error Colors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Main Error
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Level-specific Colors
  level: {
    lv1: '#10B981', // Green - Easy
    lv2: '#3B82F6', // Blue - Normal
    lv3: '#8B5CF6', // Purple - Medium
    lv4: '#F59E0B', // Orange - Hard
    lv5: '#EF4444', // Red - Expert
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F3F4F6',
    dark: '#111827',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#374151',
    tertiary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Border Colors
  border: {
    light: '#F3F4F6',
    default: '#E5E7EB',
    dark: '#D1D5DB',
    focus: '#3B82F6',
  },

  // Quiz-specific Colors
  quiz: {
    correct: '#10B981',
    incorrect: '#EF4444',
    hint: '#F59E0B',
    selected: '#3B82F6',
    pending: '#6B7280',
  },
} as const;

export type ColorKey = keyof typeof COLORS;
export type ColorShade = keyof typeof COLORS.primary;

// Helper function to get color values
export const getColor = (color: string, shade?: string | number): string => {
  const colorParts = color.split('.');

  if (colorParts.length === 1) {
    // Simple color like 'primary'
    const colorObj = (COLORS as any)[colorParts[0]];
    if (typeof colorObj === 'string') {
      return colorObj;
    }
    if (typeof colorObj === 'object' && shade) {
      return colorObj[shade] || colorObj[500];
    }
    if (typeof colorObj === 'object') {
      return colorObj[500]; // Default to 500 shade
    }
  }

  if (colorParts.length === 2) {
    // Nested color like 'primary.500'
    const [colorName, colorShade] = colorParts;
    const colorObj = (COLORS as any)[colorName];
    if (typeof colorObj === 'object') {
      return colorObj[colorShade] || colorObj[500];
    }
  }

  return COLORS.neutral[500]; // Fallback
};

// Semantic color aliases for easier usage
export const SEMANTIC_COLORS = {
  background: COLORS.background.primary,
  surface: COLORS.background.secondary,
  border: COLORS.border.default,
  text: COLORS.text.primary,
  textSecondary: COLORS.text.secondary,
  textTertiary: COLORS.text.tertiary,
  primary: COLORS.primary[500],
  success: COLORS.success[500],
  warning: COLORS.warning[500],
  error: COLORS.error[500],
  info: COLORS.primary[500],
} as const;