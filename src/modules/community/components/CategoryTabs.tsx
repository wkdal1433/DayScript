import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PostCategory } from '../types/community.types';
import { COMMUNITY_CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from '../constants/categories';
import { communityStyles } from '../constants/community.styles';

interface CategoryTabsProps {
  activeCategory: PostCategory;
  onCategoryChange: (category: PostCategory) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const categories = Object.values(COMMUNITY_CATEGORIES);

  return (
    <View style={communityStyles.tabContainer}>
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <TouchableOpacity
            key={category}
            style={[
              communityStyles.tabItem,
              isActive && communityStyles.tabItemActive,
            ]}
            onPress={() => onCategoryChange(category)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 16, marginBottom: 2 }}>
              {CATEGORY_ICONS[category]}
            </Text>
            <Text
              style={[
                communityStyles.tabText,
                isActive && communityStyles.tabTextActive,
              ]}
            >
              {CATEGORY_LABELS[category]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};