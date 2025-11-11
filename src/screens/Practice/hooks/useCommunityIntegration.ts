/**
 * React Hook for Community Integration in Practice Screens
 * Provides seamless integration between practice screens and community features
 */

import { useState, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useCommunityIntegration as useCommunityIntegrationUtil } from '../utils/communityIntegration';

interface UseCommunityIntegrationProps {
  navigation: any;
  screenType: string;
  screenData: any;
  onCommunityNavigation?: () => void;
}

interface CommunityPromptConfig {
  showAfterIncorrect: boolean;
  showAfterCorrect: boolean;
  showAfterHintUsage: number;
  autoShowDelay: number; // milliseconds
}

export const useCommunityIntegration = ({
  navigation,
  screenType,
  screenData,
  onCommunityNavigation,
}: UseCommunityIntegrationProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptConfig, setPromptConfig] = useState<CommunityPromptConfig>({
    showAfterIncorrect: true,
    showAfterCorrect: false,
    showAfterHintUsage: 3,
    autoShowDelay: 2000,
  });

  const promptTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    problemInfo,
    navigateToDiscussion,
    createCommunityButton,
    showCompletionPrompt,
    trackEngagement,
  } = useCommunityIntegrationUtil(navigation, screenType, screenData);

  /**
   * Handle navigation to community with analytics
   */
  const handleCommunityNavigation = useCallback(
    (source: string = 'button') => {
      trackEngagement({
        type: 'navigation',
        source: screenType,
        action: source,
      });

      onCommunityNavigation?.();
      navigateToDiscussion();
    },
    [navigateToDiscussion, trackEngagement, screenType, onCommunityNavigation]
  );

  /**
   * Show community prompt based on user action
   */
  const showCommunityPrompt = useCallback(
    (result: {
      isCorrect: boolean;
      userAnswer: any;
      explanation?: string;
      hintUsage?: number;
    }) => {
      const { isCorrect, hintUsage = 0 } = result;

      // Check if we should show prompt based on config
      const shouldShow =
        (isCorrect && promptConfig.showAfterCorrect) ||
        (!isCorrect && promptConfig.showAfterIncorrect) ||
        (hintUsage >= promptConfig.showAfterHintUsage);

      if (!shouldShow || !problemInfo) return;

      const prompt = showCompletionPrompt(result);
      if (!prompt) return;

      // Clear existing timeout
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }

      // Show prompt after delay
      promptTimeoutRef.current = setTimeout(() => {
        setShowPrompt(true);

        Alert.alert(
          '커뮤니티 참여',
          prompt.message,
          prompt.actions.map(action => ({
            text: action.text,
            style: action.style === 'primary' ? 'default' :
                   action.style === 'secondary' ? 'default' : 'cancel',
            onPress: () => {
              if (action.text.includes('토론') || action.text.includes('해설') || action.text.includes('공유')) {
                handleCommunityNavigation('prompt_action');
              }
              setShowPrompt(false);

              trackEngagement({
                type: 'prompt_action',
                source: screenType,
                action: action.text,
              });

              action.onPress();
            },
          })),
          { cancelable: true }
        );
      }, promptConfig.autoShowDelay);
    },
    [problemInfo, promptConfig, showCompletionPrompt, handleCommunityNavigation, trackEngagement, screenType]
  );

  /**
   * Create a header button for community navigation
   */
  const getCommunityHeaderButton = useCallback(
    (customStyle?: any) => {
      const button = createCommunityButton(customStyle);
      if (!button) return null;

      return {
        ...button,
        onPress: () => {
          button.onPress();
          handleCommunityNavigation('header_button');
        },
      };
    },
    [createCommunityButton, handleCommunityNavigation]
  );

  /**
   * Get inline community actions for problem results
   */
  const getCommunityActions = useCallback(
    (result: { isCorrect: boolean; userAnswer: any }) => {
      if (!problemInfo) return [];

      const actions = [];

      if (result.isCorrect) {
        actions.push({
          title: '💡 풀이 공유하기',
          subtitle: '나의 해결 방법을 다른 사람들과 공유해보세요',
          onPress: () => handleCommunityNavigation('share_solution'),
          style: 'success',
        });

        actions.push({
          title: '🔍 다른 풀이 보기',
          subtitle: '다른 사람들은 어떻게 풀었는지 확인해보세요',
          onPress: () => handleCommunityNavigation('view_solutions'),
          style: 'info',
        });
      } else {
        actions.push({
          title: '❓ 도움 요청하기',
          subtitle: '커뮤니티에 질문을 올려 도움을 받아보세요',
          onPress: () => handleCommunityNavigation('ask_help'),
          style: 'warning',
        });

        actions.push({
          title: '📚 해설 보기',
          subtitle: '상세한 해설과 토론을 확인해보세요',
          onPress: () => handleCommunityNavigation('view_explanation'),
          style: 'info',
        });
      }

      return actions;
    },
    [problemInfo, handleCommunityNavigation]
  );

  /**
   * Update prompt configuration
   */
  const updatePromptConfig = useCallback(
    (config: Partial<CommunityPromptConfig>) => {
      setPromptConfig(prev => ({ ...prev, ...config }));
    },
    []
  );

  /**
   * Cleanup function
   */
  const cleanup = useCallback(() => {
    if (promptTimeoutRef.current) {
      clearTimeout(promptTimeoutRef.current);
    }
    setShowPrompt(false);
  }, []);

  return {
    // State
    problemInfo,
    showPrompt,
    promptConfig,

    // Actions
    handleCommunityNavigation,
    showCommunityPrompt,
    getCommunityHeaderButton,
    getCommunityActions,
    updatePromptConfig,
    cleanup,

    // Utils
    trackEngagement,
  };
};

export default useCommunityIntegration;