export interface ProblemReviewModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback function called when modal should be closed
   */
  onClose: () => void;

  /**
   * Problem data to display
   */
  problemData: any; // Can be ProblemData or MultipleChoiceProblemData

  /**
   * User's selected answer
   */
  userAnswer: string;

  /**
   * Whether the user's answer was correct
   */
  isCorrect: boolean;

  /**
   * Type of problem being reviewed
   * @default 'OX'
   */
  problemType?: 'OX' | 'MULTIPLE_CHOICE';
}