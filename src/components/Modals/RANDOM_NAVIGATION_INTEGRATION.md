# Random Problem Navigation Integration - Final Connection

## 개요
DifficultySelectionModal에서 '입문' 난이도를 선택하고 '문제 풀기' 버튼을 눌렀을 때, O/X 퀴즈와 객관식 문제 화면 중 하나가 랜덤으로 표시되도록 하는 내비게이션 로직의 최종 연결을 구현했습니다.

## 🔄 구현된 변경사항

### 1. **AppNavigator.tsx** - 메인 내비게이션 스택 확장

#### 새로 추가된 라우트
```typescript
export type ScreenName = TabName | 'OXProblem' | 'MultipleChoiceProblem';
```

#### 강화된 내비게이션 객체
```typescript
const mockNavigation = {
  navigate: (screen: string, params?: any) => {
    console.log('Navigate to:', screen, params);
    setCurrentScreen(screen as ScreenName);

    // Update activeTab for tab screens
    if (screen === 'Home' || screen === 'Practice' || screen === 'Community' || screen === 'Profile') {
      setActiveTab(screen as TabName);
    }
  },
  goBack: () => {
    console.log('Go back');
    // Return to the current active tab
    setCurrentScreen(activeTab);
  },
  // ... other methods
};
```

#### 새로운 화면 렌더링 로직
```typescript
case 'OXProblem':
  return (
    <Lv1OXProblemScreen
      onAnswerSelect={(answer) => console.log('OX Answer:', answer)}
      onClose={() => mockNavigation.goBack()}
      onNext={() => console.log('Next problem')}
      currentProblem={1}
      totalProblems={10}
      timeRemaining={30}
    />
  );

case 'MultipleChoiceProblem':
  return (
    <Lv2MultipleChoiceProblemScreen
      onAnswerSelect={(answer) => console.log('MC Answer:', answer)}
      onClose={() => mockNavigation.goBack()}
      onNext={() => console.log('Next problem')}
      currentProblem={2}
      totalProblems={10}
      timeRemaining={30}
    />
  );
```

### 2. **DifficultySelectionModal.tsx** - 랜덤 내비게이션 로직

#### 새로운 Props
```typescript
interface DifficultySelectionModalProps {
  // ... existing props
  navigation?: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}
```

#### 랜덤 선택 및 내비게이션 로직
```typescript
const handleStartPress = () => {
  if (selectedLevel) {
    onSelectLevel(selectedLevel);

    // Implement random navigation logic for 입문 level
    if (selectedLevel.id === 'beginner' && navigation) {
      // Random selection between OX and Multiple Choice
      const problemRoutes = ['OXProblem', 'MultipleChoiceProblem'];
      const randomRoute = problemRoutes[Math.floor(Math.random() * problemRoutes.length)];

      console.log('Random problem route selected:', randomRoute);

      // Close modal first, then navigate
      onClose();
      navigation.navigate(randomRoute, {
        difficulty: selectedLevel,
        language: selectedLanguage,
      });
    } else {
      // For other levels or when navigation is not available, use existing logic
      onClose();
    }
  }
};
```

#### 잠금 상태 UX 반영
```typescript
const renderBottomSection = () => {
  const canStartLevel = selectedLevel && selectedLevel.isUnlocked &&
    !(selectedLevel.id === 'intermediate' && selectedLevel.attemptsRemaining === 0);

  return (
    <View style={styles.bottomSection}>
      {canStartLevel ? (
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartPress}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>문제 풀기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>← 뒤로가기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

### 3. **HomeScreen.tsx** - 조건부 렌더링 제거

#### 제거된 로직
- ✅ 기존 `showProblemScreen` 상태 제거
- ✅ 기존 `currentProblemType` 상태 제거
- ✅ 조건부 렌더링된 문제 화면 컴포넌트 제거
- ✅ 불필요한 핸들러 함수들 제거

#### 간소화된 모달 연결
```typescript
<DifficultySelectionModal
  isVisible={isDifficultyModalVisible}
  onClose={handleModalClose}
  onSelectLevel={handleLevelSelect}
  selectedLanguage={selectedLanguage}
  navigation={navigation}  // 새로 추가된 prop
/>
```

## 🎯 핵심 동작 플로우

### 정상적인 입문 레벨 선택 플로우
1. **사용자 액션**: QuickActions에서 "바로 시작하기" 버튼 클릭
2. **모달 표시**: DifficultySelectionModal 열림
3. **레벨 선택**: '입문' 난이도 카드 클릭
4. **버튼 활성화**: "문제 풀기" 버튼 표시
5. **랜덤 선택**: `Math.random()`으로 OXProblem 또는 MultipleChoiceProblem 선택
6. **내비게이션**: 선택된 화면으로 이동
7. **모달 닫기**: 자동으로 모달 닫힘

### 잠금 레벨 선택 시 플로우
1. **사용자 액션**: 잠금된 레벨 (중급/고급/챌린지) 클릭
2. **잠금 모달**: 해금 조건 안내 모달 표시
3. **버튼 상태**: "← 뒤로가기" 버튼만 표시
4. **내비게이션 차단**: 문제 화면으로 이동하지 않음

### 시도 횟수 소진 시 플로우
1. **중급 레벨**: 3회 시도 모두 사용한 경우
2. **특별 모달**: 시도 횟수 소진 안내 모달 표시
3. **버튼 비활성화**: "문제 풀기" 버튼 숨김
4. **복구 안내**: 입문 재완료로 기회 복구 안내

## 🔍 기술적 세부사항

### 랜덤 선택 로직
```typescript
const problemRoutes = ['OXProblem', 'MultipleChoiceProblem'];
const randomRoute = problemRoutes[Math.floor(Math.random() * problemRoutes.length)];
```
- **확률**: 각 화면 50% 확률로 선택
- **예측 불가능성**: `Math.random()` 사용으로 매번 다른 결과
- **확장성**: 새로운 문제 유형 쉽게 추가 가능

### 내비게이션 파라미터
```typescript
navigation.navigate(randomRoute, {
  difficulty: selectedLevel,     // 선택된 난이도 정보
  language: selectedLanguage,    // 선택된 언어 (Python, JavaScript 등)
});
```

### 접근 제어 로직
```typescript
const canStartLevel = selectedLevel && selectedLevel.isUnlocked &&
  !(selectedLevel.id === 'intermediate' && selectedLevel.attemptsRemaining === 0);
```

## 🧪 테스트 커버리지

### 단위 테스트 시나리오 (RandomNavigationIntegration.test.tsx)
1. **랜덤 내비게이션 테스트**
   - OXProblem 선택 시나리오
   - MultipleChoiceProblem 선택 시나리오
   - 디버그 로그 확인

2. **잠금 상태 테스트**
   - 잠금된 레벨 선택 시 모달 표시
   - 시작 버튼 숨김 확인
   - 내비게이션 차단 확인

3. **시도 소진 테스트**
   - 중급 레벨 시도 소진 시나리오
   - 특별 메시지 표시 확인
   - 버튼 상태 변경 확인

4. **폴백 처리 테스트**
   - navigation prop 없을 때 처리
   - 다른 난이도 레벨 선택 시 처리

## 🚀 사용자 경험 개선사항

### 1. **다양성 제공**
- 같은 입문 레벨이라도 다른 문제 유형으로 다양한 경험
- 지루함 방지 및 학습 흥미도 증가

### 2. **직관적 접근 제어**
- 잠금된 레벨은 명확한 시각적 피드백
- 해금 조건을 명시적으로 안내

### 3. **단계적 학습 유도**
- 순차적 레벨 해금으로 체계적 학습
- 명확한 진행 방향 제시

### 4. **시도 제한 관리**
- 중급 레벨의 특별한 시도 제한 (3회)
- 실패 시 복구 방법 안내

## 🔧 향후 확장 계획

### 1. **추가 문제 유형**
```typescript
// 미래 확장 예시
const problemRoutes = [
  'OXProblem',
  'MultipleChoiceProblem',
  'FillInBlankProblem',    // 빈칸 채우기
  'DebuggingProblem',      // 디버깅 문제
  'LiveCodingProblem'      // 라이브 코딩
];
```

### 2. **가중치 기반 선택**
```typescript
// 사용자 성향 기반 가중치 적용
const getWeightedRandomRoute = (userPreferences) => {
  // 사용자가 선호하는 문제 유형에 더 높은 확률 부여
};
```

### 3. **적응형 난이도**
```typescript
// 사용자 실력에 따른 동적 난이도 조정
const getAdaptiveDifficulty = (userStats) => {
  // 정답률에 따라 문제 난이도 자동 조정
};
```

### 4. **학습 경로 추천**
- 사용자 약점 분석 기반 문제 유형 추천
- AI 기반 개인화된 학습 경로 제안

## 🎯 성공 지표

### 기술적 성공
- ✅ 랜덤 선택 로직 정상 동작
- ✅ 모든 접근 제어 규칙 준수
- ✅ 에러 없는 화면 전환
- ✅ 상태 관리 일관성 유지

### 사용자 경험 성공
- ✅ 직관적인 모달 인터랙션
- ✅ 명확한 잠금/해금 상태 표시
- ✅ 부드러운 화면 전환
- ✅ 예측 가능한 동작 패턴

이 구현으로 사용자는 입문 레벨에서 다양한 문제 유형을 경험하며, 체계적이고 단계적인 학습 여정을 시작할 수 있습니다.