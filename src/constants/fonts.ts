export const FONTS = {
  // Font Families
  primary: 'Inter',

  // Font Sizes (Figma에서 추출한 크기들)
  sizes: {
    // Headlines
    heading: 18,    // style_CTMZUR (오늘의 할일)
    title: 16,      // style_PFPFXL (학습 진도)
    subtitle: 14,   // style_3RK6VQ (DayScript)

    // Body Text
    body: 14,       // style_S55UCA (일반 텍스트)
    bodyLarge: 16,  // style_IZU6MA (75%)
    bodySmall: 12,  // style_KNRZ4T (체크마크)

    // Captions
    captionSm:8,
    caption: 10,    // style_MSLGV3 (버튼 설명)
    tiny: 12,       // style_ZCU3LJ (작은 텍스트)

    // Special Sizes
    large: 20,      // style_XIZWMA (127, 84%)
    emoji: 24,      // style_PNO90X (이모지)
    button: 13,     // style_C5YKI8 (버튼 텍스트)
    nav: 12,        // style_42EVPS (네비게이션)
  },

  // Font Weights
  weights: {
    regular: 400,   // 일반
    medium: 500,    // 중간
    semiBold: 600,  // 세미볼드
    bold: 700,      // 굵게
    extraBold: 800, // 매우 굵게
    black: 900,     // 블랙
  },

  // Line Heights (Figma에서 추출한 비율들)
  lineHeights: {
    tight: 1.1,
    normal: 1.21,   // Figma의 기본 lineHeight
    relaxed: 1.4,
    loose: 1.6,
  },
} as const;

export type FontSize = keyof typeof FONTS.sizes;
export type FontWeight = keyof typeof FONTS.weights;