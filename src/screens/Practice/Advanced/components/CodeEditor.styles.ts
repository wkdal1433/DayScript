import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { FONTS } from '../../../../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8E8EE', // 코드 블록 배경색 (디자인 가이드)
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDCEDF',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  darkContainer: {
    backgroundColor: '#2D1B2E',
    borderColor: '#4A3A4B',
  },

  // 에디터 헤더
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0D5E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0B4CC',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerRight: {
    alignItems: 'flex-end',
  },

  languageTag: {
    backgroundColor: '#BE185D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },

  languageText: {
    fontSize: 10,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.bold.toString(),
    color: COLORS.white,
  },

  fileNameText: {
    fontSize: 12,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.medium.toString(),
    color: '#8B5A6B',
  },

  cursorPosition: {
    fontSize: 10,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#9CA3AF',
  },

  // 에디터 메인 영역
  editorContainer: {
    flexDirection: 'row',
    minHeight: 300,
    maxHeight: 400,
  },

  // 줄 번호 영역
  lineNumberContainer: {
    backgroundColor: '#F0D5E2',
    borderRightWidth: 1,
    borderRightColor: '#E0B4CC',
    minWidth: 50,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  lineNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20,
    paddingVertical: 1,
  },

  lineNumber: {
    fontSize: 12,
    fontFamily: 'Fira Code',
    fontWeight: '400',
    color: '#8B5A6B',
    textAlign: 'right',
    minWidth: 30,
  },

  selectedLineNumber: {
    color: '#BE185D',
    fontWeight: 'bold',
  },

  highlightedLineNumber: {
    color: '#F59E0B',
    fontWeight: 'bold',
  },

  breakpoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginLeft: 4,
  },

  // 라인 스타일
  normalLine: {
    backgroundColor: 'transparent',
  },

  selectedLine: {
    backgroundColor: 'rgba(190, 24, 93, 0.1)',
  },

  highlightedLine: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },

  // 코드 편집 영역
  codeContainer: {
    flex: 1,
    backgroundColor: '#F8E8EE',
  },

  codeInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Fira Code',
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },

  // 읽기 전용 모드
  codeLine: {
    flexDirection: 'row',
    minHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 1,
  },

  codeText: {
    fontSize: 14,
    fontFamily: 'Fira Code',
    color: '#374151',
    lineHeight: 20,
  },

  highlightedCodeLine: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },

  selectedCodeLine: {
    backgroundColor: 'rgba(190, 24, 93, 0.05)',
  },

  highlightedCodeText: {
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    color: '#92400E',
  },

  selectedCodeText: {
    fontWeight: 'bold',
  },

  // 에디터 푸터
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0D5E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#E0B4CC',
  },

  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerRight: {
    alignItems: 'flex-end',
  },

  footerText: {
    fontSize: 10,
    fontFamily: FONTS.primary,
    fontWeight: FONTS.weights.regular.toString(),
    color: '#8B5A6B',
  },
});