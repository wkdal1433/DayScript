import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../screens/Practice/Practice.styles';
import { DifficultySelectProps, DifficultyLevel } from '../../types/practice';

/**
 * DifficultySelect Component
 *
 * 문제 난이도 선택을 위한 버튼 그룹 컴포넌트
 * Figma 디자인: Lv.1/Lv.2/Lv.3/전체 4개 옵션
 */
const DifficultySelect: React.FC<DifficultySelectProps> = ({
  selectedDifficulty,
  onDifficultyChange,
}) => {
  const difficulties: DifficultyLevel[] = ['Lv.1', 'Lv.2', 'Lv.3', '전체'];

  const getDifficultyColors = (difficulty: DifficultyLevel, isSelected: boolean) => {
    if (isSelected) {
      switch (difficulty) {
        case 'Lv.1':
          return { backgroundColor: '#10B981', borderColor: '#10B981' };
        case 'Lv.2':
          return { backgroundColor: '#F6C177', borderColor: '#F6C177' };
        case 'Lv.3':
          return { backgroundColor: '#F6A6A6', borderColor: '#F6A6A6' };
        default:
          return { backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' };
      }
    }
    return {};
  };

  return (
    <View style={styles.difficultyOptions}>
      {difficulties.map((difficulty) => {
        const isSelected = selectedDifficulty === difficulty;
        const difficultyColors = getDifficultyColors(difficulty, isSelected);

        return (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.difficultyButton,
              isSelected && {
                ...styles.difficultyButtonActive,
                ...difficultyColors,
              },
            ]}
            onPress={() => onDifficultyChange(difficulty)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.difficultyButtonText,
                isSelected && styles.difficultyButtonTextActive,
              ]}
            >
              {difficulty}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DifficultySelect;