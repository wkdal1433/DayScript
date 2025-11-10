/**
 * 문제 표시 카드 컴포넌트
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 문제 정보 표시만 담당
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { QuizDifficulty } from '../../core/domain/QuizBase';
import { problemCardStyles } from '../styles/ProblemCard.styles';

export interface ProblemCardProps {
  question: string;
  category: string;
  tags: string[];
  difficulty: QuizDifficulty;
  points: number;
  codeBlock?: string;
  isReviewMode?: boolean;
  reviewInfo?: {
    wrongDate: string;
    attemptCount: number;
  };
}

export function ProblemCard({
  question,
  category,
  tags,
  difficulty,
  points,
  codeBlock,
  isReviewMode = false,
  reviewInfo,
}: ProblemCardProps) {
  const getDifficultyColor = (diff: QuizDifficulty): string => {
    switch (diff) {
      case QuizDifficulty.BEGINNER:
        return '#10B981'; // green
      case QuizDifficulty.ELEMENTARY:
        return '#3B82F6'; // blue
      case QuizDifficulty.INTERMEDIATE:
        return '#F59E0B'; // amber
      case QuizDifficulty.ADVANCED:
        return '#EF4444'; // red
      case QuizDifficulty.CHALLENGER:
        return '#8B5CF6'; // purple
      default:
        return '#6B7280'; // gray
    }
  };

  const getDifficultyText = (diff: QuizDifficulty): string => {
    switch (diff) {
      case QuizDifficulty.BEGINNER:
        return '입문';
      case QuizDifficulty.ELEMENTARY:
        return '초급';
      case QuizDifficulty.INTERMEDIATE:
        return '중급';
      case QuizDifficulty.ADVANCED:
        return '고급';
      case QuizDifficulty.CHALLENGER:
        return '챌린저';
      default:
        return '알 수 없음';
    }
  };

  return (
    <View style={problemCardStyles.container}>
      {/* 복습 모드 알림 */}
      {isReviewMode && reviewInfo && (
        <View style={problemCardStyles.reviewBanner}>
          <Text style={problemCardStyles.reviewBannerText}>
            📖 {reviewInfo.wrongDate}에 틀린 문제입니다 (시도: {reviewInfo.attemptCount}회)
          </Text>
        </View>
      )}

      {/* 카테고리 및 메타 정보 */}
      <View style={problemCardStyles.metaContainer}>
        <View style={problemCardStyles.categoryContainer}>
          <Text style={problemCardStyles.categoryText}>{category}</Text>
        </View>

        <View style={problemCardStyles.rightMeta}>
          <View style={[
            problemCardStyles.difficultyBadge,
            { backgroundColor: getDifficultyColor(difficulty) }
          ]}>
            <Text style={problemCardStyles.difficultyText}>
              {getDifficultyText(difficulty)}
            </Text>
          </View>

          <View style={problemCardStyles.pointsBadge}>
            <Text style={problemCardStyles.pointsText}>{points}점</Text>
          </View>
        </View>
      </View>

      {/* 문제 내용 */}
      <ScrollView style={problemCardStyles.questionContainer}>
        <Text style={problemCardStyles.questionText}>{question}</Text>

        {/* 코드 블록 (있는 경우) */}
        {codeBlock && (
          <View style={problemCardStyles.codeContainer}>
            <View style={problemCardStyles.codeHeader}>
              <Text style={problemCardStyles.codeHeaderText}>코드</Text>
            </View>
            <ScrollView
              horizontal
              style={problemCardStyles.codeScrollView}
              showsHorizontalScrollIndicator={false}
            >
              <Text style={problemCardStyles.codeText}>{codeBlock}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* 태그들 */}
      {tags.length > 0 && (
        <View style={problemCardStyles.tagsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={problemCardStyles.tagsScrollContent}
          >
            {tags.map((tag, index) => (
              <View key={index} style={problemCardStyles.tag}>
                <Text style={problemCardStyles.tagText}>#{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}