import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { styles } from '../../screens/Practice/Practice.styles';
import { LanguageToggleProps, ProgrammingLanguage } from '../../types/practice';

/**
 * LanguageToggle Component
 *
 * 프로그래밍 언어 선택을 위한 토글 버튼 컴포넌트
 * Figma 디자인: Python/Java/C++ 3개 언어 토글
 */
const LanguageToggle: React.FC<LanguageToggleProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const languages: ProgrammingLanguage[] = ['Python', 'Java', 'C++'];

  return (
    <View style={styles.languageToggle}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language}
          style={[
            styles.languageButton,
            selectedLanguage === language && styles.languageButtonActive,
          ]}
          onPress={() => onLanguageChange(language)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.languageButtonText,
              selectedLanguage === language && styles.languageButtonTextActive,
            ]}
          >
            {language}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default LanguageToggle;