import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // #FFFFFF
  },

  // Header Section
  header: {
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // fill_40VNAP
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 206, 223, 0.3)', // stroke_OROE74
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(248, 232, 238, 0.8)', // fill_U6S24P
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder, // #FDCEDF
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 18, // style_ZQPC5I
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textPrimary, // #393E46
    textAlign: 'center',
  },

  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },

  problemCounter: {
    fontSize: 18, // style_W4M9SN
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary, // #393E46
    textAlign: 'center',
    marginBottom: 4,
  },

  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(248, 232, 238, 1)', // Gradient start
    borderRadius: 10,
  },

  categoryText: {
    fontSize: 11, // style_T1RAML
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#8B5A6B', // fill_O5NF4X
    textAlign: 'center',
  },

  timerContainer: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // fill_AL2S3S
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerText: {
    fontSize: 12, // style_W0IOP1
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.primary, // #F2BED1
    textAlign: 'center',
  },

  // Progress Bar (Top)
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB', // fill_DK0YEU
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // #F2BED1
    borderRadius: 3,
  },

  // Problem Content Section
  problemContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)', // fill_2BHSYD gradient start
    borderWidth: 2,
    borderColor: COLORS.primaryBorder, // #FDCEDF
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emojiContainer: {
    marginBottom: 20,
  },

  emoji: {
    fontSize: 32, // style_DZ42OJ
    fontFamily: FONTS.primary,
    textAlign: 'center',
  },

  problemTitle: {
    fontSize: 20, // style_7CR3Z2
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary, // #393E46
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },

  problemSubtitle: {
    fontSize: 20, // style_7CR3Z2
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary, // #393E46
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  hintContainer: {
    backgroundColor: 'rgba(248, 232, 238, 0.6)', // fill_NPQSG0
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },

  hintText: {
    fontSize: 14, // style_C38W87
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#8B5A6B', // fill_O5NF4X
    textAlign: 'center',
  },

  // Answer Buttons Section
  answerSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 60,
    paddingVertical: 30,
  },

  answerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  answerButtonX: {
    backgroundColor: 'rgba(242, 190, 209, 1)', // fill_UHEI9H gradient start
    borderColor: '#E38B9C', // stroke_LMM144
  },

  answerButtonO: {
    backgroundColor: 'rgba(168, 213, 186, 1)', // fill_TM7X0X gradient start
    borderColor: '#6BB77B', // stroke_4A19UA
  },

  answerButtonSelected: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },

  answerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerIconX: {
    fontSize: 48,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
    textAlign: 'center',
  },

  answerIconO: {
    fontSize: 48,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
    textAlign: 'center',
  },

  // Bottom Progress Section
  bottomSection: {
    height: 84,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  bottomProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB', // fill_DK0YEU
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },

  bottomProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // #F2BED1
    borderRadius: 3,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    fontSize: 12, // style_9L02JM
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted, // #6B7280
  },

  progressPercentage: {
    fontSize: 12, // style_52LSAT
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted, // #6B7280
  },

  // Result Overlay (for showing answer feedback)
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  resultContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 40,
    alignItems: 'center',
  },

  resultText: {
    fontSize: 24,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },

  explanationText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Result View Styles (Based on Figma Design)
  resultContentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  achievementBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)', // Success green background
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },

  achievementText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#4CAF50', // Success green
    textAlign: 'center',
  },

  resultStatusContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },

  resultStatusText: {
    fontSize: 32,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    textAlign: 'center',
    marginBottom: 8,
  },

  correctText: {
    color: '#4CAF50', // Success green
  },

  incorrectText: {
    color: '#FF4D4D', // Error red
  },

  explanationContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },

  celebrationText: {
    fontSize: 24,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },

  // Result Bottom Section
  resultBottomSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  statsContainer: {
    backgroundColor: 'rgba(245, 247, 250, 1)', // Light background
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  statLabel: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textPrimary,
  },

  pointsContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold background
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  pointsText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#FFD700', // Gold color
  },

  expContainer: {
    marginBottom: 8,
  },

  expLabel: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  expText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
  },

  expBarContainer: {
    marginTop: 8,
  },

  expBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },

  expBarFill: {
    height: '100%',
    backgroundColor: '#FFD700', // Gold for experience
    borderRadius: 4,
  },

  // Result Action Buttons
  resultActionButtons: {
    gap: 12,
  },

  nextButton: {
    backgroundColor: COLORS.primary, // #F2BED1
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nextButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: 'rgba(248, 232, 238, 0.8)', // Light background
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    fontSize: 16,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  goalCompleteButton: {
    backgroundColor: '#88C7A1',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#88C7A1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  goalCompleteButtonText: {
    fontSize: 18,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#FFFFFF',
    textAlign: 'center',
  },

  // Hint System Styles
  hintButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F8E8EE',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 16,
    alignSelf: 'center',
  },

  hintButtonActive: {
    backgroundColor: '#F8E8EE',
    borderColor: '#FDCEDF',
  },

  hintButtonText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#BE185D',
    textAlign: 'center',
  },

  hintButtonTextActive: {
    color: '#8B5A6B',
  },

  hintBubble: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#F8E8EE',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDCEDF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },

  hintBubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  hintBubbleTitle: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#8B5A6B',
  },

  hintBubbleClose: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FDCEDF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  hintBubbleCloseText: {
    fontSize: 12,
    color: '#8B5A6B',
    fontWeight: 'bold',
  },

  hintBubbleContent: {
    fontSize: 13,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#5D4E75',
    lineHeight: 18,
    marginBottom: 12,
  },

  xpNotice: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 6,
    padding: 6,
    marginBottom: 8,
    alignItems: 'center',
  },

  xpNoticeText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#DC2626',
    textAlign: 'center',
  },

  hintBubbleActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  hintStepText: {
    fontSize: 11,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#8B5A6B',
  },

  hintNextButton: {
    backgroundColor: '#BE185D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  hintNextButtonText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
  },

  hintNextButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },

  hintNextButtonTextDisabled: {
    color: '#9CA3AF',
  },

  // Background color transition for answer section
  answerSectionHinted: {
    backgroundColor: 'rgba(253, 206, 223, 0.1)',
  },
});