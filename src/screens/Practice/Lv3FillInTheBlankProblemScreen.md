# Lv3FillInTheBlankProblemScreen

중급 단계(LV3)에서 사용되는 **빈칸 채우기(Fill-in-the-Blank) 문제 화면** 컴포넌트입니다.

## 📋 개요

이 컴포넌트는 Figma 디자인을 기반으로 구현된 중급 수준의 빈칸 채우기 문제 화면입니다. 사용자가 Python 코드의 빈칸에 올바른 키워드를 입력하여 문제를 해결하는 인터랙티브한 학습 경험을 제공합니다.

### 주요 특징

- **Figma 디자인 완벽 구현**: 모든 색상, 폰트, 간격이 Figma 디자인과 일치
- **코드 블록 통합**: 실제 코드와 빈칸 입력 필드가 자연스럽게 통합
- **키보드 접근성**: iOS/Android 플랫폼별 키보드 동작 최적화
- **실시간 검증**: 입력 즉시 답안 검증 및 시각적 피드백
- **결과 화면**: 정답/오답에 따른 상세한 피드백 및 설명 제공

## 🎨 Figma 디자인 참조

**디자인 링크**: [코딩테스트 앱 - 빈칸 문법 화면](https://www.figma.com/design/ER7IIuhQIXF9fCbte7LBPi/%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%95%B1?node-id=103-365)

### 구현된 UI 요소

1. **상단 헤더**
   - 뒤로가기 버튼 (`#F8E8EE` 배경, 원형)
   - 문제 진행률 표시 (`문제 2 / 10`)
   - 카테고리 배지 (`Python 기초`)
   - 타이머 (`30s` 형식)

2. **진행률 바**
   - 전체 진행률 시각적 표시
   - 애니메이션 효과로 부드러운 진행률 업데이트

3. **문제 영역**
   - 문제 제목 및 설명
   - `🎯 빈칸 채우기` 배지
   - 코드 블록 컨테이너 (`#F7F7F7` 배경)

4. **코드 블록**
   - 라인 넘버 표시 (`#9CA3AF` 색상)
   - 코드 텍스트 (Monospace 폰트)
   - 빈칸 입력 필드 (`#FDCEDF` 배경, `#BE185D` 텍스트)

5. **입력 안내 섹션**
   - 입력 가이드 텍스트 (`빈칸에 들어갈 답을 입력하세요`)

6. **하단 영역**
   - 제출 버튼 (활성화 시 `#FDCEDF` 배경)
   - 전체 진행률 바
   - 진행률 퍼센티지 표시

## 🏗️ 파일 구조

```
src/screens/Practice/
├── Lv3FillInTheBlankProblemScreen.tsx      # 메인 컴포넌트
├── Lv3FillInTheBlankProblemScreen.types.ts # 타입 정의
├── Lv3FillInTheBlankProblemScreen.styles.ts # 스타일 정의
├── Lv3FillInTheBlankProblemScreen.test.tsx  # 테스트 파일
└── Lv3FillInTheBlankProblemScreen.md        # 문서화
```

## 🔧 주요 기능

### 1. 빈칸 입력 관리

```typescript
const handleBlankChange = (blankId: string, text: string) => {
  if (resultState !== 'ANSWERING') return;

  setUserAnswers(prev => ({
    ...prev,
    [blankId]: text,
  }));
};
```

### 2. 답안 검증 로직

```typescript
const handleSubmit = () => {
  const correctAnswers = problemData.correctAnswers;
  let correctCount = 0;
  const totalBlanks = Object.keys(correctAnswers).length;

  Object.keys(correctAnswers).forEach(blankId => {
    const userAnswer = userAnswers[blankId]?.toLowerCase().trim();
    const correctAnswer = correctAnswers[blankId].toLowerCase().trim();
    if (userAnswer === correctAnswer) {
      correctCount++;
    }
  });

  const isCorrect = correctCount === totalBlanks;
  // 결과 처리 및 상태 업데이트
};
```

### 3. 키보드 접근성

```typescript
<KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  {/* 컨텐츠 */}
</KeyboardAvoidingView>
```

## 📱 사용법

### 기본 사용

```typescript
import Lv3FillInTheBlankProblemScreen from './Lv3FillInTheBlankProblemScreen';

<Lv3FillInTheBlankProblemScreen
  onAnswerSubmit={(answers) => console.log('답안 제출:', answers)}
  onClose={() => console.log('화면 닫기')}
  onNext={() => console.log('다음 문제')}
  timeRemaining={30}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onAnswerSubmit` | `(answers: { [blankId: string]: string }) => void` | `undefined` | 답안 제출 시 호출되는 콜백 |
| `onClose` | `() => void` | `undefined` | 화면 닫기 시 호출되는 콜백 |
| `onNext` | `() => void` | `undefined` | 다음 문제로 이동 시 호출되는 콜백 |
| `onSessionComplete` | `() => void` | `undefined` | 세션 완료 시 호출되는 콜백 |
| `onShowGoalModal` | `() => void` | `undefined` | 목표 완료 모달 표시 시 호출되는 콜백 |
| `timeRemaining` | `number` | `30` | 남은 시간 (초) |
| `problemData` | `FillInTheBlankProblemData` | `mockProblemData` | 문제 데이터 |

## 🧪 테스트

### 주요 테스트 케이스

1. **기본 렌더링 테스트**
   - 헤더, 문제 내용, 코드 블록, 제출 버튼 표시 확인

2. **사용자 상호작용 테스트**
   - 빈칸 입력 필드에 텍스트 입력
   - 제출 버튼 활성화/비활성화
   - 뒤로가기 버튼 동작

3. **답안 검증 테스트**
   - 정답 입력 시 정확한 결과 표시
   - 오답 입력 시 오류 결과 표시
   - 결과 화면 전환

4. **접근성 테스트**
   - 키보드 동작 확인
   - 플랫폼별 동작 테스트

### 테스트 실행

```bash
# 특정 파일 테스트
npm test -- Lv3FillInTheBlankProblemScreen.test.tsx

# 전체 테스트
npm test
```

## 🎯 데이터 구조

### FillInTheBlankProblemData

```typescript
interface FillInTheBlankProblemData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  codeLines: CodeLine[];
  correctAnswers: { [blankId: string]: string };
  explanation: string;
  hints?: string[];
}
```

### CodeLine

```typescript
interface CodeLine {
  lineNumber: number;
  content: string;
  hasBlank: boolean;
  blankField?: BlankField;
}
```

### BlankField

```typescript
interface BlankField {
  id: string;
  placeholder: string;
  correctAnswer: string;
  position: number;
}
```

## 🎨 스타일링

### 주요 색상 정의

- **배경**: `#FFFFFF` (COLORS.white)
- **문제 영역**: `#FFF8FB` (연한 핑크)
- **코드 블록**: `#F7F7F7` (연한 회색)
- **빈칸 입력**: `#FDCEDF` (핑크)
- **텍스트**: `#1F2937` (어두운 회색)
- **라인 번호**: `#9CA3AF` (중간 회색)

### 폰트

- **기본 폰트**: Inter (FONTS.primary)
- **코드 폰트**: Monospace (FONTS.monospace)
- **굵기**: Regular(400), Bold(700)

## 🔄 상태 관리

### 주요 상태

1. **userAnswers**: 사용자가 입력한 답안들
2. **resultState**: 현재 문제 상태 ('ANSWERING' | 'CORRECT' | 'INCORRECT')
3. **resultData**: 결과 화면에 표시할 데이터
4. **sessionProgress**: 세션 진행률 정보

### 상태 전환

```
ANSWERING → (제출) → CORRECT/INCORRECT → (다음 문제) → ANSWERING
```

## 🚀 향후 개선사항

1. **세션 매니저 통합**: 현재 Mock 데이터 사용 중, 실제 세션 매니저와 연동 필요
2. **문제 데이터 확장**: 더 다양한 문제 유형 및 복잡한 코드 블록 지원
3. **힌트 시스템**: 사용자가 어려워할 때 힌트 제공 기능
4. **자동 완성**: 코딩 관련 키워드 자동 완성 기능
5. **오프라인 지원**: 네트워크 없이도 문제 풀이 가능

## 📋 체크리스트

- [x] Figma 디자인 정확한 구현
- [x] 타입 안정성 확보 (TypeScript)
- [x] 키보드 접근성 구현
- [x] 테스트 코드 작성
- [x] 문서화 완료
- [ ] 세션 매니저 통합
- [ ] 다양한 문제 유형 지원
- [ ] 접근성 개선 (스크린 리더 지원)

## 🤝 기여 가이드

1. 새로운 기능 추가 시 관련 타입 정의 필수
2. 스타일 변경 시 Figma 디자인과의 일치성 확인
3. 테스트 코드 작성 및 기존 테스트 통과 확인
4. 문서 업데이트