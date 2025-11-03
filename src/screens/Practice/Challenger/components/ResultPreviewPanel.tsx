import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ResultPreviewPanelProps, UserActionType } from '../VibeSessionScreen.types';
import { styles } from '../VibeSessionScreen.styles';
import CodeEditor from './CodeEditor';

/**
 * ResultPreviewPanel Component
 *
 * 우측 패널에서 AI 생성 결과를 미리보기하고 관리하는 컴포넌트입니다.
 * 코드 편집, 결과 핀고정, 히스토리 관리 등의 기능을 제공합니다.
 *
 * SOLID 원칙:
 * - Single Responsibility: 결과 미리보기와 관리만 담당
 * - Interface Segregation: 결과 관련 정보만 props로 받음
 */
const ResultPreviewPanel: React.FC<ResultPreviewPanelProps> = ({
  currentResult,
  allResults,
  isGenerating,
  onCodeEdit,
  onResultAction,
  onResultSelect,
}) => {
  const [selectedTab, setSelectedTab] = useState<'current' | 'history'>('current');
  const [showMetadata, setShowMetadata] = useState(false);

  // Handle user actions on results
  const handleResultAction = useCallback((action: UserActionType, data?: any) => {
    if (!currentResult) return;

    switch (action) {
      case 'pin':
        Alert.alert(
          '결과 고정',
          '이 결과를 고정하시겠습니까? 고정된 결과는 세션 종료 시까지 보존됩니다.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '고정',
              onPress: () => {
                onResultAction && onResultAction(action, { resultId: currentResult.id });
              },
            },
          ]
        );
        break;

      case 'retry':
        Alert.alert(
          '재생성 요청',
          '같은 프롬프트로 다시 생성하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '재생성',
              onPress: () => {
                onResultAction && onResultAction(action, { resultId: currentResult.id });
              },
            },
          ]
        );
        break;

      case 'approve':
      case 'reject':
        onResultAction && onResultAction(action, { resultId: currentResult.id, ...data });
        break;

      default:
        onResultAction && onResultAction(action, data);
    }
  }, [currentResult, onResultAction]);

  // Format quality metrics for display
  const formatQualityScore = (score: number): string => {
    if (score >= 90) return `${score}% 우수`;
    if (score >= 80) return `${score}% 양호`;
    if (score >= 70) return `${score}% 보통`;
    return `${score}% 개선 필요`;
  };

  // Get quality color based on score
  const getQualityColor = (score: number): string => {
    if (score >= 90) return '#10B981'; // Green
    if (score >= 80) return '#3B82F6'; // Blue
    if (score >= 70) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Render result history item
  const renderHistoryItem = (result: any, index: number) => {
    const isSelected = currentResult?.id === result.id;

    return (
      <TouchableOpacity
        key={result.id}
        style={{
          backgroundColor: isSelected ? '#E0F2FE' : '#F9FAFB',
          borderWidth: 1,
          borderColor: isSelected ? '#0EA5E9' : '#E5E7EB',
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
        onPress={() => onResultSelect && onResultSelect(result)}
        accessibilityRole="button"
        accessibilityLabel={`생성 결과 ${index + 1}`}
        accessibilityState={{ selected: isSelected }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#374151',
          }}>
            결과 #{index + 1}
          </Text>
          <Text style={{
            fontSize: 10,
            color: '#6B7280',
          }}>
            {result.createdAt.toLocaleTimeString()}
          </Text>
        </View>

        <Text style={{
          fontSize: 11,
          color: '#6B7280',
          marginTop: 4,
          numberOfLines: 2,
        }}>
          {result.generatedContent.substring(0, 80)}...
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{
            fontSize: 10,
            color: getQualityColor(result.metadata.qualityMetrics.estimatedAccuracy),
            fontWeight: '600',
          }}>
            정확도: {result.metadata.qualityMetrics.estimatedAccuracy}%
          </Text>
          <Text style={{
            fontSize: 10,
            color: '#6B7280',
          }}>
            {result.tokensUsed} tokens
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.previewPanel}
      accessibilityRole="group"
      accessibilityLabel="결과 미리보기 패널"
    >
      {/* Panel Header */}
      <View style={styles.previewHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.previewTitle}>생성된 결과</Text>
            <Text style={styles.previewSubtitle}>
              {currentResult
                ? `${currentResult.language || 'Python'} • 편집 가능`
                : '프롬프트를 입력하여 결과를 생성하세요'
              }
            </Text>
          </View>

          {/* Tab Selector */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#F3F4F6',
            borderRadius: 8,
            padding: 2,
          }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: selectedTab === 'current' ? '#FFFFFF' : 'transparent',
              }}
              onPress={() => setSelectedTab('current')}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab === 'current' }}
            >
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: selectedTab === 'current' ? '#374151' : '#6B7280',
              }}>
                현재
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 6,
                backgroundColor: selectedTab === 'history' ? '#FFFFFF' : 'transparent',
              }}
              onPress={() => setSelectedTab('history')}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab === 'history' }}
            >
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: selectedTab === 'history' ? '#374151' : '#6B7280',
              }}>
                히스토리 ({allResults.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Area */}
      {selectedTab === 'current' ? (
        <View style={{ flex: 1 }}>
          {/* Current Result */}
          {currentResult ? (
            <>
              {/* Quality Metrics Bar */}
              <View style={{
                backgroundColor: '#F9FAFB',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Text style={{
                    fontSize: 10,
                    color: getQualityColor(currentResult.metadata.qualityMetrics.estimatedAccuracy),
                    fontWeight: '600',
                  }}>
                    정확도: {formatQualityScore(currentResult.metadata.qualityMetrics.estimatedAccuracy)}
                  </Text>
                  <Text style={{
                    fontSize: 10,
                    color: '#6B7280',
                  }}>
                    토큰: {currentResult.tokensUsed}
                  </Text>
                  <Text style={{
                    fontSize: 10,
                    color: '#6B7280',
                  }}>
                    처리: {(currentResult.processingTime / 1000).toFixed(1)}초
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setShowMetadata(!showMetadata)}
                  accessibilityRole="button"
                  accessibilityLabel="상세 정보 토글"
                >
                  <Text style={{
                    fontSize: 10,
                    color: '#3B82F6',
                    fontWeight: '600',
                  }}>
                    {showMetadata ? '간단히' : '상세히'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Detailed Metadata (if enabled) */}
              {showMetadata && (
                <View style={{
                  backgroundColor: '#F8FAFC',
                  borderBottomWidth: 1,
                  borderBottomColor: '#E5E7EB',
                  padding: 12,
                }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151', marginBottom: 4 }}>
                    품질 지표
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    <Text style={{ fontSize: 9, color: '#6B7280' }}>
                      관련성: {currentResult.metadata.qualityMetrics.relevanceScore}%
                    </Text>
                    <Text style={{ fontSize: 9, color: '#6B7280' }}>
                      완성도: {currentResult.metadata.qualityMetrics.completenessScore}%
                    </Text>
                    <Text style={{ fontSize: 9, color: '#6B7280' }}>
                      명확성: {currentResult.metadata.qualityMetrics.clarityScore}%
                    </Text>
                    {currentResult.metadata.qualityMetrics.codeQualityScore && (
                      <Text style={{ fontSize: 9, color: '#6B7280' }}>
                        코드 품질: {currentResult.metadata.qualityMetrics.codeQualityScore}%
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Code Editor */}
              <CodeEditor
                code={currentResult.extractedCode || currentResult.generatedContent}
                language={currentResult.language || 'python'}
                onCodeChange={onCodeEdit}
                showLineNumbers={true}
                theme="light"
                maxHeight={400}
              />

              {/* Action Buttons */}
              <View style={{
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                padding: 16,
                flexDirection: 'row',
                gap: 8,
              }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#F3F4F6',
                    paddingVertical: 8,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                  onPress={() => handleResultAction('retry')}
                  accessibilityRole="button"
                  accessibilityLabel="재생성"
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151' }}>
                    🔄 재생성
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#FEF3C7',
                    paddingVertical: 8,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                  onPress={() => handleResultAction('pin')}
                  accessibilityRole="button"
                  accessibilityLabel="결과 고정"
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#92400E' }}>
                    📌 고정
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#D1FAE5',
                    paddingVertical: 8,
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                  onPress={() => handleResultAction('approve')}
                  accessibilityRole="button"
                  accessibilityLabel="결과 승인"
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#065F46' }}>
                    ✅ 승인
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 32,
            }}>
              {isGenerating ? (
                <>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#374151',
                    textAlign: 'center',
                  }}>
                    🤖 AI가 결과를 생성하고 있습니다
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#6B7280',
                    textAlign: 'center',
                    marginTop: 8,
                  }}>
                    잠시만 기다려주세요...
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#374151',
                    textAlign: 'center',
                  }}>
                    💬 프롬프트를 입력해보세요
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: '#6B7280',
                    textAlign: 'center',
                    marginTop: 8,
                    lineHeight: 16,
                  }}>
                    하단의 입력창에 질문이나 요청사항을 입력하면{'\n'}
                    AI가 코드와 솔루션을 생성해드립니다.
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      ) : (
        /* History Tab */
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {allResults.length > 0 ? (
            allResults.map((result, index) => renderHistoryItem(result, index))
          ) : (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 40,
            }}>
              <Text style={{
                fontSize: 14,
                color: '#6B7280',
                textAlign: 'center',
              }}>
                📝 아직 생성된 결과가 없습니다
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#9CA3AF',
                textAlign: 'center',
                marginTop: 4,
              }}>
                AI와 대화하여 결과를 생성해보세요.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ResultPreviewPanel;