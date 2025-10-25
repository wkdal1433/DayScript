/**
 * Practice Screen Type Definitions
 *
 * Figma Design 기반 Practice 화면의 모든 타입 정의
 */

// 프로그래밍 언어 옵션
export type ProgrammingLanguage = 'Python' | 'Java' | 'C++';

// 난이도 레벨
export type DifficultyLevel = 'Lv.1' | 'Lv.2' | 'Lv.3' | '전체';

// 정렬 옵션
export type SortOption = '추천순' | '최신순' | '난이도순' | '성공률순';

// 문제 태그 인터페이스
export interface ProblemTag {
  name: string;
  color: string;
  bg: string;
}

// 문제 데이터 인터페이스
export interface ProblemData {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
  difficultyColor: string;
  difficultyBg: string;
  tags: ProblemTag[];
  timeEstimate: string;
  successRate: string;
}

// 필터 섹션 Props
export interface FilterSectionProps {
  selectedLanguage: ProgrammingLanguage;
  selectedDifficulty: DifficultyLevel;
  selectedSort: SortOption;
  onLanguageChange: (language: ProgrammingLanguage) => void;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
  onSortChange: (sort: SortOption) => void;
}

// 문제 카드 Props
export interface ProblemCardProps {
  problem: ProblemData;
  onPress: () => void;
}

// 언어 토글 Props
export interface LanguageToggleProps {
  selectedLanguage: ProgrammingLanguage;
  onLanguageChange: (language: ProgrammingLanguage) => void;
}

// 난이도 선택 Props
export interface DifficultySelectProps {
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

// 정렬 선택 Props
export interface SortSelectProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}