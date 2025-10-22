export const COLORS = {
  // Primary Colors
  primary: '#F2BED1',      // fill_FG2YSL (메인 핑크)
  primaryLight: '#FCE7F3', // fill_MJC2KU (연한 핑크)
  primaryBorder: '#FDCEDF', // stroke_RAB8SD (핑크 보더)

  // Background Colors
  white: '#FFFFFF',         // fill_HLZYZX
  background: '#F9F5F6',    // fill_84J8DV (메인 배경)
  cardBg: 'rgba(255, 255, 255, 0.8)', // fill_IV7JN5 (카드 배경)

  // Text Colors
  textPrimary: '#393E46',   // fill_7FMIJV (메인 텍스트)
  textSecondary: '#1F2937', // fill_5FNOR5 (보조 텍스트)
  textMuted: '#6B7280',     // fill_V5DCA0 (흐린 텍스트)
  textTertiary: '#00ADB5',  // fill_287NHJ (터미널 텍스트)

  // Status Colors
  success: '#10B981',       // 성공/완료 컬러
  error: '#FF4D4D',        // 에러 컬러
  warning: '#F59E0B',      // 경고 컬러
  info: '#3B82F6',         // 정보 컬러

  // Gradient Colors
  gradientBlue: {
    start: '#3B82F6',      // fill_QPU829 시작
    end: '#1D4ED8',        // fill_QPU829 끝
  },
  gradientGreen: {
    start: '#10B981',      // fill_Y587UC 시작
    end: '#047857',        // fill_Y587UC 끝
  },
  gradientPurple: {
    start: '#8B5CF6',      // fill_ZBY3RM 시작
    end: '#7C3AED',        // fill_ZBY3RM 끝
  },
  gradientOrange: {
    start: '#F59E0B',      // fill_PHNYE8 시작
    end: '#D97706',        // fill_PHNYE8 끝
  },

  // Border Colors
  border: '#E5E7EB',       // stroke_ZQP64G
  borderLight: 'rgba(253, 206, 223, 0.2)', // stroke_OY10ML

  // Progress Colors
  progressBg: '#E5E7EB',   // fill_H984PK (진행바 배경)
  progressFill: '#F2BED1', // fill_FG2YSL (진행바 채움)

  // Special Colors
  terminal: '#61DAFB',     // fill_FJCWL6 (터미널 커서)
  black: '#000000',        // fill_9O9HSW
} as const;

export type ColorKey = keyof typeof COLORS;