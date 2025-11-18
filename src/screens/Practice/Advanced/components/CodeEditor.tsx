import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CodeEditorProps } from '../Lv4DebuggingScreen.types';
import { styles } from './CodeEditor.styles';

/**
 * CodeEditor Component
 * Monaco Editor 스타일의 코드 편집기 목업
 * SOLID 원칙: 단일 책임 - 코드 편집과 표시만 담당
 */
const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onCodeChange,
  readonly = false,
  highlightedLines = [],
  theme = 'light',
}) => {
  const [localCode, setLocalCode] = useState(code);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const textInputRef = useRef<TextInput>(null);

  // 코드가 외부에서 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  // 줄 번호 생성
  const lines = localCode.split('\n');
  const lineNumbers = lines.map((_, index) => index + 1);

  // 코드 변경 핸들러
  const handleCodeChange = (newCode: string) => {
    setLocalCode(newCode);
    onCodeChange(newCode);
    updateCursorPosition(newCode);
  };

  // 커서 위치 업데이트
  const updateCursorPosition = (text: string) => {
    const lines = text.split('\n');
    const totalLines = lines.length;
    const lastLineLength = lines[lines.length - 1].length;
    setCursorPosition({
      line: totalLines,
      column: lastLineLength + 1,
    });
  };

  // 라인 클릭 핸들러 (디버깅 브레이크포인트 시뮬레이션)
  const handleLineClick = (lineNumber: number) => {
    if (readonly) return;

    setSelectedLines(prev =>
      prev.includes(lineNumber)
        ? prev.filter(l => l !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  // 키워드 하이라이팅
  const getHighlightedText = (text: string, lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const isSelected = selectedLines.includes(lineNumber);

    // Python 키워드 하이라이팅 (간단한 예시)
    const keywords = ['def', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'class'];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

    let highlightedText = text;
    if (language === 'python') {
      highlightedText = text.replace(keywordRegex, '🔵$1'); // 키워드 표시 (실제로는 색상으로 구현)
    }

    return {
      text: highlightedText,
      isHighlighted,
      isSelected,
    };
  };

  // 줄 스타일 결정
  const getLineStyle = (lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const isSelected = selectedLines.includes(lineNumber);

    if (isHighlighted) return styles.highlightedLine;
    if (isSelected) return styles.selectedLine;
    return styles.normalLine;
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      {/* 에디터 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.languageTag}>
            <Text style={styles.languageText}>{language.toUpperCase()}</Text>
          </View>
          <Text style={styles.fileNameText}>main.{language === 'python' ? 'py' : 'js'}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.cursorPosition}>
            줄 {cursorPosition.line}, 열 {cursorPosition.column}
          </Text>
        </View>
      </View>

      {/* 에디터 메인 영역 */}
      <View style={styles.editorContainer}>
        {/* 줄 번호 영역 */}
        <View style={styles.lineNumberContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {lineNumbers.map((lineNumber) => (
              <TouchableOpacity
                key={lineNumber}
                style={[styles.lineNumberButton, getLineStyle(lineNumber)]}
                onPress={() => handleLineClick(lineNumber)}
                disabled={readonly}
              >
                <Text style={[
                  styles.lineNumber,
                  selectedLines.includes(lineNumber) && styles.selectedLineNumber,
                  highlightedLines.includes(lineNumber) && styles.highlightedLineNumber,
                ]}>
                  {lineNumber}
                </Text>
                {selectedLines.includes(lineNumber) && (
                  <View style={styles.breakpoint} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 코드 편집 영역 */}
        <View style={styles.codeContainer}>
          {readonly ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {lines.map((line, index) => {
                const lineNumber = index + 1;
                const { text, isHighlighted, isSelected } = getHighlightedText(line, lineNumber);

                return (
                  <View key={lineNumber} style={[
                    styles.codeLine,
                    isHighlighted && styles.highlightedCodeLine,
                    isSelected && styles.selectedCodeLine,
                  ]}>
                    <Text style={[
                      styles.codeText,
                      isHighlighted && styles.highlightedCodeText,
                      isSelected && styles.selectedCodeText,
                    ]}>
                      {text || ' '}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <TextInput
              ref={textInputRef}
              style={styles.codeInput}
              value={localCode}
              onChangeText={handleCodeChange}
              multiline
              scrollEnabled
              placeholder="여기에 코드를 입력하세요..."
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
              fontFamily="Fira Code"
              fontSize={14}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="ascii-capable"
            />
          )}
        </View>
      </View>

      {/* 에디터 푸터 (상태 정보) */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerText}>
            {readonly ? '읽기 전용' : '편집 가능'} • {lines.length}줄 • {localCode.length}자
          </Text>
        </View>
        <View style={styles.footerRight}>
          <Text style={styles.footerText}>
            {language === 'python' ? 'Python 3.x' : 'JavaScript ES6+'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CodeEditor;