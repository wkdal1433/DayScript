/**
 * Quiz 모듈 통합 내보내기
 * SOLID 원칙 중 ISP(인터페이스 분리) 적용 - 필요한 것만 노출
 */

// Core Domain
export * from './core/domain/QuizBase';
export * from './core/domain/QuizTypes';
export * from './core/domain/IQuizRepository';

// Application Layer
export * from './core/application/useQuizSession';
export * from './core/application/useQuizHint';

// Infrastructure
export { QuizRepositoryImpl } from './infra/QuizRepositoryImpl';

// UI Components (Lv1OXProblemScreen moved to screens/Practice)
export * from './ui/components/ProblemCard';
export * from './ui/components/HintModal';
export * from './ui/components/ResultModal';
export * from './ui/components/QuizProgressBar';
export * from './ui/components/QuizTimer';

// Types for external use
export type {
  QuizSessionState,
  UseQuizSessionOptions,
  HintState,
  UseQuizHintOptions,
} from './core/application/useQuizSession';

export type {
  ProblemCardProps,
  HintModalProps,
  ResultModalProps,
  QuizProgressBarProps,
  QuizTimerProps,
} from './ui/components/ProblemCard';