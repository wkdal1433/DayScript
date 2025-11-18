import { CommunityPost, Comment, PostCategory } from '../types/community.types';

// 5글자 더미 데이터 생성 함수들
const generateRandomText = (length: number = 5): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz가나다라마바사아자차카타파하';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateRandomCode = (): string => {
  const codeSnippets = [
    'function solve() {\n  return true;\n}',
    'const arr = [1,2,3];\nreturn arr.map(x => x*2);',
    'for(let i=0; i<n; i++) {\n  console.log(i);\n}',
    'if (condition) {\n  doSomething();\n}',
    'class Solution {\n  solve() {\n    return 42;\n  }\n}'
  ];
  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
};

const userNames = ['김철수', '이영희', '박민준', '최수진', '정도현'];
const problemTitles = ['배열정렬', '문자탐색', '트리순회', '그래프탐색', '동적계획'];
const categories: PostCategory[] = ['problems', 'resources', 'career'];

// 더미 댓글 생성
const generateMockComments = (count: number = 3): Comment[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `comment_${Date.now()}_${index}`,
    postId: `post_${Date.now()}_${index}`,
    content: `${generateRandomText(8)} 좋은 의견이네요! ${generateRandomText(5)}`,
    authorId: `user_${index}`,
    authorName: userNames[index % userNames.length],
    author: {
      id: `user_${index}`,
      username: userNames[index % userNames.length],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      level: Math.floor(Math.random() * 10) + 1,
      reputation: Math.floor(Math.random() * 1000),
    },
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7), // 최근 1주일 내
    updatedAt: new Date(),
    likes: Math.floor(Math.random() * 50),
    dislikes: Math.floor(Math.random() * 5),
    replies: [],
    isEdited: Math.random() > 0.8,
  }));
};

// 더미 포스트 생성
export const generateMockPosts = (count: number = 12): CommunityPost[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `post_${Date.now()}_${index}`,
    title: `${problemTitles[index % problemTitles.length]} 질문드려요`,
    content: `안녕하세요! ${generateRandomText(6)}에 대해 질문이 있습니다.\n\n\`\`\`javascript\n${generateRandomCode()}\n\`\`\`\n\n${generateRandomText(10)} 이렇게 하면 될까요?`,
    category: categories[index % categories.length],
    authorId: `user_${index}`,
    authorName: userNames[index % userNames.length],
    author: {
      id: `user_${index}`,
      username: userNames[index % userNames.length],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      level: Math.floor(Math.random() * 10) + 1,
      reputation: Math.floor(Math.random() * 1000),
    },
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 30), // 최근 1달 내
    updatedAt: new Date(),
    likes: Math.floor(Math.random() * 100),
    dislikes: Math.floor(Math.random() * 10),
    views: Math.floor(Math.random() * 500) + 50,
    commentCount: Math.floor(Math.random() * 20),
    tags: [
      generateRandomText(4),
      generateRandomText(6),
      generateRandomText(3)
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    isPinned: Math.random() > 0.9,
    isSolved: Math.random() > 0.7,
    difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as 'easy' | 'medium' | 'hard',
    problemId: `problem_${Math.floor(Math.random() * 100) + 1}`,
    codeSnippet: generateRandomCode(),
  }));
};

// 초기 더미 데이터
export const MOCK_POSTS = generateMockPosts();