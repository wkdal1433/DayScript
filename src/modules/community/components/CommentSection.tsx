import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Comment, CreateCommentRequest } from '../types/community.types';
import { communityStyles } from '../constants/community.styles';
import { COLORS } from '../../../constants/colors';
import { SIZES } from '../../../constants/sizes';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  loading: boolean;
  onAddComment: (request: CreateCommentRequest) => Promise<void>;
  onVote: (commentId: string, voteType: 'like' | 'dislike') => void;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  onVote: (commentId: string, voteType: 'like' | 'dislike') => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onVote,
  level = 0
}) => {
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const marginLeft = level * SIZES.paddingLarge;

  return (
    <View style={[communityStyles.commentItem, { marginLeft }]}>
      <View style={communityStyles.commentHeader}>
        <Text style={communityStyles.commentAuthor}>{comment.authorName}</Text>
        <Text style={communityStyles.commentTime}>{formatTimeAgo(comment.createdAt)}</Text>
      </View>

      <Text style={communityStyles.commentContent}>{comment.content}</Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={communityStyles.voteContainer}>
          <TouchableOpacity
            style={communityStyles.voteButton}
            onPress={() => onVote(comment.id, 'like')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 14 }}>👍</Text>
            <Text style={communityStyles.voteText}>{comment.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={communityStyles.voteButton}
            onPress={() => onVote(comment.id, 'dislike')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 14 }}>👎</Text>
            <Text style={communityStyles.voteText}>{comment.dislikes}</Text>
          </TouchableOpacity>
        </View>

        {level < 2 && (
          <TouchableOpacity onPress={() => onReply(comment.id)} activeOpacity={0.7}>
            <Text style={{
              fontSize: 12,
              color: COLORS.primary,
              fontWeight: '600'
            }}>
              답글
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {comment.replies && comment.replies.length > 0 && (
        <View style={communityStyles.replyContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onVote={onVote}
              level={level + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  loading,
  onAddComment,
  onVote,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    if (submitting) return;

    setSubmitting(true);
    try {
      await onAddComment({
        postId,
        parentCommentId: replyToId || undefined,
        content: newComment.trim(),
      });

      setNewComment('');
      setReplyToId(null);
    } catch (error) {
      Alert.alert('오류', '댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyToId(parentId);
  };

  const cancelReply = () => {
    setReplyToId(null);
  };

  return (
    <View style={communityStyles.commentSection}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.paddingMedium,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: COLORS.textPrimary,
        }}>
          댓글 {comments.length}개
        </Text>
      </View>

      {/* Comment Input */}
      <View style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.borderRadius,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SIZES.paddingMedium,
        marginBottom: SIZES.paddingMedium,
      }}>
        {replyToId && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SIZES.paddingSmall,
          }}>
            <Text style={{
              fontSize: 12,
              color: COLORS.primary,
              fontWeight: '600',
            }}>
              답글 작성 중...
            </Text>
            <TouchableOpacity onPress={cancelReply} style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 12, color: COLORS.textMuted }}>취소</Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: SIZES.borderRadius,
            padding: SIZES.paddingSmall,
            minHeight: 80,
            textAlignVertical: 'top',
            fontSize: 14,
            color: COLORS.textPrimary,
          }}
          placeholder={replyToId ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
          multiline
          value={newComment}
          onChangeText={setNewComment}
          maxLength={1000}
        />

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: SIZES.paddingSmall,
        }}>
          <Text style={{
            fontSize: 12,
            color: COLORS.textMuted,
          }}>
            {newComment.length}/1000
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: newComment.trim() ? COLORS.primary : COLORS.textMuted,
              paddingHorizontal: SIZES.paddingMedium,
              paddingVertical: SIZES.paddingSmall,
              borderRadius: SIZES.borderRadius,
              opacity: submitting ? 0.7 : 1,
            }}
            onPress={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            activeOpacity={0.8}
          >
            <Text style={{
              color: COLORS.white,
              fontSize: 14,
              fontWeight: '600',
            }}>
              {submitting ? '작성 중...' : replyToId ? '답글 작성' : '댓글 작성'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments List */}
      {loading ? (
        <Text style={{ textAlign: 'center', color: COLORS.textMuted }}>
          댓글을 불러오는 중...
        </Text>
      ) : comments.length === 0 ? (
        <Text style={communityStyles.emptyText}>
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </Text>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onVote={onVote}
          />
        ))
      )}
    </View>
  );
};