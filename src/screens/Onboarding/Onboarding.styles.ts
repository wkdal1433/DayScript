import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS } from '../../constants/fonts';
import { SIZES } from '../../constants/sizes';

export const onboardingStyles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.figma.cardMargin,
  },

  // Content Area
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 120,
  },

  // Image/Illustration Area
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.figma.cardBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xxxl,
    borderWidth: 2,
    borderColor: COLORS.primaryBorder,
    borderStyle: 'dashed',
  },

  imagePlaceholder: {
    fontSize: FONTS.sizes.emoji,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },

  // Text Content
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
  },

  title: {
    fontSize: FONTS.sizes.heading + 4, // 22px for onboarding
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
    lineHeight: FONTS.lineHeights.tight * (FONTS.sizes.heading + 4),
  },

  description: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.regular as any,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONTS.lineHeights.relaxed * FONTS.sizes.body,
    marginBottom: SIZES.spacing.xxl,
  },

  // Terminal Style Elements
  terminalText: {
    fontFamily: 'Courier New',
    fontSize: FONTS.sizes.body,
    color: COLORS.textTertiary,
    backgroundColor: COLORS.black,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
    marginVertical: SIZES.spacing.sm,
  },

  // Bottom Navigation Area
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.figma.cardMargin,
    paddingTop: SIZES.spacing.xxl,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },

  // Step Indicators
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
  },

  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  indicatorDotActive: {
    backgroundColor: COLORS.primary,
  },

  indicatorDotInactive: {
    backgroundColor: COLORS.borderLight,
  },

  // Buttons
  buttonContainer: {
    width: '100%',
  },

  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.spacing.lg,
    borderRadius: SIZES.figma.cardBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.md,
    ...SIZES.shadow.small,
  },

  primaryButtonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semiBold as any,
    color: COLORS.white,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium as any,
    color: COLORS.textMuted,
  },

  // Animation Elements
  typingAnimation: {
    opacity: 1,
  },

  fadeIn: {
    opacity: 0,
  },

  // Special Elements for CLI Theme
  cliPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.sm,
    marginVertical: SIZES.spacing.sm,
  },

  cliPromptText: {
    fontFamily: 'Courier New',
    fontSize: FONTS.sizes.caption,
    color: COLORS.terminal,
  },

  cursor: {
    width: 2,
    height: FONTS.sizes.caption,
    backgroundColor: COLORS.terminal,
    marginLeft: 2,
  },
});