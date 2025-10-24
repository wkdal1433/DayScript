import { ScreenProps, Quest, LearningStats, UserRanking, ProgrammingLanguage, WeeklyStats } from '../../types/common';

export interface HomeScreenProps extends ScreenProps {}

export interface TodayQuestProps {
  quests: Quest[];
  onQuestToggle: (questId: string) => void;
}

export interface TerminalHeaderProps {
  appName: string;
}

export interface LearningQuickActionProps {
  selectedLanguage: ProgrammingLanguage;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  onActionPress: (actionType: string) => void;
  weeklyStats: WeeklyStats;
}

export interface LearningStatusProps {
  stats: LearningStats;
}

export interface RankingProps {
  currentUserRank: string;
  topUsers: UserRanking[];
  onViewMore: () => void;
}

export interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}