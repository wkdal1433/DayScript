/**
 * SuccessModal Component
 *
 * 성공 알림을 위한 재사용 가능한 커스텀 모달
 * 앱의 디자인 시스템과 일관성을 유지하며 그라데이션 버튼 사용
 */

import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { NextButton } from '../../ui/NextButton';
import { styles } from './SuccessModal.styles';
import { COLORS } from '../../../constants';
import type { SuccessModalProps } from './SuccessModal.types';

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  title = '성공!',
  message = '작업이 성공적으로 완료되었습니다.',
  buttonText = '확인',
  onClose,
  onConfirm,
  showIcon = true,
  iconType = 'success',
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconPulseAnim = useRef(new Animated.Value(1)).current;

  // 모달 표시 애니메이션
  useEffect(() => {
    if (isVisible) {
      // 모달 페이드인 및 스케일 애니메이션
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // 아이콘 펄스 애니메이션
      const pulseAnimation = Animated.sequence([
        Animated.timing(iconPulseAnim, {
          toValue: 1.1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconPulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]);

      // 펄스 애니메이션을 2회 반복
      Animated.loop(pulseAnimation, { iterations: 2 }).start();

      // 자동 닫기 설정
      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      // 모달 페이드아웃
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  // 모달 닫기 처리
  const handleClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  // 아이콘 렌더링
  const renderIcon = () => {
    if (!showIcon) return null;

    let iconText = '✅';
    let iconStyle = styles.icon;

    switch (iconType) {
      case 'checkmark':
        iconText = '✓';
        iconStyle = styles.checkmarkIcon;
        break;
      case 'star':
        iconText = '⭐';
        iconStyle = styles.starIcon;
        break;
      case 'trophy':
        iconText = '🏆';
        iconStyle = styles.trophyIcon;
        break;
      case 'success':
      default:
        iconText = '✅';
        iconStyle = styles.icon;
        break;
    }

    const iconContainerStyle = [
      styles.iconContainer,
      iconType === 'success' && styles.successIconContainer,
      iconType === 'trophy' && styles.celebrationIconContainer,
    ];

    return (
      <Animated.View
        style={[
          iconContainerStyle,
          { transform: [{ scale: iconPulseAnim }] }
        ]}
      >
        <Text style={iconStyle}>{iconText}</Text>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            iconType === 'success' && styles.successVariant,
            iconType === 'trophy' && styles.celebrationVariant,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            {/* Success Icon */}
            {renderIcon()}

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{title}</Text>
              {message && (
                <Text style={styles.message}>{message}</Text>
              )}
            </View>

            {/* Confirmation Button */}
            <View style={styles.buttonContainer}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <NextButton
                  title={buttonText}
                  onPress={handleClose}
                  variant="primary"
                  style={[styles.closeButton, { alignSelf: 'center' }]}
                  textStyle={{
                    fontSize: 16,
                    fontWeight: '600',
                    textAlign: 'center'
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

// 간편 사용을 위한 프리셋 컴포넌트들
export const LoginSuccessModal: React.FC<Omit<SuccessModalProps, 'title' | 'message' | 'iconType'>> = (props) => (
  <SuccessModal
    {...props}
    title="로그인 성공!"
    message="환영합니다! 앱의 모든 기능을 이용해보세요."
    iconType="checkmark"
  />
);

export const WelcomeModal: React.FC<Omit<SuccessModalProps, 'title' | 'message' | 'iconType'>> = (props) => (
  <SuccessModal
    {...props}
    title="환영합니다!"
    message="DayScript와 함께 즐거운 학습을 시작해보세요."
    iconType="star"
  />
);

export const AchievementModal: React.FC<Omit<SuccessModalProps, 'iconType'> & { achievementTitle?: string }> = ({
  achievementTitle = "목표 달성!",
  ...props
}) => (
  <SuccessModal
    {...props}
    title={achievementTitle}
    iconType="trophy"
  />
);

export default SuccessModal;