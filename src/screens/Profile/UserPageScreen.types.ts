/**
 * UserPageScreen Types
 *
 * 사용자 프로필 페이지 타입 정의
 */

export interface UserPageScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    push: (screen: string, params?: any) => void;
    replace: (screen: string, params?: any) => void;
  };
  route: {
    key: string;
    name: string;
    params?: any;
  };
  activeTab?: 'Home' | 'Practice' | 'Community' | 'Profile';
  onTabPress?: (tab: string) => void;
}

// 사용자 데이터 타입
export interface UserProfile {
  id: string;
  name: string;
  level: number;
  currentExp: number;
  maxExp: number;
  streakDays: number;
  profileImage?: string;
}

// 학습 통계 타입
export interface LearningStats {
  totalProblems: number;
  totalHours: number;
  averageAccuracy: number;
  weeklyData: WeeklyLearningData[];
}

export interface WeeklyLearningData {
  date: string;
  problemsSolved: number;
}

// 오답노트 타입
export interface MistakeNote {
  id: string;
  level: number;
  problemType: 'OX' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'DEBUGGING' | 'CODE_REVIEW';
  title: string;
  wrongCount: number;
  lastAttempt: string;
  description: string;
}

// 성취/배지 타입
export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  icon: string;
  unlockedAt?: string;
}