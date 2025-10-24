import React, { useState } from 'react';
import {
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigationBar from '../../components/BottomNavigation';
import {
  TerminalHeader,
  TodayQuests,
  QuickActions,
  LearningStatus,
  Ranking
} from '../../components/Home';

import { HomeScreenProps } from './Home.types';
import { styles } from './Home.styles';
import { COLORS, SIZES } from '../../constants';
import { Quest, LearningStats, UserRanking, ProgrammingLanguage, WeeklyStats } from '../../types/common';

// 목업 데이터
const mockQuests: Quest[] = [
  { id: '1', title: '알고리즘 문제 1개 풀기', completed: false, progress: 0 },
  { id: '2', title: '문법 퀴즈 3개 완료', completed: true, progress: 100 },
  { id: '3', title: '라이브 코딩 1회 참여', completed: false, progress: 0 },
];

const mockLearningStats: LearningStats = {
  todayProgress: 75,
  totalProblems: 127,
  accuracy: 84,
  streakDays: 5,
};

const mockTopUsers: UserRanking[] = [
  { rank: 1, name: '김민수', score: 2847 },
  { rank: 2, name: '이지은', score: 2731 },
  { rank: 3, name: '박상우', score: 2645 },
];

const mockWeeklyStats: WeeklyStats = {
  language: 'Python',
  accuracy: 70,
  streakDays: 5,
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('Python');
  const [activeTab, setActiveTab] = useState('Home');
  const [headerShadowVisible, setHeaderShadowVisible] = useState(false);

  const handleQuestToggle = (questId: string) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId
          ? { ...quest, completed: !quest.completed, progress: quest.completed ? 0 : 100 }
          : quest
      )
    );
  };

  const handleActionPress = (actionType: string) => {
    console.log('Action pressed:', actionType);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    console.log('Tab pressed:', tab);
  };

  // TodayQuests 카드 높이 계산 (스크롤 임계점 설정용)
  const todayQuestCardHeight = SIZES.figma.todoCardHeight; // 180px

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // TodayQuests 카드에 도달한 시점부터 그림자 활성화
    const shouldShowShadow = scrollY > 0;
    setHeaderShadowVisible(shouldShowShadow);
  };














  return (
    <SafeAreaView style={styles.container}>
      <TerminalHeader showShadow={headerShadowVisible} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TodayQuests
          quests={quests}
          onQuestToggle={handleQuestToggle}
        />
        <QuickActions
          selectedLanguage={selectedLanguage}
          onLanguageSelect={setSelectedLanguage}
          onActionPress={handleActionPress}
          weeklyStats={mockWeeklyStats}
        />
        <LearningStatus
          learningStats={mockLearningStats}
        />
        <Ranking
          topUsers={mockTopUsers}
        />
      </ScrollView>
      <BottomNavigationBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;