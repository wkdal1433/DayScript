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
    height: 80, // layout_4HCOFQ
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // fill_K6RHLU
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 206, 223, 0.3)', // stroke_F76GNU
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  backButton: {
    width: 44, // layout_0SHSGU
    height: 44,
    backgroundColor: 'rgba(248, 232, 238, 0.8)', // fill_4UMOAZ
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder, // #FDCEDF stroke_8I53N4
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonText: {
    fontSize: 18, // style_IH4327
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textPrimary, // #393E46 fill_K2O21T
    textAlign: 'center',
  },

  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },

  problemCounter: {
    fontSize: 18, // style_R2F6SW
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary, // #393E46 fill_K2O21T
    textAlign: 'center',
    marginBottom: 4,
  },

  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(248, 232, 238, 1)', // fill_IHUZBM gradient start
    borderRadius: 10, // layout_IM9OPI
  },

  categoryText: {
    fontSize: 11, // style_CJT6M4
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: '#8B5A6B', // fill_SLRQS4
    textAlign: 'center',
  },

  timerContainer: {
    width: 44, // layout_5REUCA
    height: 44,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // fill_PJEMDG
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerText: {
    fontSize: 12, // style_WS5EEC
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.primary, // #F2BED1 fill_3O931Z
    textAlign: 'center',
  },

  // Progress Bar (Top)
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  progressBarBg: {
    width: '100%',
    height: 4, // layout_6RB6R6
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // fill_FAR9LZ gradient
    borderRadius: 2,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // Problem Content Section
  problemContainer: {
    backgroundColor: COLORS.white, // fill_SKEBA4
    borderWidth: 1,
    borderColor: 'rgba(253, 206, 223, 0.3)', // stroke_F76GNU
    borderRadius: 20,
    marginHorizontal: 26, // layout_EZUJ6P
    marginVertical: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  problemTitle: {
    fontSize: 18, // style_R2F6SW
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary, // #393E46 fill_K2O21T
    textAlign: 'center',
    marginBottom: 8,
  },

  problemSubtitle: {
    fontSize: 18, // style_R2F6SW
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary, // #393E46 fill_K2O21T
    textAlign: 'center',
  },

  // Multiple Choice Options
  choicesContainer: {
    paddingHorizontal: 26, // layout_EZUJ6P
    gap: 12, // Spacing between choices
  },

  choiceContainer: {
    width: '100%', // layout_Z385Y8
    height: 64,
    backgroundColor: COLORS.white, // fill_SKEBA4
    borderWidth: 2,
    borderColor: COLORS.primary, // #F2BED1 stroke_KRQJEO
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },

  choiceContainerSelected: {
    backgroundColor: 'rgba(253, 206, 223, 0.1)',
    borderColor: COLORS.primary,
  },

  choiceContainerCorrect: {
    backgroundColor: 'rgba(168, 230, 207, 0.1)', // Green tint
    borderColor: '#10B981',
  },

  choiceContainerIncorrect: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)', // Red tint
    borderColor: '#EF4444',
  },

  choiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  choiceIdContainer: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  choiceIdContainerSelected: {
    backgroundColor: COLORS.primary,
  },

  choiceIdContainerCorrect: {
    backgroundColor: '#10B981',
  },

  choiceIdContainerIncorrect: {
    backgroundColor: '#EF4444',
  },

  choiceIdText: {
    fontSize: 14,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.textPrimary,
  },

  choiceIdTextSelected: {
    color: COLORS.white,
  },

  choiceIdTextCorrect: {
    color: COLORS.white,
  },

  choiceIdTextIncorrect: {
    color: COLORS.white,
  },

  choiceText: {
    fontSize: 16, // style_2NN97V
    fontFamily: 'Fira Code', // Fira Code for code text
    fontWeight: '500', // medium weight
    color: COLORS.textPrimary, // #393E46 fill_K2O21T
    flex: 1,
  },

  choiceTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.semiBold.toString(), // style_NIW7X2 for selected
  },

  choiceTextCorrect: {
    color: '#065F46', // Darker green for correct
    fontWeight: FONTS.weights.semiBold.toString(),
  },

  choiceTextIncorrect: {
    color: '#991B1B', // Darker red for incorrect
    fontWeight: FONTS.weights.semiBold.toString(),
  },

  // Bottom Submit Section
  bottomSection: {
    height: 124, // layout_168MWC
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // fill_K6RHLU
    borderTopWidth: 1,
    borderTopColor: 'rgba(253, 206, 223, 0.3)', // stroke_F76GNU
    paddingHorizontal: 26, // layout_G0GT1R
    paddingVertical: 20,
  },

  submitButton: {
    width: '100%', // layout_IA0568
    height: 56,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // fill_8LXHDW (disabled state)
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  submitButtonEnabled: {
    backgroundColor: COLORS.primaryBorder, // #FDCEDF (enabled state)
  },

  submitButtonText: {
    fontSize: 16, // style_PRK435
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted, // Disabled text color
    textAlign: 'center',
  },

  submitButtonTextEnabled: {
    color: COLORS.white, // fill_SKEBA4 with stroke_1628M3
    fontWeight: FONTS.weights.medium.toString(),
  },

  // Bottom Progress Container
  bottomProgressContainer: {
    marginTop: 6, // layout_NQR0D0
  },

  bottomProgressBar: {
    width: '100%', // layout_HUURJJ
    height: 8,
    backgroundColor: 'rgba(229, 231, 235, 0.5)', // fill_439EVB
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },

  bottomProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // fill_2KYIGP gradient
    borderRadius: 4,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  progressLabel: {
    fontSize: 12, // style_BGLRA4
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted, // #6B7280 fill_DOCPBU
  },

  progressPercentage: {
    fontSize: 12, // style_PQ2C0E
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: COLORS.textMuted, // #6B7280 fill_DOCPBU
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