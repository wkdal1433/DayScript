# DayScript 온보딩/회원가입 화면 설계 가이드 - 디자이너 최종 레퍼런스

## 📋 가이드 개요

본 문서는 **DayScript** 앱의 LV0(온보딩) 및 회원가입 화면 설계를 위한 종합 가이드입니다. 디자이너가 CLI 테마 기반의 프로그래밍 학습 앱에 맞는 일관된 사용자 경험을 구현할 수 있도록, 기술적 컨텍스트, 디자인 시스템, UX 플로우를 상세히 제공합니다.

**핵심 설계 방향:**
- **CLI/터미널 테마**: 개발자 친화적인 시각적 언어
- **게이미피케이션 시스템**: 단계적 레벨 해금 및 목표 완료 경험
- **Pink-Accent 브랜드 컬러**: 따뜻하고 접근 가능한 프로그래밍 학습 환경
- **단계적 정보 수집**: 사용자 부담 최소화 원칙

---

## 🎨 디자인 시스템 & 컬러 팔레트 (Critical Styles)

### 1. 핵심 브랜드 컬러 (3가지 주요 컬러)

```typescript
// 1️⃣ 배경 컬러 시스템
background: '#F9F5F6'    // 메인 배경 - 연한 핑크 그레이
white: '#FFFFFF'         // 카드/모달 배경
cardBg: 'rgba(255, 255, 255, 0.8)' // 반투명 카드

// 2️⃣ 프라이머리 컬러 (핵심 액션)
primary: '#F2BED1'       // 메인 핑크 - 버튼, CTA, 강조
primaryLight: '#FCE7F3'  // 연한 핑크 - 호버, 선택 상태
primaryBorder: '#FDCEDF' // 핑크 테두리 - 입력란, 카드

// 3️⃣ 세컨더리 액센트 (터미널 테마)
terminal: '#61DAFB'      // 터미널 커서/액센트 - React 블루
textTertiary: '#007A7A'  // 터미널 텍스트 - 청록색
```

### 2. 텍스트 컬러 계층

```typescript
textPrimary: '#393E46'   // 메인 헤딩, 중요 텍스트
textSecondary: '#1F2937' // 본문 텍스트, 부제목
textMuted: '#6B7280'     // 플레이스홀더, 보조 정보
```

### 3. 상태 컬러 시스템

```typescript
success: '#10B981'   // 완료, 성공 피드백
error: '#FF4D4D'     // 에러, 실패 상태
warning: '#F59E0B'   // 주의, 경고 메시지
info: '#3B82F6'      // 정보, 팁
```

### 4. 그림자 & 윤곽선 규칙

```css
/* 카드 기본 그림자 */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

/* 버튼 눌림 효과 */
box-shadow: 0 2px 6px rgba(242, 190, 209, 0.3);

/* 모달 그림자 */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

/* 터미널 스타일 테두리 */
border: 1px solid #E5E7EB;
border-radius: 8px;
```

---

## 🎯 핵심 UX 플로우 & 게임화 요소

### 1. 레벨 진행 시스템 (순차적 해금)

```
🔓 LV0 (온보딩)     → 항상 열림
⬇️
🔓 LV1 (O/X 문제)   → LV0 완료 후 해금
⬇️
🔒 LV2 (객관식)     → LV1 완료 후 해금
⬇️
🔒 LV3 (빈칸 채우기) → LV2 완료 후 해금
⬇️
🔒 LV4 (디버깅)     → LV3 완료 후 해금
⬇️
🔒 LV5 (전문가 모드) → LV4 완료 후 해금
```

**디자인 고려사항:**
- 잠금 상태는 회색조 + 자물쇠 아이콘
- 해금 가능한 다음 단계는 약간의 강조 효과
- 현재 진행 중인 레벨은 진행률 표시

### 2. 목표 완료 모달 (Goal Completion UX)

```typescript
interface GoalCompletionFlow {
  trigger: '문제 완료' | '레벨 클리어' | '첫 로그인';
  animation: 'CanvasConfetti' // 축하 애니메이션
  content: {
    title: "🎉 축하합니다!";
    description: string; // 달성 내용
    reward: string;      // 해금된 기능/레벨
    nextAction: string;  // 다음 단계 안내
  };
  actions: ['다음 레벨로', '홈으로 돌아가기'];
}
```

### 3. 온보딩 데이터 수집 플로우

```
1️⃣ 환영 화면
   ↓ (터미널 애니메이션으로 텍스트 타이핑)

2️⃣ 닉네임 입력
   ↓ (실시간 유효성 검사)

3️⃣ 학습 목표 선택 (선택사항)
   ↓ (빠른 개인화)

4️⃣ 첫 번째 목표 완료 모달
   ↓ (게임화 요소 체험)

5️⃣ 홈 화면 진입
```

**주요 UX 원칙:**
- **최소 정보**: 닉네임만 필수, 나머지는 선택
- **즉시 피드백**: 입력과 동시에 유효성 표시
- **점진적 공개**: 기능을 단계적으로 소개

---

## 📁 최종 파일 구조 & SOLID 아키텍처 매핑

### 현재 프로젝트 구조 (온보딩 관련 컴포넌트 중심)

```
src/
├── components/                           # 재사용 가능한 UI 컴포넌트
│   ├── BottomNavigation/                # 하단 네비게이션 (온보딩 후 활성화)
│   ├── Effects/
│   │   └── CanvasConfetti.tsx           # 🎯 목표 완료 축하 애니메이션
│   ├── Home/
│   │   ├── TerminalHeader.tsx           # 🎯 CLI 테마 헤더 (온보딩 참조)
│   │   └── QuickActions.tsx             # 🎯 레벨 선택 버튼들
│   ├── Modals/
│   │   ├── DifficultySelectionModal.tsx # 🎯 레벨 선택 모달
│   │   ├── GoalCompletionModal.tsx      # 🎯 목표 완료 모달 (중요!)
│   │   └── Lv5ModeSelectModal.tsx       # LV5 분기 선택
│   ├── Profile/                         # 🆕 사용자 프로필 관련 (신규 추가됨)
│   │   ├── UserSummaryHeader.tsx        # 사용자 요약 정보
│   │   ├── AchievementsSection.tsx      # 업적 표시
│   │   ├── LearningInsights.tsx         # 학습 인사이트
│   │   └── MistakeNoteSection.tsx       # 오답 노트
│   └── Progress/
│       └── CircularProgress.tsx         # 🎯 진행률 표시 (중요!)
├── constants/                           # 🎯 디자인 토큰 (중요!)
│   ├── colors.ts                        # 컬러 팔레트 시스템
│   ├── fonts.ts                         # 폰트 및 타이포그래피
│   └── sizes.ts                         # 크기 및 간격 시스템
├── screens/
│   ├── Home/
│   │   └── HomeScreen.tsx               # 🎯 온보딩 완료 후 랜딩
│   └── Practice/                        # 학습 화면들
│       ├── Lv1OXProblemScreen.tsx       # LV1 O/X 문제
│       ├── Lv2MultipleChoiceProblemScreen.tsx # LV2 객관식
│       └── ... (LV3-LV5 화면들)
└── navigation/
    └── AppNavigator.tsx                 # 🎯 중앙 라우팅 시스템
```

**🎯 온보딩 화면에서 참조할 핵심 컴포넌트들:**

1. **TerminalHeader** (`src/components/Home/TerminalHeader.tsx`)
   - CLI 테마의 헤더 디자인 참조
   - 터미널 스타일 타이포그래피
   - 브랜드 컬러 적용 사례

2. **GoalCompletionModal** (`src/components/Modals/GoalCompletionModal.tsx`)
   - 목표 완료 시 축하 UX 패턴
   - CanvasConfetti 애니메이션 연동
   - 다음 액션 유도 버튼 설계

3. **CircularProgress** (`src/components/Progress/CircularProgress.tsx`)
   - 진행률 표시 시각화
   - 애니메이션 효과
   - 색상 및 스타일 가이드

### SOLID 원칙 적용 (컴포넌트 책임 분리)

#### 단일 책임 원칙 (SRP)
```
- TerminalHeader: CLI 테마 헤더 표시만 담당
- GoalCompletionModal: 완료 축하 UX만 담당
- CircularProgress: 진행률 시각화만 담당
- CanvasConfetti: 축하 애니메이션만 담당
```

#### 개방-폐쇄 원칙 (OCP)
```
- colors.ts: 새로운 컬러 추가 시 기존 코드 수정 없이 확장
- 모달 시스템: 새로운 모달 타입 추가 가능
- Progress 컴포넌트: 다양한 진행률 스타일 확장 지원
```

#### 의존 역전 원칙 (DIP)
```
- 모든 컴포넌트는 constants/ 의 디자인 토큰에 의존
- 구체적인 색상값이 아닌 추상화된 컬러 키 사용
- Props 인터페이스를 통한 타입 안전성 보장
```

---

## 🗄️ 백엔드 데이터 모델 요구사항

### 1. 사용자 기본 정보 (User Profile)

```typescript
interface UserProfile {
  id: string;                    // UUID
  nickname: string;              // 온보딩에서 수집 (필수)
  email?: string;               // 소셜 로그인 시 수집 (선택)
  profileImage?: string;        // 프로필 이미지 URL (선택)
  createdAt: Date;              // 가입 일시
  lastActiveAt: Date;           // 마지막 활동 시간

  // 온보딩 설정
  preferredLanguage: 'ko' | 'en'; // 기본값: 'ko'
  learningGoal?: string;        // 학습 목표 (선택사항)
  completedOnboarding: boolean; // 온보딩 완료 여부
}
```

### 2. 학습 진행 상태 (Learning Progress)

```typescript
interface LearningProgress {
  userId: string;               // User ID 참조

  // 레벨 진행 상태
  currentLevel: 'LV0' | 'LV1' | 'LV2' | 'LV3' | 'LV4' | 'LV5';
  unlockedLevels: string[];     // ['LV0', 'LV1'] 형태
  completedLevels: {
    [key: string]: {
      completedAt: Date;
      score: number;            // 점수
      timeSpent: number;        // 소요 시간 (초)
      attemptsCount: number;    // 시도 횟수
    }
  };

  // 전체 통계
  totalProblemsCompleted: number;
  totalTimeSpent: number;       // 전체 학습 시간 (초)
  streakDays: number;          // 연속 학습 일수
  lastStudyDate: Date;         // 마지막 학습 날짜

  // 레벨별 통계
  levelStats: {
    [key: string]: {
      totalAttempts: number;
      correctAnswers: number;
      averageTime: number;      // 평균 소요 시간
      bestScore: number;        // 최고 점수
    }
  };
}
```

### 3. 온보딩 세션 데이터 (Onboarding Session)

```typescript
interface OnboardingSession {
  id: string;                   // UUID
  userId: string;               // User ID 참조

  // 온보딩 단계별 진행
  currentStep: 'welcome' | 'nickname' | 'goals' | 'complete';
  completedSteps: string[];     // 완료한 단계들
  startedAt: Date;              // 온보딩 시작 시간
  completedAt?: Date;           // 온보딩 완료 시간

  // 수집된 데이터
  collectedData: {
    nickname?: string;
    learningGoal?: string;
    preferredDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  };

  // 인터랙션 로그
  interactions: Array<{
    step: string;
    action: string;
    timestamp: Date;
    metadata?: object;          // 추가 메타데이터
  }>;
}
```

### 4. 일일 퀘스트 시스템 (Daily Quests)

```typescript
interface DailyQuest {
  id: string;
  userId: string;
  date: string;                 // YYYY-MM-DD 형태

  quests: Array<{
    id: string;
    type: 'solve_problems' | 'study_time' | 'streak_maintain';
    title: string;              // "3문제 풀기"
    description: string;        // 상세 설명
    target: number;             // 목표값
    current: number;            // 현재 진행
    completed: boolean;         // 완료 여부
    completedAt?: Date;         // 완료 시간
    reward: {
      type: 'experience' | 'badge';
      value: number | string;
    };
  }>;

  allCompleted: boolean;        // 모든 퀘스트 완료 여부
  completionReward?: {          // 전체 완료 보상
    type: 'special_badge' | 'bonus_experience';
    value: string | number;
  };
}
```

### 5. API 엔드포인트 설계 (온보딩 중심)

#### 사용자 온보딩 관련
```typescript
// 온보딩 시작
POST /api/onboarding/start
Request: { deviceInfo?: object }
Response: { sessionId: string, currentStep: string }

// 닉네임 검증 및 설정
POST /api/onboarding/nickname
Request: { sessionId: string, nickname: string }
Response: { valid: boolean, available: boolean, suggestions?: string[] }

// 학습 목표 설정 (선택)
POST /api/onboarding/goals
Request: { sessionId: string, learningGoal: string, preferredDifficulty: string }
Response: { saved: boolean }

// 온보딩 완료
POST /api/onboarding/complete
Request: { sessionId: string }
Response: {
  userId: string,
  profile: UserProfile,
  initialProgress: LearningProgress
}
```

#### 진행 상태 관리
```typescript
// 사용자 진행 상태 조회
GET /api/users/{userId}/progress
Response: LearningProgress

// 레벨 완료 처리
POST /api/users/{userId}/levels/{levelId}/complete
Request: {
  score: number,
  timeSpent: number,
  problemsCompleted: number
}
Response: {
  nextUnlockedLevel?: string,
  achievements?: string[],
  showCelebration: boolean
}

// 일일 퀘스트 조회
GET /api/users/{userId}/quests/daily
Response: DailyQuest

// 퀘스트 진행 업데이트
POST /api/users/{userId}/quests/progress
Request: { questId: string, progress: number }
Response: { updated: boolean, completed: boolean, reward?: object }
```

### 6. 데이터베이스 스키마 권장사항

```sql
-- 사용자 프로필
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    profile_image VARCHAR(500),
    preferred_language VARCHAR(2) DEFAULT 'ko',
    learning_goal TEXT,
    completed_onboarding BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 학습 진행 상태
CREATE TABLE learning_progress (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    current_level VARCHAR(10) DEFAULT 'LV0',
    unlocked_levels JSONB DEFAULT '["LV0"]',
    completed_levels JSONB DEFAULT '{}',
    total_problems_completed INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_study_date DATE,
    level_stats JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 온보딩 세션
CREATE TABLE onboarding_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    current_step VARCHAR(20) DEFAULT 'welcome',
    completed_steps JSONB DEFAULT '[]',
    collected_data JSONB DEFAULT '{}',
    interactions JSONB DEFAULT '[]',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- 일일 퀘스트
CREATE TABLE daily_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    quest_date DATE NOT NULL,
    quests JSONB NOT NULL,
    all_completed BOOLEAN DEFAULT false,
    completion_reward JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quest_date)
);
```

---

## 🎨 온보딩 화면 구체적 설계 가이드

### 1. 환영 화면 (Welcome Screen)

#### 레이아웃 구성
```
┌─────────────────────────┐
│   [터미널 헤더 영역]        │ ← TerminalHeader 컴포넌트 참조
├─────────────────────────┤
│                         │
│    🚀 DayScript         │ ← 브랜드 로고
│                         │
│   $ welcome --user      │ ← CLI 스타일 텍스트 타이핑
│   $ init --journey      │   애니메이션
│   $ ready? [Y/n]        │
│                         │
│   [시작하기 버튼]          │ ← Primary 컬러
│                         │
└─────────────────────────┘
```

#### 스타일 규칙
```css
/* 배경 */
background: COLORS.background; // #F9F5F6

/* CLI 텍스트 */
color: COLORS.textTertiary;    // #007A7A
font-family: 'Monaco', monospace;
typing-animation: 0.5s ease-in-out;

/* CTA 버튼 */
background: COLORS.primary;    // #F2BED1
color: COLORS.white;
border-radius: 8px;
box-shadow: 0 2px 6px rgba(242, 190, 209, 0.3);
```

### 2. 닉네임 입력 화면

#### 레이아웃 구성
```
┌─────────────────────────┐
│   [진행률 표시 2/4]       │ ← CircularProgress 참조
├─────────────────────────┤
│                         │
│ $ create --user-profile │ ← CLI 명령어 스타일
│                         │
│ 닉네임을 입력해주세요      │ ← textPrimary
│ (2-10자, 한글/영문/숫자) │ ← textMuted
│                         │
│ ┌─────────────────────┐ │
│ │ [입력란]             │ │ ← primaryBorder 테두리
│ └─────────────────────┘ │
│                         │
│ ✓ 사용 가능한 닉네임     │ ← success 컬러
│                         │
│   [건너뛰기]  [다음단계]  │ ← 선택사항 + Primary CTA
│                         │
└─────────────────────────┘
```

### 3. 학습 목표 선택 화면 (선택사항)

#### 카드 그리드 레이아웃
```
┌─────────────────────────┐
│ 어떤 목표로 학습할까요?   │
├─────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ │
│ │ 🎯  │ │ 💻  │ │ 🚀  │ │
│ │취업  │ │개발  │ │성장 │ │ ← 카드 선택 UI
│ │준비  │ │실력  │ │마인드│ │   (primary 테두리)
│ └─────┘ └─────┘ └─────┘ │
│                         │
│   [건너뛰기]    [완료]    │
└─────────────────────────┘
```

### 4. 완료 축하 화면

#### 애니메이션 + 모달 구성
```
┌─────────────────────────┐
│     🎊 (Confetti)       │ ← CanvasConfetti 애니메이션
├─────────────────────────┤
│                         │
│    🎉 환영합니다!        │ ← GoalCompletionModal
│                         │
│  DayScript와 함께       │   컴포넌트 참조
│  프로그래밍 여행을       │
│  시작해볼까요?          │
│                         │
│  🔓 LV1이 해금되었어요  │ ← success 컬러
│                         │
│     [여행 시작하기]       │ ← Primary CTA
│                         │
└─────────────────────────┘
```

---

## 📱 모바일 반응형 및 접근성 고려사항

### 1. 화면 크기별 대응
```css
/* 스마트폰 (320px ~ 414px) */
@media (max-width: 414px) {
  font-size: 16px;          // 최소 폰트 크기
  touch-target: 44px;       // 최소 터치 영역
  padding: 16px;            // 여백
}

/* 태블릿 (768px ~ 1024px) */
@media (min-width: 768px) {
  max-width: 600px;         // 최대 컨텐츠 너비
  margin: 0 auto;           // 중앙 정렬
}
```

### 2. 접근성 (Accessibility)
```jsx
// 스크린 리더 지원
<input
  accessibilityLabel="닉네임을 입력하세요"
  accessibilityHint="2글자 이상 10글자 이하로 입력해주세요"
/>

// 고대비 지원
const highContrastColors = {
  text: '#000000',
  background: '#FFFFFF',
  primary: '#0066CC'
};

// 키보드 네비게이션
tabIndex={0}
onKeyDown={handleKeyDown}
```

---

## 🚀 구현 우선순위 및 다음 단계

### Phase 1: 핵심 온보딩 플로우 (1-2주)
1. ✅ 환영 화면 + CLI 테마 적용
2. ✅ 닉네임 입력 + 실시간 검증
3. ✅ 완료 모달 + 축하 애니메이션
4. ✅ 홈 화면 연동

### Phase 2: 고도화 기능 (2-3주)
1. 🔄 학습 목표 선택 화면
2. 🔄 일일 퀘스트 시스템 연동
3. 🔄 진행률 상세 표시
4. 🔄 백엔드 API 연동

### Phase 3: 최적화 및 개선 (1주)
1. ⏭️ 성능 최적화
2. ⏭️ 접근성 강화
3. ⏭️ 다국어 지원
4. ⏭️ A/B 테스트 설정

---

## 📋 디자이너 체크리스트

### ✅ 필수 구현 요소
- [ ] CLI 터미널 테마 일관성
- [ ] Pink-accent 브랜드 컬러 적용
- [ ] 타이핑 애니메이션 효과
- [ ] 진행률 표시 시각화
- [ ] 축하 애니메이션 (Confetti)
- [ ] 모바일 반응형 레이아웃
- [ ] 접근성 고려 (스크린 리더, 고대비)

### ✅ UX 플로우 검증
- [ ] 최소 정보 수집 (닉네임만 필수)
- [ ] 건너뛰기 옵션 제공
- [ ] 실시간 피드백 (유효성 검사)
- [ ] 명확한 다음 단계 안내
- [ ] 에러 상황 처리 (네트워크, 입력 오류)

### ✅ 기술적 연동 확인
- [ ] 기존 컴포넌트와 스타일 일관성
- [ ] TypeScript 인터페이스 정의
- [ ] Navigation 시스템 연동
- [ ] 백엔드 API 호출 준비

**🎯 최종 목표: 사용자가 30초 이내에 온보딩을 완료하고, 즉시 학습을 시작할 수 있는 매끄러운 경험 제공**

이 가이드를 바탕으로 LV0 온보딩 화면을 설계하시면, DayScript의 브랜드 정체성과 완벽하게 일치하는 사용자 경험을 구현하실 수 있습니다.