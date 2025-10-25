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
    width: 390,
    height: 844,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    overflow: 'hidden',
  },

  // Header styles
  header: {
    paddingTop: 51,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(253, 206, 223, 0.3)',
    position: 'relative',
  },

  headerContent: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: 51,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },

  // Content styles
  scrollContainer: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Language badge
  languageBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },

  languageBadgeText: {
    fontSize: 12,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
    textAlign: 'center',
  },

  // Progress dots
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 20,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
  },

  // Instructions
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },

  instructionsTitle: {
    fontSize: 20,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },

  instructionsSubtitle: {
    fontSize: 14,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Difficulty cards container
  difficultyContainer: {
    gap: 16,
    paddingBottom: 20,
  },

  // Difficulty card styles
  difficultyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
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
    borderRadius: 2,
  },

  completionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    zIndex: 1,
  },

  completionBadgeText: {
    fontSize: 10,
    fontWeight: FONTS.weights.bold,
    color: COLORS.white,
  },

  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconEmoji: {
    fontSize: 24,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  cardSubtitle: {
    fontSize: 12,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
  },

  cardArrow: {
    fontSize: 20,
    color: '#C9738F',
    fontWeight: FONTS.weights.regular,
  },

  cardDescription: {
    fontSize: 13,
    fontWeight: FONTS.weights.regular,
    color: COLORS.textMuted,
    paddingHorizontal: 16,
    paddingBottom: 12,
    lineHeight: 18,
  },

  cardStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 40,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statIcon: {
    fontSize: 12,
  },

  statText: {
    fontSize: 12,
    fontWeight: FONTS.weights.medium,
    color: '#8B5A6B',
  },

  // Bottom section
  bottomSection: {
    padding: 20,
    paddingBottom: 34,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  startButton: {
    backgroundColor: 'rgba(185, 227, 216, 0.8)',
    borderRadius: 27,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B9E3D8',
  },

  startButtonText: {
    fontSize: 20,
    fontWeight: FONTS.weights.bold,
    color: '#065F46',
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },

  backButtonText: {
    fontSize: 20,
    fontWeight: FONTS.weights.bold,
    color: '#065F46',
  },
});