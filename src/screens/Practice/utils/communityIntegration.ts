/**
 * Community Integration Utilities for Practice Screens
 * Provides helper functions to integrate community features with problem-solving flows
 */

import { navigateToProblemDiscussion } from '../../../modules/community';

/**
 * Problem data interface for community integration
 */
export interface ProblemInfo {
  id: string;
  title: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  language?: string;
}

/**
 * Integration helpers for different practice screen levels
 */
export class CommunityIntegration {
  /**
   * Navigate to problem discussion from any practice screen
   */
  static navigateToDiscussion(
    navigation: any,
    problemInfo: ProblemInfo,
    source?: string
  ) {
    const { id, title } = problemInfo;

    // Track analytics for community engagement
    console.log(`Community navigation from ${source || 'practice'} for problem ${id}`);

    navigateToProblemDiscussion(navigation, id, title);
  }

  /**
   * Extract problem info from different practice screen data formats
   */
  static extractProblemInfo(screenData: any, screenType: string): ProblemInfo | null {
    try {
      switch (screenType) {
        case 'LV1_OX':
          return {
            id: screenData.id || `ox_${screenData.question?.slice(0, 20)}`,
            title: `OX 문제: ${screenData.question}`,
            difficulty: 'easy',
            category: 'OX문제',
          };

        case 'LV2_MULTIPLE_CHOICE':
          return {
            id: screenData.id || `mc_${screenData.question?.slice(0, 20)}`,
            title: `객관식: ${screenData.question}`,
            difficulty: 'easy',
            category: '객관식문제',
          };

        case 'LV3_FILL_BLANK':
          return {
            id: screenData.id || `fb_${screenData.question?.slice(0, 20)}`,
            title: `빈칸채우기: ${screenData.question}`,
            difficulty: 'medium',
            category: '빈칸채우기',
          };

        case 'LV4_DEBUGGING':
          return {
            id: screenData.problemId || `debug_${screenData.title?.slice(0, 20)}`,
            title: screenData.title || '디버깅 문제',
            difficulty: 'medium',
            category: '디버깅',
            language: screenData.language || 'JavaScript',
          };

        case 'LV5_EXPERT':
          return {
            id: screenData.problemId || `expert_${screenData.scenario?.slice(0, 20)}`,
            title: screenData.scenario || '전문가 문제',
            difficulty: 'hard',
            category: '전문가모드',
          };

        default:
          return null;
      }
    } catch (error) {
      console.error('Failed to extract problem info:', error);
      return null;
    }
  }

  /**
   * Add community button to practice screen headers
   */
  static createCommunityButton(
    navigation: any,
    problemInfo: ProblemInfo,
    source: string,
    customStyle?: any
  ) {
    return {
      title: '💬',
      onPress: () => this.navigateToDiscussion(navigation, problemInfo, source),
      style: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F2BED1',
        borderRadius: 8,
        ...customStyle,
      },
      textStyle: {
        fontSize: 16,
      },
    };
  }

  /**
   * Show community prompt after problem completion
   */
  static showCommunityPrompt(
    navigation: any,
    problemInfo: ProblemInfo,
    result: { isCorrect: boolean; userAnswer: any; explanation?: string },
    source: string
  ) {
    const promptMessage = result.isCorrect
      ? '정답입니다! 이 문제에 대한 다른 풀이법을 공유하거나 토론에 참여해보세요.'
      : '틀렸습니다. 커뮤니티에서 해설과 다른 사람들의 풀이를 확인해보세요.';

    return {
      show: true,
      message: promptMessage,
      actions: [
        {
          text: '토론 참여',
          style: 'primary',
          onPress: () => this.navigateToDiscussion(navigation, problemInfo, source),
        },
        {
          text: result.isCorrect ? '풀이 공유' : '해설 보기',
          style: 'secondary',
          onPress: () => this.navigateToDiscussion(navigation, problemInfo, source),
        },
        {
          text: '다음 문제',
          style: 'default',
          onPress: () => {}, // Will be handled by parent component
        },
      ],
    };
  }

  /**
   * Get suggested community actions based on user behavior
   */
  static getSuggestedActions(
    userStats: {
      correctAnswers: number;
      incorrectAnswers: number;
      hintUsage: number;
      timeSpent: number;
    },
    problemInfo: ProblemInfo
  ) {
    const suggestions = [];

    // High hint usage - suggest seeking help
    if (userStats.hintUsage > 2) {
      suggestions.push({
        type: 'ask_help',
        message: '어려운 문제인가요? 커뮤니티에 질문을 올려보세요.',
        action: 'navigate_to_discussion',
      });
    }

    // High accuracy - suggest sharing solutions
    if (userStats.correctAnswers > userStats.incorrectAnswers * 2) {
      suggestions.push({
        type: 'share_solution',
        message: '실력이 좋으시네요! 다른 사람들과 풀이법을 공유해보세요.',
        action: 'navigate_to_discussion',
      });
    }

    // Quick solve - suggest advanced problems
    if (userStats.timeSpent < 30 && userStats.correctAnswers > 0) {
      suggestions.push({
        type: 'challenge',
        message: '빠른 해결! 더 어려운 문제에 도전해보거나 다른 풀이법을 찾아보세요.',
        action: 'navigate_to_discussion',
      });
    }

    return suggestions;
  }

  /**
   * Track community engagement metrics
   */
  static trackEngagement(event: {
    type: 'button_click' | 'navigation' | 'prompt_shown' | 'prompt_action';
    source: string;
    problemId: string;
    action?: string;
    metadata?: Record<string, any>;
  }) {
    // Analytics tracking for community engagement
    console.log('Community Engagement:', {
      timestamp: new Date().toISOString(),
      ...event,
    });

    // Here you would integrate with your analytics service
    // Example: Analytics.track('community_engagement', event);
  }
}

/**
 * Hook for using community integration in practice screens
 */
export const useCommunityIntegration = (
  navigation: any,
  screenType: string,
  screenData: any
) => {
  const problemInfo = CommunityIntegration.extractProblemInfo(screenData, screenType);

  const navigateToDiscussion = () => {
    if (problemInfo) {
      CommunityIntegration.trackEngagement({
        type: 'navigation',
        source: screenType,
        problemId: problemInfo.id,
      });
      CommunityIntegration.navigateToDiscussion(navigation, problemInfo, screenType);
    }
  };

  const createCommunityButton = (customStyle?: any) => {
    if (!problemInfo) return null;

    return CommunityIntegration.createCommunityButton(
      navigation,
      problemInfo,
      screenType,
      customStyle
    );
  };

  const showCompletionPrompt = (result: any) => {
    if (!problemInfo) return null;

    CommunityIntegration.trackEngagement({
      type: 'prompt_shown',
      source: screenType,
      problemId: problemInfo.id,
      metadata: { result },
    });

    return CommunityIntegration.showCommunityPrompt(
      navigation,
      problemInfo,
      result,
      screenType
    );
  };

  return {
    problemInfo,
    navigateToDiscussion,
    createCommunityButton,
    showCompletionPrompt,
    trackEngagement: (event: Omit<Parameters<typeof CommunityIntegration.trackEngagement>[0], 'problemId'>) => {
      if (problemInfo) {
        CommunityIntegration.trackEngagement({
          ...event,
          problemId: problemInfo.id,
        });
      }
    },
  };
};