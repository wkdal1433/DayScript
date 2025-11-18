# Lv2MultipleChoiceProblemScreen 구현 문서

## 개요

이 문서는 입문 단계(Lv2)에서 사용되는 **객관식 선택 문제 화면의 UI** 구현에 대한 상세한 기술적 설명을 제공합니다. 이 화면은 Figma 디자인을 기반으로 하여 정확하게 구현되었으며, Lv1 O/X 화면과 함께 무작위로 선택되어 문제 풀이 스택에 사용됩니다.

## 파일 구조

```
src/screens/Practice/
├── Lv2MultipleChoiceProblemScreen.tsx          # 메인 컴포넌트
├── Lv2MultipleChoiceProblemScreen.styles.ts    # 스타일 정의
├── Lv2MultipleChoiceProblemScreen.types.ts     # 타입 정의
├── Lv2MultipleChoiceProblemScreen.test.tsx     # 테스트 파일
└── Lv2MultipleChoiceProblemScreen.md           # 이 문서
```

## 구현된 주요 기능

### 1. UI 레이아웃 (Figma 디자인 완벽 매칭)

#### 헤더 섹션
- **뒤로가기 버튼**: 원형 배경에 화살표 아이콘
- **문제 카운터**: "문제 2/ 10" 형태로 현재 진행 상태 표시
- **카테고리 배지**: "기초 문법 : 함수 정의" 등 문제 카테고리 표시
- **타이머**: 남은 시간을 "30s" 형태로 표시

#### 진행률 바
- **상단 진행률 바**: 문제 해결 진행률을 시각적으로 표시 (4px 높이)
- **하단 진행률 바**: 전체 진행률과 백분율 표시 (8px 높이)
- **애니메이션**: Animated.Value를 사용한 부드러운 진행률 애니메이션

#### 문제 내용 영역
- **문제 제목**: "Python에서 함수를 정의할 때 사용하는"
- **문제 부제목**: "키워드는 무엇일까요?"
- **스크롤 가능**: ScrollView를 사용하여 긴 문제도 표시 가능

#### 객관식 선택 영역
- **4개 선택지**: A, B, C, D 옵션
- **코드 폰트**: Fira Code 폰트 사용으로 코딩 관련 텍스트 최적화
- **선택 상태 표시**: 선택된 항목의 시각적 피드백
- **정답/오답 표시**: 결과 표시 시 색상 변경

#### 하단 제출 영역
- **정답 제출하기 버튼**: 선택 후 활성화
- **진행률 표시**: 전체 진행률과 백분율

### 2. 상태 관리 로직

#### 기본 상태
```typescript
const [selectedAnswer, setSelectedAnswer] = useState<MultipleChoiceAnswer | null>(null);
const [showResult, setShowResult] = useState(false);
const [progressAnimation] = useState(new Animated.Value(0));
```

#### 선택 처리 로직
```typescript
const handleChoicePress = (choiceId: MultipleChoiceAnswer) => {
  if (selectedAnswer) return; // 중복 선택 방지

  setSelectedAnswer(choiceId);
  setShowResult(true);
  onAnswerSelect(choiceId);

  // 2초 후 자동으로 다음 문제로 진행
  setTimeout(() => {
    onNext();
  }, 2000);
};
```

#### 진행률 애니메이션
```typescript
useEffect(() => {
  const progressPercentage = (currentProblem / totalProblems) * 100;
  Animated.timing(progressAnimation, {
    toValue: progressPercentage,
    duration: 500,
    useNativeDriver: false,
  }).start();
}, [currentProblem, totalProblems, progressAnimation]);
```

### 3. 스타일 시스템

#### 색상 매핑 (Figma → Constants)
```typescript
// Figma fill_K6RHLU → Header background
backgroundColor: 'rgba(255, 255, 255, 0.9)'

// Figma fill_4UMOAZ → Back button background
backgroundColor: 'rgba(248, 232, 238, 0.8)'

// Figma fill_K2O21T → Text color
color: COLORS.textPrimary // #393E46

// Figma stroke_KRQJEO → Choice border
borderColor: COLORS.primary // #F2BED1
```

#### 타이포그래피 매핑
```typescript
// Figma style_R2F6SW → 문제 카운터 및 제목
fontSize: 18,
fontWeight: FONTS.weights.bold,

// Figma style_2NN97V → 선택지 텍스트 (Fira Code)
fontSize: 16,
fontFamily: 'Fira Code',
fontWeight: '500',

// Figma style_CJT6M4 → 카테고리 텍스트
fontSize: 11,
fontWeight: FONTS.weights.bold,
```

#### 레이아웃 매핑
```typescript
// Figma layout_4HCOFQ → 헤더 영역
height: 80,

// Figma layout_Z385Y8 → 선택지 컨테이너
height: 64,

// Figma layout_168MWC → 하단 제출 영역
height: 124,

// Figma layout_6RB6R6 → 상단 진행률 바
height: 4,
```

### 4. 타입 정의

#### 핵심 타입
```typescript
export type MultipleChoiceAnswer = 'A' | 'B' | 'C' | 'D';

export interface ChoiceOption {
  id: MultipleChoiceAnswer;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceProblemData {
  id: string;
  title: string;
  subtitle: string;
  correctAnswer: MultipleChoiceAnswer;
  explanation: string;
  category: string;
  choices: ChoiceOption[];
}

export interface Lv2MultipleChoiceProblemScreenProps {
  onAnswerSelect?: (answer: MultipleChoiceAnswer) => void;
  onClose?: () => void;
  onNext?: () => void;
  currentProblem?: number;
  totalProblems?: number;
  timeRemaining?: number;
  problemData?: MultipleChoiceProblemData;
}
```

### 5. 네비게이션 통합

#### HomeScreen 통합
```typescript
// HomeScreen.tsx에서 상태 관리
const [currentProblemType, setCurrentProblemType] = useState<'OX' | 'MultipleChoice'>('OX');

// 난이도 선택 시 랜덤 타입 선택
const handleLevelSelect = (level: DifficultyLevel) => {
  if (level === '입문') {
    const problemTypes: ('OX' | 'MultipleChoice')[] = ['OX', 'MultipleChoice'];
    const randomType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    setCurrentProblemType(randomType);
    setShowProblemScreen(true);
  }
};

// 조건부 렌더링
{showProblemScreen && currentProblemType === 'MultipleChoice' && (
  <Lv2MultipleChoiceProblemScreen
    onAnswerSelect={handleAnswerSelect}
    onClose={handleProblemScreenClose}
    onNext={handleNextProblem}
    currentProblem={2}
    totalProblems={10}
    timeRemaining={30}
  />
)}
```

## 기술적 특징

### 1. 완전한 TypeScript 지원
- 모든 컴포넌트와 함수에 명시적 타입 정의
- 객관식 답안 타입 안전성 보장 (A, B, C, D)
- 기본값 제공으로 선택적 props 지원

### 2. Figma 디자인 완벽 재현
- 모든 시각적 요소의 정확한 크기, 색상, 간격 매핑
- Figma 노드 ID와 스타일 ID를 주석으로 문서화
- 기존 디자인 시스템과의 일관성 유지
- Fira Code 폰트를 사용한 코드 텍스트 최적화

### 3. 성능 최적화
- ScrollView를 사용한 효율적인 콘텐츠 렌더링
- 불필요한 리렌더링 방지를 위한 상태 관리
- Animated API를 활용한 네이티브 성능

### 4. 접근성 고려
- 터치 영역 최적화 (64px 높이)
- 명확한 시각적 피드백 (선택 상태, 정답/오답 표시)
- 스크롤 가능한 콘텐츠로 다양한 화면 크기 지원

### 5. 확장성
- 다양한 문제 타입으로 확장 가능한 인터페이스
- 재사용 가능한 컴포넌트 구조
- 모듈화된 스타일 시스템

## 테스트 커버리지

### 단위 테스트 (Lv2MultipleChoiceProblemScreen.test.tsx)
- 컴포넌트 렌더링 테스트
- 객관식 선택지 상호작용 테스트
- 상태 변경 테스트
- 콜백 함수 호출 테스트
- 진행률 계산 테스트
- 타이머 포맷팅 테스트
- 결과 표시 테스트
- 제출 버튼 활성화 테스트

### 통합 테스트 시나리오
1. HomeScreen → DifficultySelectionModal → Lv2MultipleChoiceProblemScreen 플로우
2. 선택지 선택 → 결과 표시 → 다음 문제 진행 플로우
3. 뒤로가기 → HomeScreen 복귀 플로우

## 핵심 차별점 (vs Lv1 O/X 화면)

### 1. 선택지 구조
- **Lv1**: 2개 버튼 (O, X)
- **Lv2**: 4개 선택지 (A, B, C, D) + 제출 버튼

### 2. 레이아웃
- **Lv1**: 중앙 정렬된 큰 버튼들
- **Lv2**: 리스트 형태의 선택지 + 스크롤 가능

### 3. 상호작용
- **Lv1**: 선택 즉시 결과 표시
- **Lv2**: 선택 후 제출 버튼으로 결과 표시

### 4. 폰트 시스템
- **Lv1**: 일반 Inter 폰트
- **Lv2**: 코드 텍스트에 Fira Code 폰트 사용

## 사용법

### 기본 사용법
```typescript
<Lv2MultipleChoiceProblemScreen
  onAnswerSelect={(answer) => console.log('Answer:', answer)}
  onClose={() => navigation.goBack()}
  onNext={() => loadNextProblem()}
  currentProblem={2}
  totalProblems={10}
  timeRemaining={30}
/>
```

### 커스텀 문제 데이터 사용
```typescript
const customProblemData = {
  id: '3',
  title: 'JavaScript에서 변수를 선언할 때',
  subtitle: '사용하는 키워드가 아닌 것은?',
  correctAnswer: 'D' as MultipleChoiceAnswer,
  explanation: 'function은 함수를 선언할 때 사용하는 키워드입니다.',
  category: 'JavaScript 기초',
  choices: [
    { id: 'A', text: 'var', isCorrect: false },
    { id: 'B', text: 'let', isCorrect: false },
    { id: 'C', text: 'const', isCorrect: false },
    { id: 'D', text: 'function', isCorrect: true },
  ],
};

<Lv2MultipleChoiceProblemScreen
  problemData={customProblemData}
  // ... other props
/>
```

## 향후 개선 사항

### 1. UI/UX 개선
- 선택지 선택 시 더 다양한 애니메이션 효과
- 정답/오답 표시 애니메이션 강화
- 드래그 제스처를 통한 선택지 재정렬

### 2. 기능 확장
- 이미지가 포함된 선택지 지원
- 코드 하이라이팅 기능
- 선택지 셔플 기능
- 부분 점수 시스템

### 3. 성능 최적화
- 가상화된 리스트 렌더링 (많은 선택지 처리)
- 이미지 리소스 최적화
- 메모리 사용량 최적화

### 4. 접근성 강화
- 스크린 리더 지원 강화
- 키보드 네비게이션 지원
- 고대비 모드 지원

## 기술 스택

- **React Native** + **TypeScript**
- **Animated API** (진행률 애니메이션)
- **ScrollView** (콘텐츠 스크롤)
- **Fira Code 폰트** (코드 텍스트)
- **기존 디자인 시스템** 완전 준수
- **Jest + React Native Testing Library**

이 구현은 React Native 환경에서 Figma 디자인을 완벽하게 재현하면서도, Lv1 O/X 화면과 함께 사용할 수 있는 확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.