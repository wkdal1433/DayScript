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
  // 메인 컨테이너 (HomeScreen과 일관성)
  container: {
    flex: 1,
    backgroundColor: '#FCE7F3', // HomeScreen과 동일한 배경색
    minHeight: screenHeight,
  },

  // 헤더 컨테이너 (TerminalHeader를 위한 공간)
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FCE7F3',
    paddingBottom: 10,
  },

  // 헤더 내용 컨테이너 (HomeScreen과 동일)
  headerContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SIZES.figma.terminalMargin,
    marginTop: SIZES.figma.terminalTopMargin,
    height: scaleSize(SIZES.figma.terminalHeight),
  },

  // 스크롤 컨테이너 (HomeScreen 패딩 시스템 적용)
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