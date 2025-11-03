import { StyleSheet, Dimensions } from 'react-native';
import { FONTS } from '../../constants/fonts';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // 오버레이 배경
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // 모달 컨테이너
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: height * 0.9,
  },

  // 모달 카드
  modalCard: {
    backgroundColor: '#F9F5F6',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  // 헤더 영역
  header: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F2BED1',
    fontFamily: FONTS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#333333AA',
    fontFamily: FONTS.primary,
    textAlign: 'center',
  },

  closeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontFamily: FONTS.primary,
  },

  // 모듈 선택 영역
  moduleSelection: {
    marginBottom: 24,
  },

  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    fontFamily: FONTS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },

  moduleCards: {
    gap: 16,
  },

  // 모듈 카드
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },

  moduleCardSelected: {
    borderColor: '#F2BED1',
    backgroundColor: '#FDF7F8',
  },

  // 선택 표시
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F2BED1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectionCheckmark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // 모듈 아이콘
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2BED1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  moduleIcon: {
    fontSize: 24,
  },

  // 모듈 정보
  moduleInfo: {
    gap: 8,
  },

  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: FONTS.primary,
  },

  moduleSubtitle: {
    fontSize: 12,
    color: '#F2BED1',
    fontFamily: FONTS.primary,
    fontWeight: '600',
  },

  moduleDescription: {
    fontSize: 13,
    color: '#666666',
    fontFamily: FONTS.primary,
    lineHeight: 18,
    marginBottom: 8,
  },

  // 기능 목록
  featuresList: {
    gap: 4,
    marginBottom: 12,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },

  featureBullet: {
    fontSize: 12,
    color: '#F2BED1',
    fontWeight: 'bold',
    marginTop: 1,
  },

  featureText: {
    fontSize: 11,
    color: '#555555',
    fontFamily: FONTS.primary,
    flex: 1,
    lineHeight: 15,
  },

  // 메타 정보
  moduleMetaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaLabel: {
    fontSize: 10,
    color: '#888888',
    fontFamily: FONTS.primary,
  },

  metaValue: {
    fontSize: 10,
    color: '#F2BED1',
    fontFamily: FONTS.primary,
    fontWeight: '600',
  },

  // 하단 버튼 영역
  bottomSection: {
    alignItems: 'center',
    gap: 12,
  },

  confirmButton: {
    backgroundColor: '#F2BED1',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    minWidth: 140,
    alignItems: 'center',
  },

  confirmButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },

  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: FONTS.primary,
  },

  confirmButtonTextDisabled: {
    color: '#AAAAAA',
  },

  helpText: {
    fontSize: 11,
    color: '#888888',
    fontFamily: FONTS.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default styles;