/**
 * ScenarioSection Component
 *
 * PR 시나리오와 요구사항을 표시하는 섹션 컴포넌트
 * 접히고 펼쳐지는 기능과 진행률 표시 포함
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { ScenarioSectionProps } from '../PRInboxScreen.types';
import { styles } from '../PRInboxScreen.styles';

const ScenarioSection: React.FC<ScenarioSectionProps> = ({
  scenario,
  progress,
  isCollapsed,
  onToggleCollapse,
}) => {
  // Calculate completion percentage
  const completionPercentage = progress.totalCommits > 0
    ? Math.round((progress.reviewedCommits / progress.totalCommits) * 100)
    : 0;

  // Format difficulty for display
  const getDifficultyDisplay = (difficulty: string): string => {
    switch (difficulty) {
      case 'medium':
        return '중급';
      case 'hard':
        return '고급';
      case 'expert':
        return '전문가';
      default:
        return difficulty;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'medium':
        return '#F59E0B'; // Warning yellow
      case 'hard':
        return '#EF4444'; // Error red
      case 'expert':
        return '#8B5CF6'; // Purple
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <View style={styles.scenarioSection}>
      {/* Scenario Header */}
      <TouchableOpacity
        style={styles.scenarioHeader}
        onPress={onToggleCollapse}
        accessibilityRole="button"
        accessibilityLabel={isCollapsed ? "시나리오 펼치기" : "시나리오 접기"}
        accessibilityState={{ expanded: !isCollapsed }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.scenarioTitle} numberOfLines={isCollapsed ? 1 : 0}>
            📋 {scenario.title}
          </Text>

          {/* Progress and Difficulty Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <View style={{
              backgroundColor: getDifficultyColor(scenario.difficulty),
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 8,
              marginRight: 8,
            }}>
              <Text style={{
                fontSize: 10,
                color: '#FFFFFF',
                fontWeight: '600',
              }}>
                {getDifficultyDisplay(scenario.difficulty)}
              </Text>
            </View>

            <Text style={{
              fontSize: 12,
              color: '#6B7280',
            }}>
              {progress.reviewedCommits}/{progress.totalCommits} 완료 ({completionPercentage}%)
            </Text>

            <Text style={{
              fontSize: 12,
              color: '#6B7280',
              marginLeft: 8,
            }}>
              ⏱️ 예상 {scenario.estimatedTime}분
            </Text>
          </View>
        </View>

        <View style={styles.collapseButton}>
          <Text style={styles.collapseIcon}>
            {isCollapsed ? '▼' : '▲'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Scenario Content (when expanded) */}
      {!isCollapsed && (
        <View style={styles.scenarioContent}>
          {/* Description */}
          <Text style={styles.scenarioDescription}>
            {scenario.description}
          </Text>

          {/* Context (if available) */}
          {scenario.context && (
            <View style={{
              backgroundColor: '#F3F4F6',
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#374151',
                marginBottom: 4,
              }}>
                📖 배경 정보
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
                lineHeight: 20,
              }}>
                {scenario.context}
              </Text>
            </View>
          )}

          {/* Requirements */}
          {scenario.requirements.length > 0 && (
            <View>
              <Text style={styles.requirementsTitle}>
                ✅ 검토 요구사항
              </Text>
              {scenario.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Text style={styles.requirementBullet}>•</Text>
                  <Text style={styles.requirementText}>
                    {requirement}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {scenario.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {scenario.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Progress Summary */}
          <View style={{
            backgroundColor: '#F9FAFB',
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#3B82F6',
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: '#374151',
              marginBottom: 8,
            }}>
              📊 현재 진행 상황
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                총 커밋: {progress.totalCommits}개
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                검토 완료: {progress.reviewedCommits}개
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#10B981' }}>
                승인: {progress.acceptedCommits}개
              </Text>
              <Text style={{ fontSize: 12, color: '#EF4444' }}>
                거부: {progress.rejectedCommits}개
              </Text>
              <Text style={{ fontSize: 12, color: '#8B5CF6' }}>
                플래그: {progress.flaggedCommits}개
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%` }
                ]}
              />
            </View>

            <Text style={{
              fontSize: 10,
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 4,
            }}>
              {completionPercentage}% 완료
            </Text>
          </View>

          {/* Current Score Display */}
          {progress.currentScore > 0 && (
            <View style={{
              backgroundColor: progress.currentScore >= 80 ? '#D1FAE5' :
                            progress.currentScore >= 60 ? '#FEF3C7' : '#FEE2E2',
              padding: 12,
              borderRadius: 8,
              marginTop: 8,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: progress.currentScore >= 80 ? '#065F46' :
                       progress.currentScore >= 60 ? '#92400E' : '#991B1B',
              }}>
                현재 점수: {Math.round(progress.currentScore)}점
              </Text>
              <Text style={{
                fontSize: 11,
                color: '#6B7280',
                marginTop: 2,
              }}>
                {progress.currentScore >= 80 ? '🎉 훌륭합니다!' :
                 progress.currentScore >= 60 ? '👍 잘하고 있습니다!' : '💪 더 신중하게 검토해보세요!'}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(ScenarioSection);