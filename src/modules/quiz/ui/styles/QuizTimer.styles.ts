/**
 * 퀴즈 타이머 컴포넌트 스타일
 */

import { StyleSheet } from 'react-native';

export const quizTimerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // QuizTimer.tsx에서 사용되는 필수 스타일들 추가
  timerContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },

  timerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  warningTimer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
  },

  warningText: {
    fontWeight: 'bold',
  },

  progressContainer: {
    alignItems: 'center',
    marginTop: 8,
  },

  progressRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  },

  progressFill: {
    position: 'absolute',
    width: 30,
    height: 60,
    top: 0,
    left: 30,
    transformOrigin: '0 30px',
    backgroundColor: '#10B981',
  },

  progressText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },

  warningMessage: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },

  warningMessageText: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },

  timeUpMessage: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },

  timeUpText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // 기본 타이머 디스플레이
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  timerIcon: {
    fontSize: 16,
    color: '#6B7280',
  },

  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
  },

  // 상태별 색상
  normalState: {
    color: '#10B981',
  },

  warningState: {
    color: '#F59E0B',
  },

  criticalState: {
    color: '#EF4444',
  },

  // 원형 프로그레스 타이머
  circularContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circularTimer: {
    width: 60,
    height: 60,
  },

  circularBackground: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },

  circularProgress: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#3B82F6',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },

  circularText: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  // 바 형태 프로그레스
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 8,
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },

  progressBarWarning: {
    backgroundColor: '#F59E0B',
  },

  progressBarCritical: {
    backgroundColor: '#EF4444',
  },

  // 컴팩트 모드
  compactContainer: {
    flexDirection: 'row',
    padding: 8,
    gap: 6,
  },

  compactTimer: {
    fontSize: 14,
  },

  compactIcon: {
    fontSize: 14,
  },

  // 확장된 모드
  expandedContainer: {
    padding: 16,
    minWidth: 120,
  },

  expandedTimer: {
    fontSize: 24,
    fontWeight: '700',
  },

  expandedLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  // 플래시 애니메이션
  flashAnimation: {
    backgroundColor: '#FEE2E2',
  },

  // 일시정지 상태
  pausedContainer: {
    backgroundColor: '#F3F4F6',
  },

  pausedTimer: {
    color: '#9CA3AF',
  },

  pausedIcon: {
    color: '#9CA3AF',
  },

  // 만료 상태
  expiredContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  expiredTimer: {
    color: '#DC2626',
  },

  expiredMessage: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    marginTop: 4,
  },

  // 보너스 시간
  bonusContainer: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },

  bonusTimer: {
    color: '#059669',
  },

  bonusLabel: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },

  // 미니 모드 (헤더용)
  miniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 4,
    shadowOpacity: 0,
    elevation: 0,
  },

  miniTimer: {
    fontSize: 12,
    fontWeight: '500',
  },

  miniIcon: {
    fontSize: 12,
  },

  // 풀스크린 모드
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  fullscreenTimer: {
    fontSize: 72,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  fullscreenMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
  },

  // 카운트다운 모드
  countdownContainer: {
    backgroundColor: '#1F2937',
  },

  countdownTimer: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  countdownLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },

  // 펄스 효과
  pulseEffect: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  // 시간 단위별 스타일
  hoursMinutesSeconds: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeUnit: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'monospace',
  },

  timeSeparator: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
  },

  // 배경 모드
  transparentBackground: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },

  gradientBackground: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
});