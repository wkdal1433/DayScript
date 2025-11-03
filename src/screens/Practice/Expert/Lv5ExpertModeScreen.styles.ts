import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import { SIZES } from '../../../constants/sizes';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeArea: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SIZES.margin,
  },

  expertModeTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  sessionInfo: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },

  timerContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  timerText: {
    fontSize: FONTS.sizes.small,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  timerWarning: {
    backgroundColor: COLORS.warning,
  },

  timerWarningText: {
    color: COLORS.white,
  },

  // Tab Navigation
  tabNavigation: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
  },

  // Code Review Module Styles
  moduleContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  prHeader: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 16,
  },

  prTitleSection: {
    marginBottom: 8,
  },

  prTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },

  prStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },

  prMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  prMetricText: {
    fontSize: 11,
    color: '#6B7280',
  },

  reviewProgress: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 16,
  },

  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressStat: {
    fontSize: 12,
    color: '#6B7280',
  },

  reviewContent: {
    flex: 1,
  },

  diffContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 16,
  },

  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },

  diffLine: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginVertical: 1,
  },

  addedLine: {
    backgroundColor: '#DCFCE7',
  },

  deletedLine: {
    backgroundColor: '#FEE2E2',
  },

  modifiedLine: {
    backgroundColor: '#FEF3C7',
  },

  selectedLine: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  lineNumber: {
    fontSize: 12,
    color: '#6B7280',
    width: 40,
    fontFamily: 'monospace',
  },

  diffContent: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    fontFamily: 'monospace',
  },

  commentsSection: {
    backgroundColor: '#F9FAFB',
    padding: 16,
  },

  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },

  commentItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  commentAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  commentTime: {
    fontSize: 10,
    color: '#6B7280',
  },

  commentContent: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
    marginBottom: 8,
  },

  commentLocation: {
    fontSize: 10,
    color: '#6B7280',
  },

  commentInput: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  commentTextInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 80,
  },

  commentActions: {
    marginTop: 8,
  },

  addCommentButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  addCommentButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  prActions: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  prActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  approveButton: {
    backgroundColor: '#D1FAE5',
  },

  changesButton: {
    backgroundColor: '#FEF3C7',
  },

  rejectButton: {
    backgroundColor: '#FEE2E2',
  },

  prActionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  tabItem: {
    flex: 1,
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },

  tabText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  tabProgressIndicator: {
    marginTop: 4,
    height: 4,
    width: '100%',
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
  },

  tabProgressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },

  // Progress Section
  progressSection: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  progressStats: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    borderRadius: 4,
  },

  vibeProgressBar: {
    backgroundColor: COLORS.gradients.vibe.from,
  },

  codeReviewProgressBar: {
    backgroundColor: COLORS.gradients.codeReview.from,
  },

  // Main Content
  mainContent: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
  },

  // Module Container
  moduleContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },

  moduleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.margin * 0.5,
  },

  vibeModuleIcon: {
    backgroundColor: COLORS.gradients.vibe.from,
  },

  codeReviewModuleIcon: {
    backgroundColor: COLORS.gradients.codeReview.from,
  },

  moduleIconText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.small,
    fontWeight: 'bold',
  },

  moduleTitle: {
    fontSize: FONTS.sizes.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    flex: 1,
  },

  moduleDescription: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SIZES.margin,
  },

  // Analytics Dashboard
  analyticsDashboard: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.margin,
  },

  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },

  analyticsTitle: {
    fontSize: FONTS.sizes.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },

  analyticsTimeRange: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },

  analyticsTimeRangeText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
  },

  scoreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  scoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 0.5,
    padding: SIZES.padding * 0.75,
    width: (width - SIZES.padding * 3) * 0.48,
    marginBottom: SIZES.margin * 0.5,
    alignItems: 'center',
  },

  scoreValue: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  scoreLabel: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Error States
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },

  errorIcon: {
    fontSize: 48,
    color: COLORS.error,
    marginBottom: SIZES.margin,
  },

  errorTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.margin * 0.5,
  },

  errorMessage: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SIZES.margin,
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    borderRadius: SIZES.radius,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
  },

  loadingSpinner: {
    marginBottom: SIZES.margin,
  },

  loadingText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.75,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },

  actionButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding * 0.75,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginHorizontal: SIZES.margin * 0.25,
  },

  actionButtonSecondary: {
    backgroundColor: COLORS.lightGray,
  },

  actionButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },

  actionButtonTextSecondary: {
    color: COLORS.textPrimary,
  },

  // Status Indicators
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: SIZES.margin * 0.5,
  },

  statusIndicatorActive: {
    backgroundColor: COLORS.success + '20',
  },

  statusIndicatorInactive: {
    backgroundColor: COLORS.lightGray,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusDotActive: {
    backgroundColor: COLORS.success,
  },

  statusDotInactive: {
    backgroundColor: COLORS.textSecondary,
  },

  statusText: {
    fontSize: FONTS.sizes.small,
    fontWeight: '500',
  },

  statusTextActive: {
    color: COLORS.success,
  },

  statusTextInactive: {
    color: COLORS.textSecondary,
  },

  // Accessibility
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  accessibilityHidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },

  // Animation Support
  fadeInAnimation: {
    opacity: 1,
  },

  slideInAnimation: {
    transform: [{ translateY: 0 }],
  },

  // Responsive Design
  tabletContainer: {
    paddingHorizontal: SIZES.padding * 2,
  },

  tabletModuleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  tabletModule: {
    width: (width - SIZES.padding * 4) * 0.48,
  },

  // Dark Mode Support (if implemented)
  darkModeContainer: {
    backgroundColor: '#1a1a1a',
  },

  darkModeText: {
    color: '#ffffff',
  },

  darkModeCard: {
    backgroundColor: '#2a2a2a',
    borderColor: '#3a3a3a',
  },
});

// Gradient styles for different modules
export const gradientStyles = {
  vibe: {
    colors: [COLORS.gradients.vibe.from, COLORS.gradients.vibe.to],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  codeReview: {
    colors: [COLORS.gradients.codeReview.from, COLORS.gradients.codeReview.to],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  analytics: {
    colors: [COLORS.gradients.analytics.from, COLORS.gradients.analytics.to],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

// Animation configurations
export const animations = {
  fadeIn: {
    duration: 300,
    easing: 'ease-out',
  },
  slideIn: {
    duration: 400,
    easing: 'ease-out',
  },
  bounce: {
    duration: 600,
    easing: 'bounce',
  },
  scale: {
    duration: 200,
    easing: 'ease-in-out',
  },
};

// Accessibility configurations
export const accessibility = {
  announcements: {
    moduleSwitch: 'Switched to {module} module',
    scoreUpdate: 'Score updated to {score}',
    errorOccurred: 'An error occurred: {error}',
    taskCompleted: 'Task completed successfully',
  },
  hints: {
    tabNavigation: 'Double tap to switch modules',
    progressBar: 'Shows current progress',
    actionButton: 'Double tap to perform action',
  },
};