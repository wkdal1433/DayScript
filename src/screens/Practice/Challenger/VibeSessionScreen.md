# LV5 VibeSessionScreen 구현 가이드

## 📋 개요

**VibeSessionScreen**은 LV5 Expert Mode의 핵심 Vibe Coding 모듈로, AI와의 대화를 통한 코드 생성 및 평가를 담당하는 전문가급 학습 화면입니다. Figma 디자인(Live Coding UI)을 기반으로 하되, Vibe Coding에 특화된 기능과 UX를 제공합니다.

## 🎯 주요 구현 목표

### 1. Figma 디자인 기반 UI 구현
- **원본 디자인**: Live Coding 화면 (node-id: 113-561)
- **커스터마이징**: Vibe Coding 워크플로우에 최적화
- **녹음 기능 제거**: 텍스트 기반 AI 프롬프팅으로 변경

### 2. 좌우 분할 레이아웃
- **좌측 패널**: 대화 히스토리 + 문제 요구사항
- **우측 패널**: AI 생성 결과 미리보기 + 코드 편집

### 3. AI 프롬프팅 시스템
- **실시간 토큰 모니터링**
- **품질 지표 기반 평가**
- **대화형 개선 프로세스**

## 🏗️ 아키텍처 및 구조

### 파일 구조
```
src/screens/Practice/Challenger/
├── VibeSessionScreen.tsx                 # 메인 화면 컴포넌트
├── VibeSessionScreen.types.ts            # 타입 정의
├── VibeSessionScreen.styles.ts           # 스타일 정의
├── VibeSessionScreen.md                  # 이 문서
└── components/
    ├── ConversationPanel.tsx             # 좌측 대화 패널
    ├── ResultPreviewPanel.tsx            # 우측 결과 패널
    ├── TokenMonitor.tsx                  # 토큰 사용량 모니터
    └── CodeEditor.tsx                    # 코드 편집기
```

### SOLID 원칙 적용

#### 1. Single Responsibility Principle (단일 책임 원칙)
- **VibeSessionScreen**: 세션 관리와 전체 UI 조정만 담당
- **ConversationPanel**: 대화 히스토리 표시만 담당
- **ResultPreviewPanel**: 결과 미리보기와 관리만 담당
- **TokenMonitor**: 토큰 사용량 모니터링만 담당
- **CodeEditor**: 코드 표시와 편집만 담당

#### 2. Open/Closed Principle (개방-폐쇄 원칙)
- 새로운 AI 프로바이더 추가 시 기존 코드 수정 없이 확장 가능
- 새로운 평가 지표나 언어 지원 확장 가능

#### 3. Liskov Substitution Principle (리스코프 치환 원칙)
- TypeScript 인터페이스로 모든 props와 상태 타입 정의
- 컴포넌트 간 예측 가능한 동작 보장

#### 4. Interface Segregation Principle (인터페이스 분리 원칙)
- 각 컴포넌트별 독립적이고 최소한의 props 인터페이스
- 불필요한 의존성 제거

#### 5. Dependency Inversion Principle (의존 역전 원칙)
- AI 서비스는 추상화된 인터페이스를 통해 접근
- 구체적 구현보다는 추상화에 의존

## 🎨 UI/UX 디자인 시스템

### Figma 디자인에서 추출한 컬러 팔레트
```typescript
const figmaColors = {
  // 배경 그라데이션
  primaryGradientStart: '#1E293B', // Slate 800
  primaryGradientEnd: '#0F172A',   // Slate 900

  // 프로그레스 그라데이션
  progressGradientStart: '#10B981', // Emerald 500
  progressGradientEnd: '#F97316',   // Orange 500

  // AI 면접관 그라데이션
  aiAvatarGradient: '#3B82F6',     // Blue 500

  // 질문 카드 그라데이션
  questionCardGradient: '#3B82F6', // Blue 500

  // 토큰 표시기
  timerOrange: '#F97316',          // Orange 500

  // 난이도 표시
  difficultyHard: '#EF4444',       // Red 500
};
```

### 레이아웃 구성 요소

#### 1. 헤더 섹션
- **진행률 바**: 전체 LV5 진행 상황 표시
- **타이머**: 원형 타이머 (Figma 디자인 유지)
- **난이도 배지**: Hard/Medium/Easy 표시
- **문제 카운터**: 현재 문제 번호

#### 2. AI 면접관 섹션
- **아바타**: 블루 그라데이션 원형 아바타
- **역할 정보**: "AI 면접관" + "Senior Technical Interviewer"

#### 3. 메인 컨텐츠 (좌우 분할)
```typescript
// 좌측 패널 (50% 너비)
conversationPanel: {
  - 문제 요구사항 (상단 고정)
  - 대화 히스토리 (스크롤 가능)
  - 메시지 통계 (하단)
}

// 우측 패널 (50% 너비)
previewPanel: {
  - 품질 지표 바
  - 코드 에디터
  - 액션 버튼들
}
```

#### 4. 하단 입력 섹션
- **토큰 모니터**: 실시간 사용량 + 효율성 점수
- **프롬프트 입력창**: 멀티라인 텍스트 입력
- **컨트롤 버튼**: 건너뛰기 + 답변 제출

## 📊 기능 구현 상세

### 1. 대화 시스템 (ConversationPanel)

```typescript
interface ConversationMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  tokensUsed?: number;
  metadata?: {
    confidence?: number;
    processingTime?: number;
  };
}
```

**주요 기능:**
- 시간순 메시지 표시
- 토큰 사용량 표시
- AI 신뢰도 및 처리 시간 표시
- 문제 요구사항 상단 고정 표시

### 2. 결과 관리 시스템 (ResultPreviewPanel)

```typescript
interface GenerationResult {
  id: string;
  generatedContent: string;
  extractedCode?: string;
  language?: string;
  tokensUsed: number;
  confidence: number;
  qualityMetrics: QualityMetrics;
  userActions: UserAction[];
}
```

**주요 기능:**
- 현재 결과 vs 히스토리 탭 전환
- 품질 지표 시각화
- 코드 편집 기능
- 결과 액션 (재생성, 고정, 승인)

### 3. 토큰 모니터링 (TokenMonitor)

```typescript
interface TokenUsage {
  currentSession: number;
  sessionLimit: number;
  averagePerPrompt: number;
  estimatedRemaining: number;
  efficiencyScore: number;
  recommendations: TokenRecommendation[];
}
```

**표시 정보:**
- 현재 사용량 / 전체 한도
- 효율성 점수 (색상 코딩)
- 개선 팁 및 권장사항

### 4. 코드 에디터 (CodeEditor)

```typescript
interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
}
```

**기능:**
- 기본 신택스 하이라이팅
- 라인 번호 표시
- 편집 모드 토글
- 코드 복사 기능
- 파일 정보 표시 (라인 수, 문자 수)

## 🔄 상태 관리

### useReducer 패턴 사용
```typescript
interface VibeSessionState {
  session: VibeSessionData | null;
  problem: VibeProblem | null;
  currentGeneration: GenerationResult | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: VibeSessionError | null;
  tokenUsage: TokenUsage;
}

type VibeSessionAction =
  | { type: 'SET_SESSION'; payload: VibeSessionData }
  | { type: 'ADD_MESSAGE'; payload: ConversationMessage }
  | { type: 'ADD_GENERATION'; payload: GenerationResult }
  | { type: 'UPDATE_TOKEN_USAGE'; payload: Partial<TokenUsage> }
  // ... 기타 액션들
```

## 🔧 주요 기술 구현

### 1. AI 응답 시뮬레이션
```typescript
const simulateAIGeneration = async (prompt: string) => {
  // 2-4초 지연 시뮬레이션
  // 토큰 사용량 계산
  // 품질 지표 생성
  // 코드 추출 및 하이라이팅
};
```

### 2. 실시간 타이머
```typescript
const startTimer = useCallback(() => {
  timerIntervalRef.current = setInterval(() => {
    setTimeRemaining(prev => prev - 1);
  }, 1000);
}, []);
```

### 3. 키보드 대응
```typescript
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={styles.bottomSection}
>
```

## 🌟 접근성 (Accessibility) 구현

### Screen Reader 지원
```typescript
// 음성 안내
AccessibilityInfo.announceForAccessibility('AI 응답이 생성되었습니다');

// 접근성 라벨
accessibilityRole="button"
accessibilityLabel="AI 프롬프트 입력창"
accessibilityHint="AI에게 전달할 메시지를 입력하세요"
```

### 키보드 네비게이션
- Tab 순서 최적화
- 포커스 인디케이터
- Enter 키 제출 지원

### 색상 대비
- WCAG 2.1 AA 준수
- 고대비 모드 지원
- 색상에만 의존하지 않는 정보 전달

## 📈 성능 최적화

### 1. 메모이제이션
```typescript
const handlePromptSubmit = useCallback(async () => {
  // 프롬프트 제출 로직
}, [promptText, state.isGenerating]);
```

### 2. 조건부 렌더링
```typescript
{currentResult ? (
  <CodeEditor {...props} />
) : (
  <EmptyState />
)}
```

### 3. 효율적인 상태 업데이트
```typescript
// 배치 업데이트
dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
dispatch({ type: 'SET_GENERATING', payload: true });
```

## 🔮 향후 확장 계획

### 1. AI 프로바이더 통합
- OpenAI GPT-4 연동
- Anthropic Claude 연동
- 커스텀 모델 지원

### 2. 고급 코드 편집 기능
- 진정한 신택스 하이라이팅
- 코드 자동 완성
- 에러 감지 및 표시

### 3. 협업 기능
- 실시간 코드 공유
- 피어 리뷰 시스템
- 팀 세션 지원

### 4. 평가 시스템 고도화
- ML 기반 코드 품질 평가
- 실행 가능한 코드 테스트
- 성능 벤치마킹

## 🎯 구현 완료 상태

### ✅ 완료된 기능
- [x] Figma 디자인 기반 UI 구현
- [x] 좌우 분할 레이아웃
- [x] 대화 히스토리 시스템
- [x] AI 응답 시뮬레이션
- [x] 토큰 모니터링
- [x] 코드 에디터 (기본)
- [x] 결과 관리 시스템
- [x] 접근성 지원
- [x] 타이머 및 세션 관리
- [x] 반응형 디자인

### 🔄 진행 중
- [ ] 실제 AI API 연동
- [ ] 고급 평가 지표
- [ ] 성능 최적화

### ⏳ 향후 계획
- [ ] 실시간 협업 기능
- [ ] 고급 코드 에디터
- [ ] ML 기반 평가 시스템

## 🚀 실행 방법

1. **의존성 설치**
```bash
npm install react-native-linear-gradient
```

2. **네비게이션 설정**
```typescript
// App.tsx 또는 네비게이션 설정에 추가
import VibeSessionScreen from './src/screens/Practice/Challenger/VibeSessionScreen';
```

3. **라우트 파라미터**
```typescript
navigation.navigate('VibeSession', {
  problemId: 'vibe_problem_001',
  sessionId: 'session_' + Date.now(),
  difficulty: 'medium',
  timeLimit: 1800, // 30분
});
```

## 📝 개발자 노트

### 중요한 구현 결정
1. **상태 관리**: useReducer 패턴 선택 - 복잡한 상태 로직 관리에 적합
2. **스타일링**: StyleSheet 기반 - 성능과 타입 안전성 고려
3. **접근성**: 처음부터 고려하여 구현 - 후추가보다 효율적
4. **모듈화**: 컴포넌트별 독립성 확보 - 재사용성과 테스트 용이성

### 알려진 제한사항
1. 현재는 AI 응답 시뮬레이션만 구현
2. 기본적인 신택스 하이라이팅만 지원
3. 클립보드 기능은 플랫폼별 구현 필요

### 트러블슈팅 가이드
1. **타이머 관련**: useRef로 interval 관리하여 메모리 누수 방지
2. **키보드 이슈**: KeyboardAvoidingView로 플랫폼별 대응
3. **성능 이슈**: useCallback과 조건부 렌더링으로 최적화

---

이 문서는 LV5 VibeSessionScreen의 완전한 구현 가이드입니다. 추가 질문이나 구현 관련 도움이 필요하시면 언제든 문의해 주세요!