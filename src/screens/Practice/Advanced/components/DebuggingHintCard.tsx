import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { DebuggingHintCardProps } from '../Lv4DebuggingScreen.types';
import { styles } from './DebuggingHintCard.styles';

/**
 * DebuggingHintCard Component
 * 디버깅 문제에 특화된 3단계 힌트 카드
 * SOLID 원칙: 단일 책임 - 디버깅 힌트 표시와 상호작용만 담당
 */
const DebuggingHintCard: React.FC<DebuggingHintCardProps> = ({
  isVisible,
  hint,
  currentStep,
  totalSteps,
  totalXpDeducted,
  onNextHint,
  onClose,
  isLastStep,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
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
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      scaleAnim.setValue(0.8);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  // 힌트 타입별 스타일 및 아이콘
  const getHintTypeStyle = () => {
    switch (hint.type) {
      case 'concept':
        return {
          icon: '💡',
          backgroundColor: '#FEF3C7',
          borderColor: '#F59E0B',
          textColor: '#92400E',
        };
      case 'visual':
        return {
          icon: '🔍',
          backgroundColor: '#DBEAFE',
          borderColor: '#3B82F6',
          textColor: '#1E40AF',
        };
      case 'specific':
        return {
          icon: '🎯',
          backgroundColor: '#D1FAE5',
          borderColor: '#10B981',
          textColor: '#065F46',
        };
      default:
        return {
          icon: '💡',
          backgroundColor: '#F8E8EE',
          borderColor: '#FDCEDF',
          textColor: '#8B5A6B',
        };
    }
  };

  const typeStyle = getHintTypeStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* 힌트 카드 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.typeIndicator, { backgroundColor: typeStyle.backgroundColor, borderColor: typeStyle.borderColor }]}>
            <Text style={styles.typeIcon}>{typeStyle.icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{hint.title}</Text>
            <Text style={styles.stepInfo}>
              단계 {currentStep} / {totalSteps}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="힌트 닫기"
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* 힌트 컨텐츠 */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.content, { color: typeStyle.textColor }]}>
          {hint.content}
        </Text>

        {/* 코드 하이라이트 (specific 타입일 때) */}
        {hint.type === 'specific' && hint.codeHighlight && (
          <View style={styles.codeHighlightContainer}>
            <View style={styles.codeHighlightHeader}>
              <Text style={styles.codeHighlightTitle}>📍 코드 위치 힌트</Text>
            </View>
            <View style={styles.codeHighlightContent}>
              <Text style={styles.codeHighlightLine}>
                줄 {hint.codeHighlight.startLine}
                {hint.codeHighlight.endLine !== hint.codeHighlight.startLine &&
                  ` - ${hint.codeHighlight.endLine}`
                }
              </Text>
              <Text style={styles.codeHighlightMessage}>
                {hint.codeHighlight.message}
              </Text>
            </View>
          </View>
        )}

        {/* XP 차감 알림 */}
        <View style={styles.xpNotice}>
          <Text style={styles.xpNoticeText}>
            💰 힌트 사용으로 총 {totalXpDeducted} XP가 차감되었습니다
          </Text>
        </View>

        {/* 학습 팁 (타입별 추가 정보) */}
        {hint.type === 'concept' && (
          <View style={styles.learningTip}>
            <Text style={styles.learningTipTitle}>💭 학습 팁</Text>
            <Text style={styles.learningTipText}>
              디버깅의 첫 단계는 문제의 원인을 정확히 파악하는 것입니다.
              오류 메시지를 주의 깊게 읽고 코드의 논리적 흐름을 따라가 보세요.
            </Text>
          </View>
        )}

        {hint.type === 'visual' && (
          <View style={styles.learningTip}>
            <Text style={styles.learningTipTitle}>🔎 디버깅 전략</Text>
            <Text style={styles.learningTipText}>
              코드를 단계별로 실행하면서 각 변수의 값이 예상과 일치하는지 확인해 보세요.
              print문을 활용해 중간 결과를 출력하는 것도 좋은 방법입니다.
            </Text>
          </View>
        )}

        {hint.type === 'specific' && (
          <View style={styles.learningTip}>
            <Text style={styles.learningTipTitle}>🎯 구체적 수정</Text>
            <Text style={styles.learningTipText}>
              제시된 위치의 코드를 주의 깊게 살펴보고 수정해 보세요.
              작은 변경이 큰 차이를 만들 수 있습니다.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 힌트 카드 액션 */}
      <View style={styles.actionContainer}>
        <View style={styles.actionLeft}>
          <Text style={styles.progressText}>
            진행률: {Math.round((currentStep / totalSteps) * 100)}%
          </Text>
        </View>

        <View style={styles.actionRight}>
          {!isLastStep ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={onNextHint}
              accessibilityRole="button"
              accessibilityLabel="다음 힌트 보기"
            >
              <Text style={styles.nextButtonText}>다음 힌트</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, styles.completedButton]}
              disabled={true}
            >
              <Text style={[styles.nextButtonText, styles.completedButtonText]}>
                모든 힌트 완료
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default DebuggingHintCard;