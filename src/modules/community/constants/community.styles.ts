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
    backgroundColor: '#FCE7F3', // 통일된 메인 배경색 (Home 화면과 동일)
  },

  contentContainer: {
    paddingTop: 120, // TerminalHeader의 높이만큼 상단 패딩 추가 (StatusBar + TerminalHeader)
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: '#FDCEDF', // 통일된 핑크 테두리
    paddingHorizontal: COMMUNITY_SPACING.paddingMedium,
    paddingVertical: COMMUNITY_SPACING.paddingSmall,
    // 통일된 그림자 적용
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    borderColor: '#FDCEDF', // 통일된 핑크 테두리
    // 통일된 그림자 적용
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    bottom: 91, // Bottom Navigation 높이 (71px) + 여백 (20px) = 충돌 방지
    right: 20, // 원래 우측 고정 위치로 복구
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
    zIndex: 5, // 서브 버튼보다 낮게 설정
  },

  subFabButton: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    flexDirection: 'row-reverse', // 레이블이 버튼 왼쪽에 위치하도록 reverse 적용
    zIndex: 10, // 메인 FAB보다 위에 표시
    // right: 4 제거 - 부모 컨테이너의 alignItems: 'center'에 의존하여 완벽한 중앙 정렬
  },

  subFab: {
    width: 56,  // 메인 FAB과 동일한 크기로 통일 (48px → 56px)
    height: 56, // 메인 FAB과 동일한 크기로 통일 (48px → 56px)
    borderRadius: 28, // width/height의 절반으로 조정 (24px → 28px)
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  subFabLabel: {
    marginRight: COMMUNITY_SPACING.paddingSmall, // row-reverse로 인해 marginLeft → marginRight 변경
    fontSize: COMMUNITY_FONTS.sizes.caption,
    color: COLORS.textPrimary,
    fontWeight: String(COMMUNITY_FONTS.weights.medium),
    backgroundColor: COLORS.white,
    paddingHorizontal: COMMUNITY_SPACING.paddingSmall,
    paddingVertical: COMMUNITY_SPACING.paddingXSmall,
    borderRadius: COMMUNITY_BORDER.borderRadiusSmall,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
    minWidth: 60, // '검색하기' 텍스트가 한 줄로 표시되도록 최소 너비 설정
    textAlign: 'center', // 텍스트 중앙 정렬
    ...SIZES.shadow.small,
  },

  // 분리된 FAB 버튼 - 절대 위치로 중앙 고정 (레이블과 독립)
  subFabButtonOnly: {
    position: 'absolute',
    bottom: 0,
    right: 0, // 메인 FAB의 정확한 중심에 위치 (28px 오프셋으로 중앙 정렬)
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // 메인 FAB보다 위에 표시
  },

  // 분리된 FAB 레이블 - 버튼과 독립적인 절대 위치
  subFabLabelOnly: {
    position: 'absolute',
    bottom: 14, // 레이블 높이(28px)의 절반을 고려하여 정확한 중앙 정렬: 28px - 14px = 14px
    right: 64, // 버튼(56px) + 간격(8px) = 64px 왼쪽에 위치
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9, // 버튼보다 낮은 z-index
    minWidth: 60, // 레이블 컨테이너 최소 너비 보장
    height: 28, // 버튼 높이와 동일하게 설정하여 완벽한 수직 정렬
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