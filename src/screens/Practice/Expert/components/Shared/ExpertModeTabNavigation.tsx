import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  AccessibilityInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ExpertModeTabNavigationProps } from '../../Lv5ExpertModeScreen.types';
import { styles, gradientStyles } from '../../Lv5ExpertModeScreen.styles';

/**
 * ExpertModeTabNavigation Component
 *
 * Provides navigation between Vibe Coding and Code Review modules
 * with visual progress indicators and accessibility support.
 *
 * SOLID Principles:
 * - Single Responsibility: Handles only tab navigation UI and interactions
 * - Open/Closed: Can be extended with new modules without modification
 * - Interface Segregation: Focused props interface for tab navigation only
 */
const ExpertModeTabNavigation: React.FC<ExpertModeTabNavigationProps> = ({
  activeModule,
  onModuleChange,
  moduleProgress,
  isModuleUnlocked,
}) => {

  // Handle tab press with accessibility support
  const handleTabPress = (module: 'vibe_coding' | 'code_review') => {
    if (!isModuleUnlocked[module]) {
      AccessibilityInfo.announceForAccessibility(
        `${getModuleDisplayName(module)} module is locked. Complete previous modules to unlock.`
      );
      return;
    }

    if (module === activeModule) return;

    // Announce module switch for screen readers
    AccessibilityInfo.announceForAccessibility(
      `Switched to ${getModuleDisplayName(module)} module`
    );

    onModuleChange(module);
  };

  // Get user-friendly module names
  const getModuleDisplayName = (module: 'vibe_coding' | 'code_review'): string => {
    switch (module) {
      case 'vibe_coding':
        return 'Vibe Coding';
      case 'code_review':
        return 'Code Review';
      default:
        return module;
    }
  };

  // Get module icon/emoji
  const getModuleIcon = (module: 'vibe_coding' | 'code_review'): string => {
    switch (module) {
      case 'vibe_coding':
        return '🤖';
      case 'code_review':
        return '🔍';
      default:
        return '📝';
    }
  };

  // Get progress color based on score
  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return '#10B981'; // Green
    if (progress >= 60) return '#F59E0B'; // Orange
    if (progress >= 40) return '#EF4444'; // Red
    return '#9CA3AF'; // Gray
  };

  // Render individual tab
  const renderTab = (module: 'vibe_coding' | 'code_review') => {
    const isActive = activeModule === module;
    const isUnlocked = isModuleUnlocked[module];
    const progress = moduleProgress[module];
    const displayName = getModuleDisplayName(module);
    const icon = getModuleIcon(module);

    return (
      <TouchableOpacity
        key={module}
        style={[
          styles.tabItem,
          isActive && styles.tabItemActive,
          !isUnlocked && { opacity: 0.5 },
        ]}
        onPress={() => handleTabPress(module)}
        disabled={!isUnlocked}
        accessibilityRole="tab"
        accessibilityLabel={`${displayName} module tab`}
        accessibilityHint={
          isUnlocked
            ? `Double tap to switch to ${displayName} module. Progress: ${Math.round(progress)}%`
            : `${displayName} module is locked`
        }
        accessibilityState={{
          selected: isActive,
          disabled: !isUnlocked,
        }}
      >
        {/* Tab Content */}
        <View style={{ alignItems: 'center' }}>
          {/* Module Icon */}
          <Text style={{ fontSize: 20, marginBottom: 4 }}>
            {isUnlocked ? icon : '🔒'}
          </Text>

          {/* Module Name */}
          <Text
            style={[
              styles.tabText,
              isActive && styles.tabTextActive,
              !isUnlocked && { color: '#9CA3AF' },
            ]}
          >
            {displayName}
          </Text>

          {/* Progress Score */}
          {isUnlocked && (
            <Text
              style={{
                fontSize: 12,
                color: getProgressColor(progress),
                fontWeight: '600',
                marginTop: 2,
              }}
            >
              {Math.round(progress)}%
            </Text>
          )}
        </View>

        {/* Progress Indicator */}
        {isUnlocked && (
          <View style={styles.tabProgressIndicator}>
            <View
              style={[
                styles.tabProgressFill,
                {
                  width: `${Math.max(progress, 5)}%`, // Minimum 5% for visibility
                  backgroundColor: getProgressColor(progress),
                },
              ]}
            />
          </View>
        )}

        {/* Active Indicator (Bottom Border) */}
        {isActive && (
          <LinearGradient
            colors={
              module === 'vibe_coding'
                ? gradientStyles.vibe.colors
                : gradientStyles.codeReview.colors
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              borderRadius: 2,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.tabNavigation}
      accessibilityRole="tablist"
      accessibilityLabel="Expert mode module navigation"
    >
      <View style={styles.tabContainer}>
        {renderTab('vibe_coding')}
        {renderTab('code_review')}
      </View>

      {/* Overall Progress Summary */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: '#F9FAFB',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: '#6B7280',
            textAlign: 'center',
          }}
          accessibilityLabel={`Overall progress across all modules`}
        >
          Overall Progress: {Math.round((moduleProgress.vibe_coding + moduleProgress.code_review) / 2)}%
        </Text>
      </View>
    </View>
  );
};

export default ExpertModeTabNavigation;