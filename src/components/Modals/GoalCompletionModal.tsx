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
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Multiple confetti animations for enhanced effect
  const confettiAnims = {
    fall1: useRef(new Animated.Value(0)).current,
    fall2: useRef(new Animated.Value(0)).current,
    fall3: useRef(new Animated.Value(0)).current,
    rotation1: useRef(new Animated.Value(0)).current,
    rotation2: useRef(new Animated.Value(0)).current,
    rotation3: useRef(new Animated.Value(0)).current,
  };

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
      confettiAnim.setValue(0);
      // Reset all confetti animations
      Object.values(confettiAnims).forEach(anim => anim.setValue(0));

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
  }, [visible, isReduceMotionEnabled, fadeAnim, scaleAnim, confettiAnim]);

  // Handle progress completion
  const handleProgressComplete = () => {
    setShowConfetti(true);

    if (!isReduceMotionEnabled) {
      // Enhanced confetti animations with staggered timing
      const confettiSequence = [
        // Initial burst
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Falling animations with different delays
        Animated.parallel([
          Animated.timing(confettiAnims.fall1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnims.fall2, {
            toValue: 1,
            duration: 2200,
            delay: 150,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnims.fall3, {
            toValue: 1,
            duration: 2400,
            delay: 300,
            useNativeDriver: true,
          }),
          // Continuous rotation animations
          Animated.loop(
            Animated.timing(confettiAnims.rotation1, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            })
          ),
          Animated.loop(
            Animated.timing(confettiAnims.rotation2, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            })
          ),
          Animated.loop(
            Animated.timing(confettiAnims.rotation3, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            })
          ),
        ]),
      ];

      Animated.sequence(confettiSequence).start();
    }
  };

  // Enhanced confetti component with multiple layers and animations
  const renderConfetti = () => {
    if (!showConfetti) return null;

    const confettiPieces = [
      { emoji: '🎉', color: '#FF6B6B', delay: 0 },
      { emoji: '✨', color: '#4ECDC4', delay: 100 },
      { emoji: '🎊', color: '#45B7D1', delay: 200 },
      { emoji: '🌟', color: '#FFA726', delay: 300 },
      { emoji: '💫', color: '#AB47BC', delay: 150 },
      { emoji: '🎁', color: '#66BB6A', delay: 250 },
      { emoji: '🏆', color: '#FFD54F', delay: 350 },
      { emoji: '⭐', color: '#EF5350', delay: 50 },
    ];

    return (
      <View style={styles.confettiContainer}>
        {/* Background burst effect */}
        <Animated.View
          style={[
            styles.confettiBurst,
            {
              opacity: confettiAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  scale: confettiAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 3],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Individual confetti pieces */}
        {confettiPieces.map((piece, index) => {
          const fallAnim = index % 3 === 0 ? confettiAnims.fall1 :
                          index % 3 === 1 ? confettiAnims.fall2 : confettiAnims.fall3;
          const rotationAnim = index % 3 === 0 ? confettiAnims.rotation1 :
                              index % 3 === 1 ? confettiAnims.rotation2 : confettiAnims.rotation3;

          return (
            <Animated.View
              key={index}
              style={[
                styles.confettiPiece,
                {
                  left: `${(index * 12 + 10) % 90}%`,
                  opacity: confettiAnim,
                  transform: [
                    {
                      translateY: fallAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 600],
                      }),
                    },
                    {
                      translateX: fallAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, (index % 2 === 0 ? 30 : -30), 0],
                      }),
                    },
                    {
                      rotate: rotationAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                    {
                      scale: fallAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.2, 0.8],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.confettiEmoji, { color: piece.color }]}>
                {piece.emoji}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    );
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
            {/* Confetti Layer */}
            {renderConfetti()}

            {/* Modal Content */}
            <View style={styles.contentContainer}>
              {/* Progress Circle */}
              <View style={styles.progressContainer}>
                <CircularProgress
                  progress={progress}
                  size={150}
                  strokeWidth={12}
                  duration={animationDuration}
                  color="#88C7A1"
                  backgroundColor="#E8F5E8"
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