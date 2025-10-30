import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from 'react-native';
import { styles } from './DifficultySelectionModal.styles';

export interface DifficultyLevel {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  problemCount: string;
  timeEstimate: string;
  difficulty: string;
  gradient: string[];
  borderColor: string;
  isUnlocked: boolean;
  unlockCondition?: string;
  completionRate?: number;
  attemptsRemaining?: number;
}

export interface UserProgressionState {
  unlockedLevels: string[];
  completedLevels: string[];
  currentLevel: string | null;
  levelStats: {
    [levelId: string]: {
      completionRate: number;
      attemptsUsed: number;
      maxAttempts: number;
      isCompleted: boolean;
    };
  };
}

interface DifficultySelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLevel: (level: DifficultyLevel) => void;
  selectedLanguage?: string;
  userProgressionState?: UserProgressionState;
  onUpdateProgression?: (state: UserProgressionState) => void;
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
  isVisible,
  onClose,
  onSelectLevel,
  selectedLanguage = 'Python',
  userProgressionState,
  onUpdateProgression,
  navigation,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedLockedLevel, setSelectedLockedLevel] = useState<DifficultyLevel | null>(null);

  // Default progression state - both 입문 and 초급 unlocked initially
  const defaultProgressionState: UserProgressionState = {
    unlockedLevels: ['beginner', 'elementary'],
    completedLevels: [],
    currentLevel: null,
    levelStats: {
      beginner: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
      elementary: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
      intermediate: { completionRate: 0, attemptsUsed: 0, maxAttempts: 3, isCompleted: false },
      advanced: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
      challenge: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
    },
  };

  const currentProgressionState = userProgressionState || defaultProgressionState;

  const baseDifficultyLevels: Omit<DifficultyLevel, 'isUnlocked' | 'unlockCondition' | 'completionRate' | 'attemptsRemaining'>[] = [
    {
      id: 'beginner',
      emoji: '🌱',
      title: '입문',
      subtitle: 'Python 기초 문법',
      description: 'O/X 퀴즈로 기본 개념을 확실하게 다져보아요.',
      problemCount: '20문제',
      timeEstimate: '15분',
      difficulty: '쉬움',
      gradient: ['rgba(248, 232, 238, 1)', 'rgba(253, 206, 223, 1)'],
      borderColor: '#FDCEDF',
    },
    {
      id: 'elementary',
      emoji: '📚',
      title: '초급',
      subtitle: 'Python 응용 문법',
      description: '객관식 문제로 기본 문법을 응용해보아요.',
      problemCount: '20문제',
      timeEstimate: '15분',
      difficulty: '쉬움',
      gradient: ['rgba(248, 232, 238, 1)', 'rgba(253, 206, 223, 1)'],
      borderColor: '#FDCEDF',
    },
    {
      id: 'intermediate',
      emoji: '🚀',
      title: '중급',
      subtitle: '제어문과 함수',
      description: '빈칸 채우기 퀴즈로 문법과 흐름을 직접 완성해보아요.',
      problemCount: '25문제',
      timeEstimate: '20분',
      difficulty: '보통',
      gradient: ['rgba(248, 232, 238, 1)', 'rgba(253, 206, 223, 1)'],
      borderColor: '#FDCEDF',
    },
    {
      id: 'advanced',
      emoji: '💎',
      title: '고급',
      subtitle: '객체지향과 고급 문법',
      description: '디버깅 모드에서 오류를 찾고 문제 해결력을 키워보아요.',
      problemCount: '30문제',
      timeEstimate: '25분',
      difficulty: '어려움',
      gradient: ['rgba(248, 232, 238, 1)', 'rgba(253, 206, 223, 1)'],
      borderColor: '#F2BED1',
    },
    {
      id: 'challenge',
      emoji: '🏆',
      title: '챌린저',
      subtitle: '실전 문제 도전',
      description: '코드 리뷰와 라이브 코딩으로 실전 감각을 완성해보아요.',
      problemCount: '15문제',
      timeEstimate: '10분',
      difficulty: '최고난이도',
      gradient: ['rgba(248, 232, 238, 1)', 'rgba(253, 206, 223, 1)'],
      borderColor: '#F2BED1',
    },
  ];

  // Enhanced difficulty levels with dynamic unlock conditions
  const difficultyLevels: DifficultyLevel[] = baseDifficultyLevels.map((level) => {
    const isUnlocked = currentProgressionState.unlockedLevels.includes(level.id);
    const stats = currentProgressionState.levelStats[level.id];

    let unlockCondition = '';
    if (!isUnlocked) {
      switch (level.id) {
        case 'elementary':
          unlockCondition = '입문 단계를 완료해야 합니다';
          break;
        case 'intermediate':
          unlockCondition = '초급 단계를 완료해야 합니다';
          break;
        case 'advanced':
          unlockCondition = '중급 단계를 완료해야 합니다';
          break;
        case 'challenge':
          unlockCondition = '고급 단계를 완료해야 합니다';
          break;
      }
    }

    return {
      ...level,
      isUnlocked,
      unlockCondition,
      completionRate: stats?.completionRate || 0,
      attemptsRemaining: level.id === 'intermediate' ?
        Math.max(0, (stats?.maxAttempts || 3) - (stats?.attemptsUsed || 0)) :
        undefined,
    };
  });

  const handleLevelPress = (level: DifficultyLevel) => {
    if (!level.isUnlocked) {
      setSelectedLockedLevel(level);
      setShowUnlockModal(true);
      return;
    }

    // Check if intermediate level has attempts remaining
    if (level.id === 'intermediate' && level.attemptsRemaining === 0) {
      setSelectedLockedLevel(level);
      setShowUnlockModal(true);
      return;
    }

    setSelectedLevel(level);
  };

  const handleStartPress = () => {
    if (selectedLevel) {
      onSelectLevel(selectedLevel);

      // Fixed navigation mapping: 입문→OX, 초급→Multiple Choice
      if (navigation) {
        let targetRoute = '';

        switch (selectedLevel.id) {
          case 'beginner':
            // 입문: LV1 문제 세트 (O/X 문제)
            targetRoute = 'OXProblem';
            break;
          case 'elementary':
            // 초급: LV2 문제 세트 (객관식 문제)
            targetRoute = 'MultipleChoiceProblem';
            break;
          default:
            // For other difficulty levels, can be extended later
            console.log('Navigation for level', selectedLevel.id, 'not yet implemented');
            onClose();
            return;
        }

        console.log('Navigating to:', targetRoute, 'for level:', selectedLevel.id);

        // Close modal first, then navigate
        onClose();
        navigation.navigate(targetRoute, {
          difficulty: selectedLevel,
          language: selectedLanguage,
        });
      } else {
        // For when navigation is not available, use existing logic
        onClose();
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>레벨별 학습 모드</Text>
        <Text style={styles.headerSubtitle}>단계별로 실력을 향상시켜보세요</Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLanguageBadge = () => (
    <View style={styles.languageBadge}>
      <Text style={styles.languageBadgeText}>{selectedLanguage}</Text>
    </View>
  );

  const renderProgressDots = () => (
    <View style={styles.progressDots}>
      <View style={[styles.progressDot, styles.progressDotActive]} />
      <View style={styles.progressDot} />
      <View style={styles.progressDot} />
      <View style={styles.progressDot} />
      <View style={styles.progressDot} />
    </View>
  );

  const renderInstructions = () => (
    <View style={styles.instructionsContainer}>
      <Text style={styles.instructionsTitle}>학습 레벨을 선택하세요</Text>
      <Text style={styles.instructionsSubtitle}>자신의 수준에 맞는 문제로 시작해서</Text>
      <Text style={styles.instructionsSubtitle}>점진적으로 실력을 향상시킬 수 있습니다</Text>
    </View>
  );

  const renderDifficultyCard = (level: DifficultyLevel, index: number) => {
    const isSelected = selectedLevel?.id === level.id;
    const isCompleted = currentProgressionState.completedLevels.includes(level.id);
    const isLocked = !level.isUnlocked;
    const hasNoAttempts = level.id === 'intermediate' && level.attemptsRemaining === 0;

    return (
      <TouchableOpacity
        key={level.id}
        style={[
          styles.difficultyCard,
          { borderColor: isSelected ? level.borderColor : '#F8E8EE' },
          isSelected && styles.difficultyCardSelected,
          (isLocked || hasNoAttempts) && { opacity: 0.4 },
        ]}
        onPress={() => handleLevelPress(level)}
        activeOpacity={isLocked || hasNoAttempts ? 1 : 0.8}
        disabled={false} // Always allow taps to show unlock modals
      >
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: level.borderColor,
                width: isCompleted ? '100%' : `${level.completionRate || 0}%`
              }
            ]}
          />
        </View>

        {/* Completion badge */}
        {isCompleted && (
          <View style={styles.completionBadge}>
            <Text style={styles.completionBadgeText}>완료!</Text>
          </View>
        )}

        {/* Lock indicator for locked levels */}
        {isLocked && (
          <View style={styles.lockIndicator}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}

        {/* Attempts remaining for intermediate level */}
        {level.id === 'intermediate' && level.isUnlocked && !isCompleted && (
          <View style={styles.attemptsContainer}>
            <Text style={styles.attemptsText}>
              남은 기회: {level.attemptsRemaining}회
            </Text>
          </View>
        )}

        {/* Main content */}
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: level.gradient[0] }]}>
            <Text style={styles.iconEmoji}>{level.emoji}</Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{level.title}</Text>
            <Text style={styles.cardSubtitle}>{level.subtitle}</Text>
          </View>

          <Text style={styles.cardArrow}>→</Text>
        </View>

        {/* Description */}
        <Text style={styles.cardDescription}>{level.description}</Text>

        {/* Stats */}
        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statText}>{level.problemCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⏰</Text>
            <Text style={styles.statText}>{level.timeEstimate}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statText}>{level.difficulty}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBottomSection = () => {
    const canStartLevel = selectedLevel && selectedLevel.isUnlocked &&
      !(selectedLevel.id === 'intermediate' && selectedLevel.attemptsRemaining === 0);

    return (
      <View style={styles.bottomSection}>
        {canStartLevel ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartPress}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>문제 풀기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← 뒤로가기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {renderHeader()}

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.content}>
              {renderLanguageBadge()}
              {renderProgressDots()}
              {renderInstructions()}

              <View style={styles.difficultyContainer}>
                {difficultyLevels.map((level, index) => renderDifficultyCard(level, index))}
              </View>
            </View>
          </ScrollView>

          {renderBottomSection()}
        </Pressable>
      </Pressable>

      {/* Unlock Conditions Modal */}
      {showUnlockModal && selectedLockedLevel && (
        <Modal
          visible={showUnlockModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowUnlockModal(false)}
        >
          <Pressable
            style={styles.unlockModalOverlay}
            onPress={() => setShowUnlockModal(false)}
          >
            <Pressable
              style={styles.unlockModalContainer}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.unlockModalContent}>
                <Text style={styles.unlockModalIcon}>🔒</Text>
                <Text style={styles.unlockModalTitle}>단계 잠금</Text>

                {selectedLockedLevel.attemptsRemaining === 0 ? (
                  <>
                    <Text style={styles.unlockModalMessage}>
                      중급 단계의 테스트 기회를 모두 사용했습니다.
                    </Text>
                    <Text style={styles.unlockModalSubMessage}>
                      초급 단계를 다시 완료하면 추가 기회를 얻을 수 있습니다.
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.unlockModalMessage}>
                      이 단계를 시작하려면
                    </Text>
                    <Text style={styles.unlockModalCondition}>
                      {selectedLockedLevel.unlockCondition}
                    </Text>
                  </>
                )}

                <TouchableOpacity
                  style={styles.unlockModalButton}
                  onPress={() => setShowUnlockModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.unlockModalButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Modal>
  );
};

export default DifficultySelectionModal;