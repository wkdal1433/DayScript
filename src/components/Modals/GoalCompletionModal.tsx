import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  AccessibilityInfo,
  BackHandler,
} from 'react-native';
import CircularProgress from '../Progress/CircularProgress';
import CanvasConfetti from '../Effects/CanvasConfetti';
import { styles } from './GoalCompletionModal.styles';
import { GoalCompletionModalProps } from './GoalCompletionModal.types';

const GoalCompletionModal: React.FC<GoalCompletionModalProps> = ({
  visible,
  onRequestClose,
  onGoHome,
  experiencePoints = 50,
  animationDuration = 1400,
}) => {
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Check accessibility settings
  useEffect(() => {
    const checkReduceMotion = async () => {
      try {
        const reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
        setIsReduceMotionEnabled(reduceMotion);
      } catch (error) {
        console.warn('Could not check reduce motion setting:', error);
        setIsReduceMotionEnabled(false);
      }
    };

    if (visible) {
      checkReduceMotion();
    }
  }, [visible]);

  // Handle Android back button
  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          // Block back button when modal is open
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  // Modal entrance animation
  useEffect(() => {
    if (visible) {
      // Reset states
      setProgress(0);
      setShowConfetti(false);

      if (isReduceMotionEnabled) {
        // Immediate appearance for accessibility
        fadeAnim.setValue(1);
        scaleAnim.setValue(1);
        setProgress(100);
        setShowConfetti(true);
      } else {
        // Animated entrance
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Start progress animation after modal appears
          setTimeout(() => {
            setProgress(100);
          }, 200);
        });
      }
    } else {
      // Reset animations when modal closes
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      setProgress(0);
      setShowConfetti(false);
    }
  }, [visible, isReduceMotionEnabled, fadeAnim, scaleAnim]);

  // Handle progress completion - trigger Canvas Confetti
  const handleProgressComplete = () => {
    if (!isReduceMotionEnabled) {
      // Slight delay for natural feeling
      setTimeout(() => {
        setShowConfetti(true);
      }, 100);
    }
  };

  // Handle confetti completion
  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };


  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onRequestClose}
      accessibilityViewIsModal={true}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => {}} // Block tap to close
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Canvas-Style Confetti Layer */}
            <CanvasConfetti
              visible={showConfetti}
              onComplete={handleConfettiComplete}
              particleCount={60}
              duration={2000}
              explosionPoints={3}
            />

            {/* Modal Content */}
            <View style={styles.contentContainer}>
              {/* Progress Circle */}
              <View style={styles.progressContainer}>
                <CircularProgress
                  progress={progress}
                  size={150}
                  strokeWidth={10}
                  duration={animationDuration}
                  color="#6BCB77" // Design guide main color
                  backgroundColor="rgba(107,203,119,0.2)" // Design guide background
                  isReduceMotionEnabled={isReduceMotionEnabled}
                  onComplete={handleProgressComplete}
                />
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>100%</Text>
                  <Text style={styles.progressSubtext}>완료!</Text>
                </View>
              </View>

              {/* Success Message */}
              <View style={styles.messageContainer}>
                <Text style={styles.celebrationTitle}>🎉 대단해요!</Text>
                <Text style={styles.celebrationSubtitle}>
                  오늘의 목표를 완료했어요.
                </Text>
              </View>

              {/* Rewards Section */}
              <View style={styles.rewardsContainer}>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>✨</Text>
                  <Text style={styles.rewardText}>+{experiencePoints} XP 획득</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>🏆</Text>
                  <Text style={styles.rewardText}>목표 달성 배지</Text>
                </View>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardIcon}>📈</Text>
                  <Text style={styles.rewardText}>학습 진도 100%</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onGoHome}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="홈화면으로 돌아가기"
                >
                  <Text style={styles.primaryButtonText}>
                    🏠 홈화면으로 돌아가기
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onRequestClose}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="계속 학습하기"
                >
                  <Text style={styles.secondaryButtonText}>
                    📚 계속 학습하기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GoalCompletionModal;