/**
 * 결과 모달 컴포넌트 스타일
 */

import { StyleSheet } from 'react-native';

export const resultModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  // 헤더
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  correctHeader: {
    backgroundColor: '#ECFDF5',
  },

  incorrectHeader: {
    backgroundColor: '#FEF2F2',
  },

  resultEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },

  resultSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },

  // 답안 비교
  answersContainer: {
    padding: 20,
    gap: 12,
  },

  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  answerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },

  answerValue: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  correctAnswer: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },

  wrongAnswer: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },

  // 점수 정보
  scoreContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  scoreLabel: {
    fontSize: 14,
    color: '#6B7280',
  },

  scoreValue: {
    fontSize: 16,
    fontWeight: '600',
  },

  positiveScore: {
    color: '#059669',
  },

  zeroScore: {
    color: '#6B7280',
  },

  bonusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  bonusLabel: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },

  bonusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
  },

  // 해설
  explanationContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  explanationScroll: {
    maxHeight: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },

  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },

  // 하단 버튼
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  continueButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  correctButton: {
    backgroundColor: '#10B981',
  },

  incorrectButton: {
    backgroundColor: '#3B82F6',
  },

  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 성과 배지
  achievementBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FBBF24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  achievementText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
});