/**
 * AchievementsSection Component
 *
 * 성취/배지 섹션
 * 획득/잠금 상태를 구분하는 배지 리스트와 성취 요약 포함
 */

import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { styles } from './AchievementsSection.styles';
import type { Achievement } from '../../screens/Profile/UserPageScreen.types';

// 더미 데이터
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'achievement_001',
    title: '첫 걸음',
    description: '첫 번째 문제를 해결했습니다',
    isUnlocked: true,
    icon: '🎯',
    unlockedAt: '2024-10-15',
  },
  {
    id: 'achievement_002',
    title: '연속 학습자',
    description: '7일 연속으로 학습했습니다',
    isUnlocked: true,
    icon: '🔥',
    unlockedAt: '2024-10-22',
  },
  {
    id: 'achievement_003',
    title: '백문제 달성',
    description: '100개의 문제를 해결했습니다',
    isUnlocked: true,
    icon: '💯',
    unlockedAt: '2024-11-01',
  },
  {
    id: 'achievement_004',
    title: '완벽주의자',
    description: '정답률 95% 이상 달성',
    isUnlocked: false,
    icon: '⭐',
  },
  {
    id: 'achievement_005',
    title: '시간 관리 마스터',
    description: '모든 문제를 제한시간 내에 해결',
    isUnlocked: false,
    icon: '⏰',
  },
  {
    id: 'achievement_006',
    title: '디버깅 킹',
    description: 'LV4 디버깅 모드 10회 연속 성공',
    isUnlocked: false,
    icon: '👑',
  },
];

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <View style={[
    styles.achievementCard,
    !achievement.isUnlocked && styles.achievementCardLocked,
  ]}>
    <View style={[
      styles.iconContainer,
      !achievement.isUnlocked && styles.iconContainerLocked,
    ]}>
      <Text style={[
        styles.iconText,
        !achievement.isUnlocked && styles.iconTextLocked,
      ]}>
        {achievement.isUnlocked ? achievement.icon : '🔒'}
      </Text>
    </View>

    <View style={styles.achievementContent}>
      <Text style={[
        styles.achievementTitle,
        !achievement.isUnlocked && styles.achievementTitleLocked,
      ]}>
        {achievement.title}
      </Text>
      <Text style={styles.achievementDescription}>
        {achievement.description}
      </Text>
      {achievement.isUnlocked && achievement.unlockedAt && (
        <Text style={styles.unlockedDate}>
          달성일: {achievement.unlockedAt}
        </Text>
      )}
    </View>

    {achievement.isUnlocked && (
      <View style={styles.unlockedBadge}>
        <Text style={styles.unlockedText}>달성</Text>
      </View>
    )}
  </View>
);

export const AchievementsSection: React.FC = () => {
  const unlockedCount = MOCK_ACHIEVEMENTS.filter(achievement => achievement.isUnlocked).length;
  const totalCount = MOCK_ACHIEVEMENTS.length;

  return (
    <View style={styles.container}>
      {/* 섹션 제목 및 요약 */}
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>성과 및 배지</Text>
        <Text style={styles.achievementSummary}>
          {unlockedCount} / {totalCount} 달성
        </Text>
      </View>

      {/* 진행률 표시 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / totalCount) * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((unlockedCount / totalCount) * 100)}% 완료
        </Text>
      </View>

      {/* 배지 리스트 */}
      <FlatList
        data={MOCK_ACHIEVEMENTS}
        renderItem={({ item }) => <AchievementCard achievement={item} />}
        keyExtractor={item => item.id}
        scrollEnabled={false} // 외부 ScrollView 사용
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};