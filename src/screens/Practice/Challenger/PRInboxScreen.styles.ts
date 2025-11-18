/**
 * PRInboxScreen Styles
 *
 * LV5 Code Review & PR 모듈의 PR Inbox 화면을 위한 스타일 정의
 * 전문적이고 직관적인 UI/UX를 위한 디자인 시스템
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Design System Colors
const colors = {
  // Primary Colors
  primary: '#3B82F6',
  primaryLight: '#DBEAFE',
  primaryDark: '#1E40AF',

  // Secondary Colors
  secondary: '#6B7280',
  secondaryLight: '#F3F4F6',
  secondaryDark: '#374151',

  // Status Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',

  // Git Status Colors
  added: '#22C55E',
  modified: '#3B82F6',
  deleted: '#EF4444',
  renamed: '#8B5CF6',

  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',

  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Commit Status Colors
  pending: '#F59E0B',
  accepted: '#10B981',
  rejected: '#EF4444',
  needsReview: '#8B5CF6',
};

// Typography Scale
const typography = {
  h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  h4: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  small: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
  code: { fontSize: 14, fontWeight: '400' as const, fontFamily: 'monospace', lineHeight: 20 },
};

// Spacing System
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Main Styles
export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  safeArea: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.md,
  },

  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 2,
  },

  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  timerContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },

  timerText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },

  // Progress Section
  progressSection: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  progressTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  progressStats: {
    ...typography.body2,
    color: colors.textSecondary,
  },

  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },

  // Scenario Section
  scenarioSection: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
  },

  scenarioTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    flex: 1,
  },

  collapseButton: {
    padding: spacing.sm,
  },

  collapseIcon: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  scenarioContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  scenarioDescription: {
    ...typography.body1,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },

  requirementsTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },

  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },

  requirementBullet: {
    ...typography.body2,
    color: colors.primary,
    marginRight: spacing.sm,
    marginTop: 2,
  },

  requirementText: {
    ...typography.body2,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },

  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },

  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '500',
  },

  // Commit List Section
  commitListSection: {
    flex: 1,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  listTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },

  commitCount: {
    ...typography.body2,
    color: colors.textSecondary,
  },

  commitList: {
    flex: 1,
  },

  // Commit Card Styles
  commitCard: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  commitCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  commitCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },

  commitAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  commitAuthorInitials: {
    ...typography.body2,
    color: colors.background,
    fontWeight: '600',
  },

  commitInfo: {
    flex: 1,
  },

  commitMessage: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },

  commitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  commitAuthor: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },

  commitTime: {
    ...typography.caption,
    color: colors.textTertiary,
  },

  commitHash: {
    ...typography.code,
    color: colors.textSecondary,
    backgroundColor: colors.backgroundTertiary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },

  commitStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },

  statIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },

  statText: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  additionStat: {
    color: colors.added,
  },

  deletionStat: {
    color: colors.deleted,
  },

  // Diff Preview Styles
  diffPreview: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 8,
    overflow: 'hidden',
  },

  diffPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundTertiary,
  },

  diffPreviewTitle: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '500',
  },

  expandButton: {
    padding: spacing.xs,
  },

  expandIcon: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  diffSummary: {
    padding: spacing.md,
  },

  diffSummaryText: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },

  keyChangesList: {
    marginTop: spacing.xs,
  },

  keyChangeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },

  keyChangeBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 6,
    marginRight: spacing.sm,
  },

  keyChangeText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },

  codeSnippet: {
    backgroundColor: colors.backgroundTertiary,
    padding: spacing.md,
    borderRadius: 6,
    marginTop: spacing.sm,
  },

  codeSnippetText: {
    ...typography.code,
    color: colors.textPrimary,
  },

  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },

  riskIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },

  riskText: {
    ...typography.caption,
    fontWeight: '500',
  },

  riskLow: {
    color: colors.success,
  },

  riskMedium: {
    color: colors.warning,
  },

  riskHigh: {
    color: colors.error,
  },

  // Review Action Buttons
  reviewActions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },

  reviewButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  acceptButton: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },

  rejectButton: {
    backgroundColor: colors.errorLight,
    borderColor: colors.error,
  },

  flagButton: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
  },

  reviewButtonText: {
    ...typography.body2,
    fontWeight: '600',
  },

  acceptButtonText: {
    color: colors.success,
  },

  rejectButtonText: {
    color: colors.error,
  },

  flagButtonText: {
    color: colors.warning,
  },

  reviewButtonDisabled: {
    opacity: 0.5,
  },

  // Status Indicators
  statusIndicator: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },

  statusPending: {
    backgroundColor: colors.warningLight,
  },

  statusAccepted: {
    backgroundColor: colors.successLight,
  },

  statusRejected: {
    backgroundColor: colors.errorLight,
  },

  statusNeedsReview: {
    backgroundColor: colors.primaryLight,
  },

  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },

  statusTextPending: {
    color: colors.pending,
  },

  statusTextAccepted: {
    color: colors.accepted,
  },

  statusTextRejected: {
    color: colors.rejected,
  },

  statusTextNeedsReview: {
    color: colors.needsReview,
  },

  // Bottom Action Bar
  bottomActionBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryActionButton: {
    backgroundColor: colors.primary,
  },

  secondaryActionButton: {
    backgroundColor: colors.secondaryLight,
    borderWidth: 1,
    borderColor: colors.border,
  },

  actionButtonText: {
    ...typography.body1,
    fontWeight: '600',
  },

  primaryActionButtonText: {
    color: colors.background,
  },

  secondaryActionButtonText: {
    color: colors.textPrimary,
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  errorText: {
    ...typography.body1,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },

  retryButtonText: {
    ...typography.body1,
    color: colors.background,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  emptyStateIcon: {
    fontSize: 48,
    color: colors.textTertiary,
    marginBottom: spacing.lg,
  },

  emptyStateTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  emptyStateDescription: {
    ...typography.body1,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

// Export additional theme objects
export const theme = {
  colors,
  typography,
  spacing,
};

export default styles;