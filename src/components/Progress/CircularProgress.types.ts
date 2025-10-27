export interface CircularProgressProps {
  /**
   * Size of the circular progress indicator in pixels
   * @default 120
   */
  size?: number;

  /**
   * Width of the progress stroke in pixels
   * @default 8
   */
  strokeWidth?: number;

  /**
   * Progress value from 0 to 100
   * @default 0
   */
  progress: number;

  /**
   * Animation duration in milliseconds
   * @default 1400
   */
  duration?: number;

  /**
   * Color of the progress stroke
   * @default '#88C7A1'
   */
  color?: string;

  /**
   * Background color of the progress track
   * @default '#E5E5E5'
   */
  backgroundColor?: string;

  /**
   * Whether reduced motion is enabled for accessibility
   * @default false
   */
  isReduceMotionEnabled?: boolean;

  /**
   * Callback function called when progress reaches 100%
   */
  onComplete?: () => void;
}