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
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FCE7F3" />
      <HomeScreen navigation={{}} route={{}} />
    </SafeAreaProvider>
  );
}

export default App;
