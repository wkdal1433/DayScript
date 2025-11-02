import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F5F6', // 배경색 (디자인 가이드)
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.medium.toString(),
    color: COLORS.textMuted,
  },

  // 헤더 섹션
  header: {
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 206, 223, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(248, 232, 238, 0.8)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },

  problemCounter: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },

  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(248, 232, 238, 1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDCEDF',
  },

  categoryText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#8B5A6B',
    textAlign: 'center',
  },

  timerContainer: {
    width: 60,
    height: 44,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#F59E0B',
    textAlign: 'center',
  },

  // 진행률 바
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#BE185D',
    borderRadius: 3,
  },

  // 스크롤 컨테이너
  scrollContainer: {
    flex: 1,
    paddingBottom: 20,
  },

  // 문제 컨테이너
  problemContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(253, 206, 223, 0.3)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  problemTitle: {
    fontSize: 20,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },

  problemDescription: {
    fontSize: 15,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },

  // 힌트 버튼
  hintButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F8E8EE',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignSelf: 'center',
    marginTop: 8,
  },

  hintButtonText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#BE185D',
    textAlign: 'center',
  },

  // 액션 컨테이너
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },

  executeButton: {
    backgroundColor: '#BE185D',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#BE185D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  executeButtonDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },

  executeButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
    textAlign: 'center',
  },

  nextButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  nextButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
    textAlign: 'center',
  },

  // 성공 상태 스타일
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },

  successIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  successTitle: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#059669',
    textAlign: 'center',
    marginBottom: 4,
  },

  successMessage: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#065F46',
    textAlign: 'center',
  },

  // 실패 상태 스타일
  failureContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },

  failureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  failureTitle: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 4,
  },

  failureMessage: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#991B1B',
    textAlign: 'center',
  },

  // 테스트 케이스 미리보기
  testCasesPreview: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  testCasesTitle: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  testCasePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  testCasePreviewIcon: {
    fontSize: 12,
    marginRight: 8,
    width: 16,
  },

  testCasePreviewText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
    flex: 1,
  },

  // 디버깅 팁 컨테이너
  debuggingTipContainer: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  debuggingTipTitle: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#0369A1',
    marginBottom: 8,
  },

  debuggingTipText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#0C4A6E',
    lineHeight: 18,
  },
});