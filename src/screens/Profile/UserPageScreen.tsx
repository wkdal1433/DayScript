/**
 * UserPageScreen Component
 *
 * 사용자 프로필 페이지 메인 화면
 * 5개 섹션으로 구성된 모바일 최적화 레이아웃
 */

import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigationBar from '../../components/BottomNavigation/BottomNavigationBar';
import { UserSummaryHeader } from '../../components/Profile/UserSummaryHeader';
import { LearningInsights } from '../../components/Profile/LearningInsights';
import { MistakeNoteSection } from '../../components/Profile/MistakeNoteSection';
import { AchievementsSection } from '../../components/Profile/AchievementsSection';
import { BottomSection } from '../../components/Profile/BottomSection';
import { styles } from './UserPageScreen.styles';
import type { UserPageScreenProps } from './UserPageScreen.types';

const UserPageScreen: React.FC<UserPageScreenProps> = ({
  navigation,
  route,
  activeTab = 'Profile',
  onTabPress,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 1. User Summary Header */}
        <UserSummaryHeader />

        {/* 2. Learning Insights Section */}
        <LearningInsights />

        {/* 3. Mistake Note Section */}
        <MistakeNoteSection navigation={navigation} />

        {/* 4. Achievements Section */}
        <AchievementsSection />

        {/* 5. Bottom Section */}
        <BottomSection navigation={navigation} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar
        activeTab={activeTab}
        onTabPress={onTabPress}
      />
    </SafeAreaView>
  );
};

export default UserPageScreen;