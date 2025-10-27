// Mock data for Multiple Choice problems
import { MultipleChoiceProblemData } from '../../screens/Practice/Lv2MultipleChoiceProblemScreen.types';

export const MULTIPLE_CHOICE_PROBLEMS_POOL: MultipleChoiceProblemData[] = [
  {
    id: 'mc_001',
    title: 'Python에서 함수를 정의할 때 사용하는',
    subtitle: '키워드는 무엇일까요?',
    correctAnswer: 'C',
    explanation: 'Python에서 함수를 정의할 때는 "def" 키워드를 사용합니다.',
    category: '기초 문법 : 함수 정의',
    choices: [
      { id: 'A', text: 'function', isCorrect: false },
      { id: 'B', text: 'define', isCorrect: false },
      { id: 'C', text: 'def', isCorrect: true },
      { id: 'D', text: 'func', isCorrect: false },
    ],
  },
  {
    id: 'mc_002',
    title: 'JavaScript에서 배열의 마지막 요소를 제거하는',
    subtitle: '메서드는 무엇인가요?',
    correctAnswer: 'B',
    explanation: 'pop() 메서드는 배열의 마지막 요소를 제거하고 반환합니다.',
    category: 'JavaScript 배열',
    choices: [
      { id: 'A', text: 'shift()', isCorrect: false },
      { id: 'B', text: 'pop()', isCorrect: true },
      { id: 'C', text: 'push()', isCorrect: false },
      { id: 'D', text: 'unshift()', isCorrect: false },
    ],
  },
  {
    id: 'mc_003',
    title: 'CSS에서 요소를 화면 중앙에 배치하는',
    subtitle: 'flexbox 속성 조합은?',
    correctAnswer: 'A',
    explanation: 'justify-content: center와 align-items: center를 함께 사용하면 요소를 중앙에 배치할 수 있습니다.',
    category: 'CSS 레이아웃',
    choices: [
      { id: 'A', text: 'justify-content: center; align-items: center;', isCorrect: true },
      { id: 'B', text: 'text-align: center; vertical-align: middle;', isCorrect: false },
      { id: 'C', text: 'margin: auto; padding: auto;', isCorrect: false },
      { id: 'D', text: 'position: absolute; center: true;', isCorrect: false },
    ],
  },
  {
    id: 'mc_004',
    title: 'React에서 컴포넌트의 상태를 관리하는',
    subtitle: 'Hook은 무엇인가요?',
    correctAnswer: 'C',
    explanation: 'useState Hook은 함수형 컴포넌트에서 상태를 관리하는 데 사용됩니다.',
    category: 'React Hooks',
    choices: [
      { id: 'A', text: 'useEffect', isCorrect: false },
      { id: 'B', text: 'useContext', isCorrect: false },
      { id: 'C', text: 'useState', isCorrect: true },
      { id: 'D', text: 'useRef', isCorrect: false },
    ],
  },
  {
    id: 'mc_005',
    title: 'Python에서 문자열을 리스트로 변환하는',
    subtitle: '메서드는 무엇인가요?',
    correctAnswer: 'D',
    explanation: 'split() 메서드는 문자열을 지정된 구분자로 나누어 리스트로 반환합니다.',
    category: 'Python 문자열',
    choices: [
      { id: 'A', text: 'join()', isCorrect: false },
      { id: 'B', text: 'append()', isCorrect: false },
      { id: 'C', text: 'slice()', isCorrect: false },
      { id: 'D', text: 'split()', isCorrect: true },
    ],
  },
  {
    id: 'mc_006',
    title: 'HTML에서 외부 CSS 파일을 연결하는',
    subtitle: '태그는 무엇인가요?',
    correctAnswer: 'A',
    explanation: '<link> 태그는 외부 리소스를 HTML 문서에 연결할 때 사용됩니다.',
    category: 'HTML 기초',
    choices: [
      { id: 'A', text: '<link>', isCorrect: true },
      { id: 'B', text: '<style>', isCorrect: false },
      { id: 'C', text: '<css>', isCorrect: false },
      { id: 'D', text: '<import>', isCorrect: false },
    ],
  },
  {
    id: 'mc_007',
    title: 'Git에서 새로운 브랜치를 생성하고 전환하는',
    subtitle: '명령어는 무엇인가요?',
    correctAnswer: 'B',
    explanation: 'git checkout -b는 새로운 브랜치를 생성하고 동시에 그 브랜치로 전환합니다.',
    category: 'Git 브랜치',
    choices: [
      { id: 'A', text: 'git branch new-branch', isCorrect: false },
      { id: 'B', text: 'git checkout -b new-branch', isCorrect: true },
      { id: 'C', text: 'git create new-branch', isCorrect: false },
      { id: 'D', text: 'git switch new-branch', isCorrect: false },
    ],
  },
  {
    id: 'mc_008',
    title: 'SQL에서 중복된 값을 제거하여 조회하는',
    subtitle: '키워드는 무엇인가요?',
    correctAnswer: 'C',
    explanation: 'DISTINCT 키워드는 중복된 값을 제거하고 고유한 값만 반환합니다.',
    category: 'SQL 기초',
    choices: [
      { id: 'A', text: 'UNIQUE', isCorrect: false },
      { id: 'B', text: 'REMOVE', isCorrect: false },
      { id: 'C', text: 'DISTINCT', isCorrect: true },
      { id: 'D', text: 'FILTER', isCorrect: false },
    ],
  },
  {
    id: 'mc_009',
    title: 'Node.js에서 패키지를 설치하는',
    subtitle: '명령어는 무엇인가요?',
    correctAnswer: 'A',
    explanation: 'npm install은 Node.js 패키지를 설치하는 기본 명령어입니다.',
    category: 'Node.js 패키지',
    choices: [
      { id: 'A', text: 'npm install', isCorrect: true },
      { id: 'B', text: 'node install', isCorrect: false },
      { id: 'C', text: 'npm add', isCorrect: false },
      { id: 'D', text: 'package install', isCorrect: false },
    ],
  },
  {
    id: 'mc_010',
    title: 'TypeScript에서 변수의 타입을 명시적으로',
    subtitle: '선언하는 방법은?',
    correctAnswer: 'B',
    explanation: 'TypeScript에서는 콜론(:) 뒤에 타입을 명시하여 변수의 타입을 선언합니다.',
    category: 'TypeScript 타입',
    choices: [
      { id: 'A', text: 'let name as string', isCorrect: false },
      { id: 'B', text: 'let name: string', isCorrect: true },
      { id: 'C', text: 'let name = string', isCorrect: false },
      { id: 'D', text: 'let name<string>', isCorrect: false },
    ],
  },
  {
    id: 'mc_011',
    title: 'HTTP 상태코드 중 성공을 나타내는',
    subtitle: '코드는 무엇인가요?',
    correctAnswer: 'A',
    explanation: '200 OK는 요청이 성공적으로 처리되었음을 나타내는 상태코드입니다.',
    category: 'HTTP 상태코드',
    choices: [
      { id: 'A', text: '200', isCorrect: true },
      { id: 'B', text: '404', isCorrect: false },
      { id: 'C', text: '500', isCorrect: false },
      { id: 'D', text: '302', isCorrect: false },
    ],
  },
  {
    id: 'mc_012',
    title: 'Python에서 딕셔너리의 모든 키를 가져오는',
    subtitle: '메서드는 무엇인가요?',
    correctAnswer: 'D',
    explanation: 'keys() 메서드는 딕셔너리의 모든 키를 반환합니다.',
    category: 'Python 딕셔너리',
    choices: [
      { id: 'A', text: 'get_keys()', isCorrect: false },
      { id: 'B', text: 'all_keys()', isCorrect: false },
      { id: 'C', text: 'items()', isCorrect: false },
      { id: 'D', text: 'keys()', isCorrect: true },
    ],
  },
  {
    id: 'mc_013',
    title: 'CSS에서 요소의 크기를 화면에 맞게',
    subtitle: '반응형으로 설정하는 단위는?',
    correctAnswer: 'C',
    explanation: 'vw(viewport width)와 vh(viewport height)는 뷰포트 크기에 상대적인 단위입니다.',
    category: 'CSS 반응형',
    choices: [
      { id: 'A', text: 'px', isCorrect: false },
      { id: 'B', text: 'em', isCorrect: false },
      { id: 'C', text: 'vw, vh', isCorrect: true },
      { id: 'D', text: 'pt', isCorrect: false },
    ],
  },
  {
    id: 'mc_014',
    title: 'JavaScript에서 비동기 처리를 위한',
    subtitle: '최신 문법은 무엇인가요?',
    correctAnswer: 'B',
    explanation: 'async/await는 Promise를 더 간단하고 읽기 쉽게 처리할 수 있는 최신 문법입니다.',
    category: 'JavaScript 비동기',
    choices: [
      { id: 'A', text: 'callback', isCorrect: false },
      { id: 'B', text: 'async/await', isCorrect: true },
      { id: 'C', text: 'setTimeout', isCorrect: false },
      { id: 'D', text: 'setInterval', isCorrect: false },
    ],
  },
  {
    id: 'mc_015',
    title: 'React에서 컴포넌트 간 데이터를 전달하는',
    subtitle: '방법은 무엇인가요?',
    correctAnswer: 'A',
    explanation: 'props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 기본 방법입니다.',
    category: 'React 데이터 전달',
    choices: [
      { id: 'A', text: 'props', isCorrect: true },
      { id: 'B', text: 'variables', isCorrect: false },
      { id: 'C', text: 'functions', isCorrect: false },
      { id: 'D', text: 'methods', isCorrect: false },
    ],
  },
];

// Utility function to get random problems from the pool
export const getRandomMultipleChoiceProblems = (count: number = 10): MultipleChoiceProblemData[] => {
  const shuffled = [...MULTIPLE_CHOICE_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, MULTIPLE_CHOICE_PROBLEMS_POOL.length));
};

// Function to get a specific problem by ID
export const getMultipleChoiceProblemById = (id: string): MultipleChoiceProblemData | undefined => {
  return MULTIPLE_CHOICE_PROBLEMS_POOL.find(problem => problem.id === id);
};

// Function to get problems by category
export const getMultipleChoiceProblemsByCategory = (category: string): MultipleChoiceProblemData[] => {
  return MULTIPLE_CHOICE_PROBLEMS_POOL.filter(problem => problem.category === category);
};