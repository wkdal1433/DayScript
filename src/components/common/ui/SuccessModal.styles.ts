/**
 * SuccessModal Styles
 *
 * 성공 모달 스타일 정의 - 기존 디자인 시스템과 일관성 유지
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../../constants';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Modal Backdrop
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.figma.cardMargin,
  },

  // Modal Container
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.figma.cardBorderRadius + 8, // 20px for more elegant look
    width: screenWidth - (SIZES.figma.cardMargin * 2),
    maxWidth: 320,
    paddingVertical: SIZES.spacing.xxxl,
    paddingHorizontal: SIZES.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SIZES.shadow.medium,
    // Enhanced shadow for modal prominence
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    // Subtle border matching app theme
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },

  // Success Icon Container - 배경 제거, 중앙 정렬
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
    // 배경과 테두리 제거
  },

  // Success Icon
  icon: {
    fontSize: 40,
    color: COLORS.primary,
  },

  // Animated Success Icon (for checkmark) - 더 크고 눈에 띄게
  checkmarkIcon: {
    fontSize: 60,
    color: COLORS.success,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Trophy Icon
  trophyIcon: {
    fontSize: 36,
    color: '#FFD700',
  },

  // Star Icon
  starIcon: {
    fontSize: 38,
    color: '#FFD700',
  },

  // Text Content Container
  textContainer: {
    alignItems: 'center',
    marginBottom: SIZES.spacing.xxl,
    paddingHorizontal: SIZES.spacing.sm,
  },

  // Modal Title
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
    letterSpacing: -0.3,
    lineHeight: 26,
  },

  // Modal Message
  message: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },

  // Button Container - 버튼 컴포넌트 자체를 모달 중앙에 배치
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Close Button (uses NextButton component) - 버튼 컴포넌트 자체 중앙 정렬
  closeButton: {
    width: 200,
    // 추가적인 중앙 정렬을 위한 마진 제거
  },

  // Animation Styles
  fadeIn: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },

  fadeOut: {
    opacity: 0,
    transform: [{ scale: 0.8 }],
  },

  // Slide Animation
  slideUp: {
    transform: [{ translateY: 0 }],
  },

  slideDown: {
    transform: [{ translateY: 50 }],
  },

  // Pulse Animation for Icon
  pulseIcon: {
    transform: [{ scale: 1.05 }],
  },

  // Special Success Variant
  successVariant: {
    borderColor: COLORS.success,
    borderWidth: 2,
  },

  successIconContainer: {
    backgroundColor: '#E8F5E8',
    borderColor: COLORS.success,
  },

  // Celebration Variant
  celebrationVariant: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: '#FFFEF7',
  },

  celebrationIconContainer: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
  },
});