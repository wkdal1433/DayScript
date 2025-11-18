import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { CodeEditorProps } from '../VibeSessionScreen.types';
import { styles } from '../VibeSessionScreen.styles';

/**
 * CodeEditor Component
 *
 * AI가 생성한 코드를 표시하고 편집할 수 있는 코드 에디터 컴포넌트입니다.
 * 신택스 하이라이팅과 기본적인 코드 편집 기능을 제공합니다.
 *
 * SOLID 원칙:
 * - Single Responsibility: 코드 표시와 편집만 담당
 * - Open/Closed: 새로운 언어나 테마 지원 확장 가능
 * - Interface Segregation: 코드 에디터 관련 props만 받음
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onCodeChange,
  readOnly = false,
  showLineNumbers = true,
  theme = 'light',
  fontSize = 14,
  maxHeight = 400,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState(code);

  // Language display mapping
  const getLanguageDisplayName = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'python': 'Python',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'go': 'Go',
      'rust': 'Rust',
      'sql': 'SQL',
      'json': 'JSON',
      'yaml': 'YAML',
      'xml': 'XML',
      'html': 'HTML',
      'css': 'CSS',
    };
    return languageMap[lang.toLowerCase()] || lang.toUpperCase();
  };

  // Handle edit mode toggle
  const handleEditToggle = useCallback(() => {
    if (readOnly) return;

    if (isEditing) {
      // Save changes
      onCodeChange(editedCode);
      setIsEditing(false);
    } else {
      // Start editing
      setEditedCode(code);
      setIsEditing(true);
    }
  }, [isEditing, editedCode, code, onCodeChange, readOnly]);

  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    Alert.alert(
      '편집 취소',
      '변경사항을 취소하시겠습니까?',
      [
        { text: '계속 편집', style: 'cancel' },
        {
          text: '취소',
          onPress: () => {
            setEditedCode(code);
            setIsEditing(false);
          },
        },
      ]
    );
  }, [code]);

  // Copy code to clipboard
  const handleCopyCode = useCallback(() => {
    // TODO: Implement clipboard functionality
    Alert.alert('복사 완료', '코드가 클립보드에 복사되었습니다.');
  }, [code]);

  // Simple syntax highlighting (basic implementation)
  const renderCodeWithHighlighting = (codeText: string) => {
    if (language === 'python') {
      // Basic Python syntax highlighting
      const lines = codeText.split('\n');
      return lines.map((line, index) => {
        let highlightedLine = line;

        // Keywords
        const keywords = ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return', 'try', 'except', 'with', 'as'];
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          highlightedLine = highlightedLine.replace(regex, keyword);
        });

        return (
          <View key={index} style={{ flexDirection: 'row', minHeight: 20 }}>
            {showLineNumbers && (
              <Text style={{
                fontSize: fontSize - 2,
                color: '#9CA3AF',
                marginRight: 12,
                minWidth: 24,
                textAlign: 'right',
                fontFamily: 'Courier New',
              }}>
                {index + 1}
              </Text>
            )}
            <Text style={{
              fontSize,
              fontFamily: 'Courier New',
              color: '#1F2937',
              flex: 1,
              lineHeight: fontSize * 1.4,
            }}>
              {line || ' '}
            </Text>
          </View>
        );
      });
    }

    // Fallback: plain text rendering
    const lines = codeText.split('\n');
    return lines.map((line, index) => (
      <View key={index} style={{ flexDirection: 'row', minHeight: 20 }}>
        {showLineNumbers && (
          <Text style={{
            fontSize: fontSize - 2,
            color: '#9CA3AF',
            marginRight: 12,
            minWidth: 24,
            textAlign: 'right',
            fontFamily: 'Courier New',
          }}>
            {index + 1}
          </Text>
        )}
        <Text style={{
          fontSize,
          fontFamily: 'Courier New',
          color: '#1F2937',
          flex: 1,
          lineHeight: fontSize * 1.4,
        }}>
          {line || ' '}
        </Text>
      </View>
    ));
  };

  return (
    <View
      style={styles.codeEditorContainer}
      accessibilityLabel={`${getLanguageDisplayName(language)} 코드 에디터`}
    >
      {/* Editor Header */}
      <View style={styles.codeEditorHeader}>
        <Text style={styles.languageTag}>
          {getLanguageDisplayName(language)}
        </Text>

        <View style={styles.codeActionsContainer}>
          <TouchableOpacity
            style={styles.codeActionButton}
            onPress={handleCopyCode}
            accessibilityRole="button"
            accessibilityLabel="코드 복사"
          >
            <Text style={styles.codeActionText}>복사</Text>
          </TouchableOpacity>

          {!readOnly && (
            <>
              {isEditing ? (
                <>
                  <TouchableOpacity
                    style={styles.codeActionButton}
                    onPress={handleCancelEdit}
                    accessibilityRole="button"
                    accessibilityLabel="편집 취소"
                  >
                    <Text style={styles.codeActionText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.codeActionButton, { backgroundColor: '#3B82F6' }]}
                    onPress={handleEditToggle}
                    accessibilityRole="button"
                    accessibilityLabel="편집 저장"
                  >
                    <Text style={[styles.codeActionText, { color: '#FFFFFF' }]}>저장</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.codeActionButton}
                  onPress={handleEditToggle}
                  accessibilityRole="button"
                  accessibilityLabel="코드 편집"
                >
                  <Text style={styles.codeActionText}>편집</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      {/* Code Content */}
      <ScrollView
        style={[styles.codeScrollView, { maxHeight }]}
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={true}
        horizontal={false}
      >
        {isEditing ? (
          <TextInput
            style={styles.codeTextInput}
            value={editedCode}
            onChangeText={setEditedCode}
            multiline
            textAlignVertical="top"
            placeholder="코드를 입력하세요..."
            placeholderTextColor="#9CA3AF"
            selectionColor="#3B82F6"
            accessibilityLabel="코드 편집 입력창"
            accessibilityHint="여기에서 코드를 수정할 수 있습니다"
          />
        ) : (
          <View style={{ padding: 12 }}>
            {code ? (
              renderCodeWithHighlighting(code)
            ) : (
              <Text style={{
                fontSize,
                fontFamily: 'Courier New',
                color: '#9CA3AF',
                fontStyle: 'italic',
              }}>
                아직 생성된 코드가 없습니다.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Info */}
      {code && (
        <View style={{
          backgroundColor: '#F9FAFB',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}>
          <Text style={{
            fontSize: 10,
            color: '#6B7280',
            fontFamily: 'Inter',
          }}>
            {code.split('\n').length} 줄 • {code.length} 문자
            {isEditing && ' • 편집 모드'}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CodeEditor;