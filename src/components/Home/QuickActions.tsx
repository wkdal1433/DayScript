import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgrammingLanguage, WeeklyStats } from '../../types/common';
import { styles } from '../../screens/Home/Home.styles';

interface QuickActionsProps {
  selectedLanguage: ProgrammingLanguage;
  onLanguageSelect: (language: ProgrammingLanguage) => void;
  onActionPress: (actionType: string) => void;
  weeklyStats: WeeklyStats;
  userLevel: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  selectedLanguage,
  onLanguageSelect,
  onActionPress,
  weeklyStats,
  userLevel,
}) => {
  const renderLanguageToggle = () => (
    <View style={styles.languageToggle}>
      {['Python', 'Java', 'C++'].map((language) => (
        <TouchableOpacity
          key={language}
          style={[
            styles.languageButton,
            selectedLanguage === language && styles.languageButtonActive,
          ]}
          onPress={() => onLanguageSelect(language as ProgrammingLanguage)}
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
        colors: ['#A7C7F9', '#A7C7F9'], // Figma blue gradient
        borderColor: '#ebeaeaff',
      },
      {
        id: 'grammar',
        emoji: '✍️',
        title: '문법 문제',
        subtitle: '',
        description: '기초 문법 학습',
        colors: ['#A6E3B0', '#A6E3B0'], // Figma green gradient
        borderColor: '#ebeaeaff',
      },
      {
        id: 'algorithm',
        emoji: '🧩',
        title: '알고리즘',
        subtitle: '퀴즈',
        description: '개념 정리',
        colors: ['#C7A4F9', '#C7A4F9'], // Figma purple gradient
        borderColor: '#ebeaeaff',
      },
      {
        id: 'new',
        emoji: '🆕',
        title: '새로운 유형',
        subtitle: '',
        description: '최신 트렌드',
        colors: ['#F6C177', '#F6C177'], // Figma orange gradient
        borderColor: '#ebeaeaff',
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
                marginBottom: index < 2 ? 1 : 0,
              }
            ]}
            onPress={() => onActionPress(button.id)}
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
            {/* <Text style={styles.actionButtonEmoji}>{button.emoji}</Text> */}
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
      <View style={styles.weeklyStatsHeader}>
        <Text style={styles.weeklyStatsTitle}>이번 주 학습 현황</Text>
        <View style={styles.userLevelContainer}>
          <Text style={styles.userLevelLabel}>당신의 단계는</Text>
          <Text style={styles.userLevelText}>{userLevel}</Text>
        </View>
      </View>
      <Text style={styles.weeklyStatsText}>Python 문제 해결률</Text>
      <View style={styles.statsProgressContainer}>
        <View style={styles.statsProgressBar}>
          <View style={[styles.statsProgressFill, { width: `${weeklyStats.accuracy}%` }]} />
        </View>
        <Text style={styles.weeklyStatsText}>70%</Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakLabel}>연속 학습</Text>
          <Text style={styles.streakValue}>5일</Text>
        </View>
      </View>
    </View>
  );

  const renderShortcutButton = () => (
    <TouchableOpacity
      style={styles.shortcutButton}
      onPress={() => onActionPress('shortcut')}
      activeOpacity={0.8}
    >
      <Text style={styles.shortcutButtonText}>챌린지 학습 바로가기</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.card, styles.quickActionCard]}>
      <Text style={styles.sectionTitle}>학습 퀵 액션</Text>
      {renderWeeklyStats()}
      <Text style={styles.langugeSelectText}>원하는 언어와 문제 유형을 선택하세요</Text>
      {renderLanguageToggle()}
      {renderActionButtons()}
      {renderShortcutButton()}
    </View>
  );
};

export default QuickActions;