import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useHint } from '../../../hooks/useHint';
import {
  Lv4DebuggingScreenProps,
  DebuggingProblemData,
  CodeExecutionResult,
  DebuggingHint,
  TestCase,
} from './Lv4DebuggingScreen.types';
import { styles } from './Lv4DebuggingScreen.styles';

// 컴포넌트 imports
import CodeEditor from './components/CodeEditor';
import DebugSimulationModal from './components/DebugSimulationModal';
import DebuggingHintCard from './components/DebuggingHintCard';

/**
 * Lv4DebuggingScreen Component
 * 중급 단계 디버깅 모드 학습 화면
 *
 * SOLID 원칙 적용:
 * - 단일 책임: 디버깅 학습 화면의 전체 관리만 담당
 * - 개방-폐쇄: 새로운 문제 유형 추가 시 기존 코드 수정 없이 확장 가능
 * - 리스코프 치환: 인터페이스 기반 props로 예측 가능한 동작 보장
 * - 인터페이스 분리: 각 컴포넌트별 독립적인 props 인터페이스
 * - 의존 역전: 구체적 구현이 아닌 추상화에 의존
 */
const Lv4DebuggingScreen: React.FC<Lv4DebuggingScreenProps> = ({
  onDebugComplete,
  onClose,
  onNext,
  onSessionComplete,
  onShowGoalModal,
  timeRemaining = 600, // 10분 기본값
  problemData,
}) => {
  // State Management
  const [currentCode, setCurrentCode] = useState('');
  const [isSimulationVisible, setIsSimulationVisible] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [currentProblemData, setCurrentProblemData] = useState<DebuggingProblemData | null>(null);
  const [sessionProgress, setSessionProgress] = useState({ current: 1, total: 10, percentage: 10 });

  // Hint System Integration
  const hintConfig = { maxSteps: 3, xpDeductionPerStep: 10 };
  const {
    hintState,
    showHint,
    nextHint,
    hideHint,
    resetHint,
    getCurrentHintData,
    isLastStep,
  } = useHint(hintConfig);

  // Mock 문제 데이터 (실제로는 API에서 가져올 데이터)
  const mockProblemData: DebuggingProblemData = {
    id: 'debug-001',
    title: '리스트 합계 계산 오류',
    description: '주어진 숫자 리스트의 합계를 계산하는 함수에 버그가 있습니다. 코드를 수정하여 모든 테스트 케이스가 통과하도록 만드세요.',
    initialCode: `def calculate_sum(numbers):
    total = 0
    for i in range(len(numbers) + 1):  # 버그: 범위 초과
        total += numbers[i]
    return total

# 테스트용 호출
result = calculate_sum([1, 2, 3, 4, 5])
print(result)`,
    language: 'python',
    difficulty: 'intermediate',
    category: '배열/리스트',
    hints: [
      {
        id: 1,
        title: '💡 개념적 단서',
        content: '리스트의 인덱스 범위를 다시 확인해보세요. Python에서 리스트의 유효한 인덱스 범위는 0부터 len(list)-1까지입니다.',
        type: 'concept',
      },
      {
        id: 2,
        title: '🔍 시각적 단서',
        content: 'for문에서 range() 함수의 사용을 자세히 살펴보세요. 현재 range(len(numbers) + 1)로 설정되어 있는데, 이것이 올바른 범위일까요?',
        type: 'visual',
      },
      {
        id: 3,
        title: '🎯 구체적 수정',
        content: '5번째 줄의 range(len(numbers) + 1)을 range(len(numbers))로 수정하거나, 더 간단하게 for number in numbers: 형태로 변경해보세요.',
        type: 'specific',
        codeHighlight: {
          startLine: 3,
          endLine: 3,
          message: '이 줄에서 인덱스 범위가 잘못되었습니다.',
        },
      },
    ],
    testCases: [
      {
        id: 'test-1',
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '15',
        description: '기본적인 양수 리스트 합계',
      },
      {
        id: 'test-2',
        input: '[0, -1, 5, -3]',
        expectedOutput: '1',
        description: '음수가 포함된 리스트 합계',
      },
      {
        id: 'test-3',
        input: '[]',
        expectedOutput: '0',
        description: '빈 리스트의 경우',
      },
    ],
  };

  // 초기화
  useEffect(() => {
    const problemToUse = problemData || mockProblemData;
    setCurrentProblemData(problemToUse);
    setCurrentCode(problemToUse.initialCode);
  }, [problemData]);

  // 코드 변경 핸들러
  const handleCodeChange = useCallback((newCode: string) => {
    setCurrentCode(newCode);
  }, []);

  // 코드 실행 핸들러
  const handleExecuteCode = useCallback(() => {
    if (!currentCode.trim()) {
      Alert.alert('알림', '실행할 코드를 입력해주세요.');
      return;
    }

    setIsExecuting(true);
    setIsSimulationVisible(true);
  }, [currentCode]);

  // 실행 완료 핸들러
  const handleExecutionComplete = useCallback((result: CodeExecutionResult) => {
    setIsExecuting(false);
    setExecutionResult(result);

    if (onDebugComplete) {
      onDebugComplete(result);
    }

    // 모든 테스트 통과 시 축하 메시지
    if (result.isSuccess) {
      setTimeout(() => {
        Alert.alert(
          '🎉 디버깅 성공!',
          `모든 테스트 케이스를 통과했습니다!\n${result.passedTests}/${result.totalTests} 테스트 성공`,
          [
            {
              text: '다음 문제로',
              onPress: handleNextProblem,
            },
          ]
        );
      }, 1000);
    }
  }, [onDebugComplete]);

  // 시뮬레이션 모달 닫기
  const handleCloseSimulation = useCallback(() => {
    setIsSimulationVisible(false);
  }, []);

  // 힌트 요청 핸들러
  const handleHintRequest = useCallback(() => {
    if (!hintState.isVisible) {
      showHint();
    } else if (!isLastStep()) {
      nextHint();
    }
  }, [hintState.isVisible, showHint, nextHint, isLastStep]);

  // 다음 문제로 이동
  const handleNextProblem = useCallback(() => {
    resetHint();
    setExecutionResult(null);

    if (sessionProgress.current >= sessionProgress.total) {
      // 세션 완료
      if (onSessionComplete) {
        onSessionComplete();
      }
    } else {
      // 다음 문제로
      if (onNext) {
        onNext();
      }
    }
  }, [sessionProgress, resetHint, onSessionComplete, onNext]);

  // 닫기 핸들러
  const handleClose = useCallback(() => {
    Alert.alert(
      '학습 종료',
      '정말로 디버깅 학습을 종료하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '종료',
          style: 'destructive',
          onPress: () => {
            if (onClose) {
              onClose();
            }
          },
        },
      ]
    );
  }, [onClose]);

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!currentProblemData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>문제를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.problemCounter}>
            문제 {sessionProgress.current}/{sessionProgress.total}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentProblemData.category}</Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>

      {/* 진행률 표시 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${sessionProgress.percentage}%` },
            ]}
          />
        </View>
      </View>

      {/* 메인 컨텐츠 */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 문제 설명 */}
        <View style={styles.problemContainer}>
          <Text style={styles.problemTitle}>{currentProblemData.title}</Text>
          <Text style={styles.problemDescription}>{currentProblemData.description}</Text>

          {/* 힌트 버튼 */}
          <TouchableOpacity
            style={styles.hintButton}
            onPress={handleHintRequest}
            accessibilityRole="button"
            accessibilityLabel="힌트 보기"
          >
            <Text style={styles.hintButtonText}>
              💡 힌트 보기 {hintState.usedSteps > 0 && `(${hintState.usedSteps}/${hintConfig.maxSteps})`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 코드 에디터 */}
        <CodeEditor
          code={currentCode}
          language={currentProblemData.language}
          onCodeChange={handleCodeChange}
          highlightedLines={
            hintState.isVisible && getCurrentHintData(currentProblemData.hints)?.codeHighlight
              ? [getCurrentHintData(currentProblemData.hints)!.codeHighlight!.startLine]
              : []
          }
        />

        {/* 실행 버튼 */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.executeButton,
              isExecuting && styles.executeButtonDisabled,
            ]}
            onPress={handleExecuteCode}
            disabled={isExecuting}
            accessibilityRole="button"
            accessibilityLabel="코드 실행하기"
          >
            <Text style={styles.executeButtonText}>
              {isExecuting ? '⏳ 실행 중...' : '▶️ 코드 실행하기'}
            </Text>
          </TouchableOpacity>

          {/* 다음 문제 버튼 (성공 시에만 표시) */}
          {executionResult?.isSuccess && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextProblem}
              accessibilityRole="button"
              accessibilityLabel="다음 문제로 이동"
            >
              <Text style={styles.nextButtonText}>다음 문제로 이동 🚀</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 힌트 카드 */}
      {hintState.isVisible && (
        <DebuggingHintCard
          isVisible={hintState.isVisible}
          hint={getCurrentHintData(currentProblemData.hints)!}
          currentStep={hintState.currentStep}
          totalSteps={hintConfig.maxSteps}
          totalXpDeducted={hintState.totalXpDeducted}
          onNextHint={handleHintRequest}
          onClose={hideHint}
          isLastStep={isLastStep()}
        />
      )}

      {/* 시뮬레이션 모달 */}
      <DebugSimulationModal
        isVisible={isSimulationVisible}
        code={currentCode}
        language={currentProblemData.language}
        testCases={currentProblemData.testCases}
        onExecutionComplete={handleExecutionComplete}
        onClose={handleCloseSimulation}
        isExecuting={isExecuting}
      />
    </SafeAreaView>
  );
};

export default Lv4DebuggingScreen;