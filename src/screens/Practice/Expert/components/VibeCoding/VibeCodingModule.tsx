import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Alert,
  AccessibilityInfo,
  Keyboard,
} from 'react-native';
import {
  ExpertSessionConfig,
  VibePromptData,
  VibeEvaluationScores,
  ExpertModeError,
  VibeModuleScore,
} from '../../Lv5ExpertModeScreen.types';
import { styles } from '../../Lv5ExpertModeScreen.styles';

// Component imports
import VibePromptInterface from './VibePromptInterface';
import AIResponseViewer from './AIResponseViewer';
import TokenEfficiencyMonitor from './TokenEfficiencyMonitor';
import AccuracyEvaluator from './AccuracyEvaluator';
import PromptHistoryPanel from './PromptHistoryPanel';

interface VibeCodingModuleProps {
  sessionId: string;
  config?: ExpertSessionConfig;
  onScoreUpdate: (scores: VibeModuleScore) => void;
  onError: (error: ExpertModeError) => void;
}

/**
 * VibeCodingModule Component
 *
 * Main module for AI prompting, code generation, and evaluation.
 * Implements the "Vibe Coding" learning methodology where users learn
 * to effectively communicate with AI systems for code generation.
 *
 * SOLID Principles:
 * - Single Responsibility: Manages only Vibe Coding workflow and state
 * - Open/Closed: Extensible for new AI providers and evaluation methods
 * - Interface Segregation: Focused props for Vibe Coding functionality
 * - Dependency Inversion: Uses abstract interfaces for AI services
 */
const VibeCodingModule: React.FC<VibeCodingModuleProps> = ({
  sessionId,
  config,
  onScoreUpdate,
  onError,
}) => {
  // Core state
  const [currentPrompt, setCurrentPrompt] = useState<VibePromptData | null>(null);
  const [promptHistory, setPromptHistory] = useState<VibePromptData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionTokens, setSessionTokens] = useState(0);
  const [currentScores, setCurrentScores] = useState<VibeModuleScore>({
    accuracy: 0,
    quality: 0,
    efficiency: 0,
    creativity: 0,
    speed: 0,
    overall: 0,
  });

  // Module state
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [autoEvaluate, setAutoEvaluate] = useState(config?.enableAIAssistance ?? true);

  // Refs for performance
  const evaluationTimeoutRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>();

  // Constants
  const supportedLanguages = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust'];
  const maxTokensPerSession = 10000; // Configurable limit
  const evaluationDelay = 2000; // 2 seconds delay for auto-evaluation

  // Initialize module
  useEffect(() => {
    initializeModule();
    return () => {
      if (evaluationTimeoutRef.current) {
        clearTimeout(evaluationTimeoutRef.current);
      }
    };
  }, []);

  // Update scores when they change
  useEffect(() => {
    onScoreUpdate(currentScores);
  }, [currentScores, onScoreUpdate]);

  // Initialize module
  const initializeModule = useCallback(async () => {
    try {
      // TODO: Load user preferences and history
      // const userPrefs = await VibeUserPreferences.load(sessionId);
      // setSelectedLanguage(userPrefs.preferredLanguage || 'python');

      // Load session history if continuing
      // const history = await VibeSessionService.getHistory(sessionId);
      // setPromptHistory(history);

      AccessibilityInfo.announceForAccessibility('Vibe Coding module initialized');
    } catch (error) {
      onError({
        code: 'MODULE_INIT_FAILED',
        message: 'Failed to initialize Vibe Coding module',
        type: 'service',
        retryable: true,
        context: { error },
      });
    }
  }, [sessionId, onError]);

  // Handle prompt submission
  const handlePromptSubmit = useCallback(async (promptRequest: any) => {
    if (sessionTokens >= maxTokensPerSession) {
      Alert.alert(
        'Token Limit Reached',
        'You have reached the maximum token limit for this session. Please review your previous responses or start a new session.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsProcessing(true);
    startTimeRef.current = Date.now();

    // Dismiss keyboard
    Keyboard.dismiss();

    try {
      // Create prompt data structure
      const promptData: VibePromptData = {
        id: `vibe_${Date.now()}`,
        sessionId,
        promptText: promptRequest.promptText,
        language: promptRequest.language,
        taskType: promptRequest.taskType,
        context: promptRequest.context,
        tokensUsed: 0,
        responseTime: 0,
        createdAt: new Date(),
      };

      // TODO: Call AI service
      const aiResponse = await generateAIResponse(promptData);

      // Update prompt data with response
      const updatedPromptData: VibePromptData = {
        ...promptData,
        aiResponse: aiResponse.content,
        generatedCode: extractCodeFromResponse(aiResponse.content),
        tokensUsed: aiResponse.tokensUsed,
        responseTime: Date.now() - (startTimeRef.current || Date.now()),
      };

      // Update state
      setCurrentPrompt(updatedPromptData);
      setPromptHistory(prev => [...prev, updatedPromptData]);
      setSessionTokens(prev => prev + aiResponse.tokensUsed);

      // Announce success for accessibility
      AccessibilityInfo.announceForAccessibility(
        `AI response generated successfully. ${aiResponse.tokensUsed} tokens used.`
      );

      // Auto-evaluate if enabled
      if (autoEvaluate) {
        evaluationTimeoutRef.current = setTimeout(() => {
          evaluateResponse(updatedPromptData);
        }, evaluationDelay);
      }

    } catch (error) {
      onError({
        code: 'AI_REQUEST_FAILED',
        message: 'Failed to generate AI response',
        type: 'ai_service',
        retryable: true,
        context: { error, promptRequest },
      });
    } finally {
      setIsProcessing(false);
    }
  }, [sessionId, sessionTokens, maxTokensPerSession, autoEvaluate, onError]);

  // Generate AI response (mock implementation)
  const generateAIResponse = async (promptData: VibePromptData) => {
    // TODO: Implement actual AI service call
    // This is a mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

    const mockResponse = {
      content: `# ${promptData.taskType} for ${promptData.language}\n\n\`\`\`${promptData.language}\n# Generated code based on: "${promptData.promptText}"\n\ndef example_function():\n    # Implementation here\n    pass\n\`\`\`\n\nThis code addresses your request by implementing...`,
      tokensUsed: Math.floor(Math.random() * 200) + 50, // Random tokens 50-250
      processingTime: 1500,
      metadata: {},
    };

    return mockResponse;
  };

  // Extract code blocks from AI response
  const extractCodeFromResponse = (response: string): string => {
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)\n```/g;
    const matches = response.match(codeBlockRegex);

    if (matches && matches.length > 0) {
      // Return the first code block, removing the markdown syntax
      return matches[0].replace(/```[\w]*\n/, '').replace(/\n```$/, '');
    }

    return '';
  };

  // Evaluate AI response
  const evaluateResponse = useCallback(async (promptData: VibePromptData) => {
    try {
      // TODO: Implement comprehensive evaluation
      const evaluation = await performResponseEvaluation(promptData);

      // Update prompt with evaluation
      const updatedPrompt = {
        ...promptData,
        evaluationScores: evaluation,
      };

      setCurrentPrompt(updatedPrompt);

      // Update session scores
      updateSessionScores(evaluation);

      // Update history
      setPromptHistory(prev =>
        prev.map(p => p.id === promptData.id ? updatedPrompt : p)
      );

      AccessibilityInfo.announceForAccessibility(
        `Response evaluated. Overall score: ${Math.round(evaluation.accuracy)}%`
      );

    } catch (error) {
      console.warn('Failed to evaluate response:', error);
    }
  }, []);

  // Perform response evaluation (mock implementation)
  const performResponseEvaluation = async (promptData: VibePromptData): Promise<VibeEvaluationScores> => {
    // TODO: Implement actual evaluation logic with AI assistance

    // Mock evaluation based on prompt characteristics
    const promptLength = promptData.promptText.length;
    const hasContext = !!promptData.context;
    const responseTime = promptData.responseTime;
    const tokensUsed = promptData.tokensUsed;

    // Calculate scores (0-100)
    const accuracy = Math.min(100, 60 + (promptLength > 50 ? 20 : 0) + (hasContext ? 15 : 0));
    const quality = Math.min(100, 65 + (promptData.generatedCode ? 25 : 0));
    const efficiency = Math.max(20, 100 - (tokensUsed / 10)); // Lower tokens = higher efficiency
    const creativity = Math.min(100, 50 + Math.random() * 40); // Random for now
    const speed = Math.max(20, 100 - (responseTime / 100)); // Faster = higher score

    return {
      accuracy,
      quality,
      efficiency,
      creativity,
      speed,
      feedback: [
        'Good prompt structure',
        hasContext ? 'Context provided enhanced the response' : 'Consider providing more context',
        tokensUsed < 100 ? 'Efficient token usage' : 'Consider optimizing for fewer tokens',
      ],
      suggestions: [
        'Try being more specific about requirements',
        'Include example inputs/outputs when applicable',
        'Specify coding style preferences',
      ],
    };
  };

  // Update session scores based on latest evaluation
  const updateSessionScores = useCallback((evaluation: VibeEvaluationScores) => {
    setCurrentScores(prevScores => {
      // Calculate weighted average with previous scores
      const historyWeight = Math.min(0.8, promptHistory.length * 0.1);
      const currentWeight = 1 - historyWeight;

      const newScores = {
        accuracy: (prevScores.accuracy * historyWeight) + (evaluation.accuracy * currentWeight),
        quality: (prevScores.quality * historyWeight) + (evaluation.quality * currentWeight),
        efficiency: (prevScores.efficiency * historyWeight) + (evaluation.efficiency * currentWeight),
        creativity: (prevScores.creativity * historyWeight) + (evaluation.creativity * currentWeight),
        speed: (prevScores.speed * historyWeight) + (evaluation.speed * currentWeight),
        overall: 0, // Will be calculated
      };

      // Calculate overall score (weighted average)
      newScores.overall = (
        newScores.accuracy * 0.30 +
        newScores.quality * 0.20 +
        newScores.efficiency * 0.20 +
        newScores.creativity * 0.15 +
        newScores.speed * 0.15
      );

      return newScores;
    });
  }, [promptHistory.length]);

  // Handle response actions
  const handleResponseApprove = useCallback(() => {
    if (currentPrompt) {
      // TODO: Save approved response
      AccessibilityInfo.announceForAccessibility('Response approved');
    }
  }, [currentPrompt]);

  const handleResponseReject = useCallback(() => {
    if (currentPrompt) {
      // TODO: Handle rejection
      AccessibilityInfo.announceForAccessibility('Response rejected');
    }
  }, [currentPrompt]);

  const handleRequestModification = useCallback((feedback: string) => {
    if (currentPrompt) {
      // TODO: Request modification with feedback
      AccessibilityInfo.announceForAccessibility('Modification requested');
    }
  }, [currentPrompt]);

  const handleRetry = useCallback(() => {
    if (currentPrompt) {
      const retryRequest = {
        promptText: currentPrompt.promptText,
        language: currentPrompt.language,
        taskType: currentPrompt.taskType,
        context: currentPrompt.context,
      };
      handlePromptSubmit(retryRequest);
    }
  }, [currentPrompt, handlePromptSubmit]);

  return (
    <ScrollView
      style={styles.moduleContainer}
      showsVerticalScrollIndicator={false}
      accessibilityRole="main"
      accessibilityLabel="Vibe Coding module"
    >
      {/* Prompt Interface */}
      <VibePromptInterface
        onPromptSubmit={handlePromptSubmit}
        isLoading={isProcessing}
        supportedLanguages={supportedLanguages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        placeholder="Describe what you want to build... Be specific about requirements, constraints, and expected behavior."
        maxLength={1000}
      />

      {/* Token Monitor */}
      <TokenEfficiencyMonitor
        currentSessionTokens={sessionTokens}
        totalSessionLimit={maxTokensPerSession}
        currentPromptTokens={currentPrompt?.tokensUsed}
        averageTokensPerPrompt={
          promptHistory.length > 0
            ? Math.round(sessionTokens / promptHistory.length)
            : 0
        }
        efficiencyScore={currentScores.efficiency}
        recommendations={[
          'Be specific but concise in your prompts',
          'Provide context to reduce back-and-forth',
          'Use examples to clarify requirements',
        ]}
      />

      {/* AI Response Viewer */}
      {currentPrompt && (
        <AIResponseViewer
          response={currentPrompt}
          isLoading={isProcessing}
          onRetry={handleRetry}
          onApprove={handleResponseApprove}
          onReject={handleResponseReject}
          onRequestModification={handleRequestModification}
        />
      )}

      {/* Accuracy Evaluator */}
      {currentPrompt?.evaluationScores && (
        <AccuracyEvaluator
          evaluationScores={currentPrompt.evaluationScores}
          sessionScores={currentScores}
          onRequestReEvaluation={() => evaluateResponse(currentPrompt)}
        />
      )}

      {/* Prompt History */}
      {promptHistory.length > 0 && (
        <PromptHistoryPanel
          history={promptHistory}
          onSelectPrompt={(prompt) => setCurrentPrompt(prompt)}
          onClearHistory={() => {
            Alert.alert(
              'Clear History',
              'Are you sure you want to clear the prompt history for this session?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: () => {
                    setPromptHistory([]);
                    AccessibilityInfo.announceForAccessibility('Prompt history cleared');
                  },
                },
              ]
            );
          }}
        />
      )}
    </ScrollView>
  );
};

export default VibeCodingModule;