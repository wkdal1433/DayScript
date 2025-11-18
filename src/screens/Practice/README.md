# Lv1OXProblemScreen 구현 문서

## 개요

이 문서는 입문 단계(Lv1)에서 사용되는 **O/X 문제 화면의 UI** 구현에 대한 상세한 기술적 설명을 제공합니다. 이 화면은 Figma 디자인을 기반으로 하여 정확하게 구현되었으며, 난이도 선택 후 문제 풀이 스택의 첫 번째 화면으로 사용됩니다.

## 파일 구조

```
src/screens/Practice/
├── Lv1OXProblemScreen.tsx          # 메인 컴포넌트
├── Lv1OXProblemScreen.styles.ts    # 스타일 정의
├── Lv1OXProblemScreen.types.ts     # 타입 정의
├── Lv1OXProblemScreen.test.tsx     # 테스트 파일
└── README.md                       # 이 문서
```

## 구현된 주요 기능

### 1. UI 레이아웃 (Figma 디자인 완벽 매칭)

#### 헤더 섹션
- **뒤로가기 버튼**: 원형 배경에 화살표 아이콘
- **문제 카운터**: "문제 1 / 10" 형태로 현재 진행 상태 표시
- **카테고리 배지**: "Python 기초" 등 문제 카테고리 표시
- **타이머**: 남은 시간을 "30s" 형태로 표시

#### 진행률 바
- **상단 진행률 바**: 문제 해결 진행률을 시각적으로 표시
- **하단 진행률 바**: 전체 진행률과 백분율 표시
- **애니메이션**: Animated.Value를 사용한 부드러운 진행률 애니메이션

#### 문제 내용 영역
- **이모지**: 문제와 관련된 이모지 (🤔)
- **문제 제목**: "Python에서 리스트는"
- **문제 부제목**: "가변(mutable) 자료형이다."
- **힌트 버튼**: 문제 해결을 위한 힌트 제공

#### 답변 버튼 영역
- **O 버튼**: 초록색 그라디언트 배경의 원형 버튼
- **X 버튼**: 핑크색 그라디언트 배경의 원형 버튼
- **선택 효과**: 버튼 선택 시 크기 축소 및 투명도 변경

### 2. 상태 관리 로직

#### 기본 상태
```typescript
const [selectedAnswer, setSelectedAnswer] = useState<OXAnswer | null>(null);
const [showResult, setShowResult] = useState(false);
const [progressAnimation] = useState(new Animated.Value(0));
```

#### 답변 처리 로직
```typescript
const handleAnswerPress = (answer: OXAnswer) => {
  if (selectedAnswer) return; // 중복 선택 방지

  setSelectedAnswer(answer);
  setShowResult(true);
  onAnswerSelect(answer);

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
// Figma fill_40VNAP → COLORS.white with opacity
backgroundColor: 'rgba(255, 255, 255, 0.9)'

// Figma fill_U6S24P → Primary light with opacity
backgroundColor: 'rgba(248, 232, 238, 0.8)'

// Figma fill_T6D66T → COLORS.textPrimary
color: COLORS.textPrimary // #393E46
```

#### 타이포그래피 매핑
```typescript
// Figma style_W4M9SN → 문제 카운터
fontSize: 18,
fontWeight: FONTS.weights.bold,

// Figma style_7CR3Z2 → 문제 제목/부제목
fontSize: 20,
fontWeight: FONTS.weights.bold,
```

#### 레이아웃 매핑
```typescript
// Figma layout_5AKUUZ → O/X 버튼 크기
width: 120,
height: 120,
borderRadius: 60,

// Figma layout_TP6HIK → 헤더 영역
height: 80,
```

### 4. 타입 정의

#### 핵심 타입
```typescript
export type OXAnswer = 'O' | 'X';

export interface ProblemData {
  id: string;
  title: string;
  subtitle: string;
  correctAnswer: OXAnswer;
  explanation: string;
  category: string;
  emoji: string;
}

export interface Lv1OXProblemScreenProps {
  onAnswerSelect?: (answer: OXAnswer) => void;
  onClose?: () => void;
  onNext?: () => void;
  currentProblem?: number;
  totalProblems?: number;
  timeRemaining?: number;
  problemData?: ProblemData;
}
```

### 5. 네비게이션 통합

#### HomeScreen 통합
```typescript
// HomeScreen.tsx에서 상태 관리
const [showProblemScreen, setShowProblemScreen] = useState(false);

// 난이도 선택 시 화면 전환
const handleLevelSelect = (level: DifficultyLevel) => {
  if (level === '입문') {
    setShowProblemScreen(true);
  }
};

// 조건부 렌더링
{showProblemScreen && (
  <Lv1OXProblemScreen
    onAnswerSelect={handleAnswerSelect}
    onClose={handleProblemScreenClose}
    onNext={handleNextProblem}
    currentProblem={1}
    totalProblems={10}
    timeRemaining={30}
  />
)}
```

## 기술적 특징

### 1. 완전한 TypeScript 지원
- 모든 컴포넌트와 함수에 명시적 타입 정의
- Props 인터페이스를 통한 타입 안전성 보장
- 기본값 제공으로 선택적 props 지원

### 2. Figma 디자인 완벽 재현
- 모든 시각적 요소의 정확한 크기, 색상, 간격 매핑
- Figma 노드 ID와 스타일 ID를 주석으로 문서화
- 기존 디자인 시스템과의 일관성 유지

### 3. 성능 최적화
- React.memo 사용 가능한 구조로 설계
- 불필요한 리렌더링 방지를 위한 상태 관리
- Animated API를 활용한 네이티브 성능

### 4. 접근성 고려
- 터치 영역 최적화 (44x44pt 이상)
- 명확한 시각적 피드백
- 키보드 네비게이션 지원 가능한 구조

### 5. 확장성
- 다양한 문제 타입으로 확장 가능한 인터페이스
- 재사용 가능한 컴포넌트 구조
- 모듈화된 스타일 시스템

## 테스트 커버리지

### 단위 테스트 (Lv1OXProblemScreen.test.tsx)
- 컴포넌트 렌더링 테스트
- 버튼 상호작용 테스트
- 상태 변경 테스트
- 콜백 함수 호출 테스트
- 진행률 계산 테스트
- 타이머 포맷팅 테스트
- 결과 표시 테스트

### 통합 테스트 시나리오
1. HomeScreen → DifficultySelectionModal → Lv1OXProblemScreen 플로우
2. 답변 선택 → 결과 표시 → 다음 문제 진행 플로우
3. 뒤로가기 → HomeScreen 복귀 플로우

## 사용법

### 기본 사용법
```typescript
<Lv1OXProblemScreen
  onAnswerSelect={(answer) => console.log('Answer:', answer)}
  onClose={() => navigation.goBack()}
  onNext={() => loadNextProblem()}
  currentProblem={1}
  totalProblems={10}
  timeRemaining={30}
/>
```

### 커스텀 문제 데이터 사용
```typescript
const customProblemData = {
  id: '2',
  title: 'JavaScript에서 const는',
  subtitle: '재할당이 불가능하다.',
  correctAnswer: 'O' as OXAnswer,
  explanation: 'const로 선언된 변수는 재할당할 수 없습니다.',
  category: 'JavaScript 기초',
  emoji: '💭',
};

<Lv1OXProblemScreen
  problemData={customProblemData}
  // ... other props
/>
```

## 향후 개선 사항

### 1. 애니메이션 개선
- 답변 버튼 선택 시 더 다양한 시각적 피드백
- 결과 표시 애니메이션 강화
- 화면 전환 애니메이션 추가

### 2. 기능 확장
- 힌트 기능 실제 구현
- 문제 북마크 기능
- 오답 노트 기능
- 시간 초과 처리

### 3. 성능 최적화
- 이미지 리소스 최적화
- 메모리 사용량 최적화
- 배터리 사용량 최적화

### 4. 접근성 강화
- 스크린 리더 지원
- 고대비 모드 지원
- 큰 텍스트 모드 지원

이 구현은 React Native 환경에서 Figma 디자인을 완벽하게 재현하면서도, 확장 가능하고 유지보수가 용이한 구조로 설계되었습니다.