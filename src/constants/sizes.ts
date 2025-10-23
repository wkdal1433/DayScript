export const SIZES = {
  // Figma Auto Layout Spacing 정확 매칭
  spacing: {
    xs: 4,   // 4px
    sm: 8,   // 8px
    md: 10,  // 10px (Figma gap)
    lg: 16,  // 16px
    xl: 20,  // 20px
    xxl: 24, // 24px
    xxxl: 32, // 32px
  },

  // Figma 디자인 시스템 정확 측정값
  figma: {
    // 메인 화면 크기 (Figma Frame)
    screenWidth: 390,
    screenHeight: 1024,

    // 카드 시스템 (정확한 Auto Layout 크기)
    cardMargin: 26,        // 좌우 마진
    cardPadding: 20,       // 내부 패딩
    cardBorderRadius: 12,  // 모든 카드 동일

    // 각 섹션별 정확한 높이 (간격 조정된 버전)
    todoCardHeight: 180,
    learningCardHeight: 280,
    rankingCardHeight: 280,
    quickActionCardHeight: 500, // 더 충분한 공간 확보

    // 액션 버튼 정확 크기
    actionButtonWidth: 145,
    actionButtonHeight: 84,
    actionButtonSpacing: 10, // 버튼 간 간격

    // 언어 토글 정확 크기
    languageToggleHeight: 36,
    languageButtonMargin: 4,

    // 프로그레스 원형 차트
    progressCircleSize: 64,
    progressStrokeWidth: 6,

    // 하단 네비게이션
    bottomNavHeight: 71,
    bottomNavPadding: 30,

    // 아이콘 크기 시스템
    iconSmall: 18,
    iconMedium: 20,
    iconLarge: 24,
    iconXLarge: 40,

    // 터미널 헤더 정확 크기
    terminalHeight: 45,
    terminalMargin: 28,
    terminalTopMargin: 44,

    // 체크박스 및 프로그레스바
    checkboxSize: 18,
    questProgressWidth: 60,
    questProgressHeight: 8,

    // 랭킹 뱃지
    rankBadgeSize: 40,
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