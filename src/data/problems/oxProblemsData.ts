// Mock data for O/X problems
import { ProblemData } from '../../screens/Practice/Lv1OXProblemScreen.types';

export const OX_PROBLEMS_POOL: ProblemData[] = [
  {
    id: 'ox_001',
    title: 'Python에서 리스트는',
    subtitle: '가변(mutable) 자료형이다.',
    correctAnswer: 'O',
    explanation: '리스트는 생성 후에도 요소를 추가, 삭제, 수정할 수 있는 가변 자료형입니다.',
    category: 'Python 기초',
    emoji: '🤔',
  },
  {
    id: 'ox_002',
    title: 'JavaScript에서 var 키워드는',
    subtitle: '블록 스코프를 갖는다.',
    correctAnswer: 'X',
    explanation: 'var 키워드는 함수 스코프를 가지며, let과 const가 블록 스코프를 갖습니다.',
    category: 'JavaScript 기초',
    emoji: '🧐',
  },
  {
    id: 'ox_003',
    title: 'Python에서 튜플은',
    subtitle: '불변(immutable) 자료형이다.',
    correctAnswer: 'O',
    explanation: '튜플은 생성 후 요소를 변경할 수 없는 불변 자료형입니다.',
    category: 'Python 기초',
    emoji: '📦',
  },
  {
    id: 'ox_004',
    title: 'HTML에서 <div> 태그는',
    subtitle: '인라인 요소이다.',
    correctAnswer: 'X',
    explanation: '<div> 태그는 블록 레벨 요소로, 전체 너비를 차지하고 새 줄에서 시작합니다.',
    category: 'HTML 기초',
    emoji: '🏗️',
  },
  {
    id: 'ox_005',
    title: 'CSS에서 margin 속성은',
    subtitle: '요소의 내부 여백을 설정한다.',
    correctAnswer: 'X',
    explanation: 'margin은 요소의 외부 여백을 설정하며, 내부 여백은 padding으로 설정합니다.',
    category: 'CSS 기초',
    emoji: '🎨',
  },
  {
    id: 'ox_006',
    title: 'Python에서 ==과 is는',
    subtitle: '완전히 동일한 기능을 한다.',
    correctAnswer: 'X',
    explanation: '==은 값을 비교하고, is는 객체의 동일성(identity)을 비교합니다.',
    category: 'Python 심화',
    emoji: '⚖️',
  },
  {
    id: 'ox_007',
    title: 'React에서 useState는',
    subtitle: '함수형 컴포넌트에서만 사용할 수 있다.',
    correctAnswer: 'O',
    explanation: 'useState는 React Hook으로, 함수형 컴포넌트에서만 사용 가능합니다.',
    category: 'React 기초',
    emoji: '⚛️',
  },
  {
    id: 'ox_008',
    title: 'Git에서 commit은',
    subtitle: '변경사항을 로컬 저장소에 저장한다.',
    correctAnswer: 'O',
    explanation: 'git commit은 변경사항을 로컬 저장소에 저장하며, push를 통해 원격 저장소에 전송됩니다.',
    category: 'Git 기초',
    emoji: '📝',
  },
  {
    id: 'ox_009',
    title: 'SQL에서 SELECT 문은',
    subtitle: '데이터베이스의 구조를 변경한다.',
    correctAnswer: 'X',
    explanation: 'SELECT는 데이터를 조회하는 명령어이며, ALTER문이 데이터베이스 구조를 변경합니다.',
    category: 'SQL 기초',
    emoji: '🗄️',
  },
  {
    id: 'ox_010',
    title: 'TypeScript는',
    subtitle: 'JavaScript의 슈퍼셋(superset)이다.',
    correctAnswer: 'O',
    explanation: 'TypeScript는 JavaScript에 타입 시스템을 추가한 언어로, JavaScript의 슈퍼셋입니다.',
    category: 'TypeScript 기초',
    emoji: '🔷',
  },
  {
    id: 'ox_011',
    title: 'Node.js는',
    subtitle: '브라우저에서만 실행되는 JavaScript 런타임이다.',
    correctAnswer: 'X',
    explanation: 'Node.js는 서버 사이드에서 JavaScript를 실행할 수 있게 해주는 런타임 환경입니다.',
    category: 'Node.js 기초',
    emoji: '🟢',
  },
  {
    id: 'ox_012',
    title: 'HTTP 상태코드 404는',
    subtitle: '요청한 리소스를 찾을 수 없음을 의미한다.',
    correctAnswer: 'O',
    explanation: '404 Not Found는 서버가 요청받은 리소스를 찾을 수 없을 때 반환하는 상태코드입니다.',
    category: 'HTTP 기초',
    emoji: '🌐',
  },
  {
    id: 'ox_013',
    title: 'Python에서 lambda 함수는',
    subtitle: '여러 줄의 코드를 포함할 수 있다.',
    correctAnswer: 'X',
    explanation: 'lambda 함수는 단일 표현식만 포함할 수 있는 익명 함수입니다.',
    category: 'Python 심화',
    emoji: '🔧',
  },
  {
    id: 'ox_014',
    title: 'CSS Flexbox에서 justify-content는',
    subtitle: '주축(main axis) 방향의 정렬을 제어한다.',
    correctAnswer: 'O',
    explanation: 'justify-content는 flexbox의 주축 방향으로 아이템들의 정렬을 제어합니다.',
    category: 'CSS 심화',
    emoji: '📐',
  },
  {
    id: 'ox_015',
    title: 'JSON은',
    subtitle: 'JavaScript에서만 사용할 수 있는 데이터 형식이다.',
    correctAnswer: 'X',
    explanation: 'JSON은 언어 독립적인 데이터 교환 형식으로, 다양한 프로그래밍 언어에서 사용됩니다.',
    category: '데이터 형식',
    emoji: '📄',
  },
];

// Utility function to get random problems from the pool
export const getRandomOXProblems = (count: number = 10): ProblemData[] => {
  console.log(`🎲 getRandomOXProblems called with count: ${count}`);
  console.log(`📚 OX_PROBLEMS_POOL size: ${OX_PROBLEMS_POOL.length}`);

  if (!OX_PROBLEMS_POOL || OX_PROBLEMS_POOL.length === 0) {
    console.error('❌ OX_PROBLEMS_POOL is empty or undefined!');
    return [];
  }

  const shuffled = [...OX_PROBLEMS_POOL].sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, Math.min(count, OX_PROBLEMS_POOL.length));

  console.log(`✅ Returning ${result.length} problems`);
  console.log('First problem:', result[0]?.id, result[0]?.title);

  return result;
};

// Function to get a specific problem by ID
export const getOXProblemById = (id: string): ProblemData | undefined => {
  return OX_PROBLEMS_POOL.find(problem => problem.id === id);
};

// Function to get problems by category
export const getOXProblemsByCategory = (category: string): ProblemData[] => {
  return OX_PROBLEMS_POOL.filter(problem => problem.category === category);
};