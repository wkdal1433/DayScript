/**
 * 퀴즈 프로그레스 바 컴포넌트 스타일
 */

import { StyleSheet } from 'react-native';

export const quizProgressBarStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },

  // 상단 메타 정보
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },

  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // 프로그레스 바
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    transition: 'width 300ms ease-out',
  },

  // 레벨별 색상
  lv1Progress: {
    backgroundColor: '#10B981',
  },

  lv2Progress: {
    backgroundColor: '#3B82F6',
  },

  lv3Progress: {
    backgroundColor: '#8B5CF6',
  },

  lv4Progress: {
    backgroundColor: '#F59E0B',
  },

  lv5Progress: {
    backgroundColor: '#EF4444',
  },

  // 단계 인디케이터
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },

  stepDotCompleted: {
    backgroundColor: '#10B981',
  },

  stepDotCurrent: {
    backgroundColor: '#3B82F6',
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  stepDotUpcoming: {
    backgroundColor: '#D1D5DB',
  },

  // 연결선
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },

  stepConnectorCompleted: {
    backgroundColor: '#10B981',
  },

  // 점수 정보
  scoreInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  scoreItem: {
    alignItems: 'center',
  },

  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  positiveScore: {
    color: '#059669',
  },

  negativeScore: {
    color: '#DC2626',
  },

  neutralScore: {
    color: '#6B7280',
  },

  // 시간 정보
  timeInfo: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeIcon: {
    fontSize: 12,
    color: '#6B7280',
  },

  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },

  timeWarning: {
    backgroundColor: '#FEF3C7',
  },

  timeWarningText: {
    color: '#92400E',
  },

  timeCritical: {
    backgroundColor: '#FEE2E2',
  },

  timeCriticalText: {
    color: '#DC2626',
  },

  // 애니메이션
  pulseAnimation: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  // 컴팩트 모드
  compactContainer: {
    paddingVertical: 8,
  },

  compactProgressBar: {
    height: 4,
    marginBottom: 6,
  },

  compactMeta: {
    fontSize: 12,
  },

  // 수직 레이아웃
  verticalContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  verticalSteps: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  verticalStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },

  verticalConnector: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
  },
});