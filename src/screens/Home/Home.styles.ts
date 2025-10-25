import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

// Figma 디자인 시스템 기반 반응형 계산
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 390;
const scaleFactor = isSmallScreen ? screenWidth / 390 : 1;

// Figma Auto Layout 마진 시스템
const cardMargin = SIZES.figma.cardMargin;
const cardWidth = screenWidth - (cardMargin * 2);

// 반응형 크기 계산 헬퍼
const scaleSize = (size: number) => Math.round(size * scaleFactor);

export const styles = StyleSheet.create({
  // 메인 컨테이너 (Figma Frame 기준)
  container: {
    flex: 1,
    backgroundColor: '#FCE7F3', // Figma background color
    minHeight: screenHeight,
  },
  scrollContainer: {
    paddingTop: scaleSize(SIZES.figma.terminalHeight) + SIZES.figma.terminalTopMargin + 47, // 헤더 높이 + 상태 표시줄 높이만 (간격용 패딩 제거)
    paddingBottom: SIZES.figma.bottomNavHeight + SIZES.spacing.xl + 30, // 기존 하단 패딩 + 추가 30px 여백
    flexGrow: 1,
  },

  // 헤더 컨테이너 (전체 헤더 영역) - 상태 표시줄까지 확장된 Sticky 헤더
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FCE7F3', // 컨테이너와 동일한 배경색
    paddingBottom: 10, // 헤더 하단 여백 10px 유지
  },
  // 헤더 컨테이너 (동적 그림자 활성화 상태)
  headerContainerWithShadow: {
    ...SIZES.shadow.medium,
  },
  // 헤더 내용 컨테이너 (Safe Area 아래 실제 컨텐츠 영역)
  headerContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 터미널 헤더(좌측)와 버튼들(우측) 양끝 정렬
    alignItems: 'center',
    marginHorizontal: SIZES.figma.terminalMargin,
    marginTop: SIZES.figma.terminalTopMargin,
    height: scaleSize(SIZES.figma.terminalHeight),
  },
  // 터미널 헤더 (왼쪽 정렬, 원래 크기 복원)
  terminalHeader: {
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: '#FDCEDF',
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 220, // 최소 너비로 변경하여 긴 텍스트 처리
    maxWidth: 280, // 최대 너비 확장
    flexGrow: 1, // 유동적 너비 확장
    flexShrink: 1, // 필요시 축소 허용
    height: scaleSize(SIZES.figma.terminalHeight), // 원래 높이 복원
  },
  // 헤더 버튼 컨테이너 (우측 정렬)
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 헤더 버튼 (공통 스타일)
  headerButton: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: '#FDCEDF',
    borderRadius: SIZES.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.spacing.sm, // 버튼 간 간격
  },
  terminalText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '400',
    color: '#00ADB5', // 터미널 프롬프트 전용 색상
    marginRight: SIZES.spacing.sm,
  },
  appName: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SIZES.spacing.sm,
  },
  typewriterCursor: {
    opacity: 0.7,
  },
  // 문구별 색상 스타일
  phraseColorDark: {
    color: '#2B2B2B',
  },
  phraseColorBlue: {
    color: '#3563E9',
  },
  phraseColorLightBlue: {
    color: '#4B72FF',
  },

  // 카드 공통 스타일 (Figma Auto Layout)
  card: {
    backgroundColor: '#F9F5F6', // Figma card background
    borderWidth: SIZES.borderWidth.thin,
    borderColor: '#FDCEDF', // Figma border color
    borderRadius: SIZES.figma.cardBorderRadius,
    marginHorizontal: cardMargin,
    paddingHorizontal: SIZES.figma.cardPadding,
    paddingTop: 0, // sectionTitle의 marginTop으로 대체
    paddingBottom: SIZES.spacing.xl, // 마지막 요소 하단 마진
    marginBottom: SIZES.spacing.xl,
    width: cardWidth,
    alignSelf: 'center',
  },

  // 오늘의 할일 섹션 (Figma 정확 위치)
  todayQuestCard: {
    marginTop: 0, // 스크롤 컨테이너의 paddingTop으로 대체됨
    height: scaleSize(SIZES.figma.todoCardHeight),
  },
  sectionTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.heading,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 20, // 헤더 paddingBottom(10px) + 이 값(20px) = 총 30px 간격이지만 ScrollView paddingTop 최적화로 전체 간격 20px 달성
    marginBottom: SIZES.spacing.lg,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md, // Figma consistent spacing
    paddingVertical: 2,
  },
  checkbox: {
    width: scaleSize(SIZES.figma.checkboxSize),
    height: scaleSize(SIZES.figma.checkboxSize),
    borderWidth: 2,
    borderColor: '#F2BED1', // Figma checkbox border
    borderRadius: 4,
    marginRight: 10, // Figma 28px from left - 18px checkbox = 10px gap
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: '400',
  },
  questText: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '400',
    color: COLORS.textPrimary,
    marginRight: SIZES.spacing.md,
  },
  progressContainer: {
    width: scaleSize(SIZES.figma.questProgressWidth),
    height: scaleSize(SIZES.figma.questProgressHeight),
    backgroundColor: '#F8E8EE', // Figma progress background
    borderRadius: 4,
    overflow: 'hidden',
    marginLeft: 'auto', // Push to right
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  // 학습 퀵 액션 섹션 (Figma 정확 높이)
  quickActionCard: {
    height: scaleSize(SIZES.figma.quickActionCardHeight),
  },
  languageToggle: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing.xl,
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: '#E5E7EB', // Figma border color
    borderRadius: SIZES.borderRadius.lg,
    height: scaleSize(SIZES.figma.languageToggleHeight),
  },
  languageButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.borderRadius.lg,
    margin: SIZES.figma.languageButtonMargin,
  },
  languageButtonActive: {
    backgroundColor: '#F2BED1', // Figma active state gradient simplified
  },
  languageButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  languageButtonTextActive: {
    color: COLORS.white,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.lg, // 줄인 마진으로 잠림 방지
    marginTop: SIZES.spacing.sm, // 상단 마진 추가
    gap: SIZES.figma.actionButtonSpacing,
  },
  actionButton: {
    width: scaleSize(SIZES.figma.actionButtonWidth),
    height: scaleSize(SIZES.figma.actionButtonHeight),
    borderRadius: SIZES.borderRadius.lg,
    padding: 12, // 줄인 패딩으로 잠림 방지
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: SIZES.spacing.sm, // 줄인 하단 마진
    borderWidth: SIZES.borderWidth.thin,
  },
  actionButtonEmoji: {
    fontSize: FONTS.sizes.emoji,
    marginBottom: SIZES.spacing.xs,
  },
  actionButtonTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.button,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 2,
  },
  actionButtonSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.caption,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  weeklyStatsContainer: {
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: '#E5E7EB', // Figma border color
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    minHeight: scaleSize(70), // 최소 높이로 변경하여 오버플로우 방지
    marginTop: SIZES.spacing.sm,
  },
  weeklyStatsTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacing.xs,
  },
  weeklyStatsText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.caption,
    fontWeight: '400',
    color: COLORS.textMuted,
    marginBottom: SIZES.spacing.sm,
  },
  statsProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statsProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.progressBg,
    borderRadius: 2,
    marginRight: SIZES.spacing.lg,
    overflow: 'hidden',
  },
  statsProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  streakContainer: {
    alignItems: 'flex-end',
  },
  streakLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.caption,
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  streakValue: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.subtitle,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // 학습 현황 섹션 (Figma 정확 높이)
  learningStatusCard: {
    height: scaleSize(SIZES.figma.learningCardHeight),
  },
  progressCircleContainer: {
    flexDirection: 'row', // 내부 요소들 수평 배치
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  progressCircle: {
    width: scaleSize(SIZES.figma.progressCircleSize),
    height: scaleSize(SIZES.figma.progressCircleSize),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
    position: 'relative',
  },
  progressPercentage: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodyLarge,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  progressLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.subtitle,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SIZES.spacing.xs,
  },
  progressDescription: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '400',
    color: COLORS.textMuted,
  },
  // 프로그레스 원형 오른쪽 텍스트 영역
  progressTextContainer: {
    flex: 1,
    marginLeft: SIZES.spacing.lg,
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.primaryBorder,
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    flex: 1,
    marginHorizontal: SIZES.spacing.xs,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.large,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SIZES.spacing.xs,
  },
  statLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  statDescription: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: '400',
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // 랭킹 섹션 (Figma 정확 높이)
  rankingCard: {
    height: scaleSize(SIZES.figma.rankingCardHeight),
  },
  rankingTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.subtitle,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20, // sectionTitle과 일치하는 상단 마진 적용
    marginBottom: SIZES.spacing.lg,
  },
  rankingList: {
    marginBottom: SIZES.spacing.md,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  rankBadge: {
    width: scaleSize(SIZES.figma.rankBadgeSize),
    height: scaleSize(SIZES.figma.rankBadgeSize),
    backgroundColor: '#F2BED1', // Figma badge color
    borderRadius: scaleSize(SIZES.figma.rankBadgeSize) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.lg,
  },
  rankNumber: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    color: COLORS.white,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: '400',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  rankScore: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    color: COLORS.primary,
  },
  moreButton: {
    backgroundColor: 'rgba(242, 190, 209, 0.3)',
    borderWidth: SIZES.borderWidth.thin,
    borderColor: 'rgba(253, 206, 223, 0.2)',
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.sm,
    alignItems: 'center',
  },
  moreButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '400',
    color: COLORS.primary,
  },

});