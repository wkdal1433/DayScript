import React, { useState } from 'react';
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
}

interface DifficultySelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectLevel: (level: DifficultyLevel) => void;
  selectedLanguage?: string;
}

const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
  isVisible,
  onClose,
  onSelectLevel,
  selectedLanguage = 'Python',
}) => {
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | null>(null);

  const difficultyLevels: DifficultyLevel[] = [
    {
      id: 'beginner',
      emoji: '🌱',
      title: '입문',
      subtitle: 'Python 기초 문법',
      description: 'O/X 퀴즈와 객관식 문제로 기본 개념을 다져보아요.',
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
      title: '챌린지',
      subtitle: '실전 문제 도전',
      description: '코드 리뷰와 라이브 코딩으로 실전 감각을 완성해보아요.',
      problemCount: '15문제',
      timeEstimate: '10분',
      difficulty: '최고난이도',
      gradient: ['rgba(248, 232, 238, 1)', 'rgba(253, 206, 223, 1)'],
      borderColor: '#F2BED1',
    },
  ];

  const handleLevelPress = (level: DifficultyLevel) => {
    setSelectedLevel(level);
  };

  const handleStartPress = () => {
    if (selectedLevel) {
      onSelectLevel(selectedLevel);
      onClose();
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
    const isCompleted = index === 0; // Mock completion for first level

    return (
      <TouchableOpacity
        key={level.id}
        style={[
          styles.difficultyCard,
          { borderColor: isSelected ? level.borderColor : '#F8E8EE' },
          isSelected && styles.difficultyCardSelected,
        ]}
        onPress={() => handleLevelPress(level)}
        activeOpacity={0.8}
      >
        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressBarFill,
              { backgroundColor: level.borderColor, width: isCompleted ? '100%' : '0%' }
            ]}
          />
        </View>

        {/* Completion badge */}
        {isCompleted && (
          <View style={styles.completionBadge}>
            <Text style={styles.completionBadgeText}>완료!</Text>
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

  const renderBottomSection = () => (
    <View style={styles.bottomSection}>
      {selectedLevel ? (
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
    </Modal>
  );
};

export default DifficultySelectionModal;