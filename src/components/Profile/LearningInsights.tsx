/**
 * LearningInsights Component
 *
 * 학습 인사이트 섹션 - 데이터 시각화
 * 주간 학습 그래프(Bar Chart)와 3개 요약 카드 그리드 포함
 */

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './LearningInsights.styles';
import type { LearningStats } from '../../screens/Profile/UserPageScreen.types';

// 더미 데이터
const MOCK_LEARNING_STATS: LearningStats = {
  totalProblems: 247,
  totalHours: 42.5,
  averageAccuracy: 87.2,
  weeklyData: [
    { date: '월', problemsSolved: 12 },
    { date: '화', problemsSolved: 8 },
    { date: '수', problemsSolved: 15 },
    { date: '목', problemsSolved: 20 },
    { date: '금', problemsSolved: 18 },
    { date: '토', problemsSolved: 25 },
    { date: '일', problemsSolved: 14 },
  ],
};

const WeeklyBarChart: React.FC<{ data: typeof MOCK_LEARNING_STATS.weeklyData }> = ({ data }) => {
  const maxProblems = Math.max(...data.map(item => item.problemsSolved));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>주간 학습 현황</Text>

      <View style={styles.chartWrapper}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeight = (item.problemsSolved / maxProblems) * 120; // 최대 높이 120
            const isHighlight = item.problemsSolved >= 20; // 20개 이상일 때 강조

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isHighlight ? '#F2BED1' : '#FDCEDF',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.date}</Text>
                <Text style={styles.barValue}>{item.problemsSolved}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const StatsCard: React.FC<{
  title: string;
  value: string;
  unit: string;
  color: string;
}> = ({ title, value, unit, color }) => (
  <View style={styles.statsCard}>
    <View style={[styles.statsIcon, { backgroundColor: color }]} />
    <Text style={styles.statsTitle}>{title}</Text>
    <View style={styles.statsValueContainer}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsUnit}>{unit}</Text>
    </View>
  </View>
);

export const LearningInsights: React.FC = () => {
  const { totalProblems, totalHours, averageAccuracy, weeklyData } = MOCK_LEARNING_STATS;

  return (
    <View style={styles.container}>
      {/* 섹션 제목 */}
      <Text style={styles.sectionTitle}>학습 리포트</Text>

      {/* 주간 학습 그래프 */}
      <WeeklyBarChart data={weeklyData} />

      {/* 요약 카드 그리드 */}
      <View style={styles.statsGrid}>
        <StatsCard
          title="총 문제 수"
          value={totalProblems.toString()}
          unit="문제"
          color="#3B82F6"
        />
        <StatsCard
          title="총 학습 시간"
          value={totalHours.toString()}
          unit="시간"
          color="#10B981"
        />
        <StatsCard
          title="평균 정답률"
          value={averageAccuracy.toString()}
          unit="%"
          color="#8B5CF6"
        />
      </View>
    </View>
  );
};