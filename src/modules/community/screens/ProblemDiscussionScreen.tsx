import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useCommunityStore } from '../services/communityStore';
import { PostCard } from '../components/PostCard';
import { communityStyles } from '../constants/community.styles';
import { COLORS } from '../../../constants/colors';

interface ProblemDiscussionScreenProps {
  route: {
    params: {
      problemId: string;
      problemTitle?: string;
    };
  };
  navigation: any;
}

export const ProblemDiscussionScreen: React.FC<ProblemDiscussionScreenProps> = ({
  route,
  navigation,
}) => {
  const { problemId, problemTitle } = route.params;
  const {
    posts,
    loading,
    error,
    filter,
    setFilter,
    loadPosts,
    refreshPosts,
    votePost,
  } = useCommunityStore();

  const [selectedTab, setSelectedTab] = useState<'all' | 'questions' | 'solutions'>('all');

  useEffect(() => {
    // Set filter for this specific problem
    setFilter({
      problemId,
      category: selectedTab === 'questions' ? 'problems' :
                selectedTab === 'solutions' ? 'solutions' : undefined,
      sortBy: 'recent',
    });
  }, [problemId, selectedTab]);

  useEffect(() => {
    loadPosts(true);
  }, [filter]);

  const handleTabChange = (tab: 'all' | 'questions' | 'solutions') => {
    setSelectedTab(tab);
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleVote = async (postId: string, voteType: 'like' | 'dislike') => {
    try {
      await votePost(postId, voteType);
    } catch (error) {
      Alert.alert('오류', '투표에 실패했습니다.');
    }
  };

  const handleCreatePost = () => {
    navigation.navigate('CreatePost', {
      problemId,
      category: selectedTab === 'solutions' ? 'solutions' : 'problems',
    });
  };

  const handleRefresh = async () => {
    await refreshPosts();
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onVote={handleVote}
    />
  );

  const renderTabs = () => (
    <View style={{
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingHorizontal: 16,
    }}>
      {[
        { key: 'all', label: '전체' },
        { key: 'questions', label: '질문' },
        { key: 'solutions', label: '풀이' },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 2,
            borderBottomColor: selectedTab === tab.key ? COLORS.primary : 'transparent',
          }}
          onPress={() => handleTabChange(tab.key as any)}
          activeOpacity={0.7}
        >
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: selectedTab === tab.key ? COLORS.primary : COLORS.textMuted,
          }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View style={{
      backgroundColor: COLORS.white,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 12 }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 14, color: COLORS.primary }}>
          ← 뒤로 가기
        </Text>
      </TouchableOpacity>

      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
      }}>
        문제 토론
      </Text>

      {problemTitle && (
        <Text style={{
          fontSize: 14,
          color: COLORS.textSecondary,
          marginBottom: 8,
        }}>
          {problemTitle}
        </Text>
      )}

      <View style={{
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
      }}>
        <Text style={{
          fontSize: 12,
          color: COLORS.primary,
          fontWeight: '600',
        }}>
          문제 ID: {problemId}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={communityStyles.emptyContainer}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
      <Text style={communityStyles.emptyText}>
        이 문제에 대한 토론이 아직 없습니다.{'\n'}첫 번째 질문이나 풀이를 공유해보세요!
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
          marginTop: 16,
        }}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <Text style={{ color: COLORS.white, fontWeight: '600' }}>
          게시글 작성하기
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={communityStyles.container}>
        {renderHeader()}
        <View style={communityStyles.emptyContainer}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={communityStyles.emptyText}>
            {error}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
            onPress={() => loadPosts(true)}
            activeOpacity={0.8}
          >
            <Text style={{ color: COLORS.white, fontWeight: '600' }}>
              다시 시도
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={communityStyles.container}>
      {renderHeader()}
      {renderTabs()}

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={loading ? null : renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={posts.length === 0 ? { flex: 1 } : undefined}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={communityStyles.fabButton}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: '600' }}>
          ✏️
        </Text>
      </TouchableOpacity>
    </View>
  );
};