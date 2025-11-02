# LV4 디버깅 모드 학습 화면 구현

## 📋 개요

중급 단계 LV4 디버깅 모드 학습 화면을 React Native 기반으로 구현했습니다. 사용자가 코드의 버그를 찾고 수정하는 학습 경험을 제공하며, 실제 개발 환경과 유사한 디버깅 도구를 시뮬레이션합니다.

## 🏗 아키텍처 설계 (SOLID 원칙 적용)

### 1. 단일 책임 원칙 (Single Responsibility Principle)

각 컴포넌트는 명확히 정의된 하나의 책임만을 가집니다:

- **`Lv4DebuggingScreen`**: 전체 디버깅 학습 흐름 관리
- **`CodeEditor`**: 코드 편집 및 표시 기능
- **`DebugSimulationModal`**: 코드 실행 시뮬레이션 및 결과 표시
- **`DebuggingHintCard`**: 3단계 힌트 시스템 관리
- **`ShakeAnimation`**: 실패 시 흔들림 애니메이션
- **`ProgressBar`**: 진행률 시각화

### 2. 개방-폐쇄 원칙 (Open/Closed Principle)

- 새로운 문제 유형이나 프로그래밍 언어 추가 시 기존 코드 수정 없이 확장 가능
- 인터페이스 기반 설계로 새로운 구현체 추가 용이

### 3. 리스코프 치환 원칙 (Liskov Substitution Principle)

- TypeScript 인터페이스로 모든 props 정의
- 명시적 타입 사용으로 예측 가능한 동작 보장

### 4. 인터페이스 분리 원칙 (Interface Segregation Principle)

- 각 컴포넌트별 독립적인 props 인터페이스 정의
- 불필요한 의존성 제거

### 5. 의존 역전 원칙 (Dependency Inversion Principle)

- `useHint` 훅을 통한 추상화된 힌트 시스템
- 구체적 구현이 아닌 인터페이스에 의존

## 📁 파일 구조

```
src/screens/Practice/Advanced/
├── Lv4DebuggingScreen.tsx           # 메인 화면 컴포넌트
├── Lv4DebuggingScreen.types.ts      # 타입 정의
├── Lv4DebuggingScreen.styles.ts     # 메인 스타일
├── Lv4DebuggingScreen.test.tsx      # 단위 테스트
├── index.ts                         # 컴포넌트 export
├── README.md                        # 기술 문서
└── components/
    ├── CodeEditor.tsx               # 코드 편집기 컴포넌트
    ├── CodeEditor.styles.ts         # 에디터 스타일
    ├── DebugSimulationModal.tsx     # 실행 시뮬레이션 모달
    ├── DebugSimulationModal.styles.ts
    ├── DebuggingHintCard.tsx        # 디버깅 힌트 카드
    ├── DebuggingHintCard.styles.ts
    ├── ShakeAnimation.tsx           # 흔들림 애니메이션
    └── ProgressBar.tsx              # 진행률 바
```

## 🎨 UI/UX 디자인 시스템

### 컬러 팔레트

- **배경색**: `#F9F5F6` (메인 배경)
- **코드 블록**: `#F8E8EE` (에디터 배경)
- **액센트**: `#BE185D` (버튼, 강조)
- **성공**: `#10B981` (테스트 통과)
- **실패**: `#EF4444` (테스트 실패)
- **경고**: `#F59E0B` (타이머, 알림)

### 타이포그래피

- **메인 폰트**: FONTS.primary 사용
- **코드 폰트**: 'Fira Code' (가독성과 코딩 경험 향상)
- **계층적 텍스트 크기**: 20px (제목), 16px (본문), 14px (버튼), 12px (보조)

## 🧩 핵심 기능 구현

### 1. 에디터블 코드 블록 (CodeEditor)

**기술적 특징:**
- Monaco Editor 스타일의 UI 목업
- 줄 번호 표시 및 브레이크포인트 시뮬레이션
- 키워드 하이라이팅 (Python 기준)
- 커서 위치 추적 및 표시

**구현 세부사항:**
```typescript
// 라인 클릭으로 브레이크포인트 설정
const handleLineClick = (lineNumber: number) => {
  setSelectedLines(prev =>
    prev.includes(lineNumber)
      ? prev.filter(l => l !== lineNumber)
      : [...prev, lineNumber]
  );
};

// 키워드 하이라이팅
const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
```

### 2. 코드 실행 시뮬레이션 모달 (DebugSimulationModal)

**기술적 특징:**
- 순차적 테스트 케이스 실행 시뮬레이션
- 실제 실행 결과와 기댓값 비교
- 성공/실패에 따른 다른 UX 피드백

**시뮬레이션 로직:**
```typescript
const simulateTestCase = async (testCase: TestCase, code: string): Promise<TestCase> => {
  // 코드 패턴 검사로 통과/실패 결정
  const hasCorrectPattern = checkCodePattern(code, testCase);

  return {
    ...testCase,
    result: hasCorrectPattern ? 'PASSED' : 'FAILED',
    actualOutput: hasCorrectPattern ? testCase.expectedOutput : 'Wrong output',
  };
};
```

### 3. 3단계 진보적 힌트 시스템 (DebuggingHintCard)

**힌트 단계별 특성:**

1. **개념적 단서 (concept)**: 문제 해결의 방향성 제시
2. **시각적 단서 (visual)**: 구체적인 코드 위치 암시
3. **구체적 수정 (specific)**: 정확한 수정 방법과 코드 하이라이팅

**애니메이션 효과:**
```typescript
// 페이드인 + 슬라이드업 + 스케일 조합
Animated.parallel([
  Animated.timing(fadeAnim, { toValue: 1, duration: 300 }),
  Animated.spring(slideAnim, { toValue: 0, tension: 100, friction: 8 }),
  Animated.spring(scaleAnim, { toValue: 1, tension: 100, friction: 8 }),
]).start();
```

### 4. 애니메이션 시스템

**ShakeAnimation (실패 시):**
- 좌우 진동 효과로 실패 피드백
- 강도와 지속시간 조절 가능

**ProgressBar (진행률):**
- 테스트 실행 진행률 실시간 표시
- 성공/실패 상태별 색상 변화

## 🔧 상태 관리

### 메인 컴포넌트 상태

```typescript
const [currentCode, setCurrentCode] = useState('');           // 현재 편집 중인 코드
const [isSimulationVisible, setIsSimulationVisible] = useState(false);  // 모달 표시 상태
const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null); // 실행 결과
const [currentProblemData, setCurrentProblemData] = useState<DebuggingProblemData | null>(null); // 문제 데이터
```

### 힌트 시스템 상태 (useHint 훅 활용)

```typescript
const {
  hintState,      // 현재 힌트 상태
  showHint,       // 힌트 표시
  nextHint,       // 다음 힌트
  hideHint,       // 힌트 숨김
  resetHint,      // 힌트 초기화
  getCurrentHintData, // 현재 힌트 데이터
  isLastStep,     // 마지막 힌트 여부
} = useHint(hintConfig);
```

## 🧪 테스트 전략

### 단위 테스트 (Jest + React Native Testing Library)

**테스트 범위:**
- 컴포넌트 렌더링 검증
- 사용자 상호작용 테스트
- 상태 변화 검증
- Mock을 통한 의존성 격리

**예시:**
```typescript
it('handles execute button press', () => {
  const { getByText } = render(<Lv4DebuggingScreen {...mockProps} />);

  const executeButton = getByText('▶️ 코드 실행하기');
  fireEvent.press(executeButton);

  // Should show simulation modal
});
```

## 🚀 성능 최적화

### 메모이제이션 활용

```typescript
const handleCodeChange = useCallback((newCode: string) => {
  setCurrentCode(newCode);
}, []);

const handleExecuteCode = useCallback(() => {
  if (!currentCode.trim()) {
    Alert.alert('알림', '실행할 코드를 입력해주세요.');
    return;
  }
  setIsExecuting(true);
  setIsSimulationVisible(true);
}, [currentCode]);
```

### 조건부 렌더링

- 힌트 카드: `isVisible` 상태로 불필요한 렌더링 방지
- 모달: 필요시에만 마운트
- 버튼 상태: 조건에 따른 동적 활성화/비활성화

## 🔗 네비게이션 통합

### PracticeContainer 확장

```typescript
// 새로운 문제 타입 추가
export type ProblemType = 'OX' | 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'DEBUGGING';

// 디버깅 전용 props
const debuggingProps = {
  onDebugComplete: (result: any) => console.log('Debug completion result:', result),
  timeRemaining: 600, // 10분
};
```

### AppNavigator 라우팅

```typescript
case 'DebuggingProblem':
  return (
    <PracticeContainer
      navigation={mockNavigation}
      route={mockRoute}
      problemType="DEBUGGING"
    />
  );
```

### DifficultySelectionModal 매핑

```typescript
case 'advanced':
  // 고급: LV4 문제 세트 (디버깅 문제)
  targetRoute = 'DebuggingProblem';
  break;
```

## 📊 사용자 학습 데이터

### 추적 가능한 메트릭

- **힌트 사용률**: 단계별 힌트 사용 빈도
- **코드 수정 횟수**: 실행 버튼 클릭 빈도
- **문제 해결 시간**: 시작부터 완료까지 소요 시간
- **테스트 통과율**: 각 테스트 케이스별 성공률

### XP 시스템 통합

- 힌트 사용당 10 XP 차감
- 문제 완료 시 성과에 따른 XP 부여
- 연속 성공 시 보너스 XP

## 🔮 확장 가능성

### 1. 다중 언어 지원

```typescript
interface LanguageConfig {
  id: string;
  name: string;
  fileExtension: string;
  keywords: string[];
  syntaxHighlighter: (code: string) => string;
}
```

### 2. 실제 코드 실행 엔진 통합

```typescript
interface CodeExecutionEngine {
  execute: (code: string, language: string, testCases: TestCase[]) => Promise<CodeExecutionResult>;
  validate: (code: string, language: string) => boolean;
}
```

### 3. 협업 디버깅 모드

- 실시간 코드 공유
- 팀원과 함께 디버깅
- 코드 리뷰 시스템

### 4. AI 기반 힌트 생성

```typescript
interface AIHintGenerator {
  generateHints: (code: string, testCases: TestCase[], difficulty: string) => Promise<DebuggingHint[]>;
  analyzeError: (code: string, error: string) => Promise<string>;
}
```

## 🛠 기술 스택

- **Framework**: React Native
- **Language**: TypeScript
- **State Management**: React Hooks + Context API
- **Animation**: React Native Animated API
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint + Prettier

## 📝 향후 개선사항

1. **실제 컴파일러 통합**: Python/JavaScript 실행 엔진 연동
2. **고급 디버깅 도구**: 변수 감시, 호출 스택 추적
3. **커스텀 문제 생성**: 사용자 정의 디버깅 문제 작성
4. **소셜 기능**: 문제 공유, 랭킹 시스템
5. **접근성 향상**: 스크린 리더 최적화, 고대비 모드

---

이 구현은 교육적 목적의 디버깅 학습 도구로서, 실제 개발 환경의 복잡성을 단순화하면서도 핵심적인 디버깅 경험을 제공합니다. SOLID 원칙을 철저히 적용하여 유지보수성과 확장성을 확보했으며, 사용자 경험을 중심으로 설계된 직관적인 인터페이스를 제공합니다.