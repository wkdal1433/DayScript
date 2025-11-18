import React from 'react';
import { View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ProgressIndicatorProps } from '../../Lv5ExpertModeScreen.types';
import { progressStyles } from './ProgressIndicator.styles';

/**
 * ProgressIndicator Component
 *
 * Multi-level progress indicator for Hunk-level code review
 * Shows progress at three levels: Hunk > File > Overall
 *
 * Features:
 * - Visual progress bars with gradients
 * - Hierarchical progress display
 * - Completion percentage calculation
 * - Current position indicators
 */

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentFileIndex,
  totalFiles,
  currentHunkIndex,
  totalHunks,
  reviewedHunks,
  completionPercentage,
}) => {
  // Calculate current file progress
  const currentFileProgress = totalHunks > 0 ? (reviewedHunks / totalHunks) * 100 : 0;

  // Calculate overall files progress
  const filesProgress = totalFiles > 0 ? ((currentFileIndex + currentFileProgress / 100) / totalFiles) * 100 : 0;

  // Calculate current hunk position in current file
  const currentFileHunks = Math.ceil(totalHunks / totalFiles); // Rough estimation
  const currentHunkInFile = currentHunkIndex % currentFileHunks;

  // Format progress text
  const formatProgress = (current: number, total: number): string => {
    return `${Math.min(current + 1, total)}/${total}`;
  };

  // Get progress status color
  const getProgressColor = (percentage: number): string[] => {
    if (percentage >= 80) return ['#10B981', '#34D399']; // Green
    if (percentage >= 50) return ['#F59E0B', '#FBBF24']; // Yellow
    return ['#3B82F6', '#60A5FA']; // Blue
  };

  return (
    <View style={progressStyles.container}>
      {/* Header */}
      <View style={progressStyles.header}>
        <Text style={progressStyles.title}>Review Progress</Text>
        <Text style={progressStyles.overallPercentage}>
          {Math.round(completionPercentage)}% Complete
        </Text>
      </View>

      {/* Progress Levels */}
      <View style={progressStyles.levelsContainer}>

        {/* Level 1: Overall Progress */}
        <View style={progressStyles.progressLevel}>
          <View style={progressStyles.levelHeader}>
            <Text style={progressStyles.levelTitle}>Overall</Text>
            <Text style={progressStyles.levelStats}>
              {Math.round(completionPercentage)}%
            </Text>
          </View>

          <View style={progressStyles.progressBarBackground}>
            <LinearGradient
              colors={getProgressColor(completionPercentage)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                progressStyles.progressBarFill,
                { width: `${Math.min(completionPercentage, 100)}%` }
              ]}
            />
          </View>

          <Text style={progressStyles.levelDescription}>
            Total review completion across all files
          </Text>
        </View>

        {/* Level 2: Files Progress */}
        <View style={progressStyles.progressLevel}>
          <View style={progressStyles.levelHeader}>
            <Text style={progressStyles.levelTitle}>Files</Text>
            <Text style={progressStyles.levelStats}>
              {formatProgress(currentFileIndex, totalFiles)} • {Math.round(filesProgress)}%
            </Text>
          </View>

          <View style={progressStyles.progressBarBackground}>
            <LinearGradient
              colors={getProgressColor(filesProgress)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                progressStyles.progressBarFill,
                { width: `${Math.min(filesProgress, 100)}%` }
              ]}
            />
          </View>

          <Text style={progressStyles.levelDescription}>
            File-by-file review progress
          </Text>
        </View>

        {/* Level 3: Hunks Progress */}
        <View style={progressStyles.progressLevel}>
          <View style={progressStyles.levelHeader}>
            <Text style={progressStyles.levelTitle}>Hunks</Text>
            <Text style={progressStyles.levelStats}>
              {reviewedHunks}/{totalHunks} • {Math.round(currentFileProgress)}%
            </Text>
          </View>

          <View style={progressStyles.progressBarBackground}>
            <LinearGradient
              colors={getProgressColor(currentFileProgress)}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                progressStyles.progressBarFill,
                { width: `${Math.min(currentFileProgress, 100)}%` }
              ]}
            />
          </View>

          <Text style={progressStyles.levelDescription}>
            Individual code change blocks reviewed
          </Text>
        </View>
      </View>

      {/* Current Status */}
      <View style={progressStyles.currentStatus}>
        <View style={progressStyles.statusItem}>
          <Text style={progressStyles.statusLabel}>Current File:</Text>
          <Text style={progressStyles.statusValue}>
            File {currentFileIndex + 1} of {totalFiles}
          </Text>
        </View>

        <View style={progressStyles.statusItem}>
          <Text style={progressStyles.statusLabel}>Current Hunk:</Text>
          <Text style={progressStyles.statusValue}>
            Hunk {currentHunkIndex + 1} of {totalHunks}
          </Text>
        </View>

        <View style={progressStyles.statusItem}>
          <Text style={progressStyles.statusLabel}>Reviewed:</Text>
          <Text style={progressStyles.statusValue}>
            {reviewedHunks} hunks completed
          </Text>
        </View>
      </View>

      {/* Progress Milestones */}
      <View style={progressStyles.milestones}>
        <View style={progressStyles.milestone}>
          <View style={[
            progressStyles.milestoneIndicator,
            completionPercentage >= 25 && progressStyles.milestoneCompleted
          ]}>
            <Text style={progressStyles.milestoneText}>25%</Text>
          </View>
        </View>

        <View style={progressStyles.milestone}>
          <View style={[
            progressStyles.milestoneIndicator,
            completionPercentage >= 50 && progressStyles.milestoneCompleted
          ]}>
            <Text style={progressStyles.milestoneText}>50%</Text>
          </View>
        </View>

        <View style={progressStyles.milestone}>
          <View style={[
            progressStyles.milestoneIndicator,
            completionPercentage >= 75 && progressStyles.milestoneCompleted
          ]}>
            <Text style={progressStyles.milestoneText}>75%</Text>
          </View>
        </View>

        <View style={progressStyles.milestone}>
          <View style={[
            progressStyles.milestoneIndicator,
            completionPercentage >= 100 && progressStyles.milestoneCompleted
          ]}>
            <Text style={progressStyles.milestoneText}>100%</Text>
          </View>
        </View>
      </View>

      {/* Estimated Time Remaining */}
      {completionPercentage > 0 && completionPercentage < 100 && (
        <View style={progressStyles.timeEstimate}>
          <Text style={progressStyles.timeEstimateText}>
            Estimated remaining: {Math.ceil((totalHunks - reviewedHunks) * 2)} minutes
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProgressIndicator;