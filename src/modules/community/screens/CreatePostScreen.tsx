import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TerminalHeader } from '../../common';
import { useCommunityStore } from '../services/communityStore';
import { communityStyles } from '../constants/community.styles';
import { COLORS } from '../../../constants/colors';
import { PostCategory } from '../types/community.types';

interface CreatePostScreenProps {
  route: {
    params: {
      problemId?: string;
      category?: PostCategory;
      problemTitle?: string;
    };
  };
  navigation: any;
}

const CATEGORY_OPTIONS: { key: PostCategory; label: string }[] = [
  { key: 'problems', label: '질문' },
  { key: 'solutions', label: '풀이' },
  { key: 'career', label: '커리어' },
  { key: 'ai-trends', label: 'AI 트렌드' },
];

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({
  route,
  navigation,
}) => {
  const { problemId, category: initialCategory, problemTitle } = route.params || {};

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>(initialCategory || 'problems');
  const [tags, setTags] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createPost } = useCommunityStore();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Auto-add problem tag if problemId is provided
      if (problemId && !tagsArray.includes(`문제-${problemId}`)) {
        tagsArray.unshift(`문제-${problemId}`);
      }

      await createPost({
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tagsArray,
        problemId,
      });

      Alert.alert('성공', '게시글이 작성되었습니다.', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Create post error:', error);
      Alert.alert('오류', '게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorySelector = () => (
    <View style={{
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 12,
      }}>
        카테고리
      </Text>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {CATEGORY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: category === option.key ? COLORS.primary : COLORS.background,
              borderWidth: 1,
              borderColor: category === option.key ? COLORS.primary : COLORS.border,
            }}
            onPress={() => setCategory(option.key)}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: category === option.key ? COLORS.white : COLORS.textSecondary,
            }}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderProblemInfo = () => {
    if (!problemId) return null;

    return (
      <View style={{
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.primary,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: COLORS.primary,
          marginBottom: 4,
        }}>
          📝 연결된 문제
        </Text>
        <Text style={{
          fontSize: 12,
          color: COLORS.textSecondary,
        }}>
          문제 ID: {problemId}
        </Text>
        {problemTitle && (
          <Text style={{
            fontSize: 14,
            color: COLORS.textPrimary,
            marginTop: 4,
          }}>
            {problemTitle}
          </Text>
        )}
        <Text style={{
          fontSize: 11,
          color: COLORS.textMuted,
          marginTop: 8,
          fontStyle: 'italic',
        }}>
          이 게시글은 자동으로 해당 문제와 연결됩니다.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TerminalHeader
        onAlarmPress={() => console.log('Notifications')}
        onSettingsPress={() => console.log('Settings')}
        showShadow={true}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={120} // Account for TerminalHeader height
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 120, // Account for TerminalHeader height
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 8,
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: '500' }}>
                ← 취소
              </Text>
            </TouchableOpacity>

            <Text style={{
              fontSize: 20,
              fontWeight: '600',
              color: COLORS.textPrimary,
            }}>
              게시글 작성
            </Text>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              style={{
                backgroundColor: (!title.trim() || !content.trim()) ? COLORS.textMuted : COLORS.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                color: COLORS.white,
                fontWeight: '600',
                fontSize: 14,
              }}>
                {isSubmitting ? '작성 중...' : '완료'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Problem Info */}
          {renderProblemInfo()}

          {/* Category Selector */}
          {renderCategorySelector()}

          {/* Title Input */}
          <View style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}>
              제목
            </Text>
            <TextInput
              style={{
                fontSize: 16,
                color: COLORS.textPrimary,
                paddingVertical: 4,
              }}
              placeholder="제목을 입력하세요"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* Content Input */}
          <View style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: 8,
            }}>
              내용
            </Text>
            <TextInput
              style={{
                fontSize: 14,
                color: COLORS.textPrimary,
                minHeight: 120,
                paddingVertical: 4,
                textAlignVertical: 'top',
              }}
              placeholder="내용을 입력하세요"
              placeholderTextColor={COLORS.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              maxLength={2000}
            />
          </View>

          {/* Tags Input */}
          <View style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.textPrimary,
              marginBottom: 4,
            }}>
              태그 (선택사항)
            </Text>
            <Text style={{
              fontSize: 12,
              color: COLORS.textMuted,
              marginBottom: 8,
            }}>
              쉼표(,)로 구분하여 입력하세요
            </Text>
            <TextInput
              style={{
                fontSize: 14,
                color: COLORS.textPrimary,
                paddingVertical: 4,
              }}
              placeholder="예: JavaScript, React, 알고리즘"
              placeholderTextColor={COLORS.textMuted}
              value={tags}
              onChangeText={setTags}
              maxLength={100}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};