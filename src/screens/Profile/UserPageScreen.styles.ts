/**
 * UserPageScreen Styles
 *
 * 사용자 프로필 페이지 스타일 정의
 */

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // BottomNavigationBar 여백
  },
});