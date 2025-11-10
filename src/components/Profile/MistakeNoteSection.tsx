/**
 * MistakeNoteSection Component
 *
 * 오답노트 섹션
 * 레벨별 필터 탭과 오답 문제 카드 리스트 포함
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from './MistakeNoteSection.styles';
import type { MistakeNote } from '../../screens/Profile/UserPageScreen.types';

// 더미 데이터
const MOCK_MISTAKE_NOTES: MistakeNote[] = [
  {
    id: 'mistake_001',
    level: 1,
    problemType: 'OX',
    title: 'Java의 static 메서드는 오버라이딩이 가능한가?',
    wrongCount: 3,
    lastAttempt: '2024-11-10',
    description: 'static 메서드의 특성을 이해하지 못해 틀렸습니다.',
  },
  {
    id: 'mistake_002',
    level: 2,
    problemType: 'MULTIPLE_CHOICE',
    title: '시간복잡도 O(n²)인 정렬 알고리즘은?',
    wrongCount: 2,
    lastAttempt: '2024-11-09',
    description: '버블정렬, 선택정렬, 삽입정렬의 차이를 혼동했습니다.',
  },
  {
    id: 'mistake_003',
    level: 3,
    problemType: 'FILL_IN_BLANK',
    title: 'Binary Search Tree 구현하기',
    wrongCount: 5,
    lastAttempt: '2024-11-08',
    description: 'BST의 삽입 로직에서 재귀 조건을 잘못 작성했습니다.',
  },
  {
    id: 'mistake_004',
    level: 4,
    problemType: 'DEBUGGING',
    title: 'NullPointerException 디버깅',
    wrongCount: 1,
    lastAttempt: '2024-11-07',
    description: 'null 체크 없이 메서드 호출을 시도했습니다.',
  },
  {
    id: 'mistake_005',
    level: 5,
    problemType: 'CODE_REVIEW',
    title: 'API 응답 처리 코드 리뷰',
    wrongCount: 4,
    lastAttempt: '2024-11-06',
    description: '에러 핸들링이 부족한 코드를 리뷰하지 못했습니다.',
  },
];

interface MistakeNoteSectionProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
  limitItems?: number; // 표시할 아이템 수 제한
}

const PROBLEM_TYPE_ICONS = {
  OX: '⭕',
  MULTIPLE_CHOICE: '📝',
  FILL_IN_BLANK: '🔤',
  DEBUGGING: '🐛',
  CODE_REVIEW: '👁️',
};

const PROBLEM_TYPE_NAMES = {
  OX: 'O/X 문제',
  MULTIPLE_CHOICE: '객관식',
  FILL_IN_BLANK: '빈칸 채우기',
  DEBUGGING: '디버깅',
  CODE_REVIEW: '코드 리뷰',
};

const MistakeCard: React.FC<{
  mistake: MistakeNote;
  onReview: () => void;
}> = ({ mistake, onReview }) => (
  <View style={styles.mistakeCard}>
    <View style={styles.mistakeHeader}>
      <View style={styles.mistakeTypeContainer}>
        <Text style={styles.mistakeTypeIcon}>
          {PROBLEM_TYPE_ICONS[mistake.problemType]}
        </Text>
        <Text style={styles.mistakeType}>
          {PROBLEM_TYPE_NAMES[mistake.problemType]}
        </Text>
      </View>
      <View style={styles.wrongCountBadge}>
        <Text style={styles.wrongCountText}>{mistake.wrongCount}회</Text>
      </View>
    </View>

    <Text style={styles.mistakeTitle}>{mistake.title}</Text>
    <Text style={styles.mistakeDescription}>{mistake.description}</Text>

    <View style={styles.mistakeFooter}>
      <Text style={styles.lastAttemptText}>
        마지막 시도: {mistake.lastAttempt}
      </Text>
      <TouchableOpacity style={styles.reviewButton} onPress={onReview}>
        <Text style={styles.reviewButtonText}>복습하기</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const MistakeNoteSection: React.FC<MistakeNoteSectionProps> = ({
  navigation,
  limitItems,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');

  const filteredMistakes = MOCK_MISTAKE_NOTES.filter(mistake =>
    selectedLevel === 'all' ? true : mistake.level === selectedLevel
  );

  // limitItems가 설정되어 있으면 해당 개수만큼만 표시
  const displayedMistakes = limitItems
    ? filteredMistakes.slice(0, limitItems)
    : filteredMistakes;

  const hasMoreItems = limitItems && filteredMistakes.length > limitItems;

  const handleReview = (mistake: MistakeNote) => {
    console.log('Navigate to review:', mistake.id);
    // Mock navigation - 실제 문제 화면으로 이동
    switch (mistake.problemType) {
      case 'OX':
        navigation.navigate('OXProblem', { mistakeReview: true, problemId: mistake.id });
        break;
      case 'MULTIPLE_CHOICE':
        navigation.navigate('MultipleChoiceProblem', { mistakeReview: true, problemId: mistake.id });
        break;
      case 'FILL_IN_BLANK':
        navigation.navigate('FillInBlankProblem', { mistakeReview: true, problemId: mistake.id });
        break;
      case 'DEBUGGING':
        navigation.navigate('DebuggingProblem', { mistakeReview: true, problemId: mistake.id });
        break;
      case 'CODE_REVIEW':
        navigation.navigate('VibeSession', { mistakeReview: true, problemId: mistake.id });
        break;
    }
  };

  const handleViewAllPress = () => {
    console.log('오답노트 전체보기 클릭');
    // TODO: 오답노트 전체보기 화면으로 이동
    // navigation.navigate('MistakeNoteFullScreen');
  };

  const renderTabItem = (level: number | 'all', title: string) => (
    <TouchableOpacity
      key={level}
      style={[
        styles.tabItem,
        selectedLevel === level && styles.tabItemActive,
      ]}
      onPress={() => setSelectedLevel(level)}
    >
      <Text
        style={[
          styles.tabText,
          selectedLevel === level && styles.tabTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 섹션 제목 */}
      <Text style={styles.sectionTitle}>오답노트</Text>

      {/* 레벨별 필터 탭 (limitItems가 있을 때만 표시) */}
      {!limitItems && (
        <View style={styles.tabContainer}>
          {renderTabItem('all', '전체')}
          {renderTabItem(1, 'LV1')}
          {renderTabItem(2, 'LV2')}
          {renderTabItem(3, 'LV3')}
          {renderTabItem(4, 'LV4')}
          {renderTabItem(5, 'LV5')}
        </View>
      )}

      {/* 오답 문제 리스트 */}
      <FlatList
        data={displayedMistakes}
        renderItem={({ item }) => (
          <MistakeCard
            mistake={item}
            onReview={() => handleReview(item)}
          />
        )}
        keyExtractor={item => item.id}
        scrollEnabled={false} // 외부 ScrollView 사용
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedLevel === 'all'
                ? '오답 문제가 없습니다! 🎉'
                : `LV${selectedLevel} 오답 문제가 없습니다! 🎉`
              }
            </Text>
          </View>
        }
      />

      {/* 전체보기 버튼 (3개 초과 시 표시) */}
      {hasMoreItems && (
        <TouchableOpacity style={styles.viewAllButton} onPress={handleViewAllPress}>
          <Text style={styles.viewAllText}>
            오답노트 전체보기 ({filteredMistakes.length}개)
          </Text>
          <Text style={styles.viewAllArrow}>›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};