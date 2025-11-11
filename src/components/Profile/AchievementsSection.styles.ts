/**
 * AchievementsSection Styles
 *
 * 성취/배지 섹션 스타일 정의
 */

import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.lg,
  },

  // 헤더 스타일
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  achievementSummary: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  // 진행률 스타일
  progressContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDCEDF', // HomeScreen과 동일한 핑크 보더
    padding: 12,
    marginBottom: 14,
    flexDirection: 'row',
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
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },

  // 리스트 스타일
  listContainer: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  // 배지 카드 스타일
  achievementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDCEDF', // HomeScreen과 동일한 핑크 보더
    padding: 12,
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  achievementCardLocked: {
    backgroundColor: '#F8F9FA',
    opacity: 0.7,
  },

  // 아이콘 스타일
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
  },
  iconContainerLocked: {
    backgroundColor: '#E5E7EB',
  },
  iconText: {
    fontSize: 20,
  },
  iconTextLocked: {
    fontSize: 16,
    opacity: 0.6,
  },

  // 콘텐츠 스타일
  achievementContent: {
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: COLORS.textMuted,
  },
  achievementDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 6,
  },
  unlockedDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // 달성 배지
  unlockedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2E7D2E',
  },
});