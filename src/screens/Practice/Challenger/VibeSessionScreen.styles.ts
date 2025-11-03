import { StyleSheet, Dimensions } from 'react-native';
import { FONTS } from '../../../constants/fonts';
import { SIZES } from '../../../constants/sizes';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Main Container
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },

  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: FONTS.primary,
    marginTop: 12,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    color: '#DC2626',
    fontFamily: FONTS.primary,
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.primary,
  },

  // ===================================
  // 1️⃣ 상단 영역 - 진행 상태
  // ===================================
  topSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  // Progress Bar
  progressContainer: {
    marginBottom: SIZES.spacing.md,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressFill: {
    height: '100%',
    borderRadius: 3,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: FONTS.primary,
    textAlign: 'center',
  },

  // Status Row (AI Interviewer + Timer)
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  aiInterviewerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  aiAvatarEmoji: {
    fontSize: 20,
  },

  aiInfo: {
    flex: 1,
  },

  aiName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: FONTS.primary,
  },

  aiRole: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: FONTS.primary,
    marginTop: 2,
  },

  timerContainer: {
    alignItems: 'flex-end',
  },

  timerLabel: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: FONTS.primary,
    marginBottom: 2,
  },

  timerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F97316',
    fontFamily: FONTS.primary,
  },

  // ===================================
  // 2️⃣ 중단 영역 - 질문 & 코드 (60:40)
  // ===================================
  middleSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    maxHeight: height * 0.4, // 화면의 40% 제한
  },

  // 좌측 - AI 질문 박스 (60%)
  questionSection: {
    flex: 0.6,
    padding: SIZES.spacing.md,
  },

  questionCard: {
    backgroundColor: '#E8F0FE', // 요구사항 색상
    borderRadius: SIZES.borderRadius.lg,
    padding: SIZES.spacing.lg,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },

  questionBadge: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: FONTS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },

  questionCategory: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: FONTS.primary,
    fontWeight: '500',
  },

  questionContent: {
    gap: SIZES.spacing.sm,
  },

  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: FONTS.primary,
    lineHeight: 22,
  },

  questionDescription: {
    fontSize: 13,
    color: '#475569',
    fontFamily: FONTS.primary,
    lineHeight: 18,
  },

  requirementsList: {
    marginTop: SIZES.spacing.sm,
  },

  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    fontFamily: FONTS.primary,
    marginBottom: 6,
  },

  requirementItem: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: FONTS.primary,
    lineHeight: 16,
    marginBottom: 2,
  },

  // 우측 - 코드 편집 영역 (40%)
  codeSection: {
    flex: 0.4,
    padding: SIZES.spacing.md,
  },

  codeHeader: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SIZES.borderRadius.md,
    borderTopRightRadius: SIZES.borderRadius.md,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  codeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    fontFamily: FONTS.primary,
  },

  codeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  codeMetric: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: FONTS.primary,
  },

  codeEditorContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: SIZES.borderRadius.md,
    borderBottomRightRadius: SIZES.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopWidth: 0,
  },

  codeEditor: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Courier New',
    color: '#1F2937',
    padding: SIZES.spacing.md,
    textAlignVertical: 'top',
    lineHeight: 18,
  },

  // ===================================
  // 3️⃣ 하단 영역 - 대화 기록 및 입력
  // ===================================
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  conversationHistory: {
    flex: 1,
    padding: SIZES.spacing.md,
    maxHeight: height * 0.25, // 화면의 25% 제한
  },

  messageCard: {
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.spacing.md,
    marginBottom: SIZES.spacing.sm,
    maxWidth: '85%',
  },

  aiMessageCard: {
    backgroundColor: '#F8E8EE', // 요구사항 색상 - AI 답변
    alignSelf: 'flex-start',
  },

  userMessageCard: {
    backgroundColor: '#F2BED1', // 요구사항 색상 - 유저 답변
    alignSelf: 'flex-end',
  },

  messageContent: {
    fontSize: 13,
    color: '#1F2937',
    fontFamily: FONTS.primary,
    lineHeight: 18,
  },

  messageTimestamp: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: FONTS.primary,
    marginTop: 6,
    textAlign: 'right',
  },

  // 입력 컨트롤
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: SIZES.spacing.md,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.sm,
  },

  promptInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    fontSize: 14,
    fontFamily: FONTS.primary,
    color: '#1F2937',
    maxHeight: 100,
    textAlignVertical: 'top',
  },

  submitButton: {
    backgroundColor: '#F2BED1',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadius.md,
    justifyContent: 'center',
    minWidth: 70,
  },

  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },

  submitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: FONTS.primary,
    textAlign: 'center',
  },

  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  backButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.borderRadius.md,
  },

  backButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: FONTS.primary,
    fontWeight: '500',
  },

  completeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: SIZES.borderRadius.md,
  },

  completeButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: FONTS.primary,
    fontWeight: '600',
  },
});

export default styles;