import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  HunkDiffViewProps,
  HunkDecision,
  HunkInfo,
} from '../../Lv5ExpertModeScreen.types';
import { hunkDiffStyles } from './HunkDiffView.styles';

/**
 * HunkDiffView Component
 *
 * Git diff의 Hunk 단위로 원본과 변경된 코드를 Split-pane 형태로 표시하고,
 * 사용자가 Accept/Reject/Edit 결정을 내릴 수 있는 통합 diff 뷰어
 *
 * Features:
 * - Split-pane layout (원본 | 변경본)
 * - Line-by-line mapping and highlighting
 * - Inline editing capability
 * - Context lines display
 * - Real-time decision feedback
 */

const HunkDiffView: React.FC<HunkDiffViewProps> = ({
  hunk,
  isActive,
  onHunkDecision,
  showLineNumbers = true,
  enableInlineEdit = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState<string[]>([]);
  const [editComment, setEditComment] = useState('');

  // Initialize edited code when editing mode starts
  const initializeEdit = useCallback(() => {
    setEditedCode([...hunk.modifiedCode]);
    setIsEditing(true);
  }, [hunk.modifiedCode]);

  // Handle Accept action
  const handleAccept = useCallback(() => {
    const decision: HunkDecision = {
      action: 'accept',
      timestamp: new Date(),
    };
    onHunkDecision(decision);
  }, [onHunkDecision]);

  // Handle Reject action
  const handleReject = useCallback(() => {
    const decision: HunkDecision = {
      action: 'reject',
      timestamp: new Date(),
    };
    onHunkDecision(decision);
  }, [onHunkDecision]);

  // Handle Edit save
  const handleEditSave = useCallback(() => {
    if (editedCode.length === 0) {
      Alert.alert('오류', '편집된 코드가 비어있습니다.');
      return;
    }

    const decision: HunkDecision = {
      action: 'edit',
      editedCode,
      comment: editComment.trim() || undefined,
      timestamp: new Date(),
    };

    onHunkDecision(decision);
    setIsEditing(false);
    setEditComment('');
  }, [editedCode, editComment, onHunkDecision]);

  // Handle Edit cancel
  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditedCode([]);
    setEditComment('');
  }, []);

  // Generate line mapping for split view
  const lineMappings = useMemo(() => {
    const mappings: Array<{
      oldLine?: { number: number; content: string; isContext?: boolean };
      newLine?: { number: number; content: string; isContext?: boolean };
      changeType?: 'add' | 'delete' | 'modify' | 'context';
    }> = [];

    let oldLineIndex = 0;
    let newLineIndex = 0;

    // Add context before lines
    hunk.context.beforeLines.forEach((line, index) => {
      mappings.push({
        oldLine: {
          number: hunk.startLineOld - hunk.context.beforeLines.length + index,
          content: line,
          isContext: true,
        },
        newLine: {
          number: hunk.startLineNew - hunk.context.beforeLines.length + index,
          content: line,
          isContext: true,
        },
        changeType: 'context',
      });
    });

    // Add actual changes
    const maxLines = Math.max(hunk.originalCode.length, hunk.modifiedCode.length);

    for (let i = 0; i < maxLines; i++) {
      const oldContent = hunk.originalCode[oldLineIndex];
      const newContent = isEditing ? editedCode[newLineIndex] : hunk.modifiedCode[newLineIndex];

      if (hunk.changeType === 'addition') {
        mappings.push({
          newLine: {
            number: hunk.startLineNew + newLineIndex,
            content: newContent || '',
          },
          changeType: 'add',
        });
        newLineIndex++;
      } else if (hunk.changeType === 'deletion') {
        mappings.push({
          oldLine: {
            number: hunk.startLineOld + oldLineIndex,
            content: oldContent || '',
          },
          changeType: 'delete',
        });
        oldLineIndex++;
      } else {
        // modification or mixed
        mappings.push({
          oldLine: oldContent ? {
            number: hunk.startLineOld + oldLineIndex,
            content: oldContent,
          } : undefined,
          newLine: newContent ? {
            number: hunk.startLineNew + newLineIndex,
            content: newContent,
          } : undefined,
          changeType: 'modify',
        });

        if (oldContent) oldLineIndex++;
        if (newContent) newLineIndex++;
      }
    }

    // Add context after lines
    hunk.context.afterLines.forEach((line, index) => {
      mappings.push({
        oldLine: {
          number: hunk.startLineOld + hunk.linesOld + index,
          content: line,
          isContext: true,
        },
        newLine: {
          number: hunk.startLineNew + hunk.linesNew + index,
          content: line,
          isContext: true,
        },
        changeType: 'context',
      });
    });

    return mappings;
  }, [hunk, editedCode, isEditing]);

  // Get status indicator
  const getStatusIndicator = () => {
    switch (hunk.reviewStatus) {
      case 'accepted':
        return { icon: '✅', color: '#10B981', text: 'Accepted' };
      case 'rejected':
        return { icon: '❌', color: '#EF4444', text: 'Rejected' };
      case 'edited':
        return { icon: '✏️', color: '#F59E0B', text: 'Edited' };
      default:
        return { icon: '⏳', color: '#6B7280', text: 'Pending' };
    }
  };

  const statusInfo = getStatusIndicator();

  return (
    <View style={[
      hunkDiffStyles.container,
      isActive && hunkDiffStyles.activeContainer,
      hunk.reviewStatus !== 'pending' && hunkDiffStyles.reviewedContainer,
    ]}>
      {/* Hunk Header */}
      <View style={hunkDiffStyles.header}>
        <View style={hunkDiffStyles.headerLeft}>
          <Text style={hunkDiffStyles.hunkTitle}>
            Hunk {hunk.hunkIndex + 1} - {hunk.fileName}
          </Text>
          <Text style={hunkDiffStyles.hunkInfo}>
            @@ -{hunk.startLineOld},{hunk.linesOld} +{hunk.startLineNew},{hunk.linesNew} @@
          </Text>
        </View>

        <View style={hunkDiffStyles.headerRight}>
          <View style={[hunkDiffStyles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={hunkDiffStyles.statusIcon}>{statusInfo.icon}</Text>
            <Text style={hunkDiffStyles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>
      </View>

      {/* Split Diff View */}
      <View style={hunkDiffStyles.splitView}>
        {/* Original Code (Left Pane) */}
        <View style={hunkDiffStyles.leftPane}>
          <Text style={hunkDiffStyles.paneTitle}>Original</Text>
          <ScrollView style={hunkDiffStyles.codeContainer} showsVerticalScrollIndicator={false}>
            {lineMappings.map((mapping, index) => (
              <View key={`old-${index}`} style={[
                hunkDiffStyles.codeLine,
                mapping.oldLine?.isContext && hunkDiffStyles.contextLine,
                mapping.changeType === 'delete' && hunkDiffStyles.deletedLine,
                mapping.changeType === 'modify' && hunkDiffStyles.modifiedLine,
              ]}>
                {mapping.oldLine ? (
                  <>
                    {showLineNumbers && (
                      <Text style={hunkDiffStyles.lineNumber}>
                        {mapping.oldLine.number}
                      </Text>
                    )}
                    <Text style={hunkDiffStyles.codeContent}>
                      {mapping.oldLine.content}
                    </Text>
                  </>
                ) : (
                  <View style={hunkDiffStyles.emptyLine} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Divider */}
        <View style={hunkDiffStyles.divider} />

        {/* Modified Code (Right Pane) */}
        <View style={hunkDiffStyles.rightPane}>
          <Text style={hunkDiffStyles.paneTitle}>
            {isEditing ? 'Editing' : 'Modified'}
          </Text>
          <ScrollView style={hunkDiffStyles.codeContainer} showsVerticalScrollIndicator={false}>
            {lineMappings.map((mapping, index) => (
              <View key={`new-${index}`} style={[
                hunkDiffStyles.codeLine,
                mapping.newLine?.isContext && hunkDiffStyles.contextLine,
                mapping.changeType === 'add' && hunkDiffStyles.addedLine,
                mapping.changeType === 'modify' && hunkDiffStyles.modifiedLine,
                isEditing && hunkDiffStyles.editingLine,
              ]}>
                {mapping.newLine ? (
                  <>
                    {showLineNumbers && (
                      <Text style={hunkDiffStyles.lineNumber}>
                        {mapping.newLine.number}
                      </Text>
                    )}
                    {isEditing && !mapping.newLine.isContext ? (
                      <TextInput
                        style={hunkDiffStyles.editableCode}
                        value={mapping.newLine.content}
                        onChangeText={(text) => {
                          const newEditedCode = [...editedCode];
                          const editIndex = mapping.newLine!.number - hunk.startLineNew;
                          if (editIndex >= 0 && editIndex < newEditedCode.length) {
                            newEditedCode[editIndex] = text;
                            setEditedCode(newEditedCode);
                          }
                        }}
                        multiline
                        scrollEnabled={false}
                      />
                    ) : (
                      <Text style={hunkDiffStyles.codeContent}>
                        {mapping.newLine.content}
                      </Text>
                    )}
                  </>
                ) : (
                  <View style={hunkDiffStyles.emptyLine} />
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Edit Comment Input (when editing) */}
      {isEditing && (
        <View style={hunkDiffStyles.editCommentSection}>
          <Text style={hunkDiffStyles.editCommentLabel}>Edit Comment (Optional)</Text>
          <TextInput
            style={hunkDiffStyles.editCommentInput}
            value={editComment}
            onChangeText={setEditComment}
            placeholder="Explain your changes..."
            multiline
            numberOfLines={2}
          />
        </View>
      )}

      {/* Action Buttons */}
      {isActive && hunk.reviewStatus === 'pending' && (
        <View style={hunkDiffStyles.actionBar}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={[hunkDiffStyles.actionButton, hunkDiffStyles.cancelButton]}
                onPress={handleEditCancel}
              >
                <Text style={hunkDiffStyles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[hunkDiffStyles.actionButton, hunkDiffStyles.saveButton]}
                onPress={handleEditSave}
              >
                <Text style={hunkDiffStyles.actionButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[hunkDiffStyles.actionButton, hunkDiffStyles.rejectButton]}
                onPress={handleReject}
              >
                <Text style={hunkDiffStyles.actionButtonText}>❌ Reject</Text>
              </TouchableOpacity>

              {enableInlineEdit && (
                <TouchableOpacity
                  style={[hunkDiffStyles.actionButton, hunkDiffStyles.editButton]}
                  onPress={initializeEdit}
                >
                  <Text style={hunkDiffStyles.actionButtonText}>✏️ Edit</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[hunkDiffStyles.actionButton, hunkDiffStyles.acceptButton]}
                onPress={handleAccept}
              >
                <Text style={hunkDiffStyles.actionButtonText}>✅ Accept</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Review Decision Display (for completed hunks) */}
      {hunk.reviewStatus !== 'pending' && hunk.userDecision && (
        <View style={hunkDiffStyles.decisionDisplay}>
          <Text style={hunkDiffStyles.decisionTitle}>Review Decision:</Text>
          <Text style={hunkDiffStyles.decisionAction}>
            Action: {hunk.userDecision.action.toUpperCase()}
          </Text>
          {hunk.userDecision.comment && (
            <Text style={hunkDiffStyles.decisionComment}>
              Comment: {hunk.userDecision.comment}
            </Text>
          )}
          <Text style={hunkDiffStyles.decisionTimestamp}>
            {hunk.userDecision.timestamp.toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default HunkDiffView;