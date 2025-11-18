import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ConversationPanelProps } from '../VibeSessionScreen.types';
import { styles } from '../VibeSessionScreen.styles';

/**
 * ConversationPanel Component
 *
 * 좌측 패널에서 대화 히스토리와 문제 정보를 표시하는 컴포넌트입니다.
 * 사용자와 AI 간의 모든 대화를 시간순으로 표시하고, 문제 요구사항을 상단에 고정합니다.
 *
 * SOLID 원칙:
 * - Single Responsibility: 대화 표시와 문제 정보 표시만 담당
 * - Interface Segregation: 대화 관련 정보만 props로 받음
 */
const ConversationPanel: React.FC<ConversationPanelProps> = ({
  conversations,
  problem,
  isLoading,
  onMessagePress,
  onProblemHintRequest,
}) => {

  // Format timestamp for display
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get message style based on role
  const getMessageStyle = (role: 'user' | 'ai') => {
    return role === 'user' ? styles.userMessage : styles.aiMessage;
  };

  // Render individual message
  const renderMessage = (message: any) => {
    return (
      <TouchableOpacity
        key={message.id}
        style={styles.messageItem}
        onPress={() => onMessagePress && onMessagePress(message)}
        accessibilityRole="button"
        accessibilityLabel={`${message.role === 'user' ? '사용자' : 'AI'} 메시지`}
        accessibilityHint="탭하여 메시지 상세 정보 보기"
      >
        <View style={getMessageStyle(message.role)}>
          <Text style={styles.messageText}>{message.content}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <Text style={styles.messageTimestamp}>
              {formatTimestamp(message.timestamp)}
            </Text>
            {message.tokensUsed && (
              <Text style={[styles.messageTimestamp, { fontSize: 9 }]}>
                {message.tokensUsed} tokens
              </Text>
            )}
          </View>

          {/* Message metadata indicators */}
          {message.metadata && (
            <View style={{ flexDirection: 'row', marginTop: 2, gap: 4 }}>
              {message.metadata.confidence && (
                <Text style={[styles.messageTimestamp, { fontSize: 9, color: '#10B981' }]}>
                  신뢰도: {Math.round(message.metadata.confidence * 100)}%
                </Text>
              )}
              {message.metadata.processingTime && (
                <Text style={[styles.messageTimestamp, { fontSize: 9, color: '#6B7280' }]}>
                  {(message.metadata.processingTime / 1000).toFixed(1)}초
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.conversationPanel}
      accessibilityLabel="대화 히스토리 패널"
    >
      {/* Problem Section - Fixed at top */}
      {problem && (
        <View style={styles.problemSection}>
          <View style={styles.problemBadge}>
            <View style={styles.problemBadgeIcon} />
            <Text style={styles.problemBadgeText}>질문 #1</Text>
          </View>

          <Text style={styles.problemTitle}>{problem.title}</Text>

          {/* Problem Requirements */}
          {problem.requirements && problem.requirements.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.problemHintText, { fontWeight: '600', marginBottom: 4 }]}>
                요구사항:
              </Text>
              {problem.requirements.map((req, index) => (
                <Text key={index} style={[styles.problemHintText, { marginLeft: 8 }]}>
                  • {req}
                </Text>
              ))}
            </View>
          )}

          {/* Problem Constraints */}
          {problem.constraints && problem.constraints.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.problemHintText, { fontWeight: '600', marginBottom: 4 }]}>
                제약사항:
              </Text>
              {problem.constraints.map((constraint, index) => (
                <Text key={index} style={[styles.problemHintText, { marginLeft: 8 }]}>
                  • {constraint}
                </Text>
              ))}
            </View>
          )}

          {/* Problem Hints */}
          {problem.hints && problem.hints.length > 0 && (
            <View style={styles.problemHint}>
              <Text style={styles.problemHintText}>
                {problem.hints[0].content}
              </Text>

              {problem.hints.length > 1 && onProblemHintRequest && (
                <TouchableOpacity
                  style={{
                    marginTop: 8,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 4,
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => onProblemHintRequest(2)}
                  accessibilityRole="button"
                  accessibilityLabel="추가 힌트 요청"
                >
                  <Text style={[styles.problemHintText, { fontSize: 10 }]}>
                    더 많은 힌트 보기 (-{problem.hints[1]?.tokensDeduction || 50} tokens)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Category and Estimated Time */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.2)',
          }}>
            <Text style={[styles.problemHintText, { fontSize: 10 }]}>
              📚 {problem.category}
            </Text>
            <Text style={[styles.problemHintText, { fontSize: 10 }]}>
              ⏱️ 예상 {problem.estimatedTime}분
            </Text>
          </View>
        </View>
      )}

      {/* Conversation Messages */}
      <ScrollView
        style={styles.conversationList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        accessibilityRole="list"
        accessibilityLabel="대화 메시지 목록"
      >
        {conversations.length === 0 && !isLoading ? (
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
          }}>
            <Text style={[styles.messageText, { textAlign: 'center', opacity: 0.7 }]}>
              💬 AI와 대화를 시작해보세요!
            </Text>
            <Text style={[styles.messageTimestamp, { textAlign: 'center', marginTop: 8 }]}>
              하단의 입력창에 질문이나 요청사항을 입력하세요.
            </Text>
          </View>
        ) : (
          conversations.map(renderMessage)
        )}

        {/* Loading indicator for new messages */}
        {isLoading && (
          <View style={styles.messageItem}>
            <View style={styles.aiMessage}>
              <Text style={styles.messageText}>AI가 응답을 준비하고 있습니다...</Text>
              <View style={{
                flexDirection: 'row',
                marginTop: 8,
                gap: 4,
              }}>
                {[0, 1, 2].map((dot) => (
                  <View
                    key={dot}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#3B82F6',
                      opacity: 0.5 + (dot * 0.2),
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Conversation Stats Footer */}
      {conversations.length > 0 && (
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.2)',
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}>
          <Text style={[styles.messageTimestamp, { textAlign: 'center', fontSize: 10 }]}>
            총 {conversations.length}개의 메시지 •
            사용자 {conversations.filter(m => m.role === 'user').length}개 •
            AI {conversations.filter(m => m.role === 'ai').length}개
          </Text>
        </View>
      )}
    </View>
  );
};

export default ConversationPanel;