/**
 * LoginScreen Styles
 *
 * 로그인 화면 스타일 정의 - 기존 디자인 시스템과 일관성 유지
 */

import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants';

export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.figma.cardMargin,
  },

  // Header Section
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },

  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
    borderWidth: 2,
    borderColor: COLORS.primaryBorder,
    ...SIZES.shadow.small,
  },

  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Content Container
  contentContainer: {
    flex: 1,
    paddingTop: SIZES.spacing.xl,
  },

  // Form Section
  formContainer: {
    marginBottom: SIZES.spacing.xxl,
  },

  // Input Field Styles
  inputContainer: {
    marginBottom: SIZES.spacing.lg,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacing.sm,
    paddingLeft: SIZES.spacing.xs,
  },

  inputWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.figma.cardBorderRadius,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md + 2,
    ...SIZES.shadow.small,
  },

  inputWrapperFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },

  input: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },

  inputError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },

  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.error,
    marginTop: SIZES.spacing.xs,
    paddingLeft: SIZES.spacing.xs,
  },

  // Password Field Specific
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
  },

  eyeButton: {
    padding: SIZES.spacing.xs,
    marginLeft: SIZES.spacing.sm,
  },

  eyeIcon: {
    fontSize: 20,
    color: COLORS.textMuted,
  },

  // Forgot Password Link
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: SIZES.spacing.xxl,
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },

  // Login Button (uses NextButton component)
  loginButtonContainer: {
    marginBottom: SIZES.spacing.xxl,
  },

  // Divider Section
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.spacing.xl,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginHorizontal: SIZES.spacing.lg,
  },

  // Social Login Section
  socialLoginContainer: {
    marginBottom: SIZES.spacing.xxl,
  },

  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.spacing.md,
  },

  socialButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.figma.cardBorderRadius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.spacing.md + 2,
    paddingHorizontal: SIZES.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SIZES.shadow.small,
  },

  socialButtonPressed: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    transform: [{ scale: 0.98 }],
  },

  socialIcon: {
    fontSize: 20,
    marginRight: SIZES.spacing.sm,
  },

  googleIcon: {
    color: '#DB4437',
  },

  appleIcon: {
    color: '#000000',
  },

  facebookIcon: {
    color: '#4267B2',
  },

  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  // Sign Up Section
  signUpContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },

  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  signUpText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textMuted,
    marginRight: SIZES.spacing.xs,
  },

  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Loading State
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(249, 245, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  loadingContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.figma.cardBorderRadius,
    padding: SIZES.spacing.xxl,
    alignItems: 'center',
    ...SIZES.shadow.medium,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SIZES.spacing.md,
  },

  // Animation Styles
  fadeIn: {
    opacity: 1,
  },

  fadeOut: {
    opacity: 0,
  },

  slideUp: {
    transform: [{ translateY: 0 }],
  },

  slideDown: {
    transform: [{ translateY: 20 }],
  },
});