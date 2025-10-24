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
import Svg, { Path } from 'react-native-svg';

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

  const BellIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
        stroke="#F2BED1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const SettingsIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.7389 4.5808 13.8642 4.82578 14.0407 5.032C14.2172 5.23822 14.4399 5.39985 14.6907 5.50375C14.9414 5.60764 15.2132 5.65085 15.4838 5.62987C15.7544 5.60889 16.0162 5.5243 16.248 5.383C17.791 4.443 19.558 6.209 18.618 7.753C18.4769 7.98466 18.3924 8.24634 18.3715 8.51677C18.3506 8.78721 18.3938 9.05877 18.4975 9.30938C18.6013 9.55999 18.7627 9.78258 18.9687 9.95905C19.1747 10.1355 19.4194 10.2609 19.683 10.325C21.439 10.751 21.439 13.249 19.683 13.675C19.4192 13.7389 19.1742 13.8642 18.968 14.0407C18.7618 14.2172 18.6001 14.4399 18.4963 14.6907C18.3924 14.9414 18.3491 15.2132 18.3701 15.4838C18.3911 15.7544 18.4757 16.0162 18.617 16.248C19.557 17.791 17.791 19.558 16.247 18.618C16.0153 18.4769 15.7537 18.3924 15.4832 18.3715C15.2128 18.3506 14.9412 18.3938 14.6906 18.4975C14.44 18.6013 14.2174 18.7627 14.0409 18.9687C13.8645 19.1747 13.7391 19.4194 13.675 19.683C13.249 21.439 10.751 21.439 10.325 19.683C10.2611 19.4192 10.1358 19.1742 9.95929 18.968C9.7828 18.7618 9.56011 18.6001 9.30935 18.4963C9.05859 18.3924 8.78683 18.3491 8.51621 18.3701C8.24559 18.3911 7.98375 18.4757 7.752 18.617C6.209 19.557 4.442 17.791 5.382 16.247C5.5231 16.0153 5.60755 15.7537 5.62848 15.4832C5.64942 15.2128 5.60624 14.9412 5.50247 14.6906C5.3987 14.44 5.23726 14.2174 5.03127 14.0409C4.82529 13.8645 4.58056 13.7391 4.317 13.675C2.561 13.249 2.561 10.751 4.317 10.325C4.5808 10.2611 4.82578 10.1358 5.032 9.95929C5.23822 9.7828 5.39985 9.56011 5.50375 9.30935C5.60764 9.05859 5.65085 8.78683 5.62987 8.51621C5.60889 8.24559 5.5243 7.98375 5.383 7.752C4.443 6.209 6.209 4.442 7.753 5.382C7.98466 5.5231 8.24634 5.60755 8.51677 5.62848C8.78721 5.64942 9.05877 5.60624 9.30938 5.50247C9.55999 5.3987 9.78258 5.23726 9.95905 5.03127C10.1355 4.82529 10.2609 4.58056 10.325 4.317Z"
        stroke="#F2BED1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="#F2BED1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const renderTerminalHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.terminalHeader}>
        <Text style={styles.terminalText}>user@system~$</Text>
        <Text style={styles.appName}>DayScript</Text>
        <Text style={styles.terminalText}>|</Text>
      </View>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log('Alarm pressed')}>
          <BellIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={() => console.log('Settings pressed')}>
          <SettingsIcon />
        </TouchableOpacity>
      </View>
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



  const getNavIcon = (tab: string, isActive: boolean) => {
    const iconColor = isActive ? COLORS.white : '#F2BED1';

    switch (tab) {
      case 'Home':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12H15V22"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'Practice':
        return (
          <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path
              d="M13.5 15.75C14.7426 15.75 15.75 14.7426 15.75 13.5C15.75 12.2574 14.7426 11.25 13.5 11.25C12.2574 11.25 11.25 12.2574 11.25 13.5C11.25 14.7426 12.2574 15.75 13.5 15.75Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M4.5 6.75C5.74264 6.75 6.75 5.74264 6.75 4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9.75 4.5H12C12.3978 4.5 12.7794 4.65804 13.0607 4.93934C13.342 5.22064 13.5 5.60218 13.5 6V11.25"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M4.5 6.75V15.75"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'Community':
        return (
          <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <Path
              d="M15.75 11.25C15.75 11.6478 15.592 12.0294 15.3107 12.3107C15.0294 12.592 14.6478 12.75 14.25 12.75H5.25L2.25 15.75V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H14.25C14.6478 2.25 15.0294 2.40804 15.3107 2.68934C15.592 2.97064 15.75 3.35218 15.75 3.75V11.25Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      case 'Profile':
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return (
          <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M9 22V12H15V22"
              stroke={iconColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
    }
  };

  const renderBottomNavigation = () => (
    <View style={styles.bottomNavigation}>
      {['Home', 'Practice', 'Community', 'Profile'].map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.navButton,
              isActive && styles.navButtonActive,
            ]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            {getNavIcon(tab, isActive)}
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
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