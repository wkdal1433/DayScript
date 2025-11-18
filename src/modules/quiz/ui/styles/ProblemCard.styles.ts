/**
 * 문제 카드 컴포넌트 스타일
 */

import { StyleSheet } from 'react-native';

export const problemCardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // 복습 모드 배너
  reviewBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },

  reviewBannerText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },

  // 메타 정보
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  categoryContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },

  rightMeta: {
    flexDirection: 'row',
    gap: 8,
  },

  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  pointsBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },

  pointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },

  // 문제 내용
  questionContainer: {
    maxHeight: 200,
    marginBottom: 16,
  },

  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    fontWeight: '400',
  },

  // 코드 블록
  codeContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  codeHeader: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  codeHeaderText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  codeScrollView: {
    maxHeight: 150,
  },

  codeText: {
    fontFamily: 'Courier New',
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    padding: 12,
  },

  // 태그들
  tagsContainer: {
    marginTop: 16,
  },

  tagsScrollContent: {
    gap: 8,
  },

  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  tagText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
});