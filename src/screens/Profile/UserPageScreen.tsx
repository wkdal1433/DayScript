/**
 * UserPageScreen Component
 *
 * 사용자 프로필 페이지 메인 화면
 * 5개 섹션으로 구성된 모바일 최적화 레이아웃
 */

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigationBar from '../../components/BottomNavigation/BottomNavigationBar';
import { TerminalHeader } from '../../components/Home';
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
  const [showAchievements, setShowAchievements] = useState(false);

  const handleProfileClick = () => {
    setShowAchievements(!showAchievements);
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed - Connect to TerminalHeader settings');
    // TODO: TerminalHeader 설정 버튼과 연결
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
    // TODO: 알림 처리
  };

  return (
    <View style={styles.container}>
      {/* Terminal Header (HomeScreen과 동일) */}
      <View style={styles.headerContainer}>
        <SafeAreaView style={styles.headerContentContainer}>
          <TerminalHeader />
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* 1. User Summary Header */}
        <View style={styles.sectionContainer}>
          <UserSummaryHeader
            onProfileClick={handleProfileClick}
          />
        </View>

        {/* 2. Learning Insights Section */}
        <View style={styles.sectionContainer}>
          <LearningInsights />
        </View>

        {/* 3. Mistake Note Section (3개 제한) */}
        <View style={styles.sectionContainer}>
          <MistakeNoteSection
            navigation={navigation}
            limitItems={3}
          />
        </View>

        {/* 4. Achievements Section (조건부 표시) */}
        {showAchievements && (
          <View style={styles.sectionContainer}>
            <AchievementsSection />
          </View>
        )}

        {/* 5. Bottom Section (설정 제거) */}
        <View style={styles.sectionContainer}>
          <BottomSection navigation={navigation} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar
        activeTab={activeTab}
        onTabPress={onTabPress}
      />
    </View>
  );
};

export default UserPageScreen;