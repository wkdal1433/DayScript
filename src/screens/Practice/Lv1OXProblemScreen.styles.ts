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
});