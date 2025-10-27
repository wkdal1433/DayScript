export interface GoalCompletionModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback function called when modal should be closed
   */
  onRequestClose: () => void;

  /**
   * Callback function called when user wants to go to home screen
   */
  onGoHome: () => void;

  /**
   * Experience points earned for completing the goal
   * @default 50
   */
  experiencePoints?: number;

  /**
   * Duration of the progress animation in milliseconds
   * @default 1400
   */
  animationDuration?: number;
}