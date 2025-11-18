/**
 * CommitCard Component
 *
 * 개별 커밋 정보를 표시하는 카드 컴포넌트
 * 커밋 메시지, 작성자, 상태, diff 미리보기 등을 포함
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CommitCardProps, CommitStatus } from '../PRInboxScreen.types';
import { styles } from '../PRInboxScreen.styles';

const CommitCard: React.FC<CommitCardProps> = ({
  commit,
  onStatusChange,
  onViewDetails,
  isSelected,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate author initials
  const getAuthorInitials = useCallback((name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }, []);

  // Format timestamp
  const formatTimestamp = useCallback((date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return '방금 전';
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      });
    }
  }, []);

  // Handle status change with confirmation
  const handleStatusChange = useCallback((newStatus: CommitStatus) => {
    if (newStatus === 'rejected') {
      Alert.alert(
        '커밋 거부',
        '이 커밋을 거부하시겠습니까? 거부 사유를 입력해주세요.',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '거부',
            style: 'destructive',
            onPress: () => {
              onStatusChange(commit.hash, newStatus, '코드 품질 또는 요구사항 불일치');
            },
          },
        ]
      );
    } else {
      onStatusChange(commit.hash, newStatus);
    }
  }, [commit.hash, onStatusChange]);

  // Get status style
  const getStatusStyle = useCallback((status: CommitStatus) => {
    switch (status) {
      case 'accepted':
        return [styles.statusIndicator, styles.statusAccepted];
      case 'rejected':
        return [styles.statusIndicator, styles.statusRejected];
      case 'needs_review':
        return [styles.statusIndicator, styles.statusNeedsReview];
      default:
        return [styles.statusIndicator, styles.statusPending];
    }
  }, []);

  // Get status text style
  const getStatusTextStyle = useCallback((status: CommitStatus) => {
    switch (status) {
      case 'accepted':
        return [styles.statusText, styles.statusTextAccepted];
      case 'rejected':
        return [styles.statusText, styles.statusTextRejected];
      case 'needs_review':
        return [styles.statusText, styles.statusTextNeedsReview];
      default:
        return [styles.statusText, styles.statusTextPending];
    }
  }, []);

  // Get status display text
  const getStatusText = useCallback((status: CommitStatus): string => {
    switch (status) {
      case 'accepted':
        return '승인됨';
      case 'rejected':
        return '거부됨';
      case 'needs_review':
        return '검토 필요';
      default:
        return '대기 중';
    }
  }, []);

  // Get risk level style
  const getRiskStyle = useCallback((riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return [styles.riskIcon, styles.riskHigh];
      case 'medium':
        return [styles.riskIcon, styles.riskMedium];
      default:
        return [styles.riskIcon, styles.riskLow];
    }
  }, []);

  return (
    <TouchableOpacity
      style={[
        styles.commitCard,
        isSelected && styles.commitCardSelected,
      ]}
      onPress={() => onSelect(commit.hash)}
      accessibilityRole="button"
      accessibilityLabel={`커밋 ${commit.shortHash}: ${commit.message}`}
      accessibilityState={{ selected: isSelected }}
    >
      {/* Commit Header */}
      <View style={styles.commitCardHeader}>
        <View style={styles.commitAuthorAvatar}>
          <Text style={styles.commitAuthorInitials}>
            {getAuthorInitials(commit.author.name)}
          </Text>
        </View>

        <View style={styles.commitInfo}>
          <Text style={styles.commitMessage} numberOfLines={2}>
            {commit.message}
          </Text>
          <View style={styles.commitMeta}>
            <Text style={styles.commitAuthor}>
              {commit.author.name}
            </Text>
            <Text style={styles.commitTime}>
              {formatTimestamp(commit.timestamp)}
            </Text>
            <Text style={styles.commitHash}>
              {commit.shortHash}
            </Text>
          </View>
        </View>

        <View style={getStatusStyle(commit.status)}>
          <Text style={getStatusTextStyle(commit.status)}>
            {getStatusText(commit.status)}
          </Text>
        </View>
      </View>

      {/* Commit Stats */}
      <View style={styles.commitStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statIcon, styles.additionStat]}>+</Text>
          <Text style={[styles.statText, styles.additionStat]}>
            {commit.stats.additions}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statIcon, styles.deletionStat]}>−</Text>
          <Text style={[styles.statText, styles.deletionStat]}>
            {commit.stats.deletions}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>📁</Text>
          <Text style={styles.statText}>
            {commit.stats.filesCount}개 파일
          </Text>
        </View>
      </View>

      {/* Diff Preview */}
      <View style={styles.diffPreview}>
        <TouchableOpacity
          style={styles.diffPreviewHeader}
          onPress={() => setIsExpanded(!isExpanded)}
          accessibilityRole="button"
          accessibilityLabel="Diff 미리보기 토글"
        >
          <Text style={styles.diffPreviewTitle}>
            Diff 미리보기
          </Text>
          <Text style={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.diffSummary}>
            <Text style={styles.diffSummaryText}>
              {commit.diffPreview.summary}
            </Text>

            {/* Key Changes */}
            {commit.diffPreview.keyChanges.length > 0 && (
              <View style={styles.keyChangesList}>
                {commit.diffPreview.keyChanges.map((change, index) => (
                  <View key={index} style={styles.keyChangeItem}>
                    <View style={styles.keyChangeBullet} />
                    <Text style={styles.keyChangeText}>{change}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Code Snippet */}
            {commit.diffPreview.codeSnippet && (
              <View style={styles.codeSnippet}>
                <Text style={styles.codeSnippetText} numberOfLines={5}>
                  {commit.diffPreview.codeSnippet}
                </Text>
              </View>
            )}

            {/* Risk Indicator */}
            <View style={styles.riskIndicator}>
              <Text style={getRiskStyle(commit.diffPreview.riskLevel)}>
                ⚠️
              </Text>
              <Text
                style={[
                  styles.riskText,
                  commit.diffPreview.riskLevel === 'high' && styles.riskHigh,
                  commit.diffPreview.riskLevel === 'medium' && styles.riskMedium,
                  commit.diffPreview.riskLevel === 'low' && styles.riskLow,
                ]}
              >
                위험도: {commit.diffPreview.riskLevel === 'high' ? '높음' :
                         commit.diffPreview.riskLevel === 'medium' ? '보통' : '낮음'}
              </Text>
            </View>

            {/* View Details Button */}
            <TouchableOpacity
              style={[styles.reviewButton, { backgroundColor: '#F3F4F6', marginTop: 12 }]}
              onPress={() => onViewDetails(commit.hash)}
              accessibilityRole="button"
              accessibilityLabel="상세 diff 보기"
            >
              <Text style={[styles.reviewButtonText, { color: '#374151' }]}>
                📝 상세 diff 보기
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Review Action Buttons */}
      {commit.status === 'pending' && (
        <View style={styles.reviewActions}>
          <TouchableOpacity
            style={[styles.reviewButton, styles.acceptButton]}
            onPress={() => handleStatusChange('accepted')}
            accessibilityRole="button"
            accessibilityLabel="커밋 승인"
          >
            <Text style={[styles.reviewButtonText, styles.acceptButtonText]}>
              ✅ 승인
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reviewButton, styles.rejectButton]}
            onPress={() => handleStatusChange('rejected')}
            accessibilityRole="button"
            accessibilityLabel="커밋 거부"
          >
            <Text style={[styles.reviewButtonText, styles.rejectButtonText]}>
              ❌ 거부
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reviewButton, styles.flagButton]}
            onPress={() => handleStatusChange('needs_review')}
            accessibilityRole="button"
            accessibilityLabel="검토 필요로 표시"
          >
            <Text style={[styles.reviewButtonText, styles.flagButtonText]}>
              🚩 플래그
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Review Notes (if any) */}
      {commit.reviewNotes && (
        <View style={[styles.diffSummary, { backgroundColor: '#FEF3C7' }]}>
          <Text style={[styles.diffSummaryText, { fontWeight: '500' }]}>
            📝 검토 노트:
          </Text>
          <Text style={styles.diffSummaryText}>
            {commit.reviewNotes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(CommitCard);