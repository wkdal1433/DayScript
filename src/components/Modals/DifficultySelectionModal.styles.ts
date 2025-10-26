import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';
import { SIZES } from '../../constants/sizes';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: 350,
    height: 690,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
  },

  // Header styles
  header: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 206, 223, 0.3)',
    position: 'relative',
  },

  headerContent: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },

  headerSubtitle: {
    fontSize: 11,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 24,
    right: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },

  // Content styles
  scrollContainer: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Language badge
  languageBadge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    marginBottom: 13,
  },

  languageBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
  },

  // Progress dots
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 19,
    gap: 16,
  },

  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
  },

  // Instructions
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },

  instructionsTitle: {
    fontSize: 16,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },

  instructionsSubtitle: {
    fontSize: 11,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Difficulty cards container
  difficultyContainer: {
    gap: 13,
    paddingBottom: 16,
  },

  // Difficulty card styles
  difficultyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F8E8EE',
    padding: 0,
    overflow: 'hidden',
    position: 'relative',
  },

  difficultyCardSelected: {
    borderWidth: 2,
  },

  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 1.6,
  },

  completionBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#FFD700',
    zIndex: 1,
  },

  completionBadgeText: {
    fontSize: 8,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    paddingBottom: 6,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  iconEmoji: {
    fontSize: 19,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 10,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
  },

  cardArrow: {
    fontSize: 16,
    color: '#C9738F',
    fontWeight: FONTS.weights.regular,
  },

  cardDescription: {
    fontSize: 10,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
    paddingHorizontal: 13,
    paddingBottom: 10,
    lineHeight: 14,
  },

  cardStats: {
    flexDirection: 'row',
    paddingHorizontal: 13,
    paddingBottom: 13,
    gap: 32,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  statIcon: {
    fontSize: 10,
  },

  statText: {
    fontSize: 10,
    fontWeight: FONTS.weights.medium,
    color: '#8B5A6B',
  },

  // Bottom section
  bottomSection: {
    padding: 8,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  startButton: {
    backgroundColor: 'rgba(185, 227, 216, 0.8)',
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 26,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B9E3D8',
  },

  startButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.bold,
    color: '#065F46',
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: 13,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: FONTS.weights.bold,
    color: '#065F46',
  },

  // Lock and attempts indicators
  lockIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  lockIcon: {
    fontSize: 12,
  },

  attemptsContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#F8E8EE',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#E295B3',
  },

  attemptsText: {
    fontSize: 10,
    fontWeight: FONTS.weights.medium,
    color: '#E295B3',
  },

  // Unlock modal styles
  unlockModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  unlockModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    margin: 20,
    maxWidth: 300,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  unlockModalContent: {
    padding: 24,
    alignItems: 'center',
  },

  unlockModalIcon: {
    fontSize: 32,
    marginBottom: 16,
  },

  unlockModalTitle: {
    fontSize: 18,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },

  unlockModalMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },

  unlockModalSubMessage: {
    fontSize: 12,
    color: '#8B5A6B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 16,
  },

  unlockModalCondition: {
    fontSize: 14,
    fontWeight: FONTS.weights.medium,
    color: '#E295B3',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#F8E8EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F2BED1',
  },

  unlockModalButton: {
    backgroundColor: '#E295B3',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 100,
    alignItems: 'center',
  },

  unlockModalButtonText: {
    fontSize: 14,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },
});