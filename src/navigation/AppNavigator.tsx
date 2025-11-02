/**
 * AppNavigator Component
 *
 * 메인 네비게이션 시스템
 * BottomNavigationBar와 연동하여 화면 전환을 관리
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '../screens/Home/HomeScreen';
import PracticeScreen from '../screens/Practice/PracticeScreen';
import PracticeContainer from '../screens/Practice/PracticeContainer';

// 네비게이션 타입 정의
export type TabName = 'Home' | 'Practice' | 'Community' | 'Profile';
export type ScreenName = TabName | 'OXProblem' | 'MultipleChoiceProblem' | 'FillInBlankProblem' | 'DebuggingProblem';

interface AppNavigatorProps {}

const AppNavigator: React.FC<AppNavigatorProps> = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');

  // Enhanced navigation object with problem screen support
  const mockNavigation = {
    navigate: (screen: string, params?: any) => {
      console.log('Navigate to:', screen, params);
      setCurrentScreen(screen as ScreenName);

      // Update activeTab for tab screens
      if (screen === 'Home' || screen === 'Practice' || screen === 'Community' || screen === 'Profile') {
        setActiveTab(screen as TabName);
      }
    },
    goBack: () => {
      console.log('Go back');
      // Return to the current active tab
      setCurrentScreen(activeTab);
    },
    push: (screen: string, params?: any) => {
      console.log('Push:', screen, params);
      setCurrentScreen(screen as ScreenName);
    },
    replace: (screen: string, params?: any) => {
      console.log('Replace:', screen, params);
      setCurrentScreen(screen as ScreenName);
    },
  };

  const mockRoute = {
    key: currentScreen,
    name: currentScreen,
    params: {},
  };

  // 탭 전환 핸들러
  const handleTabPress = (tab: string) => {
    setActiveTab(tab as TabName);
    setCurrentScreen(tab as ScreenName);
    console.log('Tab switched to:', tab);
  };

  // 문제 선택 핸들러 (Practice screen)
  const handleProblemPress = (problemId: string) => {
    console.log('Problem selected:', problemId);
    // 향후 문제 상세 화면으로 네비게이션 추가 가능
  };

  // 현재 활성화된 화면 렌더링
  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return (
          <HomeScreen
            navigation={mockNavigation}
            route={mockRoute}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      case 'Practice':
        return (
          <PracticeScreen
            onProblemPress={handleProblemPress}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      case 'Community':
        // 향후 Community 화면 구현
        return (
          <HomeScreen
            navigation={mockNavigation}
            route={{ ...mockRoute, name: 'Community' }}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      case 'Profile':
        // 향후 Profile 화면 구현
        return (
          <HomeScreen
            navigation={mockNavigation}
            route={{ ...mockRoute, name: 'Profile' }}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      case 'OXProblem':
        return (
          <PracticeContainer
            navigation={mockNavigation}
            route={mockRoute}
            problemType="OX"
          />
        );
      case 'MultipleChoiceProblem':
        return (
          <PracticeContainer
            navigation={mockNavigation}
            route={mockRoute}
            problemType="MULTIPLE_CHOICE"
          />
        );
      case 'FillInBlankProblem':
        return (
          <PracticeContainer
            navigation={mockNavigation}
            route={mockRoute}
            problemType="FILL_IN_BLANK"
          />
        );
      case 'DebuggingProblem':
        return (
          <PracticeContainer
            navigation={mockNavigation}
            route={mockRoute}
            problemType="DEBUGGING"
          />
        );
      default:
        return (
          <HomeScreen
            navigation={mockNavigation}
            route={mockRoute}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FCE7F3" />
      {renderActiveScreen()}
    </SafeAreaProvider>
  );
};

export default AppNavigator;