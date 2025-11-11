import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import { SIZES } from '../../../constants/sizes';

// Community-specific design tokens
const COMMUNITY_SPACING = {
  paddingXSmall: SIZES.spacing.xs,
  paddingSmall: SIZES.spacing.sm,
  paddingMedium: SIZES.spacing.lg,
  paddingLarge: SIZES.spacing.xl,
  paddingXLarge: SIZES.spacing.xxl,
};

const COMMUNITY_BORDER = {
  borderRadius: SIZES.borderRadius.lg,
  borderRadiusSmall: SIZES.borderRadius.md,
};

const COMMUNITY_FONTS = {
  sizes: FONTS.sizes,
  weights: FONTS.weights,
};

export const communityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  contentContainer: {
    paddingTop: 120, // TerminalHeader의 높이만큼 상단 패딩 추가 (StatusBar + TerminalHeader)
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.border,
    paddingHorizontal: COMMUNITY_SPACING.paddingMedium,
    paddingVertical: COMMUNITY_SPACING.paddingSmall,
    ...SIZES.shadow.small,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: COMMUNITY_SPACING.paddingSmall,
    borderRadius: COMMUNITY_BORDER.borderRadiusSmall,
  },

  tabItemActive: {
    backgroundColor: COLORS.primaryLight,
  },

  tabText: {
    fontSize: COMMUNITY_FONTS.sizes.caption,
    color: COLORS.textMuted,
    fontWeight: String(COMMUNITY_FONTS.weights.medium),
  },

  tabTextActive: {
    color: COLORS.primary,
    fontWeight: String(COMMUNITY_FONTS.weights.bold),
  },

  postCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: COMMUNITY_SPACING.paddingMedium,
    marginVertical: COMMUNITY_SPACING.paddingSmall,
    padding: COMMUNITY_SPACING.paddingMedium,
    borderRadius: COMMUNITY_BORDER.borderRadius,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
    ...SIZES.shadow.small,
  },

  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: COMMUNITY_SPACING.paddingSmall,
  },

  postTitle: {
    fontSize: COMMUNITY_FONTS.sizes.title,
    fontWeight: String(COMMUNITY_FONTS.weights.semiBold),
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: COMMUNITY_SPACING.paddingSmall,
    lineHeight: COMMUNITY_FONTS.sizes.title * FONTS.lineHeights.normal,
  },

  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: COMMUNITY_SPACING.paddingSmall,
  },

  postMetaText: {
    fontSize: COMMUNITY_FONTS.sizes.caption,
    color: COLORS.textMuted,
    marginRight: COMMUNITY_SPACING.paddingSmall,
    fontWeight: String(COMMUNITY_FONTS.weights.regular),
  },

  postContent: {
    fontSize: COMMUNITY_FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: COMMUNITY_FONTS.sizes.body * FONTS.lineHeights.relaxed,
    marginBottom: COMMUNITY_SPACING.paddingMedium,
    fontWeight: String(COMMUNITY_FONTS.weights.regular),
  },

  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.paddingXSmall,
    paddingHorizontal: SIZES.paddingSmall,
    borderRadius: SIZES.borderRadius,
    marginRight: SIZES.paddingSmall,
  },

  voteButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },

  voteText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textMuted,
    marginLeft: 4,
  },

  voteTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  commentCount: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textMuted,
  },

  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: SIZES.paddingSmall,
  },

  tag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.paddingSmall,
    paddingVertical: SIZES.paddingXSmall,
    borderRadius: SIZES.borderRadius,
    marginRight: SIZES.paddingXSmall,
    marginBottom: SIZES.paddingXSmall,
  },

  tagText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.primary,
    fontWeight: '500',
  },

  commentSection: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.paddingMedium,
    paddingHorizontal: SIZES.paddingMedium,
    paddingVertical: SIZES.paddingMedium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  commentItem: {
    paddingVertical: SIZES.paddingSmall,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.paddingXSmall,
  },

  commentAuthor: {
    fontSize: FONTS.sizes.small,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: SIZES.paddingSmall,
  },

  commentTime: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textMuted,
  },

  commentContent: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SIZES.paddingXSmall,
  },

  replyContainer: {
    marginLeft: SIZES.paddingLarge,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.border,
    paddingLeft: SIZES.paddingSmall,
  },

  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },

  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  subFabButton: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },

  subFab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  subFabLabel: {
    marginLeft: COMMUNITY_SPACING.paddingSmall,
    fontSize: COMMUNITY_FONTS.sizes.caption,
    color: COLORS.textPrimary,
    fontWeight: String(COMMUNITY_FONTS.weights.medium),
    backgroundColor: COLORS.white,
    paddingHorizontal: COMMUNITY_SPACING.paddingSmall,
    paddingVertical: COMMUNITY_SPACING.paddingXSmall,
    borderRadius: COMMUNITY_BORDER.borderRadiusSmall,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
    ...SIZES.shadow.small,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.paddingLarge,
  },

  emptyText: {
    fontSize: FONTS.sizes.medium,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SIZES.paddingMedium,
  },
});