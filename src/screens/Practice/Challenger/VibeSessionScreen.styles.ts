import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { FONTS } from '../../../constants/fonts';
import { SIZES } from '../../../constants/sizes';

const { width, height } = Dimensions.get('window');

// Figma 디자인에서 추출한 컬러 값들
const figmaColors = {
  // 배경 그라데이션
  primaryGradientStart: '#1E293B', // Slate 800
  primaryGradientEnd: '#0F172A',   // Slate 900

  // 프로그레스 그라데이션
  progressGradientStart: '#10B981', // Emerald 500
  progressGradientEnd: '#F97316',   // Orange 500

  // AI 면접관 그라데이션
  aiAvatarGradient: '#3B82F6',     // Blue 500

  // 질문 카드 그라데이션
  questionCardGradient: '#3B82F6', // Blue 500

  // 토큰 표시기
  timerOrange: '#F97316',          // Orange 500

  // 난이도 표시
  difficultyHard: '#EF4444',       // Red 500

  // 텍스트 컬러
  primaryText: '#FFFFFF',
  secondaryText: '#E2E8F0',        // Slate 200
  mutedText: '#94A3B8',            // Slate 400
  placeholderText: '#9CA3AF',      // Gray 400

  // 배경 컬러
  cardBackground: '#F9FAFB',       // Gray 50
  inputBackground: '#FFFFFF',
  overlayBackground: 'rgba(255, 255, 255, 0.1)',

  // 경계선
  borderColor: '#E5E7EB',          // Gray 200
  focusBorder: '#3B82F6',          // Blue 500
};

export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: figmaColors.primaryGradientStart,
  },

  safeArea: {
    flex: 1,
  },

  // Header Section (Figma 상단 헤더 영역)
  header: {
    height: 74, // Figma 디자인 기준
    backgroundColor: figmaColors.primaryGradientStart,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: SIZES.padding,
    paddingTop: 4,
  },

  progressBar: {
    height: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    width: '20%', // 예시: 20% 진행률
    borderRadius: 2,
  },

  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
  },

  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  levelText: {
    fontSize: 12,
    fontWeight: '700',
    color: figmaColors.mutedText,
    fontFamily: FONTS.family.inter,
  },

  problemCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: figmaColors.mutedText,
    fontFamily: FONTS.family.inter,
    marginTop: 6,
  },

  headerCenter: {
    alignItems: 'center',
  },

  timerContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  timerText: {
    fontSize: 14,
    fontWeight: '700',
    color: figmaColors.timerOrange,
    fontFamily: FONTS.family.inter,
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  difficultyBadge: {
    backgroundColor: figmaColors.difficultyHard,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 18,
    minWidth: 50,
    alignItems: 'center',
  },

  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: figmaColors.primaryText,
    fontFamily: FONTS.family.inter,
  },

  difficultyLabel: {
    fontSize: 10,
    color: figmaColors.secondaryText,
    fontFamily: FONTS.family.inter,
    marginTop: 2,
  },

  // AI Interviewer Section (Figma AI 면접관 영역)
  aiInterviewerSection: {
    backgroundColor: figmaColors.primaryGradientStart,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
  },

  aiInterviewerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  aiAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: figmaColors.aiAvatarGradient,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  aiAvatarEmoji: {
    fontSize: 24,
    fontFamily: FONTS.family.inter,
  },

  aiInterviewerInfo: {
    flex: 1,
  },

  aiInterviewerName: {
    fontSize: 16,
    fontWeight: '700',
    color: figmaColors.secondaryText,
    fontFamily: FONTS.family.inter,
  },

  aiInterviewerRole: {
    fontSize: 12,
    color: figmaColors.mutedText,
    fontFamily: FONTS.family.inter,
    marginTop: 2,
  },

  // Main Content Area (좌우 분할 패널)
  mainContent: {
    flex: 1,
    flexDirection: 'row',
  },

  // Left Panel - Conversation History
  conversationPanel: {
    flex: 1,
    backgroundColor: figmaColors.primaryGradientStart,
    borderRightWidth: 1,
    borderRightColor: 'rgba(59, 130, 246, 0.2)',
  },

  // Problem Requirements Section (좌측 상단 고정)
  problemSection: {
    backgroundColor: figmaColors.aiAvatarGradient,
    margin: SIZES.margin,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
  },

  problemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  problemBadgeIcon: {
    width: 20,
    height: 10,
    backgroundColor: figmaColors.aiAvatarGradient,
    marginRight: 8,
  },

  problemBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: figmaColors.primaryText,
    fontFamily: FONTS.family.inter,
  },

  problemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: figmaColors.primaryText,
    fontFamily: FONTS.family.inter,
    lineHeight: 22,
    marginBottom: 8,
  },

  problemHint: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },

  problemHintText: {
    fontSize: 12,
    color: figmaColors.secondaryText,
    fontFamily: FONTS.family.inter,
    lineHeight: 15,
  },

  // Conversation Messages
  conversationList: {
    flex: 1,
    padding: SIZES.padding,
  },

  messageItem: {
    marginBottom: SIZES.margin,
  },

  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
  },

  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    maxWidth: '80%',
    borderRadius: 12,
    padding: 12,
  },

  messageText: {
    fontSize: 14,
    color: figmaColors.primaryText,
    fontFamily: FONTS.family.inter,
    lineHeight: 18,
  },

  messageTimestamp: {
    fontSize: 10,
    color: figmaColors.mutedText,
    fontFamily: FONTS.family.inter,
    marginTop: 4,
  },

  // Right Panel - Result Preview
  previewPanel: {
    flex: 1,
    backgroundColor: figmaColors.cardBackground,
  },

  previewHeader: {
    backgroundColor: figmaColors.inputBackground,
    borderBottomWidth: 1,
    borderBottomColor: figmaColors.borderColor,
    padding: SIZES.padding,
  },

  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: FONTS.family.inter,
  },

  previewSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: FONTS.family.inter,
    marginTop: 2,
  },

  // Code Editor Area
  codeEditorContainer: {
    flex: 1,
    margin: SIZES.margin,
    backgroundColor: figmaColors.inputBackground,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: figmaColors.borderColor,
    overflow: 'hidden',
  },

  codeEditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: figmaColors.borderColor,
  },

  languageTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Courier New', // 모노스페이스 폰트
  },

  codeActionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  codeActionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  codeActionText: {
    fontSize: 10,
    color: '#374151',
    fontFamily: FONTS.family.inter,
  },

  codeScrollView: {
    flex: 1,
  },

  codeTextInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Courier New', // 모노스페이스 폰트
    color: '#1F2937',
    lineHeight: 20,
    textAlignVertical: 'top',
  },

  // Bottom Section (프롬프트 입력 영역)
  bottomSection: {
    backgroundColor: figmaColors.cardBackground,
    borderTopWidth: 1,
    borderTopColor: figmaColors.borderColor,
  },

  // Token Monitor (토큰 사용량 표시)
  tokenMonitor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: figmaColors.borderColor,
  },

  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tokenText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: FONTS.family.inter,
    marginLeft: 4,
  },

  tokenUsage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: FONTS.family.inter,
  },

  efficiencyScore: {
    fontSize: 12,
    color: '#059669',
    fontFamily: FONTS.family.inter,
  },

  // Prompt Input Section (Figma 하단 입력 영역 기반)
  promptInputSection: {
    padding: SIZES.padding,
  },

  promptAnnouncementContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  promptAnnouncementText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: FONTS.family.inter,
  },

  promptInputContainer: {
    backgroundColor: figmaColors.inputBackground,
    borderWidth: 2,
    borderColor: figmaColors.borderColor,
    borderRadius: SIZES.radius,
    minHeight: 100,
    maxHeight: 150,
  },

  promptInputFocused: {
    borderColor: figmaColors.focusBorder,
  },

  promptTextInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    fontFamily: FONTS.family.inter,
    color: '#1F2937',
    textAlignVertical: 'top',
  },

  promptPlaceholder: {
    fontSize: 14,
    color: figmaColors.placeholderText,
    fontFamily: FONTS.family.inter,
    fontStyle: 'italic',
  },

  promptSuggestions: {
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  suggestionText: {
    fontSize: 14,
    color: figmaColors.placeholderText,
    fontFamily: FONTS.family.inter,
    lineHeight: 17,
  },

  // Control Buttons (Figma 하단 버튼들)
  controlButtonsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },

  controlButton: {
    flex: 1,
    height: 48,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  skipButton: {
    backgroundColor: figmaColors.borderColor,
  },

  submitButton: {
    backgroundColor: figmaColors.timerOrange,
  },

  controlButtonDisabled: {
    opacity: 0.5,
  },

  controlButtonText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: FONTS.family.inter,
  },

  skipButtonText: {
    color: '#1F2937',
  },

  submitButtonText: {
    color: figmaColors.primaryText,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: figmaColors.primaryGradientStart,
  },

  loadingText: {
    fontSize: 16,
    color: figmaColors.secondaryText,
    fontFamily: FONTS.family.inter,
    marginTop: 12,
  },

  generatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  generatingText: {
    fontSize: 18,
    color: figmaColors.primaryText,
    fontFamily: FONTS.family.inter,
    fontWeight: '600',
    marginTop: 12,
  },

  // Error States
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: SIZES.radius,
    padding: 12,
    margin: SIZES.margin,
  },

  errorText: {
    fontSize: 14,
    color: '#DC2626',
    fontFamily: FONTS.family.inter,
  },

  // Accessibility
  accessibilityHidden: {
    position: 'absolute',
    left: -10000,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },

  // Responsive Design
  tabletLayout: {
    flexDirection: 'row',
  },

  tabletConversationPanel: {
    flex: 0.6,
  },

  tabletPreviewPanel: {
    flex: 0.4,
  },

  // Animation Support
  fadeIn: {
    opacity: 1,
  },

  slideUp: {
    transform: [{ translateY: 0 }],
  },

  // Dark Mode (if needed)
  darkModeContainer: {
    backgroundColor: '#111827',
  },

  darkModeText: {
    color: '#F9FAFB',
  },
});

// Gradient configurations for different elements
export const gradientConfigs = {
  header: {
    colors: [figmaColors.primaryGradientStart, figmaColors.primaryGradientEnd],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  progress: {
    colors: [figmaColors.progressGradientStart, figmaColors.progressGradientEnd],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  aiAvatar: {
    colors: ['#3B82F6', '#1D4ED8'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  questionCard: {
    colors: ['#3B82F6', '#2563EB'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  submitButton: {
    colors: ['#F97316', '#EA580C'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

// Animation timings
export const animations = {
  messageAppear: 300,
  panelResize: 400,
  buttonPress: 150,
  codeHighlight: 200,
  fadeTransition: 250,
};

// Layout constants
export const layout = {
  headerHeight: 74,
  timerSize: 72,
  avatarSize: 60,
  controlButtonHeight: 48,
  promptInputMinHeight: 100,
  promptInputMaxHeight: 150,
  conversationPanelRatio: 0.5, // 50% of screen width
  previewPanelRatio: 0.5,      // 50% of screen width
};

export default styles;