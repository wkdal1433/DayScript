import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { styles } from '../../screens/Practice/Practice.styles';
import { FilterSectionProps } from '../../types/practice';
import LanguageToggle from './LanguageToggle';
import DifficultySelect from './DifficultySelect';
import SortSelect from './SortSelect';

/**
 * FilterSection Component
 *
 * Practice 화면 상단의 필터 컨트롤 섹션
 * - 언어 선택 토글
 * - 난이도 선택 버튼들
 * - 정렬 옵션 선택
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  selectedLanguage,
  selectedDifficulty,
  selectedSort,
  onLanguageChange,
  onDifficultyChange,
  onSortChange,
}) => {
  return (
    <View style={styles.filterContainer}>
      {/* 언어 선택 */}
      <View>
        <Text style={styles.filterLabel}>언어 선택</Text>
        <LanguageToggle
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
      </View>

      {/* 난이도 선택 */}
      <View style={styles.difficultyContainer}>
        <Text style={styles.filterLabel}>난이도</Text>
        <DifficultySelect
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={onDifficultyChange}
        />
      </View>

      {/* 정렬 선택 */}
      <View>
        <Text style={styles.filterLabel}>정렬</Text>
        <SortSelect
          selectedSort={selectedSort}
          onSortChange={onSortChange}
        />
      </View>
    </View>
  );
};

export default FilterSection;