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

---

## 📐 상세 스케일링 사양 (0.8x)

> **참고**: 이 섹션은 SCALING_SUMMARY.md의 내용을 통합한 것입니다.

### Modal Container Dimensions
- **Width**: 390px → 312px (-20%)
- **Height**: 844px → 675px (-20%)
- **Border Radius**: 30px → 24px (-20%)

### Header Section
- **Padding Top**: 30px → 24px (-20%)
- **Padding Horizontal**: 20px → 16px (-20%)
- **Padding Bottom**: 20px → 16px (-20%)
- **Title Font Size**: 24px → 19px (-20.8%)
- **Subtitle Font Size**: 14px → 11px (-21.4%)
- **Title Margin Bottom**: 8px → 6px (-25%)

### Close Button
- **Position Top**: 51px → 24px (repositioned for new header height)
- **Position Right**: 20px → 16px (-20%)
- **Dimensions**: 30x30px → 24x24px (-20%)
- **Font Size**: 18px → 14px (-22.2%)

### Content Area
- **Padding Horizontal**: 20px → 16px (-20%)
- **Padding Top**: 20px → 16px (-20%)

### Language Badge
- **Padding Horizontal**: 20px → 16px (-20%)
- **Padding Vertical**: 8px → 6px (-25%)
- **Border Radius**: 16px → 13px (-18.8%)
- **Margin Bottom**: 16px → 13px (-18.8%)
- **Font Size**: 12px → 10px (-16.7%)

### Progress Dots
- **Margin Bottom**: 24px → 19px (-20.8%)
- **Gap**: 20px → 16px (-20%)
- **Dot Size**: 8x8px → 6x6px (-25%)
- **Dot Border Radius**: 4px → 3px (-25%)

### Instructions Section
- **Margin Bottom**: 32px → 26px (-18.8%)
- **Title Font Size**: 20px → 16px (-20%)
- **Title Margin Bottom**: 8px → 6px (-25%)
- **Subtitle Font Size**: 14px → 11px (-21.4%)
- **Subtitle Line Height**: 20px → 16px (-20%)

### Difficulty Cards
- **Container Gap**: 16px → 13px (-18.8%)
- **Container Padding Bottom**: 20px → 16px (-20%)
- **Card Border Radius**: 12px → 10px (-16.7%)
- **Progress Bar Border Radius**: 2px → 1.6px (-20%)

### Completion Badge
- **Position Top**: 12px → 10px (-16.7%)
- **Position Right**: 12px → 10px (-16.7%)
- **Padding Horizontal**: 12px → 10px (-16.7%)
- **Padding Vertical**: 4px → 3px (-25%)
- **Border Radius**: 10px → 8px (-20%)
- **Font Size**: 10px → 8px (-20%)

### Card Content
- **Content Padding**: 16px → 13px (-18.8%)
- **Content Padding Bottom**: 8px → 6px (-25%)
- **Icon Container**: 48x48px → 38x38px (-20.8%)
- **Icon Border Radius**: 24px → 19px (-20.8%)
- **Icon Margin Right**: 12px → 10px (-16.7%)
- **Icon Emoji Size**: 24px → 19px (-20.8%)

### Card Typography
- **Card Title Font Size**: 18px → 14px (-22.2%)
- **Card Subtitle Font Size**: 12px → 10px (-16.7%)
- **Card Arrow Font Size**: 20px → 16px (-20%)
- **Description Font Size**: 13px → 10px (-23.1%)
- **Description Line Height**: 18px → 14px (-22.2%)
- **Description Padding**: 16px → 13px (-18.8%)
- **Description Padding Bottom**: 12px → 10px (-16.7%)

### Card Stats
- **Stats Padding Horizontal**: 16px → 13px (-18.8%)
- **Stats Padding Bottom**: 16px → 13px (-18.8%)
- **Stats Gap**: 40px → 32px (-20%)
- **Stat Item Gap**: 4px → 3px (-25%)
- **Stat Icon Font Size**: 12px → 10px (-16.7%)
- **Stat Text Font Size**: 12px → 10px (-16.7%)

### Bottom Section
- **Section Padding**: 10px → 8px (-20%)
- **Section Padding Bottom**: 20px → 16px (-20%)

### Buttons
- **Start Button Border Radius**: 27px → 22px (-18.5%)
- **Start Button Padding Vertical**: 16px → 13px (-18.8%)
- **Start Button Padding Horizontal**: 32px → 26px (-18.8%)
- **Start Button Font Size**: 20px → 16px (-20%)
- **Back Button Padding Vertical**: 16px → 13px (-18.8%)
- **Back Button Font Size**: 20px → 16px (-20%)

### Scaling Methodology

1. **Primary Scale Factor**: 0.8 (20% reduction)
2. **Consistent Application**: All dimensions scaled proportionally
3. **Visual Hierarchy Maintained**: Relative proportions preserved
4. **Typography Scaling**: Font sizes reduced by 16-25% maintaining readability
5. **Spacing Harmony**: Padding and margins scaled consistently
6. **Interactive Elements**: Buttons and touch targets appropriately sized

### Benefits of Scaling

- **Improved Screen Utilization**: Modal takes up less screen real estate
- **Better Integration**: More harmonious with other UI components
- **Maintained Usability**: All interactive elements remain accessible
- **Preserved Design**: Visual hierarchy and proportions intact
- **Responsive Design**: Consistent scaling across different screen sizes

---

이 구현으로 사용자의 학습 진행도에 따른 단계적 접근과 명확한 피드백을 제공하는 UX를 완성했습니다.