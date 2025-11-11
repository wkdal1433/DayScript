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
import VibeSessionScreen from '../screens/Practice/Challenger/VibeSessionScreen';
import PRInboxScreen from '../screens/Practice/Challenger/PRInboxScreen';
import DiffHunkScreen from '../screens/Practice/Challenger/DiffHunkScreen';
import UserPageScreen from '../screens/Profile/UserPageScreen';

// Community module integration
import {
  CommunityHomeScreen,
  ProblemDiscussionScreen,
  CreatePostScreen,
  PostDetailScreen
} from '../modules/community';

// New modular quiz screens
import { Lv1OXProblemScreen } from '../modules/quiz';

// Navigation bridge for smooth integration
import { resolveNavigation, transformNavigationParams } from './ModuleNavigationBridge';

// 네비게이션 타입 정의
export type TabName = 'Home' | 'Practice' | 'Community' | 'Profile';
export type ScreenName = TabName | 'OXProblem' | 'MultipleChoiceProblem' | 'FillInBlankProblem' | 'DebuggingProblem' | 'VibeSession' | 'PRInbox' | 'CodeReviewDiff' | 'Lv1OXProblem' | 'ProblemDiscussion' | 'CreatePost' | 'PostDetail';

interface AppNavigatorProps {}

const AppNavigator: React.FC<AppNavigatorProps> = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Home');
  const [previousScreen, setPreviousScreen] = useState<ScreenName>('Home');
  const [routeParams, setRouteParams] = useState<any>({});

  // Enhanced navigation object with problem screen support and module bridge integration
  const mockNavigation = {
    navigate: (screen: string, params?: any) => {
      // Use navigation bridge to resolve screen
      const resolvedScreen = resolveNavigation(screen as ScreenName);
      const transformedParams = transformNavigationParams(screen as ScreenName, params);

      console.log('Navigate to:', resolvedScreen, 'with params:', transformedParams);
      console.log('Original screen:', screen, '→ Resolved screen:', resolvedScreen);

      // Track previous screen for proper return navigation
      setPreviousScreen(currentScreen);
      setCurrentScreen(resolvedScreen);
      setRouteParams(transformedParams || {});

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
    params: routeParams,
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
        return (
          <CommunityHomeScreen
            navigation={mockNavigation}
            route={{ ...mockRoute, name: 'Community' }}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        );
      case 'Profile':
        return (
          <UserPageScreen
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
      case 'Lv1OXProblem':
        return (
          <Lv1OXProblemScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                level: 1,
                quizId: 'lv1_ox_001',
                returnRoute: 'Practice',
              },
            }}
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
      case 'VibeSession':
        return (
          <VibeSessionScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                problemId: 'vibe_problem_001',
                sessionId: 'session_' + Date.now(),
                difficulty: 'hard',
                timeLimit: 1800, // 30분
                returnRoute: previousScreen, // 이전 화면으로 돌아가기
              },
            }}
          />
        );
      case 'PRInbox':
        return (
          <PRInboxScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                sessionId: 'session_' + Date.now(),
                scenarioId: 'pr_scenario_001',
                difficulty: 'hard',
                timeLimit: 1800, // 30분
                returnRoute: previousScreen, // 이전 화면으로 돌아가기
              },
            }}
          />
        );
      case 'CodeReviewDiff':
        return (
          <DiffHunkScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                sessionId: 'code_review_session_' + Date.now(),
                commitHash: 'abc123def456',
                fileIndex: 0,
                fileName: 'src/components/UserValidation.js',
                returnRoute: 'PRInbox',
                totalFiles: 3,
                currentFileIndex: 0,
              },
            }}
          />
        );
      case 'ProblemDiscussion':
        return (
          <ProblemDiscussionScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                problemId: routeParams.problemId || 'default_problem_id',
                problemTitle: routeParams.problemTitle || 'Sample Problem',
                ...routeParams,
              },
            }}
          />
        );
      case 'CreatePost':
        return (
          <CreatePostScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                problemId: routeParams.problemId,
                category: routeParams.category || 'problems',
                problemTitle: routeParams.problemTitle,
                ...routeParams,
              },
            }}
          />
        );
      case 'PostDetail':
        return (
          <PostDetailScreen
            navigation={mockNavigation}
            route={{
              ...mockRoute,
              params: {
                postId: routeParams.postId || 'default_post_id',
                ...routeParams,
              },
            }}
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