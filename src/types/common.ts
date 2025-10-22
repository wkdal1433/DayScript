// 퀘스트/할일 타입
export interface Quest {
  id: string;
  title: string;
  completed: boolean;
  progress?: number; // 0-100
}

// 학습 통계 타입
export interface LearningStats {
  todayProgress: number; // 0-100
  totalProblems: number;
  accuracy: number; // 0-100
  streakDays: number;
}

// 사용자 랭킹 타입
export interface UserRanking {
  rank: number;
  name: string;
  score: number;
}

// 프로그래밍 언어 타입
export type ProgrammingLanguage = 'Python' | 'Java' | 'C++';

// 문제 유형 타입
export type ProblemType = 'coding' | 'grammar' | 'algorithm' | 'new';

// 액션 버튼 타입
export interface ActionButton {
  id: string;
  type: ProblemType;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  gradientColors: [string, string];
  borderColor: string;
}

// 주간 학습 현황 타입
export interface WeeklyStats {
  language: ProgrammingLanguage;
  accuracy: number; // 0-100
  streakDays: number;
}

// 네비게이션 탭 타입
export type NavigationTab = 'Home' | 'Practice' | 'Community' | 'Profile';

// 화면 Props 타입들
export interface ScreenProps {
  navigation: any; // React Navigation 타입
  route: any;
}