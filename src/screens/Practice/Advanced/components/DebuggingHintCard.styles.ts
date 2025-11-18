import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { FONTS } from '../../../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FDCEDF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
    maxHeight: 400,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  typeIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  typeIcon: {
    fontSize: 20,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  stepInfo: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
  },

  // 컨텐츠
  contentContainer: {
    maxHeight: 280,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  content: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    lineHeight: 22,
    marginBottom: 16,
  },

  // 코드 하이라이트
  codeHighlightContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },

  codeHighlightHeader: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },

  codeHighlightTitle: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#475569',
  },

  codeHighlightContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  codeHighlightLine: {
    fontSize: 12,
    fontFamily: 'Fira Code',
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },

  codeHighlightMessage: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#64748B',
    lineHeight: 18,
  },

  // XP 알림
  xpNotice: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignItems: 'center',
  },

  xpNoticeText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#DC2626',
    textAlign: 'center',
  },

  // 학습 팁
  learningTip: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  learningTipTitle: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#0369A1',
    marginBottom: 6,
  },

  learningTipText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#0C4A6E',
    lineHeight: 16,
  },

  // 액션 영역
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  actionLeft: {
    flex: 1,
  },

  actionRight: {
    marginLeft: 12,
  },

  progressText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
  },

  nextButton: {
    backgroundColor: '#BE185D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },

  nextButtonText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
  },

  completedButton: {
    backgroundColor: '#E5E7EB',
  },

  completedButtonText: {
    color: '#9CA3AF',
  },
});