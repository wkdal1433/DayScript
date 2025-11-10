/**
 * 힌트 모달 컴포넌트 스타일
 */

import { StyleSheet } from 'react-native';

export const hintModalStyles = StyleSheet.create({
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
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  hintEmoji: {
    fontSize: 24,
  },

  hintTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  hintSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },

  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },

  // 점수 차감 배너
  penaltyBanner: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },

  penaltyText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },

  // 잠금 해제 조건
  unlockCondition: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },

  unlockConditionText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },

  // 힌트 내용
  contentContainer: {
    padding: 20,
    maxHeight: 200,
  },

  hintContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },

  // 하단 버튼
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  confirmButton: {
    height: 48,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // 레벨 인디케이터
  levelIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
});