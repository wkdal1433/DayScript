/**
 * BottomSection Component
 *
 * 하단 섹션 - 설정 및 로그아웃
 * 설정 리스트와 로그아웃 버튼 포함
 */

import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from './BottomSection.styles';

interface BottomSectionProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const SettingItem: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
}> = ({ icon, title, subtitle, onPress, showArrow = true }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingContent}>
      <View style={styles.settingIconContainer}>
        <Text style={styles.settingIcon}>{icon}</Text>
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    {showArrow && (
      <Text style={styles.settingArrow}>›</Text>
    )}
  </TouchableOpacity>
);

export const BottomSection: React.FC<BottomSectionProps> = ({ navigation }) => {
  // 설정 관련 함수들 제거 - TerminalHeader 설정 버튼으로 이동

  const handlePrivacyPolicy = () => {
    console.log('Navigate to privacy policy');
    Alert.alert('개인정보처리방침', '개인정보처리방침 화면으로 이동합니다.');
  };

  const handleTermsOfService = () => {
    console.log('Navigate to terms of service');
    Alert.alert('서비스 이용약관', '서비스 이용약관 화면으로 이동합니다.');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말로 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            console.log('Logout confirmed');
            // 실제 로그아웃 로직 처리
            Alert.alert('로그아웃 완료', '로그아웃되었습니다.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 설정 섹션 제거 - TerminalHeader 설정 버튼을 통해 접근 */}

      {/* 약관 및 정책 섹션 */}
      <View style={styles.legalContainer}>
        <Text style={styles.sectionTitle}>약관 및 정책</Text>

        <View style={styles.settingsList}>
          <SettingItem
            icon="🔒"
            title="개인정보처리방침"
            onPress={handlePrivacyPolicy}
          />

          <SettingItem
            icon="📋"
            title="서비스 이용약관"
            onPress={handleTermsOfService}
          />
        </View>
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      {/* 앱 버전 정보 */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>DayScript v1.0.0</Text>
      </View>
    </View>
  );
};