/**
 * 공통 스페이싱 시스템
 * 일관된 레이아웃을 위한 간격 정의
 */

export const SPACING = {
  // Base spacing unit (4px)
  unit: 4,

  // Spacing scale (based on 4px unit)
  0: 0,
  1: 4,   // 0.25rem
  2: 8,   // 0.5rem
  3: 12,  // 0.75rem
  4: 16,  // 1rem
  5: 20,  // 1.25rem
  6: 24,  // 1.5rem
  8: 32,  // 2rem
  10: 40, // 2.5rem
  12: 48, // 3rem
  16: 64, // 4rem
  20: 80, // 5rem
  24: 96, // 6rem
  32: 128, // 8rem
  40: 160, // 10rem
  48: 192, // 12rem
  56: 224, // 14rem
  64: 256, // 16rem
} as const;

// Component-specific spacing
export const COMPONENT_SPACING = {
  // Container padding
  container: {
    xs: SPACING[4],  // 16px
    sm: SPACING[5],  // 20px
    md: SPACING[6],  // 24px
    lg: SPACING[8],  // 32px
    xl: SPACING[10], // 40px
  },

  // Section spacing
  section: {
    xs: SPACING[6],  // 24px
    sm: SPACING[8],  // 32px
    md: SPACING[12], // 48px
    lg: SPACING[16], // 64px
    xl: SPACING[20], // 80px
  },

  // Component gaps
  gap: {
    xs: SPACING[1],  // 4px
    sm: SPACING[2],  // 8px
    md: SPACING[3],  // 12px
    lg: SPACING[4],  // 16px
    xl: SPACING[6],  // 24px
  },

  // Button spacing
  button: {
    paddingX: {
      sm: SPACING[3], // 12px
      md: SPACING[4], // 16px
      lg: SPACING[6], // 24px
    },
    paddingY: {
      sm: SPACING[2], // 8px
      md: SPACING[3], // 12px
      lg: SPACING[4], // 16px
    },
    gap: SPACING[2], // 8px
  },

  // Input spacing
  input: {
    paddingX: SPACING[3], // 12px
    paddingY: SPACING[3], // 12px
    gap: SPACING[2], // 8px
  },

  // Card spacing
  card: {
    padding: SPACING[5], // 20px
    gap: SPACING[4], // 16px
    marginBottom: SPACING[4], // 16px
  },

  // Modal spacing
  modal: {
    padding: SPACING[6], // 24px
    gap: SPACING[5], // 20px
    margin: SPACING[5], // 20px
  },

  // List item spacing
  listItem: {
    paddingY: SPACING[3], // 12px
    paddingX: SPACING[4], // 16px
    gap: SPACING[3], // 12px
  },

  // Screen padding
  screen: {
    horizontal: SPACING[4], // 16px
    vertical: SPACING[4], // 16px
  },
} as const;

// Border radius values
export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Shadow/elevation values
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
} as const;

export type SpacingKey = keyof typeof SPACING;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
export type ShadowKey = keyof typeof SHADOWS;

// Helper functions
export const getSpacing = (size: SpacingKey): number => {
  return SPACING[size];
};

export const getBorderRadius = (size: BorderRadiusKey): number => {
  return BORDER_RADIUS[size];
};

export const getShadow = (size: ShadowKey) => {
  return SHADOWS[size];
};