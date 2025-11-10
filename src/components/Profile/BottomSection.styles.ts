/**
 * BottomSection Styles
 *
 * 하단 섹션 스타일 정의
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 40,
  },

  // 섹션 제목
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  // 설정 컨테이너
  settingsContainer: {
    marginBottom: 32,
  },
  legalContainer: {
    marginBottom: 32,
  },
  settingsList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // 설정 아이템
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingIcon: {
    fontSize: 18,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  settingArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
    fontWeight: '300',
  },

  // 로그아웃 버튼
  logoutButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE4E4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E57373', // 요구사항의 붉은 텍스트 색상
  },

  // 버전 정보
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});