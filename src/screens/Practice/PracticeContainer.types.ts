export type ProblemType = 'OX' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'DEBUGGING';

export interface PracticeContainerProps {
  /**
   * Navigation object for screen navigation
   */
  navigation?: any;

  /**
   * Route object containing route parameters
   */
  route?: any;

  /**
   * Type of problem to display
   * @default 'OX'
   */
  problemType?: ProblemType;
}

export interface PracticeNavigationParams {
  /**
   * Type of practice session to start
   */
  problemType: ProblemType;

  /**
   * Number of problems in the session
   * @default 10
   */
  problemCount?: number;

  /**
   * Time limit per problem in seconds
   * @default 30
   */
  timeLimit?: number;
}