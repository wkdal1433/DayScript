/**
 * DayScript React Native App
 * 코딩 테스트 학습 앱
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/Home/HomeScreen';

function App() {
  // 임시 네비게이션 객체 (React Navigation 없이 테스트용)
  const mockNavigation = {
    navigate: (screen: string) => console.log('Navigate to:', screen),
    goBack: () => console.log('Go back'),
    push: (screen: string) => console.log('Push:', screen),
    replace: (screen: string) => console.log('Replace:', screen),
  };

  const mockRoute = {
    key: 'HomeScreen',
    name: 'Home',
    params: {},
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FCE7F3" />
      <HomeScreen navigation={mockNavigation} route={mockRoute} />
    </SafeAreaProvider>
  );
}

export default App;
