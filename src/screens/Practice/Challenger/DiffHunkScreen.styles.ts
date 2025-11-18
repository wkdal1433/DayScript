/**
 * Styles for DiffHunkScreen
 *
 * LV5 Code Review Diff View의 완전한 스타일 시스템
 * Git diff 시각화와 사용자 인터랙션을 위한 전문적인 UI 스타일
 */

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import { SIZES } from '../../../constants/sizes';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const diffHunkStyles = StyleSheet.create({
  // ============================================================================
  // Main Container Styles
  // ============================================================================
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ============================================================================
  // Header Styles
  // ============================================================================
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    ...SIZES.shadow.small,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.cardBg,
  },

  backButtonText: {
    fontSize: FONTS.sizes.large,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.semiBold,
  },

  headerCenter: {
    flex: 1,
    marginLeft: SIZES.spacing.lg,
  },

  headerTitle: {
    fontSize: FONTS.sizes.heading,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.textPrimary,
    lineHeight: FONTS.lineHeights.tight * FONTS.sizes.heading,
  },

  headerSubtitle: {
    fontSize: FONTS.sizes.caption,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: FONTS.lineHeights.normal * FONTS.sizes.caption,
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.sm,
  },

  fileIndicator: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },

  fileIndicatorText: {
    fontSize: FONTS.sizes.caption,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },

  // ============================================================================
  // Progress Bar Styles
  // ============================================================================
  progressContainer: {
    height: 50,
    backgroundColor: COLORS.white,
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.borderLight,
    paddingHorizontal: SIZES.spacing.lg,
    justifyContent: 'center',
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs,
  },

  progressTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },

  progressStats: {
    fontSize: FONTS.sizes.bodySmall,
    color: COLORS.textMuted,
  },

  progressBar: {
    height: 4,
    backgroundColor: COLORS.progressBg,
    borderRadius: SIZES.borderRadius.sm,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.progressFill,
    borderRadius: SIZES.borderRadius.sm,
  },

  // ============================================================================
  // Split View Container Styles
  // ============================================================================
  splitViewContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  hunkHeader: {
    height: 40,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
  },

  hunkInfo: {
    flex: 1,
  },

  hunkTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
  },

  hunkRange: {
    fontSize: FONTS.sizes.bodySmall,
    fontFamily: 'Courier New',
    color: COLORS.textMuted,
    marginTop: 2,
  },

  hunkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.xs,
  },

  statusBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statusIcon: {
    fontSize: FONTS.sizes.bodySmall,
  },

  statusText: {
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.medium,
    color: COLORS.white,
  },

  // ============================================================================
  // Split Panes Styles
  // ============================================================================
  splitView: {
    flex: 1,
    flexDirection: 'row',
  },

  leftPane: {
    flex: 1,
    borderRightWidth: SIZES.borderWidth.thin,
    borderRightColor: COLORS.border,
  },

  rightPane: {
    flex: 1,
  },

  paneHeader: {
    height: 30,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: SIZES.borderWidth.thin,
    borderBottomColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: SIZES.spacing.md,
  },

  paneTitle: {
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ============================================================================
  // Code Lines Styles
  // ============================================================================
  codeScrollView: {
    flex: 1,
  },

  codeLineContainer: {
    flexDirection: 'row',
    minHeight: 20,
    alignItems: 'flex-start',
  },

  lineNumber: {
    width: 40,
    fontSize: FONTS.sizes.bodySmall,
    fontFamily: 'Courier New',
    color: COLORS.textMuted,
    textAlign: 'right',
    paddingRight: SIZES.spacing.xs,
    paddingVertical: 2,
    backgroundColor: '#F8F9FA',
    borderRightWidth: SIZES.borderWidth.thin,
    borderRightColor: COLORS.border,
  },

  codeContent: {
    flex: 1,
    fontSize: FONTS.sizes.bodySmall,
    fontFamily: 'Courier New',
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: 2,
    lineHeight: FONTS.lineHeights.relaxed * FONTS.sizes.bodySmall,
  },

  editableCodeInput: {
    flex: 1,
    fontSize: FONTS.sizes.bodySmall,
    fontFamily: 'Courier New',
    color: COLORS.textPrimary,
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: 2,
    lineHeight: FONTS.lineHeights.relaxed * FONTS.sizes.bodySmall,
    minHeight: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.info,
    borderRadius: 2,
  },

  // ============================================================================
  // Line Type Styles (Git Diff Colors)
  // ============================================================================
  addedLine: {
    backgroundColor: '#D1FAE5', // light green
  },

  deletedLine: {
    backgroundColor: '#FEE2E2', // light red
  },

  modifiedLine: {
    backgroundColor: '#FEF3C7', // light yellow
  },

  contextLine: {
    backgroundColor: COLORS.white,
  },

  noNewlineLine: {
    backgroundColor: '#F3F4F6',
    opacity: 0.7,
  },

  conflictLine: {
    backgroundColor: '#FECACA', // red for conflicts
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
  },

  // ============================================================================
  // Action Bar Styles
  // ============================================================================
  actionBar: {
    height: 80,
    backgroundColor: COLORS.white,
    borderTopWidth: SIZES.borderWidth.thin,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.md,
    ...SIZES.shadow.medium,
  },

  navigationSection: {
    flexDirection: 'row',
    gap: SIZES.spacing.xs,
  },

  actionSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.spacing.sm,
  },

  navigationButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
  },

  navigationButtonDisabled: {
    opacity: 0.3,
  },

  navigationButtonText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },

  actionButton: {
    height: 44,
    paddingHorizontal: SIZES.spacing.lg,
    borderRadius: SIZES.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SIZES.spacing.xs,
    minWidth: 100,
    ...SIZES.shadow.small,
  },

  actionButtonText: {
    fontSize: FONTS.sizes.button,
    fontWeight: FONTS.weights.semiBold,
  },

  // Action Button Variants
  acceptButton: {
    backgroundColor: COLORS.success,
  },

  rejectButton: {
    backgroundColor: COLORS.error,
  },

  editButton: {
    backgroundColor: COLORS.warning,
  },

  commentButton: {
    backgroundColor: COLORS.info,
  },

  saveButton: {
    backgroundColor: COLORS.primary,
  },

  cancelButton: {
    backgroundColor: COLORS.textMuted,
  },

  actionButtonTextLight: {
    color: COLORS.white,
  },

  // ============================================================================
  // Edit Mode Styles
  // ============================================================================
  editModeContainer: {
    backgroundColor: '#FFF7ED', // warm orange tint
    borderWidth: 2,
    borderColor: COLORS.warning,
    borderRadius: SIZES.borderRadius.md,
    margin: SIZES.spacing.xs,
  },

  editModeHeader: {
    backgroundColor: COLORS.warning,
    padding: SIZES.spacing.sm,
    borderTopLeftRadius: SIZES.borderRadius.md,
    borderTopRightRadius: SIZES.borderRadius.md,
  },

  editModeTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.white,
    textAlign: 'center',
  },

  editCommentSection: {
    padding: SIZES.spacing.md,
    backgroundColor: COLORS.white,
    borderTopWidth: SIZES.borderWidth.thin,
    borderTopColor: COLORS.border,
  },

  editCommentLabel: {
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacing.xs,
  },

  editCommentInput: {
    borderWidth: SIZES.borderWidth.thin,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.spacing.md,
    fontSize: FONTS.sizes.body,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    minHeight: 60,
    textAlignVertical: 'top',
  },

  // ============================================================================
  // Loading and Error Styles
  // ============================================================================
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textMuted,
    marginTop: SIZES.spacing.lg,
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.spacing.xl,
  },

  errorText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
    lineHeight: FONTS.lineHeights.relaxed * FONTS.sizes.body,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.borderRadius.lg,
    ...SIZES.shadow.small,
  },

  retryButtonText: {
    fontSize: FONTS.sizes.button,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.white,
  },

  // ============================================================================
  // Review Decision Display Styles
  // ============================================================================
  decisionDisplay: {
    backgroundColor: '#F0F9FF',
    padding: SIZES.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    margin: SIZES.spacing.sm,
    borderRadius: SIZES.borderRadius.md,
  },

  decisionTitle: {
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SIZES.spacing.xs,
  },

  decisionAction: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
    color: COLORS.info,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  decisionComment: {
    fontSize: FONTS.sizes.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SIZES.spacing.xs,
    fontStyle: 'italic',
  },

  decisionTimestamp: {
    fontSize: FONTS.sizes.caption,
    color: COLORS.textMuted,
    marginTop: SIZES.spacing.xs,
  },

  // ============================================================================
  // Utility Styles
  // ============================================================================
  emptyLine: {
    height: 20,
    backgroundColor: '#F9FAFB',
  },

  divider: {
    width: 2,
    backgroundColor: COLORS.border,
  },

  // ============================================================================
  // Responsive Styles
  // ============================================================================
  tabletContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
  },

  tabletSplitView: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
  },

  // ============================================================================
  // Accessibility Styles
  // ============================================================================
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: COLORS.info,
    borderRadius: SIZES.borderRadius.sm,
  },

  highContrastBorder: {
    borderWidth: SIZES.borderWidth.medium,
    borderColor: COLORS.textPrimary,
  },
});

// ============================================================================
// Utility Functions for Dynamic Styles
// ============================================================================

export const getLineBackgroundColor = (lineType: 'add' | 'delete' | 'context' | 'modify' | 'conflict') => {
  switch (lineType) {
    case 'add':
      return '#D1FAE5';
    case 'delete':
      return '#FEE2E2';
    case 'modify':
      return '#FEF3C7';
    case 'conflict':
      return '#FECACA';
    case 'context':
    default:
      return COLORS.white;
  }
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'accepted':
      return COLORS.success;
    case 'rejected':
      return COLORS.error;
    case 'edited':
      return COLORS.warning;
    case 'commented':
      return COLORS.info;
    default:
      return COLORS.textMuted;
  }
};

export const getSplitPaneWidth = (splitRatio: number) => {
  const leftWidth = screenWidth * splitRatio;
  const rightWidth = screenWidth * (1 - splitRatio);
  return { leftWidth, rightWidth };
};