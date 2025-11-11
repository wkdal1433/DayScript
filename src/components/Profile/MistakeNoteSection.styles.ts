/**
 * MistakeNoteSection Styles
 *
 * 오답노트 섹션 스타일 정의
 */

import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  // 탭 스타일
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDCEDF', // HomeScreen과 동일한 핑크 보더
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },

  // 리스트 스타일
  listContainer: {
    paddingBottom: 16,
  },
  mistakeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDCEDF', // HomeScreen과 동일한 핑크 보더
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mistakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mistakeTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mistakeTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  mistakeType: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  wrongCountBadge: {
    backgroundColor: '#FFE4E4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  wrongCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E57373',
  },
  mistakeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    lineHeight: 22,
  },
  mistakeDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  mistakeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastAttemptText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // 빈 상태 스타일
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // 전체보기 버튼 스타일
  viewAllButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  viewAllArrow: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '300',
  },
});