/**
 * LV1 O/X 문제 화면 스타일
 */

import { StyleSheet } from 'react-native';

export const lv1Styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header Styles
  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },

  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },

  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },

  hintButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },

  hintButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  hintButtonDisabled: {
    opacity: 0.5,
  },

  // Content Styles
  content: {
    flex: 1,
    padding: 16,
  },

  // Answer Buttons
  answerContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },

  answerButton: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },

  trueButton: {
    borderColor: '#10B981',
  },

  falseButton: {
    borderColor: '#EF4444',
  },

  selectedButton: {
    backgroundColor: '#F0F9FF',
    borderWidth: 3,
  },

  answerButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },

  selectedButtonText: {
    color: '#1D4ED8',
  },

  // Submit Button
  submitButton: {
    height: 56,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Next Button
  nextButton: {
    height: 56,
    backgroundColor: '#10B981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },

  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },

  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 32,
  },

  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },

  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },

  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});