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
import { TerminalHeader } from '../../common';
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
  const [fabAnimation] = useState(new Animated.Value(0)); // useState로 감싸서 재초기화 방지

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

    // 더 부드러운 스프링 애니메이션으로 업그레이드
    Animated.spring(fabAnimation, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: false, // backgroundColor와 레이아웃 속성 때문에 필요
    }).start();
  };

  // 검색 기능 핸들러 (추후 검색 화면 구현 시 연결)
  const handleSearchPress = () => {
    toggleFab();
    Alert.alert(
      '검색 기능',
      '커뮤니티 검색 기능은 추후 구현 예정입니다.',
      [{ text: '확인', style: 'default' }]
    );
  };

  // 글쓰기 화면으로 내비게이션
  const handleCreatePostPress = () => {
    toggleFab();
    navigation.navigate('CreatePost', {
      category: 'general'
    });
  };

  // FAB 닫기 전용 핸들러
  const handleCloseFab = () => {
    if (isFabExpanded) {
      toggleFab();
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FCE7F3' }}>
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

        {/* Enhanced Expandable Floating Action Button */}
        <View style={communityStyles.fabContainer}>
          {/* 배경 오버레이 제거 - 더 깔끔한 UX */}

          {/* 액션 버튼 1: 검색하기 (맨 위) - 버튼과 레이블 분리 */}
          {isFabExpanded && (
            <>
              {/* 검색 버튼 - 절대 위치로 중앙 고정 */}
              <Animated.View
                style={[
                  communityStyles.subFabButtonOnly,
                  {
                    transform: [
                      {
                        translateY: fabAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -140], // 일정한 70px 간격 (56px + 14px 여백)
                          extrapolate: 'clamp',
                        })
                      },
                      {
                        scale: fabAnimation.interpolate({
                          inputRange: [0, 0.3, 1],
                          outputRange: [0.5, 0.8, 1],
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: fabAnimation.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0, 0.6, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              >
                <TouchableOpacity
                  style={[communityStyles.subFab, { backgroundColor: '#A7C7F9' }]}
                  onPress={handleSearchPress}
                  activeOpacity={0.8}
                  disabled={!isFabExpanded}
                >
                  <Text style={{ color: '#2563EB', fontSize: 18, fontWeight: '600' }}>
                    🔍
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* 검색 레이블 - 독립적 위치 */}
              <Animated.View
                style={[
                  communityStyles.subFabLabelOnly,
                  {
                    transform: [
                      {
                        translateY: fabAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -140], // 버튼과 동일한 Y축
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: fabAnimation.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0, 0.6, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              >
                <Text style={communityStyles.subFabLabel} numberOfLines={1}>검색하기</Text>
              </Animated.View>
            </>
          )}

          {/* 액션 버튼 2: 글쓰기 (중간) - 버튼과 레이블 분리 */}
          {isFabExpanded && (
            <>
              {/* 글쓰기 버튼 - 절대 위치로 중앙 고정 */}
              <Animated.View
                style={[
                  communityStyles.subFabButtonOnly,
                  {
                    transform: [
                      {
                        translateY: fabAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -70], // 일정한 70px 간격 유지
                          extrapolate: 'clamp',
                        })
                      },
                      {
                        scale: fabAnimation.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [0.5, 0.9, 1],
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: fabAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.8, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              >
                <TouchableOpacity
                  style={[communityStyles.subFab, { backgroundColor: '#A6E3B0' }]}
                  onPress={handleCreatePostPress}
                  activeOpacity={0.8}
                  disabled={!isFabExpanded}
                >
                  <Text style={{ color: '#059669', fontSize: 18, fontWeight: '600' }}>
                    ✏️
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* 글쓰기 레이블 - 독립적 위치 */}
              <Animated.View
                style={[
                  communityStyles.subFabLabelOnly,
                  {
                    transform: [
                      {
                        translateY: fabAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -70], // 버튼과 동일한 Y축
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: fabAnimation.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 0.8, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              >
                <Text style={communityStyles.subFabLabel} numberOfLines={1}>글쓰기</Text>
              </Animated.View>
            </>
          )}

          {/* 액션 버튼 3: 닫기 (맨 아래) - 버튼과 레이블 분리 */}
          {isFabExpanded && (
            <>
              {/* 닫기 버튼 - 메인 FAB과 완벽히 겹치는 위치 */}
              <Animated.View
                style={[
                  communityStyles.subFabButtonOnly,
                  {
                    transform: [
                      {
                        translateY: fabAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0], // 메인 FAB과 완벽하게 겹치는 위치 (동일한 Y축)
                          extrapolate: 'clamp',
                        })
                      },
                      {
                        scale: fabAnimation.interpolate({
                          inputRange: [0, 0.7, 1],
                          outputRange: [0.5, 0.95, 1],
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: fabAnimation.interpolate({
                      inputRange: [0, 0.7, 1],
                      outputRange: [0, 0.9, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              >
                <TouchableOpacity
                  style={[communityStyles.subFab, { backgroundColor: '#F6C177' }]}
                  onPress={handleCloseFab}
                  activeOpacity={0.8}
                  disabled={!isFabExpanded}
                >
                  <Text style={{ color: '#EA580C', fontSize: 18, fontWeight: '600' }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* 닫기 레이블 - 독립적 위치 */}
              <Animated.View
                style={[
                  communityStyles.subFabLabelOnly,
                  {
                    transform: [
                      {
                        translateY: fabAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0], // 버튼과 동일한 Y축
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: fabAnimation.interpolate({
                      inputRange: [0, 0.7, 1],
                      outputRange: [0, 0.9, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}
              >
                <Text style={communityStyles.subFabLabel} numberOfLines={1}>닫기</Text>
              </Animated.View>
            </>
          )}

          {/* 메인 FAB - 향상된 애니메이션 */}
          <Animated.View
            style={{
              transform: [
                {
                  rotate: fabAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '135deg'],
                    extrapolate: 'clamp',
                  })
                },
                {
                  scale: fabAnimation.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [1, 1.1, 0.95],
                    extrapolate: 'clamp',
                  })
                }
              ],
            }}
          >
            <TouchableOpacity
              style={[
                communityStyles.fabButton,
                {
                  backgroundColor: isFabExpanded ? '#6B7280' : COLORS.primary,
                }
              ]}
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