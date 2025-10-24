import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';

export const styles = StyleSheet.create({
  // 하단 네비게이션 (분리된 컴포넌트 - 높이 20% 증가)
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84, // 기존 70px에서 20% 증가 (70 * 1.2 = 84px)
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Figma background
    borderTopWidth: SIZES.borderWidth.thin,
    borderTopColor: 'rgba(253, 206, 223, 0.1)', // Figma border
    flexDirection: 'row',
    justifyContent: 'space-around', // 4개 버튼 균등 분산
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.md,
  },
  // 네비게이션 버튼 (Flexbox 레이아웃 - 기본 상태)
  navButton: {
    flex: 1, // 균등 분산
    height: 54, // 높이도 비례적으로 증가 (기존 50px -> 54px)
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderRadius: SIZES.borderRadius.md,
    marginHorizontal: SIZES.spacing.xs,
    paddingVertical: SIZES.spacing.xs,
  },
  // 네비게이션 버튼 활성 상태 (언어 토글과 동일한 스타일)
  navButtonActive: {
    backgroundColor: '#F2BED1', // 언어 토글 활성 상태와 동일
  },
  navLabel: {
    fontFamily: FONTS.primary,
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  // 네비게이션 라벨 활성 상태 (언어 토글과 동일한 스타일)
  navLabelActive: {
    color: COLORS.white, // 언어 토글 활성 텍스트와 동일
  },
});