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
import { DifficultySelectionModal, DifficultyLevel } from '../../components/Modals';
import Lv1OXProblemScreen from '../Practice/Lv1OXProblemScreen';
import Lv2MultipleChoiceProblemScreen from '../Practice/Lv2MultipleChoiceProblemScreen';

import { HomeScreenProps } from './Home.types';
import { styles } from './Home.styles';
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

const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation: _navigation,
  activeTab: externalActiveTab,
  onTabPress: externalOnTabPress
}) => {
  const [quests, setQuests] = useState<Quest[]>(mockQuests);
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('Python');
  const [internalActiveTab, setInternalActiveTab] = useState('Home');
  const [isDifficultyModalVisible, setIsDifficultyModalVisible] = useState(false);
  const [showProblemScreen, setShowProblemScreen] = useState(false);
  const [currentProblemType, setCurrentProblemType] = useState<'OX' | 'MultipleChoice'>('OX');

  // Use external activeTab if provided, otherwise use internal state
  const activeTab = externalActiveTab || internalActiveTab;
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

    // Handle shortcut button press - show difficulty selection modal
    if (actionType === 'shortcut') {
      setIsDifficultyModalVisible(true);
    }
  };

  const handleTabPress = (tab: string) => {
    if (externalOnTabPress) {
      externalOnTabPress(tab);
    } else {
      setInternalActiveTab(tab);
      console.log('Tab pressed:', tab);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // TodayQuests 카드에 도달한 시점부터 그림자 활성화
    const shouldShowShadow = scrollY > 0;
    setHeaderShadowVisible(shouldShowShadow);
  };

  const handleModalClose = () => {
    setIsDifficultyModalVisible(false);
  };

  const handleLevelSelect = (level: DifficultyLevel) => {
    console.log('Selected difficulty level:', level);
    setIsDifficultyModalVisible(false);

    // Navigate to problem screen based on difficulty level
    if (level === '입문') {
      // Randomly select between OX and Multiple Choice for variety
      const problemTypes: ('OX' | 'MultipleChoice')[] = ['OX', 'MultipleChoice'];
      const randomType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
      setCurrentProblemType(randomType);
      setShowProblemScreen(true);
    }
    // TODO: Add navigation for other difficulty levels
  };

  const handleProblemScreenClose = () => {
    setShowProblemScreen(false);
  };

  const handleAnswerSelect = (answer: 'O' | 'X' | 'A' | 'B' | 'C' | 'D') => {
    console.log('Answer selected:', answer);
    // TODO: Handle answer processing
  };

  const handleNextProblem = () => {
    console.log('Moving to next problem');
    // TODO: Load next problem or complete session
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
          userLevel="입문"
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

      {/* Difficulty Selection Modal */}
      <DifficultySelectionModal
        isVisible={isDifficultyModalVisible}
        onClose={handleModalClose}
        onSelectLevel={handleLevelSelect}
        selectedLanguage={selectedLanguage}
      />

      {/* Problem Screen (conditionally rendered) */}
      {showProblemScreen && currentProblemType === 'OX' && (
        <Lv1OXProblemScreen
          onAnswerSelect={handleAnswerSelect}
          onClose={handleProblemScreenClose}
          onNext={handleNextProblem}
          currentProblem={1}
          totalProblems={10}
          timeRemaining={30}
        />
      )}

      {showProblemScreen && currentProblemType === 'MultipleChoice' && (
        <Lv2MultipleChoiceProblemScreen
          onAnswerSelect={handleAnswerSelect}
          onClose={handleProblemScreenClose}
          onNext={handleNextProblem}
          currentProblem={2}
          totalProblems={10}
          timeRemaining={30}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;