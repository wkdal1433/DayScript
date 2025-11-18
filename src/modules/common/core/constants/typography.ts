/**
 * 공통 타이포그래피 시스템
 * 일관된 텍스트 스타일링을 위한 타입스케일 정의
 */

export const TYPOGRAPHY = {
  // Font Families
  fontFamily: {
    primary: 'System', // React Native default
    mono: 'Courier New',
    heading: 'System',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extraLight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Predefined Text Styles
  textStyles: {
    // Headings
    h1: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.25,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 1.3,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.375,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.5,
    },
    h5: {
      fontSize: 18,
      fontWeight: '500',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.5,
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 1.625,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
    },

    // Labels
    labelLarge: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 1.5,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.5,
    },
    labelSmall: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 1.5,
    },

    // Captions
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.375,
    },
    captionSmall: {
      fontSize: 10,
      fontWeight: '400',
      lineHeight: 1.375,
    },

    // Button Text
    buttonLarge: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 1.25,
    },

    // Code
    code: {
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Courier New',
      lineHeight: 1.5,
    },
    codeSmall: {
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Courier New',
      lineHeight: 1.375,
    },

    // Special
    display: {
      fontSize: 48,
      fontWeight: '700',
      lineHeight: 1.1,
      letterSpacing: -1,
    },
    overline: {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 1.5,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type FontSizeKey = keyof typeof TYPOGRAPHY.fontSize;
export type FontWeightKey = keyof typeof TYPOGRAPHY.fontWeight;
export type TextStyleKey = keyof typeof TYPOGRAPHY.textStyles;

// Helper function to get text style
export const getTextStyle = (style: TextStyleKey) => {
  return TYPOGRAPHY.textStyles[style];
};

// Responsive typography scales
export const RESPONSIVE_TYPOGRAPHY = {
  mobile: {
    scale: 0.875, // 87.5% of base size
    maxWidth: 767,
  },
  tablet: {
    scale: 1, // 100% of base size
    maxWidth: 1023,
  },
  desktop: {
    scale: 1.125, // 112.5% of base size
    maxWidth: Infinity,
  },
} as const;