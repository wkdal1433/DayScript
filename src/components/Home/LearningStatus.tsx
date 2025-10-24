import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Circle } from 'react-native-progress';
import { LearningStats } from '../../types/common';
import { styles } from '../../screens/Home/Home.styles';

interface LearningStatusProps {
  learningStats: LearningStats;
}

const LearningStatus: React.FC<LearningStatusProps> = ({
  learningStats,
}) => {
  return (
    <View style={[styles.card, styles.learningStatusCard]}>
      <Text style={styles.sectionTitle}> 내 학습 현황</Text>
      <View style={styles.progressCircleContainer}>
        <View style={styles.progressCircle}>
          <Circle
            size={64}
            progress={learningStats.todayProgress / 100}
            thickness={6}
            color="#F2BED1" // Figma progress color
            unfilledColor="rgba(229, 231, 235, 0.3)" // Figma unfilled color
            borderWidth={0}
            showsText={false}
            strokeCap="round" // Figma 스타일 매칭
          />
          <View style={{ position: 'absolute' }}>
            <Text style={styles.progressPercentage}>{learningStats.todayProgress}%</Text>
          </View>
        </View>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressLabel}>오늘 학습 진도</Text>
          <Text style={styles.progressDescription}>목표의 75% 완료! 👏</Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningStats.totalProblems}</Text>
          <Text style={styles.statLabel}>누적 학습량</Text>
          <Text style={styles.statDescription}>문제 해결</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{learningStats.accuracy}%</Text>
          <Text style={styles.statLabel}>정답률</Text>
          <Text style={styles.statDescription}>평균 정답률</Text>
        </View>
      </View>
    </View>
  );
};

export default LearningStatus;