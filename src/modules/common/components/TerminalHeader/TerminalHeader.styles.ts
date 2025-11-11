import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../../../constants';

// Figma 디자인 시스템 기반 반응형 계산
const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 390;
const scaleFactor = isSmallScreen ? screenWidth / 390 : 1;

// 반응형 크기 계산 헬퍼
const scaleSize = (size: number) => Math.round(size * scaleFactor);

export const terminalHeaderStyles = StyleSheet.create({
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

  // 터미널 헤더 (자연스러운 콘텐츠 기반 동적 너비) - ORIGINAL DESIGN RESTORED
  terminalHeader: {
    backgroundColor: COLORS.white,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: '#FDCEDF',
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start', // 콘텐츠 크기 기반 자동 조정
    maxWidth: 280, // 최대 너비 제한으로 레이아웃 보호
    height: scaleSize(SIZES.figma.terminalHeight), // 원래 높이 복원
  },

  // 터미널 텍스트 (기본) - ORIGINAL DESIGN RESTORED
  terminalText: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '400',
    color: '#00ADB5', // 터미널 프롬프트 전용 색상
    marginRight: SIZES.spacing.sm,
  },

  // 앱 이름 텍스트 (타이핑되는 부분) - ORIGINAL DESIGN RESTORED
  appName: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: SIZES.spacing.sm,
  },

  // 타이핑 커서 - ORIGINAL DESIGN RESTORED
  typewriterCursor: {
    opacity: 0.7,
  },

  // 헤더 버튼 컨테이너 (우측 정렬) - ORIGINAL DESIGN RESTORED
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 헤더 버튼 (공통 스타일) - ORIGINAL DESIGN RESTORED
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

  // 문구별 색상 스타일 - ORIGINAL DESIGN RESTORED
  phraseColorDark: {
    color: '#2B2B2B',
  },
  phraseColorBlue: {
    color: '#3563E9',
  },
  phraseColorLightBlue: {
    color: '#4B72FF',
  },
});