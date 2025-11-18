/**
 * UserPageScreen Styles
 *
 * 사용자 프로필 페이지 스타일 정의
 * HomeScreen 디자인 시스템과 일관성 유지
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../constants';

// Figma 디자인 시스템 기반 반응형 계산 (HomeScreen과 동일)
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 390;
const scaleFactor = isSmallScreen ? screenWidth / 390 : 1;

// 반응형 크기 계산 헬퍼
const scaleSize = (size: number) => Math.round(size * scaleFactor);

export const styles = StyleSheet.create({
  // 메인 컨테이너 (HomeScreen과 동일한 구조)
  container: {
    flex: 1,
    backgroundColor: '#FCE7F3', // HomeScreen과 동일한 배경색
    minHeight: screenHeight,
  },

  // 스크롤 컨테이너 (HomeScreen과 동일한 패딩 시스템)
  scrollContainer: {
    paddingTop: scaleSize(SIZES.figma.terminalHeight) + SIZES.figma.terminalTopMargin + 47,
    paddingBottom: SIZES.figma.bottomNavHeight + SIZES.spacing.xl + 30,
    flexGrow: 1,
  },

  // 섹션 컨테이너 (HomeScreen 카드 마진 시스템)
  sectionContainer: {
    marginHorizontal: SIZES.figma.cardMargin,
    marginBottom: SIZES.spacing.lg,
  },

  // 카드 스타일 (HomeScreen과 일관성)
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.figma.cardBorderRadius,
    padding: SIZES.figma.cardPadding,
    ...SIZES.shadow.medium,
  },
});