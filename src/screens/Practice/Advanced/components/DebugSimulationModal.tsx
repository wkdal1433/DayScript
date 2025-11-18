import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { DebugSimulationModalProps, TestCase, CodeExecutionResult, TestCaseResult } from '../Lv4DebuggingScreen.types';
import { styles } from './DebugSimulationModal.styles';
import ShakeAnimation from './ShakeAnimation';
import ProgressBar from './ProgressBar';

/**
 * DebugSimulationModal Component
 * 코드 실행 시뮬레이션 및 테스트 케이스 검증 모달
 * SOLID 원칙: 단일 책임 - 코드 실행 시뮬레이션과 결과 표시만 담당
 */
const DebugSimulationModal: React.FC<DebugSimulationModalProps> = ({
  isVisible,
  code,
  language,
  testCases,
  onExecutionComplete,
  onClose,
  isExecuting = false,
}) => {
  const [currentResult, setCurrentResult] = useState<CodeExecutionResult | null>(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // 모달이 열릴 때 애니메이션 실행
  useEffect(() => {
    if (isVisible) {
      setShowResults(false);
      setCurrentTestIndex(0);
      setCurrentResult(null);
      setShouldShake(false);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // 자동으로 코드 실행 시뮬레이션 시작
      setTimeout(() => {
        simulateCodeExecution();
      }, 500);
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [isVisible]);

  // 코드 실행 시뮬레이션
  const simulateCodeExecution = async () => {
    try {
      const results: TestCase[] = [];
      let passedCount = 0;

      // 각 테스트 케이스를 순차적으로 실행 (시뮬레이션)
      for (let i = 0; i < testCases.length; i++) {
        setCurrentTestIndex(i);

        // 실행 시간 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 800));

        const testCase = testCases[i];
        const result = await simulateTestCase(testCase, code);

        results.push(result);

        if (result.result === 'PASSED') {
          passedCount++;
        }
      }

      // 최종 결과 생성
      const finalResult: CodeExecutionResult = {
        isSuccess: passedCount === testCases.length,
        passedTests: passedCount,
        totalTests: testCases.length,
        testResults: results,
        executionTime: Math.random() * 100 + 50, // 시뮬레이션된 실행 시간
      };

      setCurrentResult(finalResult);
      setShowResults(true);

      // 실패 시 흔들림 효과
      if (!finalResult.isSuccess) {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 600);
      }

      // 결과 콜백 호출
      onExecutionComplete(finalResult);

    } catch (error) {
      const errorResult: CodeExecutionResult = {
        isSuccess: false,
        passedTests: 0,
        totalTests: testCases.length,
        testResults: testCases.map(tc => ({ ...tc, result: 'FAILED', actualOutput: 'Runtime Error' })),
        error: '코드 실행 중 오류가 발생했습니다.',
      };

      setCurrentResult(errorResult);
      setShowResults(true);
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 600);

      onExecutionComplete(errorResult);
    }
  };

  // 개별 테스트 케이스 시뮬레이션
  const simulateTestCase = async (testCase: TestCase, code: string): Promise<TestCase> => {
    // 실제 구현에서는 여기서 코드를 실행하고 결과를 비교
    // 현재는 간단한 시뮬레이션으로 구현

    // 코드에 특정 패턴이 있는지 확인하여 통과/실패 결정
    const hasCorrectPattern = checkCodePattern(code, testCase);

    const result: TestCase = {
      ...testCase,
      result: hasCorrectPattern ? 'PASSED' : 'FAILED',
      actualOutput: hasCorrectPattern ? testCase.expectedOutput : 'Wrong output',
    };

    return result;
  };

  // 코드 패턴 검사 (실제 실행 대신 시뮬레이션)
  const checkCodePattern = (code: string, testCase: TestCase): boolean => {
    // 간단한 패턴 매칭으로 시뮬레이션
    // 실제로는 코드를 실행하고 결과를 비교해야 함

    // 기본적으로 코드에 필요한 키워드들이 있는지 확인
    const requiredKeywords = ['def', 'return', 'if']; // Python 기준
    const hasKeywords = requiredKeywords.some(keyword => code.includes(keyword));

    // 랜덤 요소 추가 (80% 성공률)
    const randomFactor = Math.random() > 0.2;

    return hasKeywords && randomFactor;
  };

  // 테스트 케이스 결과 아이콘
  const getTestResultIcon = (result: TestCaseResult) => {
    switch (result) {
      case 'PASSED':
        return '✅';
      case 'FAILED':
        return '❌';
      default:
        return '⏳';
    }
  };

  // 테스트 케이스 결과 색상
  const getTestResultColor = (result: TestCaseResult) => {
    switch (result) {
      case 'PASSED':
        return '#10B981';
      case 'FAILED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ShakeAnimation shouldShake={shouldShake}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* 모달 헤더 */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🏃‍♂️ 코드 실행 결과</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 진행률 표시 */}
            {!showResults && (
              <View style={styles.progressSection}>
                <Text style={styles.progressText}>
                  테스트 케이스 실행 중... ({currentTestIndex + 1}/{testCases.length})
                </Text>
                <ProgressBar
                  progress={(currentTestIndex + 1) / testCases.length}
                  animationDuration={800}
                />
                <ActivityIndicator size="large" color="#BE185D" style={styles.loader} />
              </View>
            )}

            {/* 실행 결과 */}
            {showResults && currentResult && (
              <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                {/* 전체 결과 요약 */}
                <View style={[
                  styles.summaryContainer,
                  currentResult.isSuccess ? styles.successSummary : styles.failureSummary
                ]}>
                  <Text style={styles.summaryIcon}>
                    {currentResult.isSuccess ? '🎉' : '🔧'}
                  </Text>
                  <Text style={[
                    styles.summaryTitle,
                    currentResult.isSuccess ? styles.successText : styles.failureText
                  ]}>
                    {currentResult.isSuccess ? '모든 테스트 통과!' : '디버깅이 필요합니다'}
                  </Text>
                  <Text style={styles.summaryStats}>
                    {currentResult.passedTests}/{currentResult.totalTests} 테스트 통과
                  </Text>
                  {currentResult.executionTime && (
                    <Text style={styles.executionTime}>
                      실행 시간: {currentResult.executionTime.toFixed(1)}ms
                    </Text>
                  )}
                </View>

                {/* 개별 테스트 케이스 결과 */}
                <View style={styles.testCasesContainer}>
                  <Text style={styles.testCasesTitle}>📋 테스트 케이스 세부 결과</Text>

                  {currentResult.testResults.map((testCase, index) => (
                    <View key={testCase.id} style={styles.testCaseItem}>
                      <View style={styles.testCaseHeader}>
                        <Text style={styles.testCaseIcon}>
                          {getTestResultIcon(testCase.result!)}
                        </Text>
                        <Text style={styles.testCaseTitle}>
                          테스트 케이스 {index + 1}
                        </Text>
                        <View style={[
                          styles.testCaseStatus,
                          { backgroundColor: getTestResultColor(testCase.result!) }
                        ]}>
                          <Text style={styles.testCaseStatusText}>
                            {testCase.result === 'PASSED' ? 'PASS' : 'FAIL'}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.testCaseDescription}>
                        {testCase.description}
                      </Text>

                      <View style={styles.testCaseDetails}>
                        <View style={styles.testCaseInput}>
                          <Text style={styles.testCaseLabel}>📥 입력:</Text>
                          <Text style={styles.testCaseValue}>{testCase.input}</Text>
                        </View>

                        <View style={styles.testCaseOutput}>
                          <Text style={styles.testCaseLabel}>📤 기댓값:</Text>
                          <Text style={styles.testCaseValue}>{testCase.expectedOutput}</Text>
                        </View>

                        <View style={styles.testCaseOutput}>
                          <Text style={styles.testCaseLabel}>🖥 실제 출력:</Text>
                          <Text style={[
                            styles.testCaseValue,
                            testCase.result === 'FAILED' && styles.failureValue
                          ]}>
                            {testCase.actualOutput}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* 에러 메시지 (있는 경우) */}
                {currentResult.error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>⚠️ 실행 오류</Text>
                    <Text style={styles.errorMessage}>{currentResult.error}</Text>
                  </View>
                )}
              </ScrollView>
            )}

            {/* 모달 액션 버튼 */}
            <View style={styles.actionContainer}>
              {showResults && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    currentResult?.isSuccess ? styles.successButton : styles.retryButton
                  ]}
                  onPress={onClose}
                >
                  <Text style={styles.actionButtonText}>
                    {currentResult?.isSuccess ? '계속하기' : '코드 수정하기'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </ShakeAnimation>
      </View>
    </Modal>
  );
};

export default DebugSimulationModal;