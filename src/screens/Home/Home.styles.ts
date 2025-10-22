import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

const { width: screenWidth } = Dimensions.get('window');
const cardMargin = 26; // Figma의 좌우 마진
const cardWidth = screenWidth - (cardMargin * 2);

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
  scrollContainer: {
    paddingBottom: SIZES.figma.bottomNavHeight + SIZES.spacing.lg,
  },

  // 터미널 헤더
  terminalHeader: {
    marginHorizontal: cardMargin + 2, // 28px (Figma 위치)
    marginTop: 44, // 상단 마진
    height: SIZES.figma.terminalHeight,
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.primaryBorder,
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: SIZES.spacing.lg + 1, // 17px
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  terminalText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '400',
    color: COLORS.textTertiary,
    marginRight: SIZES.spacing.sm,
  },
  appName: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SIZES.spacing.sm,
  },
  cursor: {
    width: 2,
    height: 15,
    backgroundColor: COLORS.terminal,
  },

  // 카드 공통 스타일
  card: {
    backgroundColor: COLORS.background,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.primaryBorder,
    borderRadius: SIZES.borderRadius.lg,
    marginHorizontal: cardMargin,
    padding: SIZES.spacing.xl,
    marginBottom: SIZES.spacing.lg,
  },

  // 오늘의 할일 섹션
  todayQuestCard: {
    marginTop: SIZES.spacing.xl + 4, // 110px에서 헤더 끝 위치 계산
    height: 160,
  },
  sectionTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.heading,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacing.lg,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm + 2, // 10px
  },
  checkbox: {
    width: SIZES.figma.iconSmall,
    height: SIZES.figma.iconSmall,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: SIZES.spacing.md,
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
    width: 60,
    height: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  // 학습 퀵 액션 섹션
  quickActionCard: {
    height: 420,
  },
  languageToggle: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing.xl,
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.lg,
    height: 36,
  },
  languageButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.borderRadius.lg,
    margin: 4,
  },
  languageButtonActive: {
    backgroundColor: COLORS.primary,
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
    marginBottom: SIZES.spacing.xl,
  },
  actionButton: {
    width: 145,
    height: 84,
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
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
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    height: 70,
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

  // 학습 현황 섹션
  learningStatusCard: {
    height: 243,
  },
  progressCircleContainer: {
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  progressCircle: {
    width: SIZES.figma.progressBarWidth,
    height: SIZES.figma.progressBarHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
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

  // 랭킹 섹션
  rankingCard: {
    height: 170,
  },
  rankingTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.subtitle,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
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
    width: SIZES.figma.iconXLarge,
    height: SIZES.figma.iconXLarge,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.figma.iconXLarge / 2,
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

  // 하단 네비게이션
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SIZES.figma.bottomNavHeight,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: SIZES.borderWidth.thin,
    borderTopColor: 'rgba(253, 206, 223, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl + 14, // 30px
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: SIZES.figma.iconSmall,
    height: SIZES.figma.iconSmall,
    marginBottom: SIZES.spacing.xs,
  },
  navLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.nav,
    fontWeight: '900',
    color: COLORS.primary,
  },
});