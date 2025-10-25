import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { styles } from '../../screens/Practice/Practice.styles';
import { ProblemCardProps } from '../../types/practice';

/**
 * Clock Icon Component
 */
const ClockIcon = () => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2v10l3 3"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * BarChart Icon Component
 */
const BarChartIcon = () => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3v18h18"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 17V9M16 17v-3M12 17V5"
      stroke="#F2BED1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * ProblemCard Component
 *
 * 개별 코딩 문제를 표시하는 카드 컴포넌트
 * Figma 디자인 기반으로 모든 시각적 요소 구현
 */
const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  onPress,
}) => {
  const isLongTitle = problem.title.length > 10;

  return (
    <TouchableOpacity
      style={styles.problemCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* 문제 헤더: 난이도 뱃지 + 제목 + 난이도 라벨 */}
      <View style={styles.problemHeader}>
        <View style={styles.problemTitleContainer}>
          {/* 난이도 뱃지 (Lv.1, Lv.2, Lv.3) */}
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor: problem.difficulty === 'Lv.1' ? '#10B981' : '#10B981',
                borderColor: problem.difficulty === 'Lv.1' ? '#10B981' : '#10B981',
              },
            ]}
          >
            <Text style={styles.difficultyBadgeText}>
              {problem.difficulty}
            </Text>
          </View>

          {/* 문제 제목 */}
          <Text
            style={[
              styles.problemTitle,
              isLongTitle && styles.problemTitleLong,
            ]}
          >
            {problem.title}
          </Text>
        </View>

        {/* 난이도 라벨 (Easy, Medium, Hard) */}
        <View
          style={[
            styles.difficultyLabel,
            {
              backgroundColor: problem.difficultyBg,
            },
          ]}
        >
          <Text
            style={[
              styles.difficultyLabelText,
              { color: problem.difficultyColor },
            ]}
          >
            {problem.difficultyLabel}
          </Text>
        </View>
      </View>

      {/* 문제 태그들 */}
      <View style={styles.tagsContainer}>
        {problem.tags.map((tag, index) => (
          <View
            key={index}
            style={[
              styles.tag,
              { backgroundColor: tag.bg },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: tag.color },
              ]}
            >
              {tag.name}
            </Text>
          </View>
        ))}
      </View>

      {/* 문제 하단: 통계 + 풀기 버튼 */}
      <View style={styles.problemFooter}>
        <View style={styles.problemStats}>
          {/* 시간 통계 */}
          <View style={styles.problemStat}>
            <ClockIcon />
            <Text style={styles.problemStatText}>{problem.timeEstimate}</Text>
          </View>

          {/* 성공률 통계 */}
          <View style={styles.problemStat}>
            <BarChartIcon />
            <Text style={styles.problemStatText}>{problem.successRate}</Text>
          </View>
        </View>

        {/* 풀기 버튼 */}
        <TouchableOpacity
          style={styles.solveButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.solveButtonText}>풀기 ▶</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProblemCard;