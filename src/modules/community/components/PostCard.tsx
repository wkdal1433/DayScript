import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CommunityPost } from '../types/community.types';
import { communityStyles } from '../constants/community.styles';

interface PostCardProps {
  post: CommunityPost;
  onPress: () => void;
  onVote: (postId: string, voteType: 'like' | 'dislike') => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress, onVote }) => {
  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const truncateContent = (content: string, maxLength: number = 100): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity style={communityStyles.postCard} onPress={onPress} activeOpacity={0.8}>
      <View style={communityStyles.postHeader}>
        <Text style={communityStyles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>
        {post.problemId && (
          <View style={{
            backgroundColor: '#E3F2FD',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12
          }}>
            <Text style={{ fontSize: 10, color: '#1976D2', fontWeight: '600' }}>
              문제연결
            </Text>
          </View>
        )}
      </View>

      <View style={communityStyles.postMeta}>
        <Text style={communityStyles.postMetaText}>{post.authorName}</Text>
        <Text style={communityStyles.postMetaText}>•</Text>
        <Text style={communityStyles.postMetaText}>{formatTimeAgo(post.createdAt)}</Text>
        {post.difficulty && (
          <>
            <Text style={communityStyles.postMetaText}>•</Text>
            <Text style={[
              communityStyles.postMetaText,
              {
                color: post.difficulty === 'easy' ? '#4CAF50' :
                       post.difficulty === 'medium' ? '#FF9800' : '#F44336'
              }
            ]}>
              {post.difficulty === 'easy' ? '쉬움' :
               post.difficulty === 'medium' ? '보통' : '어려움'}
            </Text>
          </>
        )}
      </View>

      <Text style={communityStyles.postContent} numberOfLines={3}>
        {truncateContent(post.content)}
      </Text>

      {post.tags.length > 0 && (
        <View style={communityStyles.tagContainer}>
          {post.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={communityStyles.tag}>
              <Text style={communityStyles.tagText}>#{tag}</Text>
            </View>
          ))}
          {post.tags.length > 3 && (
            <View style={communityStyles.tag}>
              <Text style={communityStyles.tagText}>+{post.tags.length - 3}</Text>
            </View>
          )}
        </View>
      )}

      <View style={communityStyles.postFooter}>
        <View style={communityStyles.voteContainer}>
          <TouchableOpacity
            style={[communityStyles.voteButton]}
            onPress={() => onVote(post.id, 'like')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>👍</Text>
            <Text style={communityStyles.voteText}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[communityStyles.voteButton]}
            onPress={() => onVote(post.id, 'dislike')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16 }}>👎</Text>
            <Text style={communityStyles.voteText}>{post.dislikes}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Text style={communityStyles.commentCount}>
            💬 {post.commentCount}개 댓글
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};