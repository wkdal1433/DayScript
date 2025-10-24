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
}

const QuickActions: React.FC<QuickActionsProps> = ({
  selectedLanguage,
  onLanguageSelect,
  onActionPress,
  weeklyStats,
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

  return (
    <View style={[styles.card, styles.quickActionCard]}>
      <Text style={styles.sectionTitle}>학습 퀵 액션</Text>
      <Text style={styles.weeklyStatsText}>원하는 언어와 문제 유형을 선택하세요</Text>
      {renderLanguageToggle()}
      {renderActionButtons()}
      {renderWeeklyStats()}
    </View>
  );
};

export default QuickActions;