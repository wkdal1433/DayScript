import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Circle } from 'react-native-progress';

import { HomeScreenProps } from './Home.types';
import { styles } from './Home.styles';
import { COLORS } from '../../constants';
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

  const renderTerminalHeader = () => (
    <View style={styles.terminalHeader}>
      <Text style={styles.terminalText}>user@system:~$</Text>
      <Text style={styles.appName}>DayScript</Text>
      <View style={styles.cursor} />
    </View>
  );

  const renderTodayQuests = () => (
    <View style={[styles.card, styles.todayQuestCard]}>
      <Text style={styles.sectionTitle}>오늘의 할일</Text>
      {quests.map((quest, index) => (
        <TouchableOpacity
          key={quest.id}
          style={[
            styles.questItem,
            { marginBottom: index === quests.length - 1 ? 0 : 10 } // Figma 정확 간격
          ]}
          onPress={() => handleQuestToggle(quest.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, quest.completed && styles.checkboxCompleted]}>
            {quest.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[styles.questText, { flex: 1 }]}>{quest.title}</Text>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: quest.progress ? `${quest.progress}%` : '0%',
                  backgroundColor: quest.completed ? '#F2BED1' : '#8B5CF6' // Figma gradient colors
                }
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLanguageToggle = () => (
    <View style={styles.languageToggle}>
      {['Python', 'Java', 'C++'].map((language) => (
        <TouchableOpacity
          key={language}
          style={[
            styles.languageButton,
            selectedLanguage === language && styles.languageButtonActive,
          ]}
          onPress={() => setSelectedLanguage(language as ProgrammingLanguage)}
        >
          <Text
            style={[
              styles.languageButtonText,
              selectedLanguage === language && styles.languageButtonTextActive,
            ]}
          >
            {language}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderActionButtons = () => {
    const actionButtons = [
      {
        id: 'coding',
        emoji: '💻',
        title: '코딩테스트',
        subtitle: '문제',
        description: '실전 문제 풀이',
        colors: ['#3B82F6', '#1D4ED8'], // Figma blue gradient
        borderColor: '#3B82F6',
      },
      {
        id: 'grammar',
        emoji: '✍️',
        title: '문법 문제',
        subtitle: '',
        description: '기초 문법 학습',
        colors: ['#10B981', '#047857'], // Figma green gradient
        borderColor: '#10B981',
      },
      {
        id: 'algorithm',
        emoji: '🧩',
        title: '알고리즘',
        subtitle: '퀴즈',
        description: '개념 정리',
        colors: ['#8B5CF6', '#7C3AED'], // Figma purple gradient
        borderColor: '#8B5CF6',
      },
      {
        id: 'new',
        emoji: '🆕',
        title: '새로운 유형',
        subtitle: '',
        description: '최신 트렌드',
        colors: ['#F59E0B', '#D97706'], // Figma orange gradient
        borderColor: '#F59E0B',
      },
    ];

    return (
      <View style={styles.actionButtonsContainer}>
        {actionButtons.map((button, index) => (
          <TouchableOpacity
            key={button.id}
            style={[
              styles.actionButton,
              { borderColor: button.borderColor },
              // Figma 2x2 그리드 레이아웃
              {
                marginRight: index % 2 === 0 ? 10 : 0,
                marginBottom: index < 2 ? 10 : 0,
              }
            ]}
            onPress={() => handleActionPress(button.id)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={button.colors}
              style={[
                styles.actionButton,
                {
                  borderWidth: 0,
                  margin: 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <Text style={styles.actionButtonEmoji}>{button.emoji}</Text>
            <View style={{ alignItems: 'center', zIndex: 1 }}>
              <Text style={styles.actionButtonTitle}>{button.title}</Text>
              {button.subtitle && <Text style={styles.actionButtonTitle}>{button.subtitle}</Text>}
            </View>
            <Text style={styles.actionButtonSubtitle}>{button.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderWeeklyStats = () => (
    <View style={styles.weeklyStatsContainer}>
      <Text style={styles.weeklyStatsTitle}>이번 주 학습 현황</Text>
      <Text style={styles.weeklyStatsText}>Python 문제 해결률</Text>
      <View style={styles.statsProgressContainer}>
        <View style={styles.statsProgressBar}>
          <View style={[styles.statsProgressFill, { width: `${mockWeeklyStats.accuracy}%` }]} />
        </View>
        <Text style={styles.weeklyStatsText}>70%</Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakLabel}>연속 학습</Text>
          <Text style={styles.streakValue}>5일</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={[styles.card, styles.quickActionCard]}>
      <Text style={styles.sectionTitle}>학습 퀵 액션</Text>
      <Text style={styles.weeklyStatsText}>원하는 언어와 문제 유형을 선택하세요</Text>
      {renderLanguageToggle()}
      {renderActionButtons()}
      {renderWeeklyStats()}
    </View>
  );

  const renderLearningStatus = () => (
    <View style={[styles.card, styles.learningStatusCard]}>
      <Text style={styles.sectionTitle}> 내 학습 현황</Text>
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircle}>
          <Circle
            size={64}
            progress={mockLearningStats.todayProgress / 100}
            thickness={6}
            color="#F2BED1" // Figma progress color
            unfilledColor="rgba(229, 231, 235, 0.3)" // Figma unfilled color
            borderWidth={0}
            showsText={false}
            strokeCap="round" // Figma 스타일 매칭
          />
          <View style={{ position: 'absolute' }}>
            <Text style={styles.progressPercentage}>{mockLearningStats.todayProgress}%</Text>
          </View>
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressLabel}>오늘 학습 진도</Text>
          <Text style={styles.progressDescription}>목표의 75% 완료! 👏</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{mockLearningStats.totalProblems}</Text>
          <Text style={styles.statLabel}>누적 학습량</Text>
          <Text style={styles.statDescription}>문제 해결</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{mockLearningStats.accuracy}%</Text>
          <Text style={styles.statLabel}>정답률</Text>
          <Text style={styles.statDescription}>평균 정답률</Text>
        </View>
      </View>
    </View>
  );

  const renderRanking = () => (
    <View style={[styles.card, styles.rankingCard]}>
      <Text style={styles.rankingTitle}>🏆 이번 주 당신은 Top 12% 🚀</Text>
      <View style={styles.rankingList}>
        {mockTopUsers.map((user) => (
          <View key={user.rank} style={styles.rankingItem}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{user.rank}</Text>
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{user.name}</Text>
              <Text style={styles.rankScore}>{user.score.toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreButtonText}>더보기</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBottomNavigation = () => (
    <View style={styles.bottomNavigation}>
      {['Home', 'Practice', 'Community', 'Profile'].map((tab) => (
        <TouchableOpacity
          key={tab}
          style={styles.navItem}
          onPress={() => handleTabPress(tab)}
        >
          <View style={styles.navIcon} />
          <Text style={styles.navLabel}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {renderTerminalHeader()}
        {renderTodayQuests()}
        {renderQuickActions()}
        {renderLearningStatus()}
        {renderRanking()}
      </ScrollView>
      {renderBottomNavigation()}
    </SafeAreaView>
  );
};

export default HomeScreen;