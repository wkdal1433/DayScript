# State-Based Difficulty Selection UX and Access Control Implementation

## 개요
DifficultySelectionModal 컴포넌트를 수정하여 하드코딩된 난이도 선택 로직을 유저 진행 상태(User Progression State) 기반으로 변경하고, 접근 제한 및 해금 조건 UX를 구현했습니다.

## 구현된 핵심 기능

### 1. User Progression State 모델
```typescript
interface UserProgressionState {
  unlockedLevels: string[];        // 해금된 단계 목록
  completedLevels: string[];       // 완료된 단계 목록
  currentLevel: string | null;     // 현재 진행 중인 단계
  levelStats: {                    // 각 단계별 통계
    [levelId: string]: {
      completionRate: number;      // 완료율 (0-100)
      attemptsUsed: number;        // 사용한 시도 횟수
      maxAttempts: number;         // 최대 시도 횟수
      isCompleted: boolean;        // 완료 여부
    };
  };
}
```

### 2. 동적 난이도 레벨 생성
- 기존 하드코딩된 배열을 유지하면서 동적 상태를 추가
- 각 레벨에 `isUnlocked`, `unlockCondition`, `completionRate`, `attemptsRemaining` 속성 추가
- 중급 단계에 특별한 시도 제한 (3회) 구현

### 3. 접근 제한 UX
- **잠금 상태**: opacity 0.4로 시각적 표현
- **잠금 아이콘**: 우상단에 🔒 표시
- **시도 횟수 표시**: 중급 단계에 "남은 기회: N회" 표시
- **진행률 바**: 실제 completionRate 반영

### 4. 해금 조건 모달
- 잠금된 단계 클릭 시 모달 표시
- 단계별 해금 조건 메시지:
  - 중급: "입문 단계를 완료해야 합니다"
  - 고급: "중급 단계를 완료해야 합니다"
  - 챌린지: "고급 단계를 완료해야 합니다"
- 시도 횟수 소진 시 별도 메시지

### 5. 기본 진행 상태
```typescript
const defaultProgressionState: UserProgressionState = {
  unlockedLevels: ['beginner'],    // 입문만 초기 해금
  completedLevels: [],
  currentLevel: null,
  levelStats: {
    beginner: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
    intermediate: { completionRate: 0, attemptsUsed: 0, maxAttempts: 3, isCompleted: false },
    advanced: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
    challenge: { completionRate: 0, attemptsUsed: 0, maxAttempts: 999, isCompleted: false },
  },
};
```

## 새로운 Props
```typescript
interface DifficultySelectionModalProps {
  // 기존 props...
  userProgressionState?: UserProgressionState;      // 사용자 진행 상태
  onUpdateProgression?: (state: UserProgressionState) => void;  // 상태 업데이트 콜백
}
```

## 스타일 업데이트
### 새로 추가된 스타일
- `lockIndicator`: 잠금 아이콘 표시
- `attemptsContainer`: 시도 횟수 표시 컨테이너
- `unlockModal*`: 해금 조건 모달 관련 스타일들
  - overlay, container, content, title, message, button 등

### 색상 사용
- 잠금 상태: opacity 0.4
- 배경: #F8E8EE
- 텍스트: #E295B3
- 테두리: #F2BED1

## 사용법

### 기본 사용 (기본 상태)
```typescript
<DifficultySelectionModal
  isVisible={isVisible}
  onClose={onClose}
  onSelectLevel={onSelectLevel}
  selectedLanguage="Python"
/>
```

### 커스텀 진행 상태 사용
```typescript
const [userProgression, setUserProgression] = useState<UserProgressionState>({
  unlockedLevels: ['beginner', 'intermediate'],
  completedLevels: ['beginner'],
  currentLevel: 'intermediate',
  levelStats: {
    beginner: { completionRate: 100, attemptsUsed: 1, maxAttempts: 999, isCompleted: true },
    intermediate: { completionRate: 75, attemptsUsed: 2, maxAttempts: 3, isCompleted: false },
    // ...
  },
});

<DifficultySelectionModal
  isVisible={isVisible}
  onClose={onClose}
  onSelectLevel={onSelectLevel}
  selectedLanguage="Python"
  userProgressionState={userProgression}
  onUpdateProgression={setUserProgression}
/>
```

## 향후 확장 계획
1. 실제 백엔드 연동으로 진행 상태 저장/복원
2. 보상 시스템 (입문 완료 시 중급 시도 횟수 복구)
3. 성취 시스템 및 배지
4. 애니메이션 효과 강화
5. A/B 테스트를 위한 다양한 해금 조건

## 테스트 시나리오
1. 기본 상태에서 입문만 선택 가능
2. 중급/고급/챌린지 클릭 시 해금 모달 표시
3. 중급 단계 시도 횟수 소진 시 특별 메시지
4. 진행률 바 및 완료 표시 정확성
5. 모달 닫기 및 재오픈 상태 유지

이 구현으로 사용자의 학습 진행도에 따른 단계적 접근과 명확한 피드백을 제공하는 UX를 완성했습니다.