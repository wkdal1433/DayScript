import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // #FFFFFF
  },

  // Header Section - Same as other screens for consistency
  header: {
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // fill_3BBGKH
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 206, 223, 0.3)', // stroke_K2IFUG
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(248, 232, 238, 0.8)', // fill_FIX4MJ
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder, // #FDCEDF
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textPrimary, // #393E46 fill_NDCLO0
    textAlign: 'center',
  },

  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },

  problemCounter: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.textPrimary, // #393E46 fill_NDCLO0
    textAlign: 'center',
    marginBottom: 4,
  },

  categoryBadge: {
    backgroundColor: 'linear-gradient(135deg, #F8E8EE 0%, #FDCEDF 100%)', // fill_W8KDV2
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 74,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: '#8B5A6B', // fill_6T82IT
    textAlign: 'center',
  },

  timerContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // fill_RR8WP8
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary, // #F2BED1 fill_9E9VL7
    textAlign: 'center',
  },

  // Progress Bar Section
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  progressBarBg: {
    width: 350,
    height: 4,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // fill_OIB79O
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // #F2BED1 fill_9E9VL7
    borderRadius: 2,
  },

  // Main Content Area
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Problem Section
  problemContainer: {
    backgroundColor: '#FFF8FB', // fill_SNBC3V
    borderWidth: 1,
    borderColor: '#FDCEDF', // stroke_J7S0SV
    borderRadius: 15,
    marginVertical: 20,
    padding: 20,
    minHeight: 300,
  },

  problemHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  problemBadge: {
    backgroundColor: COLORS.primary, // #F2BED1 fill_9E9VL7
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 10,
  },

  problemBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
    textAlign: 'center',
  },

  problemTitle: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#374151', // fill_6KHM4G
    textAlign: 'center',
    marginBottom: 4,
  },

  problemSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#374151', // fill_6KHM4G
    textAlign: 'center',
  },

  // Code Block Section
  codeContainer: {
    backgroundColor: '#F7F7F7', // fill_0HFKRL
    borderWidth: 1,
    borderColor: '#E5E7EB', // stroke_LLYF22
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },

  codeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    minHeight: 24,
  },

  lineNumber: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: FONTS.weights.regular as any,
    color: '#9CA3AF', // fill_JKZRY5
    minWidth: 20,
    textAlign: 'left',
  },

  codeText: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: FONTS.weights.regular as any,
    color: '#1F2937', // fill_3UXQ3A
    marginLeft: 16,
  },

  blankContainer: {
    backgroundColor: '#FDCEDF', // fill_Y8WFL2
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 4,
    minWidth: 60,
    height: 32,
    justifyContent: 'center',
  },

  blankInput: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: FONTS.weights.bold as any,
    color: '#BE185D', // fill_5OL3FC
    textAlign: 'center',
    padding: 0,
    margin: 0,
  },

  blankInputCorrect: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
  },

  blankInputIncorrect: {
    backgroundColor: COLORS.error,
    color: COLORS.white,
  },

  // Input Section
  inputSection: {
    backgroundColor: '#F8E8EE', // fill_554E8C
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },

  inputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#E5E7EB', // stroke_OGG95V
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 40,
    justifyContent: 'center',
  },

  inputPlaceholder: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#9CA3AF', // fill_JKZRY5
    textAlign: 'center',
  },

  // Bottom Section
  bottomSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // fill_3BBGKH
    borderTopWidth: 1,
    borderTopColor: 'rgba(253, 206, 223, 0.3)', // stroke_K2IFUG
    paddingHorizontal: 26,
    paddingTop: 20,
    paddingBottom: 48,
    minHeight: 124,
  },

  submitButtonEnabled: {
    backgroundColor: '#FDCEDF', // fill_Y8WFL2
    borderColor: COLORS.primary, // #F2BED1
  },

  submitButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  submitButtonTextEnabled: {
    color: COLORS.white,
  },

  // Bottom Progress Section
  bottomProgressContainer: {
    alignItems: 'center',
  },

  bottomProgressBar: {
    width: 312,
    height: 8,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // fill_OIB79O
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },

  bottomProgressFill: {
    height: '100%',
    backgroundColor: 'linear-gradient(0deg, #FDCEDF 0%, #F2BED1 100%)', // fill_0F95M8
    borderRadius: 4,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 312,
  },

  progressLabel: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#6B7280', // fill_9AC3BC
  },

  progressPercentage: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#6B7280', // fill_9AC3BC
    textAlign: 'right',
  },

  // Result View Styles
  resultContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  achievementBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 20,
  },

  achievementText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
    textAlign: 'center',
  },

  resultStatusContainer: {
    marginBottom: 20,
  },

  resultStatusText: {
    fontSize: 24,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    textAlign: 'center',
  },

  correctText: {
    color: COLORS.success,
  },

  incorrectText: {
    color: COLORS.error,
  },

  explanationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },

  celebrationText: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },

  explanationText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Result Bottom Section
  resultBottomSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(253, 206, 223, 0.3)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  statsContainer: {
    marginBottom: 20,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  statLabel: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textSecondary,
  },

  pointsContainer: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  pointsText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
  },

  expContainer: {
    marginBottom: 8,
  },

  expLabel: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  expText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.textSecondary,
  },

  expBarContainer: {
    marginBottom: 20,
  },

  expBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },

  expBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },

  resultActionButtons: {
    gap: 12,
  },

  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
    textAlign: 'center',
  },

  goalCompleteButton: {
    backgroundColor: COLORS.success,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  goalCompleteButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },

  retryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  // Hint System Styles
  hintCard: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    right: 20,
    backgroundColor: '#F0F7FF',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1F0FF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  hintCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  hintTitle: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: '#1E40AF',
  },

  hintCloseButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E1F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hintCloseText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  hintContent: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },

  hintActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  hintStepInfo: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#6B7280',
  },

  hintNextButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  hintNextButtonText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.white,
  },

  hintNextButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },

  hintNextButtonTextDisabled: {
    color: '#9CA3AF',
  },

  // Button Layout Styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  hintButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
  },

  hintButtonText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold as any,
    color: '#3B82F6',
    textAlign: 'center',
  },

  submitButton: {
    backgroundColor: COLORS.border, // Default disabled state
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.55,
  },

  // Highlight styles for context hints
  highlightedText: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // XP deduction notification
  xpDeductionNotice: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
  },

  xpDeductionText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular as any,
    color: '#DC2626',
    textAlign: 'center',
  },
});