import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  categoryBadge: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
  },
  problemContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emojiContainer: {
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
  },
  problemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  problemSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  answerContainer: {
    paddingVertical: 20,
  },
  answerSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  oxOptionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  oxOption: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  oxOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  choicesContainer: {
    gap: 12,
  },
  choiceOption: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  choiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceIdContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  choiceIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666666',
  },
  choiceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    lineHeight: 22,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  correctAnswerContainer: {
    backgroundColor: '#4CAF50',
  },
  correctAnswerText: {
    color: '#4CAF50',
  },
  incorrectAnswer: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FF4D4D',
  },
  incorrectAnswerContainer: {
    backgroundColor: '#FF4D4D',
  },
  incorrectAnswerText: {
    color: '#FF4D4D',
  },
  yourAnswerLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  correctAnswerLabel: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  explanationContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    lineHeight: 20,
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  resultBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  correctResultBadge: {
    backgroundColor: '#E8F5E8',
  },
  incorrectResultBadge: {
    backgroundColor: '#FFF0F0',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  correctResultText: {
    color: '#4CAF50',
  },
  incorrectResultText: {
    color: '#FF4D4D',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});