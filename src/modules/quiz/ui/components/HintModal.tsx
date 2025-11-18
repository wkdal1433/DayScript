/**
 * 힌트 표시 모달 컴포넌트
 * SOLID 원칙 중 SRP(단일 책임) 적용 - 힌트 표시만 담당
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { QuizHint, HintLevel } from '../../core/domain/QuizBase';
import { hintModalStyles } from '../styles/HintModal.styles';

export interface HintModalProps {
  isVisible: boolean;
  hint: QuizHint | null;
  onClose: () => void;
  usedHintsCount: number;
  maxHints: number;
}

export function HintModal({
  isVisible,
  hint,
  onClose,
  usedHintsCount,
  maxHints,
}: HintModalProps) {
  if (!hint) return null;

  const getHintLevelInfo = (level: HintLevel) => {
    switch (level) {
      case HintLevel.BASIC:
        return { emoji: '💡', name: '기본 힌트', color: '#10B981' };
      case HintLevel.INTERMEDIATE:
        return { emoji: '🔍', name: '중급 힌트', color: '#3B82F6' };
      case HintLevel.ADVANCED:
        return { emoji: '🎯', name: '고급 힌트', color: '#F59E0B' };
      case HintLevel.SOLUTION:
        return { emoji: '🔑', name: '해답 힌트', color: '#EF4444' };
      default:
        return { emoji: '💡', name: '힌트', color: '#6B7280' };
    }
  };

  const levelInfo = getHintLevelInfo(hint.level);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={hintModalStyles.overlay} onPress={onClose}>
        <Pressable style={hintModalStyles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* 헤더 */}
          <View style={hintModalStyles.header}>
            <View style={hintModalStyles.headerLeft}>
              <Text style={hintModalStyles.hintEmoji}>{levelInfo.emoji}</Text>
              <View>
                <Text style={hintModalStyles.hintTitle}>{levelInfo.name}</Text>
                <Text style={hintModalStyles.hintSubtitle}>
                  {usedHintsCount}/{maxHints} 사용
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={hintModalStyles.closeButton}
              onPress={onClose}
            >
              <Text style={hintModalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 점수 차감 알림 */}
          {hint.pointsPenalty && hint.pointsPenalty > 0 && (
            <View style={hintModalStyles.penaltyBanner}>
              <Text style={hintModalStyles.penaltyText}>
                ⚠️ 이 힌트를 사용하면 {hint.pointsPenalty}점이 차감됩니다
              </Text>
            </View>
          )}

          {/* 잠금 해제 조건 */}
          {hint.unlockCondition && (
            <View style={hintModalStyles.unlockCondition}>
              <Text style={hintModalStyles.unlockConditionText}>
                🔓 {hint.unlockCondition}
              </Text>
            </View>
          )}

          {/* 힌트 내용 */}
          <ScrollView style={hintModalStyles.contentContainer}>
            <Text style={hintModalStyles.hintContent}>{hint.content}</Text>
          </ScrollView>

          {/* 하단 버튼 영역 */}
          <View style={hintModalStyles.footer}>
            <TouchableOpacity
              style={hintModalStyles.confirmButton}
              onPress={onClose}
            >
              <Text style={hintModalStyles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>

          {/* 힌트 레벨 인디케이터 */}
          <View style={[
            hintModalStyles.levelIndicator,
            { backgroundColor: levelInfo.color }
          ]} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}