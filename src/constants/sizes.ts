export const SIZES = {
  // Spacing (패딩, 마진)
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Figma에서 추출한 실제 크기들
  figma: {
    // 메인 화면 크기
    screenWidth: 390,
    screenHeight: 1024,

    // 카드 크기들
    todoCardWidth: 338,
    todoCardHeight: 160,

    learningCardWidth: 338,
    learningCardHeight: 243,

    rankingCardWidth: 338,
    rankingCardHeight: 170,

    quickActionCardWidth: 338,
    quickActionCardHeight: 420,

    // 버튼 크기들
    actionButtonWidth: 145,
    actionButtonHeight: 84,

    smallActionButtonWidth: 135,
    smallActionButtonHeight: 84,

    // 프로그레스바
    progressBarWidth: 64,
    progressBarHeight: 64,

    // 네비게이션
    bottomNavHeight: 71,

    // 아이콘 크기들
    iconSmall: 18,
    iconMedium: 20,
    iconLarge: 24,
    iconXLarge: 40,

    // 터미널 헤더
    terminalHeight: 45,
  },

  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    round: 999,
  },

  // Shadow
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },

  // Border Widths
  borderWidth: {
    thin: 1,
    medium: 2,
    thick: 4,
  },
} as const;

export type Spacing = keyof typeof SIZES.spacing;
export type BorderRadius = keyof typeof SIZES.borderRadius;