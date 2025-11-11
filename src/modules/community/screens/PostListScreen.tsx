import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { useCommunityStore } from '../services/communityStore';
import { PostCard } from '../components/PostCard';
import { PostCategory, PostFilter } from '../types/community.types';
import { communityStyles } from '../constants/community.styles';
import { COLORS } from '../../../constants/colors';
import { SIZES } from '../../../constants/sizes';
import {
  SORT_OPTIONS,
  SORT_LABELS,
  DIFFICULTY_OPTIONS,
  DIFFICULTY_LABELS,
  DEFAULT_TAGS,
} from '../constants/categories';

interface PostListScreenProps {
  route: {
    params: {
      category: PostCategory;
      initialFilter?: Partial<PostFilter>;
    };
  };
  navigation: any;
}

export const PostListScreen: React.FC<PostListScreenProps> = ({
  route,
  navigation,
}) => {
  const { category, initialFilter } = route.params;
  const {
    posts,
    loading,
    error,
    filter,
    hasNext,
    setFilter,
    loadPosts,
    loadMorePosts,
    refreshPosts,
    votePost,
  } = useCommunityStore();

  const [searchText, setSearchText] = useState('');
  const [selectedSort, setSelectedSort] = useState<keyof typeof SORT_OPTIONS>('RECENT');
  const [selectedDifficulty, setSelectedDifficulty] = useState<keyof typeof DIFFICULTY_OPTIONS | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const newFilter: PostFilter = {
      category,
      sortBy: SORT_OPTIONS[selectedSort],
      difficulty: selectedDifficulty ? DIFFICULTY_OPTIONS[selectedDifficulty] : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      ...initialFilter,
    };
    setFilter(newFilter);
  }, [category, selectedSort, selectedDifficulty, selectedTags, initialFilter]);

  useEffect(() => {
    loadPosts(true);
  }, [filter]);

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
    navigation.navigate('CreatePost', { category });
  };

  const handleRefresh = async () => {
    await refreshPosts();
  };

  const handleLoadMore = async () => {
    if (hasNext && !loading) {
      await loadMorePosts();
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedSort('RECENT');
    setSelectedDifficulty(null);
    setSelectedTags([]);
    setSearchText('');
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onVote={handleVote}
    />
  );

  const renderFilters = () => (
    <View style={{
      backgroundColor: COLORS.white,
      padding: SIZES.paddingMedium,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    }}>
      {/* Search Input */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: SIZES.borderRadius,
          paddingHorizontal: SIZES.paddingMedium,
          paddingVertical: SIZES.paddingSmall,
          fontSize: 14,
          marginBottom: SIZES.paddingMedium,
        }}
        placeholder="게시글 검색..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Sort Options */}
      <View style={{ marginBottom: SIZES.paddingMedium }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: COLORS.textPrimary,
          marginBottom: SIZES.paddingSmall,
        }}>
          정렬
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={{
                backgroundColor: selectedSort === key ? COLORS.primary : COLORS.white,
                borderWidth: 1,
                borderColor: selectedSort === key ? COLORS.primary : COLORS.border,
                paddingHorizontal: SIZES.paddingMedium,
                paddingVertical: SIZES.paddingSmall,
                borderRadius: SIZES.borderRadius,
                marginRight: SIZES.paddingSmall,
                marginBottom: SIZES.paddingSmall,
              }}
              onPress={() => setSelectedSort(key as keyof typeof SORT_OPTIONS)}
              activeOpacity={0.7}
            >
              <Text style={{
                color: selectedSort === key ? COLORS.white : COLORS.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}>
                {SORT_LABELS[value]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Difficulty Filter */}
      <View style={{ marginBottom: SIZES.paddingMedium }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: COLORS.textPrimary,
          marginBottom: SIZES.paddingSmall,
        }}>
          난이도
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <TouchableOpacity
            style={{
              backgroundColor: selectedDifficulty === null ? COLORS.primary : COLORS.white,
              borderWidth: 1,
              borderColor: selectedDifficulty === null ? COLORS.primary : COLORS.border,
              paddingHorizontal: SIZES.paddingMedium,
              paddingVertical: SIZES.paddingSmall,
              borderRadius: SIZES.borderRadius,
              marginRight: SIZES.paddingSmall,
              marginBottom: SIZES.paddingSmall,
            }}
            onPress={() => setSelectedDifficulty(null)}
            activeOpacity={0.7}
          >
            <Text style={{
              color: selectedDifficulty === null ? COLORS.white : COLORS.textSecondary,
              fontSize: 12,
              fontWeight: '600',
            }}>
              전체
            </Text>
          </TouchableOpacity>
          {Object.entries(DIFFICULTY_OPTIONS).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={{
                backgroundColor: selectedDifficulty === key ? COLORS.primary : COLORS.white,
                borderWidth: 1,
                borderColor: selectedDifficulty === key ? COLORS.primary : COLORS.border,
                paddingHorizontal: SIZES.paddingMedium,
                paddingVertical: SIZES.paddingSmall,
                borderRadius: SIZES.borderRadius,
                marginRight: SIZES.paddingSmall,
                marginBottom: SIZES.paddingSmall,
              }}
              onPress={() => setSelectedDifficulty(key as keyof typeof DIFFICULTY_OPTIONS)}
              activeOpacity={0.7}
            >
              <Text style={{
                color: selectedDifficulty === key ? COLORS.white : COLORS.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}>
                {DIFFICULTY_LABELS[value]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tags Filter */}
      <View>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: COLORS.textPrimary,
          marginBottom: SIZES.paddingSmall,
        }}>
          태그
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {DEFAULT_TAGS.slice(0, 10).map((tag) => (
            <TouchableOpacity
              key={tag}
              style={{
                backgroundColor: selectedTags.includes(tag) ? COLORS.primary : COLORS.white,
                borderWidth: 1,
                borderColor: selectedTags.includes(tag) ? COLORS.primary : COLORS.border,
                paddingHorizontal: SIZES.paddingSmall,
                paddingVertical: SIZES.paddingXSmall,
                borderRadius: SIZES.borderRadius,
                marginRight: SIZES.paddingXSmall,
                marginBottom: SIZES.paddingXSmall,
              }}
              onPress={() => toggleTag(tag)}
              activeOpacity={0.7}
            >
              <Text style={{
                color: selectedTags.includes(tag) ? COLORS.white : COLORS.textSecondary,
                fontSize: 11,
                fontWeight: '600',
              }}>
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filter Actions */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SIZES.paddingMedium,
      }}>
        <TouchableOpacity
          onPress={clearFilters}
          activeOpacity={0.7}
        >
          <Text style={{
            color: COLORS.primary,
            fontSize: 14,
            fontWeight: '600',
          }}>
            필터 초기화
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowFilters(false)}
          activeOpacity={0.7}
        >
          <Text style={{
            color: COLORS.textMuted,
            fontSize: 14,
          }}>
            닫기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={{
      backgroundColor: COLORS.white,
      padding: SIZES.paddingMedium,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14, color: COLORS.primary }}>
            ← 뒤로 가기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 14, color: COLORS.primary }}>
            🔍 필터
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={communityStyles.emptyContainer}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
      <Text style={communityStyles.emptyText}>
        조건에 맞는 게시글이 없습니다.{'\n'}필터를 조정하거나 새로운 게시글을 작성해보세요!
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

  return (
    <View style={communityStyles.container}>
      {renderHeader()}
      {showFilters && renderFilters()}

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
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
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