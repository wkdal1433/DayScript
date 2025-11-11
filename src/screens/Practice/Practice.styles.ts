import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants';

// Figma 디자인 기반 반응형 계산
const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 390;
const scaleFactor = isSmallScreen ? screenWidth / 390 : 1;

// 반응형 크기 계산 헬퍼
const scaleSize = (size: number) => Math.round(size * scaleFactor);

export const styles = StyleSheet.create({
  // 메인 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#FCE7F3', // Figma background color
  },

  // 스크롤 컨테이너
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingTop: scaleSize(SIZES.figma.terminalHeight) + SIZES.figma.terminalTopMargin + 60, // 헤더 높이 + 상태 표시줄 + 여백
    paddingBottom: SIZES.figma.bottomNavHeight + 30, // 하단 네비게이션 + 여백
    paddingHorizontal: 20,
  },

  // 필터 섹션 컨테이너
  filterContainer: {
    backgroundColor: COLORS.background, // #F9F5F6
    borderWidth: 1,
    borderColor: '#FDCEDF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // 문제 리스트 컨테이너
  problemsContainer: {
    gap: 12, // 카드 간 간격
  },

  // 필터 섹션 레이블
  filterLabel: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textMuted,
    marginBottom: 8,
  },

  // 언어 선택 토글
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6', // Figma gray background
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },

  languageButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  languageButtonActive: {
    backgroundColor: COLORS.primary, // #F2BED1
  },

  languageButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.extraBold.toString(),
    color: COLORS.textMuted,
  },

  languageButtonTextActive: {
    color: COLORS.background,
  },

  // 난이도 선택
  difficultyContainer: {
    marginBottom: 16,
  },

  difficultyOptions: {
    flexDirection: 'row',
    gap: 8,
  },

  difficultyButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  difficultyButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },

  difficultyButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.extraBold.toString(),
    color: COLORS.textMuted,
  },

  difficultyButtonTextActive: {
    color: COLORS.background,
  },

  // 정렬 옵션
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 4,
  },

  sortButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.semiBold.toString(),
    color: COLORS.textPrimary,
  },

  // 문제 카드 스타일
  problemCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: '#FDCEDF',
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // 문제 카드 헤더 (제목 + 난이도)
  problemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  problemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },

  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9,
    borderWidth: 1,
  },

  difficultyBadgeText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.extraBold.toString(),
    color: COLORS.background,
  },

  problemTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    flex: 1,
  },

  problemTitleLong: {
    fontSize: FONTS.sizes.subtitle,
    fontWeight: FONTS.weights.semiBold.toString(),
  },

  difficultyLabel: {
    paddingHorizontal: 12,
    paddingVertical: 1,
    borderRadius: 9,
  },

  difficultyLabelText: {
    fontFamily: FONTS.primary,
    fontSize: 10,
    fontWeight: FONTS.weights.bold.toString(),
  },

  // 문제 태그
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },

  tag: {
    paddingHorizontal: 17,
    paddingVertical: 3,
    borderRadius: 9,
  },

  tagText: {
    fontFamily: FONTS.primary,
    fontSize: 10,
    fontWeight: FONTS.weights.semiBold.toString(),
  },

  // 문제 카드 하단 (시간 + 성공률 + 풀기 버튼)
  problemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  problemStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  problemStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  problemStatText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.tiny,
    fontWeight: FONTS.weights.semiBold.toString(),
    color: COLORS.textMuted,
  },

  solveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 12,
    minWidth: 48,
    alignItems: 'center',
  },

  solveButtonText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.semiBold.toString(),
    color: COLORS.background,
  },
});