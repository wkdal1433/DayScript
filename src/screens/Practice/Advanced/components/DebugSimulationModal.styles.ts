import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { FONTS } from '../../../../constants/fonts';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  // 모달 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
  },

  // 진행률 섹션
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },

  progressText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.medium.toString(),
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },

  loader: {
    marginTop: 20,
  },

  // 결과 컨테이너
  resultsContainer: {
    maxHeight: height * 0.6,
    paddingHorizontal: 20,
  },

  // 전체 결과 요약
  summaryContainer: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
  },

  successSummary: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
  },

  failureSummary: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  summaryTitle: {
    fontSize: 20,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    marginBottom: 8,
    textAlign: 'center',
  },

  successText: {
    color: '#059669',
  },

  failureText: {
    color: '#DC2626',
  },

  summaryStats: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.medium.toString(),
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  executionTime: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
  },

  // 테스트 케이스 컨테이너
  testCasesContainer: {
    marginBottom: 20,
  },

  testCasesTitle: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  // 개별 테스트 케이스
  testCaseItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  testCaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  testCaseIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  testCaseTitle: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    flex: 1,
  },

  testCaseStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  testCaseStatusText: {
    fontSize: 10,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
  },

  testCaseDescription: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
    marginBottom: 12,
    fontStyle: 'italic',
  },

  testCaseDetails: {
    gap: 8,
  },

  testCaseInput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  testCaseOutput: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  testCaseLabel: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textMuted,
    minWidth: 80,
  },

  testCaseValue: {
    fontSize: 12,
    fontFamily: 'Fira Code',
    fontWeight: '400',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
  },

  failureValue: {
    color: '#DC2626',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },

  // 에러 컨테이너
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },

  errorTitle: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#DC2626',
    marginBottom: 8,
  },

  errorMessage: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#991B1B',
    lineHeight: 18,
  },

  // 액션 컨테이너
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  successButton: {
    backgroundColor: '#10B981',
  },

  retryButton: {
    backgroundColor: '#BE185D',
  },

  actionButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
  },
});