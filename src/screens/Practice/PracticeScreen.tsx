import React, { useState } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { styles } from './Practice.styles';
import { TerminalHeader } from '../../modules/common';
import FilterSection from '../../components/Practice/FilterSection';
import ProblemCard from '../../components/Practice/ProblemCard';
import BottomNavigationBar from '../../components/BottomNavigation/BottomNavigationBar';
import { ProgrammingLanguage, DifficultyLevel, SortOption, ProblemData } from '../../types/practice';

interface PracticeScreenProps {
  onProblemPress?: (problemId: string) => void;
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({
  onProblemPress = (id) => console.log('Problem pressed:', id),
  activeTab = 'Practice',
  onTabPress = (tab) => console.log('Tab pressed:', tab),
}) => {
  // State for filters
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('Python');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('Lv.1');
  const [selectedSort, setSelectedSort] = useState<SortOption>('추천순');

  // Mock data based on Figma design
  const problemsData: ProblemData[] = [
    {
      id: '1',
      title: '두 수의 합',
      difficulty: 'Lv.1',
      difficultyLabel: 'Easy',
      difficultyColor: '#065F46',
      difficultyBg: '#D1FAE5',
      tags: [
        { name: '배열', color: '#1E40AF', bg: '#DBEAFE' },
        { name: '해시테이블', color: '#92400E', bg: '#FEF3C7' },
      ],
      timeEstimate: '15분',
      successRate: '85%',
    },
    {
      id: '2',
      title: '가장 긴 증가하는 부분 수열',
      difficulty: 'Lv.1',
      difficultyLabel: 'Medium',
      difficultyColor: '#92400E',
      difficultyBg: '#FEF3C7',
      tags: [
        { name: 'DP', color: '#4338CA', bg: '#E0E7FF' },
        { name: '배열', color: '#1E40AF', bg: '#DBEAFE' },
      ],
      timeEstimate: '25분',
      successRate: '62%',
    },
    {
      id: '3',
      title: '문자열 압축',
      difficulty: 'Lv.1',
      difficultyLabel: 'Easy',
      difficultyColor: '#065F46',
      difficultyBg: '#D1FAE5',
      tags: [
        { name: '문자열', color: '#92400E', bg: '#FEF3C7' },
        { name: '구현', color: '#BE185D', bg: '#FCE7F3' },
      ],
      timeEstimate: '25분',
      successRate: '62%',
    },
    {
      id: '4',
      title: '네트워크 연결',
      difficulty: 'Lv.1',
      difficultyLabel: 'Hard',
      difficultyColor: '#991B1B',
      difficultyBg: '#FEE2E2',
      tags: [
        { name: '그래프', color: '#065F46', bg: '#D1FAE5' },
        { name: 'DFS', color: '#4338CA', bg: '#E0E7FF' },
      ],
      timeEstimate: '25분',
      successRate: '62%',
    },
    {
      id: '5',
      title: '괄호 검증',
      difficulty: 'Lv.1',
      difficultyLabel: 'Easy',
      difficultyColor: '#065F46',
      difficultyBg: '#D1FAE5',
      tags: [
        { name: '스택', color: '#1E40AF', bg: '#DBEAFE' },
        { name: '문자열', color: '#92400E', bg: '#FEF3C7' },
      ],
      timeEstimate: '25분',
      successRate: '62%',
    },
  ];

  const handleLanguageChange = (language: ProgrammingLanguage) => {
    setSelectedLanguage(language);
  };

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TerminalHeader showShadow />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FilterSection
          selectedLanguage={selectedLanguage}
          selectedDifficulty={selectedDifficulty}
          selectedSort={selectedSort}
          onLanguageChange={handleLanguageChange}
          onDifficultyChange={handleDifficultyChange}
          onSortChange={handleSortChange}
        />

        <View style={styles.problemsContainer}>
          {problemsData.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onPress={() => onProblemPress(problem.id)}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNavigationBar
        activeTab={activeTab}
        onTabPress={onTabPress}
      />
    </SafeAreaView>
  );
};

export default PracticeScreen;