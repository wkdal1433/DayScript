import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TerminalHeader } from '../../common';
import { useCommunityStore } from '../services/communityStore';
import { CommentSection } from '../components/CommentSection';
import { communityStyles } from '../constants/community.styles';
import { COLORS } from '../../../constants/colors';
import { CommunityPost } from '../types/community.types';

interface PostDetailScreenProps {
  route: {
    params: {
      postId: string;
    };
  };
  navigation: any;
}

export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { postId } = route.params;
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { posts, votePost } = useCommunityStore();

  const loadPostDetail = async () => {
    try {
      // In a real app, this would be an API call
      const foundPost = posts.find(p => p.id === postId);
      setPost(foundPost || null);
    } catch (error) {
      console.error('Load post detail error:', error);
      Alert.alert('오류', '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPostDetail();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  const handleVote = async (voteType: 'like' | 'dislike') => {
    if (!post) return;

    try {
      await votePost(post.id, voteType);
      // Update local state
      setPost({
        ...post,
        likes: voteType === 'like' ? post.likes + 1 : post.likes,
        dislikes: voteType === 'dislike' ? post.dislikes + 1 : post.dislikes,
      });
    } catch (error) {
      Alert.alert('오류', '투표에 실패했습니다.');
    }
  };

  const renderCategory = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      'problems': '질문',
      'solutions': '풀이',
      'career': '커리어',
      'ai-trends': 'AI 트렌드',
    };

    return (
      <View style={{
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 8,
      }}>
        <Text style={{
          fontSize: 12,
          color: COLORS.primary,
          fontWeight: '600',
        }}>
          {categoryLabels[category] || category}
        </Text>
      </View>
    );
  };

  const renderTags = (tags: string[]) => {
    if (!tags || tags.length === 0) return null;

    return (
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 6,
      }}>
        {tags.map((tag, index) => (
          <View
            key={index}
            style={{
              backgroundColor: COLORS.background,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text style={{
              fontSize: 11,
              color: COLORS.textSecondary,
            }}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <TerminalHeader
          onAlarmPress={() => console.log('Notifications')}
          onSettingsPress={() => console.log('Settings')}
          showShadow={true}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 120,
        }}>
          <Text style={{
            fontSize: 16,
            color: COLORS.textMuted,
          }}>
            게시글을 불러오는 중...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <TerminalHeader
          onAlarmPress={() => console.log('Notifications')}
          onSettingsPress={() => console.log('Settings')}
          showShadow={true}
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 120,
        }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>😕</Text>
          <Text style={{
            fontSize: 16,
            color: COLORS.textMuted,
            marginBottom: 16,
          }}>
            게시글을 찾을 수 없습니다.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: COLORS.white, fontWeight: '600' }}>
              뒤로 가기
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TerminalHeader
        onAlarmPress={() => console.log('Notifications')}
        onSettingsPress={() => console.log('Settings')}
        showShadow={true}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 120, // Account for TerminalHeader height
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header with back button */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: COLORS.white,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 16 }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: '500' }}>
              ← 뒤로
            </Text>
          </TouchableOpacity>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.textPrimary,
            flex: 1,
          }}>
            게시글 상세
          </Text>
        </View>

        {/* Post Content */}
        <View style={{
          backgroundColor: COLORS.white,
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}>
          {renderCategory(post.category)}

          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: COLORS.textPrimary,
            marginBottom: 8,
            lineHeight: 28,
          }}>
            {post.title}
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              marginRight: 12,
            }}>
              {post.authorName}
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textMuted,
            }}>
              {new Date(post.createdAt).toLocaleString('ko-KR')}
            </Text>
          </View>

          <Text style={{
            fontSize: 16,
            color: COLORS.textPrimary,
            lineHeight: 24,
            marginBottom: 12,
          }}>
            {post.content}
          </Text>

          {renderTags(post.tags)}

          {/* Problem ID if linked */}
          {post.problemId && (
            <View style={{
              backgroundColor: COLORS.primaryLight,
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
              borderLeftWidth: 4,
              borderLeftColor: COLORS.primary,
            }}>
              <Text style={{
                fontSize: 12,
                color: COLORS.primary,
                fontWeight: '600',
                marginBottom: 4,
              }}>
                연결된 문제
              </Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textPrimary,
              }}>
                문제 ID: {post.problemId}
              </Text>
            </View>
          )}

          {/* Vote buttons */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            gap: 16,
          }}>
            <TouchableOpacity
              onPress={() => handleVote('like')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: COLORS.background,
                borderRadius: 20,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>👍</Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                fontWeight: '500',
              }}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleVote('dislike')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: COLORS.background,
                borderRadius: 20,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>👎</Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                fontWeight: '500',
              }}>
                {post.dislikes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                backgroundColor: COLORS.background,
                borderRadius: 20,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>💬</Text>
              <Text style={{
                fontSize: 14,
                color: COLORS.textSecondary,
                fontWeight: '500',
              }}>
                {post.commentCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <CommentSection
          postId={post.id}
          commentCount={post.commentCount}
        />
      </ScrollView>
    </SafeAreaView>
  );
};