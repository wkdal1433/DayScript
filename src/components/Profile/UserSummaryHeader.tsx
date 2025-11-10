/**
 * UserSummaryHeader Component
 *
 * 사용자 요약 헤더 섹션
 * 프로필 이미지, 레벨, 연속 학습 일수, 경험치 프로그레스 바 표시
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './UserSummaryHeader.styles';
import type { UserProfile } from '../../screens/Profile/UserPageScreen.types';

// 더미 데이터
const MOCK_USER_DATA: UserProfile = {
  id: 'user_001',
  name: '코딩왕자',
  level: 42,
  currentExp: 3750,
  maxExp: 5000,
  streakDays: 15,
  profileImage: undefined, // 목업용으로 undefined 사용
};

export const UserSummaryHeader: React.FC = () => {
  const { name, level, currentExp, maxExp, streakDays } = MOCK_USER_DATA;
  const expPercentage = (currentExp / maxExp) * 100;

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImagePlaceholder}>
            <Text style={styles.profileImageText}>👨‍💻</Text>
          </View>

          {/* Level Badge */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{level}</Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.streakText}>연속 학습 {streakDays}일차 🔥</Text>
        </View>
      </View>

      {/* Experience Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>경험치</Text>
        <Text style={styles.progressText}>{currentExp} / {maxExp} XP</Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={['#FDCEDF', '#F2BED1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${expPercentage}%` }]}
            />
          </View>
        </View>

        <Text style={styles.progressPercentage}>{Math.round(expPercentage)}%</Text>
      </View>
    </View>
  );
};