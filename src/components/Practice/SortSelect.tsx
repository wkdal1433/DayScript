import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../../screens/Practice/Practice.styles';
import { SortSelectProps } from '../../types/practice';

/**
 * ChevronDown Icon Component
 */
const ChevronDownIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <Path
      d="m6 9 6 6 6-6"
      stroke="#393E46"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * SortSelect Component
 *
 * 정렬 옵션 선택을 위한 드롭다운 스타일 버튼 컴포넌트
 * Figma 디자인: 추천순 기본 선택
 */
const SortSelect: React.FC<SortSelectProps> = ({
  selectedSort,
  onSortChange: _onSortChange,
}) => {
  // 현재는 드롭다운 기능 없이 표시만
  // 실제 구현에서는 Modal이나 ActionSheet 사용 가능

  return (
    <View style={styles.sortContainer}>
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => {
          // TODO: 드롭다운 메뉴 표시 로직
          console.log('Sort options pressed');
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.sortButtonText}>{selectedSort}</Text>
        <ChevronDownIcon />
      </TouchableOpacity>
    </View>
  );
};

export default SortSelect;