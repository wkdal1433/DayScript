import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Animated,
} from 'react-native';
import { useCommunityStore } from '../services/communityStore';
import { CategoryTabs } from '../components/CategoryTabs';
import { PostCard } from '../components/PostCard';
import { PostCategory } from '../types/community.types';
import { communityStyles } from '../constants/community.styles';
import { COLORS } from '../../../constants/colors';
import BottomNavigationBar from '../../../components/BottomNavigation/BottomNavigationBar';
import TerminalHeader from '../../../components/Home/TerminalHeader';
import { MOCK_POSTS } from '../services/mockData';

interface CommunityHomeScreenProps {
  navigation: any;
  route?: any;
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

export const CommunityHomeScreen: React.FC<CommunityHomeScreenProps> = ({
  navigation,
  route,
  activeTab,
  onTabPress
}) => {
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

  // 더미 데이터 사용 (네트워크 오류 방지)
  const displayPosts = posts.length > 0 ? posts : MOCK_POSTS.filter(post =>
    activeCategory === 'all' || post.category === activeCategory
  );

  const [activeCategory, setActiveCategory] = useState<PostCategory>('problems');
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const fabAnimation = new Animated.Value(0);

  useEffect(() => {
    setFilter({
      ...filter,
      category: activeCategory,
    });
  }, [activeCategory]);

  useEffect(() => {
    loadPosts(true);
  }, [filter]);

  // 초기 데이터 로드
  useEffect(() => {
    // 컴포넌트 마운트 시 데이터 로드
    loadPosts(true);
  }, []);

  const handleCategoryChange = (category: PostCategory) => {
    setActiveCategory(category);
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
    Alert.alert(
      '글 작성',
      '게시글 작성 화면은 곧 구현될 예정입니다.',
      [{ text: '확인', style: 'default' }]
    );
  };

  const handleTabPress = (tab: string) => {
    if (onTabPress) {
      onTabPress(tab);
    }
  };

  const toggleFab = () => {
    const toValue = isFabExpanded ? 0 : 1;
    setIsFabExpanded(!isFabExpanded);

    Animated.spring(fabAnimation, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();
  };

  const handleQuestionPress = () => {
    toggleFab();
    Alert.alert(
      '질문 작성',
      '문제 관련 질문을 작성하는 화면으로 이동합니다.',
      [{ text: '확인', style: 'default' }]
    );
  };

  const handleGeneralPostPress = () => {
    toggleFab();
    Alert.alert(
      '일반 글 작성',
      '커뮤니티 일반 게시글을 작성하는 화면으로 이동합니다.',
      [{ text: '확인', style: 'default' }]
    );
  };

  const handleRefresh = async () => {
    await refreshPosts();
  };

  const handleLoadMore = async () => {
    if (hasNext && !loading) {
      await loadMorePosts();
    }
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onVote={handleVote}
    />
  );

  const renderFooter = () => {
    if (!loading || posts.length === 0) return null;

    return (
      <View style={{ padding: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={{ marginTop: 8, color: COLORS.textMuted }}>
          더 많은 게시글을 불러오는 중...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={communityStyles.emptyContainer}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📝</Text>
      <Text style={communityStyles.emptyText}>
        아직 게시글이 없습니다.{'\n'}첫 번째 게시글을 작성해보세요!
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

  // 에러가 있어도 더미 데이터 표시를 위해 error 체크 비활성화
  // if (error) {
  //   return (
  //     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
  //       <TerminalHeader
  //         onAlarmPress={() => console.log('Community notifications')}
  //         onSettingsPress={() => console.log('Community settings')}
  //         showShadow={true}
  //       />
  //       <View style={communityStyles.container}>
  //         <CategoryTabs
  //           activeCategory={activeCategory}
  //           onCategoryChange={handleCategoryChange}
  //         />
  //         <View style={communityStyles.emptyContainer}>
  //           <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
  //           <Text style={communityStyles.emptyText}>
  //             {error}
  //           </Text>
  //           <TouchableOpacity
  //             style={{
  //               backgroundColor: COLORS.primary,
  //               paddingHorizontal: 24,
  //               paddingVertical: 12,
  //               borderRadius: 8,
  //               marginTop: 16,
  //             }}
  //             onPress={() => loadPosts(true)}
  //             activeOpacity={0.8}
  //           >
  //             <Text style={{ color: COLORS.white, fontWeight: '600' }}>
  //               다시 시도
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>

  //       <BottomNavigationBar
  //         activeTab={activeTab || 'Community'}
  //         onTabPress={handleTabPress}
  //       />
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TerminalHeader
        onAlarmPress={() => console.log('Community notifications')}
        onSettingsPress={() => console.log('Community settings')}
        showShadow={true}
      />
      <View style={[communityStyles.container, communityStyles.contentContainer]}>
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <View style={{ flex: 1 }}>
          <FlatList
            data={displayPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={loading && displayPosts.length === 0 ? null : renderEmpty}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={loading && displayPosts.length > 0}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={displayPosts.length === 0 ? { flex: 1 } : { paddingBottom: 100 }}
          />
        </View>

        {/* Expandable Floating Action Button */}
        <View style={communityStyles.fabContainer}>
          {/* Sub Action Buttons */}
          <Animated.View
            style={[
              communityStyles.subFabButton,
              {
                transform: [{
                  translateY: fabAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                  })
                }],
                opacity: fabAnimation,
              }
            ]}
          >
            <TouchableOpacity
              style={[communityStyles.subFab, { backgroundColor: '#10B981' }]}
              onPress={handleQuestionPress}
              activeOpacity={0.8}
            >
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}>
                ❓
              </Text>
            </TouchableOpacity>
            <Text style={communityStyles.subFabLabel}>질문하기</Text>
          </Animated.View>

          <Animated.View
            style={[
              communityStyles.subFabButton,
              {
                transform: [{
                  translateY: fabAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -130],
                  })
                }],
                opacity: fabAnimation,
              }
            ]}
          >
            <TouchableOpacity
              style={[communityStyles.subFab, { backgroundColor: '#8B5CF6' }]}
              onPress={handleGeneralPostPress}
              activeOpacity={0.8}
            >
              <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '600' }}>
                ✏️
              </Text>
            </TouchableOpacity>
            <Text style={communityStyles.subFabLabel}>일반글</Text>
          </Animated.View>

          {/* Main FAB */}
          <Animated.View
            style={{
              transform: [{
                rotate: fabAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                })
              }]
            }}
          >
            <TouchableOpacity
              style={communityStyles.fabButton}
              onPress={toggleFab}
              activeOpacity={0.8}
            >
              <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: '600' }}>
                +
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      <BottomNavigationBar
        activeTab={activeTab || 'Community'}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};