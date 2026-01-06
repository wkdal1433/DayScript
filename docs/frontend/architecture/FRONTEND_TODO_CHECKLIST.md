# 🎯 DayScript Frontend Development To-do Checklist

> **목표**: 프런트엔드 기능적 완성도 100% 달성을 위한 우선순위별 로드맵

**마지막 업데이트**: 2025-11-20
**분석 범위**: `src/` 전체 코드베이스
**분석 관점**: Architecture & UX

---

## 📊 분석 요약

### 현재 상태
- ✅ **완료된 UI 화면**: 15개 (Home, Profile, Community, Practice Lv1-5)
- ⚠️ **미구현 모달/화면**: 8개
- ⚠️ **더미 데이터 의존**: 12개 섹션
- ⚠️ **API 미연결**: 20개 기능

### 우선순위 분류
- 🔴 **P0 (Critical)**: 앱 핵심 기능 - 즉시 구현 필요
- 🟠 **P1 (High)**: 사용자 경험 저해 - 1주 내 구현
- 🟡 **P2 (Medium)**: 기능 완성도 - 2주 내 구현
- 🟢 **P3 (Low)**: 부가 기능 - 추후 구현

---

## 🔴 P0: Critical Priority (즉시 구현 필요)

### 1. 알림 센터 시스템 구현
**파일**: `src/screens/Common/NotificationCenterModal.tsx` (신규)

**현재 문제**:
- `TerminalHeader.tsx:378` - `console.log('Alarm pressed')` 만 존재
- 모든 화면에서 알람 버튼이 작동하지 않음

**구현 사항**:
```typescript
// 필요한 컴포넌트
- NotificationCenterModal (메인 모달)
- NotificationItem (개별 알림 카드)
- NotificationFilter (알림 타입 필터)

// API 연동
- GET /api/notifications - 알림 목록 조회
- PATCH /api/notifications/:id/read - 읽음 처리
- DELETE /api/notifications/:id - 알림 삭제
```

**예상 작업 시간**: 8시간

---

### 2. 설정 화면 구현
**파일**: `src/screens/Settings/SettingsScreen.tsx` (신규)

**현재 문제**:
- `TerminalHeader.tsx:384` - `console.log('Settings pressed')` 만 존재
- `UserPageScreen.tsx:34` - 설정 버튼 미연결

**구현 사항**:
```typescript
// 설정 섹션
1. 계정 설정
   - 프로필 편집
   - 비밀번호 변경
   - 연동된 소셜 계정 관리

2. 학습 설정
   - 일일 목표 설정
   - 알림 설정 (학습 리마인더)
   - 언어 선택 (Python/JavaScript/Java)

3. 앱 설정
   - 다크모드 전환
   - 폰트 크기 조정
   - 튜토리얼 다시 보기

4. 기타
   - 약관 및 정책
   - 버전 정보
   - 로그아웃
```

**예상 작업 시간**: 12시간

---

### 3. 커뮤니티 글쓰기 화면 연결
**파일**: `src/modules/community/screens/CreatePostScreen.tsx` (기존)

**현재 문제**:
- `CommunityHomeScreen.tsx:91-96` - Alert로만 처리
- 실제 내비게이션 연결 누락

**구현 사항**:
```typescript
// 수정 필요
// Before:
handleCreatePost = () => {
  Alert.alert('글 작성', '게시글 작성 화면은 곧 구현될 예정입니다.');
}

// After:
handleCreatePost = () => {
  navigation.navigate('CreatePost', {
    category: activeCategory
  });
}
```

**관련 파일**:
- `src/navigation/AppNavigator.tsx` - CreatePost 라우트 추가 확인 필요

**예상 작업 시간**: 2시간

---

## 🟠 P1: High Priority (1주 내 구현)

### 4. 프로필 학습 데이터 API 연동
**파일**:
- `src/components/Profile/LearningInsights.tsx`
- `src/components/Profile/UserSummaryHeader.tsx`

**현재 문제**:
- `LearningInsights.tsx:14-27` - `MOCK_LEARNING_STATS` 하드코딩
- 실시간 학습 데이터 반영 불가

**구현 사항**:
```typescript
// API 엔드포인트
- GET /api/user/learning-stats
  Response: {
    totalProblems: number;
    totalHours: number;
    averageAccuracy: number;
    weeklyData: Array<{ date: string; problemsSolved: number }>;
  }

- GET /api/user/profile
  Response: {
    name: string;
    level: number;
    experience: number;
    rank: number;
    streak: number;
  }
```

**마이그레이션 전략**:
1. Custom Hook 생성: `useUserLearningStats()`
2. React Query / SWR 사용 권장
3. Loading/Error 상태 처리
4. 캐싱 전략 수립 (5분 TTL)

**예상 작업 시간**: 10시간

---

### 5. 오답노트 필터링 및 API 연동
**파일**: `src/components/Profile/MistakeNoteSection.tsx`

**현재 문제**:
- `MistakeNoteSection.tsx:14-60` - `MOCK_MISTAKE_NOTES` 하드코딩
- 레벨별 필터 UI 존재하나 로직 미구현

**구현 사항**:
```typescript
// API 엔드포인트
- GET /api/user/mistakes?level={1-5}&limit={number}
  Response: {
    mistakes: MistakeNote[];
    total: number;
    hasMore: boolean;
  }

- GET /api/user/mistakes/:id/retry
  - 재도전 기능 API

// 필터 로직 구현
const [activeFilter, setActiveFilter] = useState<'all' | 1 | 2 | 3 | 4 | 5>('all');

const handleFilterChange = (level: typeof activeFilter) => {
  setActiveFilter(level);
  fetchMistakes(level);
};
```

**예상 작업 시간**: 6시간

---

### 6. 커뮤니티 댓글/좋아요 API 연동
**파일**:
- `src/modules/community/components/CommentSection.tsx`
- `src/modules/community/components/PostCard.tsx`

**현재 문제**:
- 댓글 작성 기능 UI만 존재, API 미연결
- 좋아요/싫어요 버튼 로직 미구현

**구현 사항**:
```typescript
// API 엔드포인트
- POST /api/posts/:id/comments
  Body: { content: string; parentId?: string }

- POST /api/posts/:id/vote
  Body: { voteType: 'like' | 'dislike' }

- DELETE /api/posts/:id/vote
  - 좋아요 취소

- GET /api/posts/:id/comments?page={number}
  Response: {
    comments: Comment[];
    hasMore: boolean;
  }
```

**추가 기능**:
- 대댓글 기능
- 댓글 페이지네이션
- 실시간 좋아요 카운트 업데이트

**예상 작업 시간**: 8시간

---

### 7. Home 화면 데이터 API 연동
**파일**: `src/screens/Home/HomeScreen.tsx`

**현재 문제**:
- `HomeScreen.tsx:23-46` - 모든 데이터가 하드코딩된 mock 데이터
- 실시간 퀘스트 진행 상황 반영 불가

**구현 사항**:
```typescript
// API 엔드포인트
- GET /api/quests/today
  Response: { quests: Quest[] }

- GET /api/user/stats
  Response: {
    todayProgress: number;
    totalProblems: number;
    accuracy: number;
    streakDays: number;
  }

- GET /api/ranking/top?limit=3
  Response: { rankings: UserRanking[] }

- PATCH /api/quests/:id/toggle
  Body: { completed: boolean }
```

**예상 작업 시간**: 6시간

---

## 🟡 P2: Medium Priority (2주 내 구현)

### 8. 검색 기능 구현
**파일**: `src/screens/Search/SearchScreen.tsx` (신규)

**현재 문제**:
- `CommunityHomeScreen.tsx:119-125` - Alert로만 처리
- 통합 검색 화면 부재

**구현 사항**:
```typescript
// 검색 범위
1. 커뮤니티 게시글 검색
2. 문제 검색 (제목, 태그, 언어)
3. 사용자 검색

// 검색 필터
- 카테고리 필터
- 정렬 옵션 (최신순, 인기순, 관련도순)
- 기간 필터

// API
- GET /api/search?q={query}&type={post|problem|user}&page={number}
```

**예상 작업 시간**: 10시간

---

### 9. Challenger 모드 데이터 로딩 최적화
**파일**:
- `src/screens/Practice/Challenger/DiffHunkScreen.tsx`
- `src/screens/Practice/Challenger/PRInboxScreen.tsx`
- `src/screens/Practice/Challenger/VibeSessionScreen.tsx`

**현재 문제**:
- 모든 데이터가 `generateMockData()` 함수로 생성
- 실제 GitHub 연동 없음

**구현 사항**:
```typescript
// API 엔드포인트
- GET /api/challenges/pr-scenarios?difficulty={easy|medium|hard}
  Response: { scenario: PRScenario; commits: CommitInfo[] }

- GET /api/challenges/diff-hunks/:commitHash
  Response: { fileDiff: FileDiff }

- POST /api/challenges/review-submit
  Body: {
    scenarioId: string;
    reviewActions: ReviewAction[];
    timeTaken: number;
  }
  Response: {
    score: number;
    feedback: string[];
    correctActions: number;
  }
```

**추가 개선**:
- 실제 Git diff 파싱 로직
- 코드 하이라이팅 개선
- 리뷰 히스토리 저장

**예상 작업 시간**: 16시간

---

### 10. 문제 풀이 기록 및 통계 시스템
**파일**: `src/services/analytics/ProblemAnalytics.ts` (신규)

**구현 사항**:
```typescript
// 수집할 데이터
- 문제별 정답률
- 평균 소요 시간
- 언어별 학습 패턴
- 일일/주간/월간 통계

// API
- POST /api/analytics/problem-attempt
  Body: {
    problemId: string;
    level: number;
    isCorrect: boolean;
    timeTaken: number;
    hintsUsed: number;
  }

- GET /api/analytics/user-insights
  Response: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }
```

**예상 작업 시간**: 12시간

---

### 11. 성취 시스템 구현
**파일**: `src/components/Profile/AchievementsSection.tsx`

**현재 문제**:
- UI만 존재, 실제 성취 데이터 없음
- 뱃지 획득 조건 미정의

**구현 사항**:
```typescript
// 성취 카테고리
1. 학습 성취
   - 첫 문제 해결
   - 연속 학습 (7일, 30일, 100일)
   - 레벨별 마스터

2. 커뮤니티 성취
   - 첫 게시글
   - 인기 게시글 (좋아요 100개)
   - 커뮤니티 기여자

3. 특수 성취
   - 완벽한 날 (100% 정답률)
   - 속도왕 (평균 시간 상위 1%)
   - 멘토 (5명에게 도움)

// API
- GET /api/achievements
  Response: {
    unlocked: Achievement[];
    locked: Achievement[];
    progress: { [key: string]: number };
  }
```

**예상 작업 시간**: 8시간

---

## 🟢 P3: Low Priority (추후 구현)

### 12. 다크 모드 지원
**파일**: `src/theme/ThemeProvider.tsx` (신규)

**구현 사항**:
- 전역 테마 Context 생성
- 컬러 시스템 이중화 (light/dark)
- 시스템 설정 연동
- 저장소 연동 (AsyncStorage)

**예상 작업 시간**: 6시간

---

### 13. 푸시 알림 시스템
**파일**: `src/services/notifications/PushNotification.ts` (신규)

**구현 사항**:
- Firebase Cloud Messaging 연동
- 알림 권한 요청 플로우
- 알림 타입별 처리 (퀘스트 완료, 댓글 달림, 랭킹 변동)
- 딥링크 연동

**예상 작업 시간**: 10시간

---

### 14. 오프라인 모드 지원
**파일**: `src/services/offline/OfflineManager.ts` (신규)

**구현 사항**:
- Redux Persist 또는 Zustand Persist 설정
- 오프라인 데이터 캐싱
- 동기화 큐 관리
- 네트워크 상태 감지

**예상 작업 시간**: 12시간

---

### 15. 소셜 공유 기능
**파일**: `src/utils/SocialShare.ts` (신규)

**구현 사항**:
- 성취 공유 (카카오톡, 트위터, 페이스북)
- 오픈그래프 이미지 생성
- 초대 링크 생성
- 딥링크 처리

**예상 작업 시간**: 8시간

---

## 📝 개발 가이드라인

### API 연동 표준
```typescript
// 1. Custom Hook 패턴 사용
export const useUserStats = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/stats',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1분 캐싱
    }
  );

  return { stats: data, error, isLoading, refresh: mutate };
};

// 2. Error Handling
try {
  const response = await api.post('/endpoint', data);
  // Success handling
} catch (error) {
  if (error.response?.status === 401) {
    // 인증 에러 처리
    navigation.navigate('Login');
  } else {
    // 일반 에러 처리
    Alert.alert('오류', '작업에 실패했습니다.');
  }
}

// 3. Loading States
{isLoading ? (
  <ActivityIndicator size="large" color={COLORS.primary} />
) : (
  <ActualContent data={data} />
)}
```

### 더미 데이터 마이그레이션 체크리스트
- [ ] API 엔드포인트 정의
- [ ] Custom Hook 생성
- [ ] Loading/Error 상태 추가
- [ ] 기존 MOCK 데이터 제거
- [ ] 타입 정의 업데이트
- [ ] 테스트 코드 작성

### 새 화면 추가 시 체크리스트
- [ ] TypeScript 타입 정의 (`*.types.ts`)
- [ ] 스타일 분리 (`*.styles.ts`)
- [ ] Navigation 라우트 등록
- [ ] BottomNavigationBar 연동 (필요시)
- [ ] Error Boundary 적용
- [ ] 접근성 (Accessibility) 고려

---

## 🎯 마일스톤

### Sprint 1 (1주차)
- ✅ P0-1: 알림 센터 시스템
- ✅ P0-2: 설정 화면
- ✅ P0-3: 커뮤니티 글쓰기 연결

**목표**: 핵심 사용자 경험 개선

---

### Sprint 2 (2주차)
- ✅ P1-4: 프로필 학습 데이터 API
- ✅ P1-5: 오답노트 API
- ✅ P1-6: 커뮤니티 댓글/좋아요 API
- ✅ P1-7: Home 화면 API

**목표**: 실시간 데이터 연동 완료

---

### Sprint 3 (3주차)
- ✅ P2-8: 검색 기능
- ✅ P2-9: Challenger 모드 최적화
- ✅ P2-10: 문제 풀이 통계

**목표**: 고급 기능 완성

---

### Sprint 4 (4주차)
- ✅ P2-11: 성취 시스템
- ✅ P3-12: 다크 모드
- ✅ QA 및 버그 수정

**목표**: 기능 완성도 100% 달성

---

## 📊 예상 총 작업 시간

| 우선순위 | 작업 항목 수 | 예상 시간 |
|---------|-----------|---------|
| P0 (Critical) | 3개 | 22시간 |
| P1 (High) | 4개 | 30시간 |
| P2 (Medium) | 4개 | 46시간 |
| P3 (Low) | 4개 | 36시간 |
| **총합** | **15개** | **134시간** |

**팀 구성 (2명 기준)**: 약 17일 (67시간/명)
**단독 개발**: 약 34일 (주 5일 근무, 하루 4시간)

---

## ✅ 완료 체크리스트

### P0 완료 조건
- [ ] 알림 센터에서 알림 목록 정상 조회
- [ ] 설정 화면에서 프로필 편집 가능
- [ ] 커뮤니티에서 글 작성 후 목록에 표시

### P1 완료 조건
- [ ] 프로필 화면에 실시간 학습 데이터 표시
- [ ] 오답노트 레벨별 필터링 작동
- [ ] 커뮤니티 댓글 작성/좋아요 정상 작동
- [ ] Home 화면 퀘스트 체크 시 서버 동기화

### P2 완료 조건
- [ ] 검색 화면에서 모든 타입 검색 가능
- [ ] Challenger 모드에서 실제 PR 시나리오 로드
- [ ] 문제 풀이 통계 대시보드 표시
- [ ] 성취 뱃지 획득 시 알림 표시

### P3 완료 조건
- [ ] 다크 모드 전환 시 모든 화면 테마 적용
- [ ] 푸시 알림 수신 및 화면 이동
- [ ] 오프라인 상태에서도 기본 기능 사용 가능
- [ ] 성취 공유 시 소셜 미디어 연동

---

## 🚀 시작하기

### 1단계: 환경 설정
```bash
# API 베이스 URL 설정
# .env 파일 생성
REACT_APP_API_URL=https://api.dayscript.com
REACT_APP_ENV=development
```

### 2단계: 우선순위별 착수
P0 작업부터 순차적으로 진행하되, API 팀과 병렬 작업 가능한 경우:
1. Mock API 서버 구축 (json-server 또는 MSW)
2. 프론트엔드 UI 먼저 완성
3. API 준비되는 대로 연동

### 3단계: 지속적 통합
- 각 기능 완료 시 즉시 main 브랜치 머지
- 주간 회고 및 진행 상황 점검
- 사용자 피드백 수집 및 반영

---

**작성자**: Claude Code Analysis Agent
**문서 버전**: 1.0.0
**다음 리뷰 예정일**: 2025-11-27
