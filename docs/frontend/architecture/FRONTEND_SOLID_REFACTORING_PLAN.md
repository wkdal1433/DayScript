# SOLID Architecture Refactoring - Implementation Plan

## Goal Description

This refactoring addresses critical architectural feedback to achieve 100% SOLID compliance in the DayScript frontend codebase. The current structure has good component separation but lacks proper domain layer abstraction, module-based organization, and clear API/Service layer boundaries.

### Current Issues
1. **Problem screens (LV1-LV5) have duplicated logic** - Timer, progress, hint system, answer validation scattered across files
2. **Mixed boundaries** - Challenge/Practice/Community/User features are not clearly separated
3. **LV5 exceptional flow** - Breaks UX and structural consistency
4. **Missing Data Layer** - No clear separation between API calls and business logic

### Target Architecture
- **Domain Layer**: Problem engine with reusable logic (OCP compliant)
- **Module-based Structure**: Clear feature boundaries (DDD approach)
- **API/Service Separation**: Clean data layer following SOLID principles
- **LV6 Separation**: Move LV5's exceptional flow to dedicated level

---

## User Review Required

> [!IMPORTANT]
> **Breaking Changes to Folder Structure**
> 
> This refactoring will reorganize the entire `src/` directory structure:
> - Moving from `src/screens/Practice/` to `src/modules/practice/`
> - Creating new `src/domain/` layer
> - Splitting `src/api/` and `src/services/`
> 
> **Impact**: All import paths will change. This is a one-time migration that will significantly improve maintainability.

> [!WARNING]
> **LV5 → LV6 Split**
> 
> The current LV5 screen has exceptional flow that breaks consistency. We'll split it into:
> - **LV5**: Standard expert-level problems (consistent with LV1-4)
> - **LV6**: Advanced collaborative features (new level)
> 
> **User Decision Needed**: Should we preserve existing LV5 user progress or migrate it to LV6?

---

## Proposed Changes

### Component 1: Domain Layer - Problem Engine

Creating a centralized problem management system that all levels will use.

#### [NEW] [ProblemEngine.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/domain/problems/ProblemEngine.ts)

**Purpose**: Core problem lifecycle management (loading, validation, progression)

**Key Responsibilities**:
- Problem state management
- Answer validation orchestration
- Progress tracking
- Session management integration

**Exports**:
```typescript
class ProblemEngine {
  loadProblem(problemId: string): Promise<Problem>
  validateAnswer(answer: any): ValidationResult
  calculateScore(result: ValidationResult): ScoreData
  trackProgress(): ProgressData
}
```

---

#### [NEW] [ProblemTypes.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/domain/problems/ProblemTypes.ts)

**Purpose**: Unified type definitions for all problem types

**Exports**:
```typescript
type ProblemType = 'OX' | 'MultipleChoice' | 'FillBlank' | 'Debugging' | 'Expert'
interface BaseProblem { id, title, description, difficulty, category }
interface OXProblem extends BaseProblem { correctAnswer: 'O' | 'X' }
// ... other problem types
```

---

#### [NEW] [ProblemValidator.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/domain/problems/ProblemValidator.ts)

**Purpose**: Answer validation logic for each problem type

**Key Methods**:
- `validateOXAnswer()`
- `validateMultipleChoice()`
- `validateFillBlank()`
- `validateDebugging()`

---

#### [NEW] [ProblemHintEngine.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/domain/problems/ProblemHintEngine.ts)

**Purpose**: Centralized hint system logic (currently duplicated across screens)

**Features**:
- Hint progression management
- XP deduction calculation
- Hint availability rules

---

#### [NEW] [ProblemProgressManager.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/domain/problems/ProblemProgressManager.ts)

**Purpose**: Session progress tracking and completion detection

**Integrates with**: Existing `sessionManager` but adds abstraction layer

---

### Component 2: Module-based Feature Structure

Reorganizing from screen-centric to feature-centric modules.

#### [NEW] Directory Structure

```
src/
  modules/
    practice/
      screens/
        LV1/
          OXScreen.tsx
          OXPresenter.ts
        LV2/
          MultipleChoiceScreen.tsx
          MultipleChoicePresenter.ts
        LV3/
          FillBlankScreen.tsx
          FillBlankPresenter.ts
        LV4/
          DebuggerScreen.tsx
          DebuggerPresenter.ts
        LV5/
          ExpertScreen.tsx
          ExpertPresenter.ts
        LV6/  [NEW]
          CollaborativeScreen.tsx
          CollaborativePresenter.ts
      components/
        ProblemHeader.tsx
        ProgressBar.tsx
        ResultView.tsx
      hooks/
        useProblemSession.ts
        useProblemTimer.ts
      index.ts
    
    community/
      screens/
        CommunityHomeScreen.tsx
        PostDetailScreen.tsx
        CreatePostScreen.tsx
      components/
        PostCard.tsx
        CommentSection.tsx
      hooks/
        useCommunityData.ts
      index.ts
    
    user/
      screens/
        ProfileScreen.tsx
        SettingsScreen.tsx
      components/
        UserSummaryHeader.tsx
        LearningInsights.tsx
      hooks/
        useUserProfile.ts
      index.ts
    
    onboarding/
      screens/
        OnboardingFlow.tsx
        Step1Screen.tsx
        Step2Screen.tsx
        Step3Screen.tsx
        Step4Screen.tsx
      components/
        OnboardingProgress.tsx
      index.ts
    
    auth/
      screens/
        LoginScreen.tsx
        SignupScreen.tsx
      hooks/
        useAuth.ts
      index.ts
```

---

#### Migration Strategy

**Phase 1**: Create new module structure alongside existing
**Phase 2**: Migrate screens one module at a time
**Phase 3**: Update navigation imports
**Phase 4**: Remove old `src/screens/` directory

---

### Component 3: API and Service Layer Separation

Creating clear boundaries between I/O operations and business logic.

#### [NEW] [onboardingApi.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/api/onboardingApi.ts)

**Purpose**: Raw HTTP calls for onboarding endpoints

**Methods**:
```typescript
export const onboardingApi = {
  getOnboardingStatus: () => axios.get('/api/onboarding/status'),
  completeStep: (stepId: number) => axios.post('/api/onboarding/complete', { stepId }),
  skipOnboarding: () => axios.post('/api/onboarding/skip')
}
```

---

#### [NEW] [progressApi.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/api/progressApi.ts)

**Purpose**: Learning progress data fetching

**Methods**:
```typescript
export const progressApi = {
  getUserProgress: () => axios.get('/api/user/progress'),
  updateProgress: (data) => axios.patch('/api/user/progress', data),
  getSessionHistory: () => axios.get('/api/sessions/history')
}
```

---

#### [NEW] [problemsApi.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/api/problemsApi.ts)

**Purpose**: Problem data CRUD operations

**Methods**:
```typescript
export const problemsApi = {
  getProblemsByLevel: (level: number) => axios.get(`/api/problems?level=${level}`),
  getProblemById: (id: string) => axios.get(`/api/problems/${id}`),
  submitAnswer: (problemId: string, answer: any) => axios.post(`/api/problems/${problemId}/submit`, { answer })
}
```

---

#### [NEW] [communityApi.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/api/communityApi.ts)

**Purpose**: Community features API calls

---

#### [NEW] [onboardingService.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/services/onboardingService.ts)

**Purpose**: Business logic for onboarding flow

**Responsibilities**:
- Determine next onboarding step
- Validate step completion
- Handle onboarding state transitions
- Map API responses to domain models

**Example**:
```typescript
export class OnboardingService {
  async getNextStep(): Promise<OnboardingStep> {
    const status = await onboardingApi.getOnboardingStatus()
    return this.determineNextStep(status.data)
  }
  
  private determineNextStep(status: ApiOnboardingStatus): OnboardingStep {
    // Business logic here
  }
}
```

---

#### [NEW] [problemService.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/services/problemService.ts)

**Purpose**: Problem-related business logic

**Responsibilities**:
- Problem selection algorithm
- Difficulty adaptation
- Answer validation coordination
- Score calculation
- Achievement unlocking logic

---

#### [NEW] [communityService.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/services/communityService.ts)

**Purpose**: Community interaction business logic

**Responsibilities**:
- Post filtering and sorting
- Comment threading logic
- Vote aggregation
- Spam detection

---

### Component 4: LV5 → LV6 Split

Separating exceptional flow into dedicated level.

#### [MODIFY] [Lv5ExpertScreen.tsx](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/screens/Practice/Expert/Lv5ExpertScreen.tsx)

**Changes**:
- Remove collaborative features
- Align with LV1-4 structure
- Use ProblemEngine for consistency
- Standard problem → result → next flow

---

#### [NEW] [Lv6CollaborativeScreen.tsx](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/screens/LV6/CollaborativeScreen.tsx)

**Purpose**: Advanced collaborative learning features

**Features** (moved from old LV5):
- Pair programming simulation
- Code review challenges
- Team problem solving
- Real-time collaboration

---

### Component 5: Screen Refactoring with Presenter Pattern

Applying MVP pattern to separate UI from logic.

#### [MODIFY] [Lv1OXProblemScreen.tsx](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/screens/LV1/OXScreen.tsx)

**Changes**:
- Extract business logic to `OXPresenter.ts`
- Use `ProblemEngine` for common operations
- Remove duplicated timer/progress logic
- Simplify to pure UI rendering

---

#### [NEW] [OXPresenter.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/screens/LV1/OXPresenter.ts)

**Purpose**: Business logic for OX problem screen

**Responsibilities**:
- Problem loading via ProblemEngine
- Answer submission handling
- Progress calculation
- Navigation decisions

---

#### Similar refactoring for LV2, LV3, LV4, LV5

Each level will follow the same pattern:
- `[Level]Screen.tsx` - Pure UI
- `[Level]Presenter.ts` - Business logic
- Both use shared `ProblemEngine`

---

### Component 6: Shared Components Extraction

Creating reusable components used across all problem screens.

#### [NEW] [ProblemHeader.tsx](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/components/ProblemHeader.tsx)

**Purpose**: Standardized header for all problem screens

**Props**: `{ problemNumber, totalProblems, category, timeRemaining, onClose }`

---

#### [NEW] [ProgressBar.tsx](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/components/ProgressBar.tsx)

**Purpose**: Animated progress indicator

---

#### [NEW] [ResultView.tsx](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/components/ResultView.tsx)

**Purpose**: Standardized result display

**Props**: `{ isCorrect, explanation, stats, onNext, onReview }`

---

### Component 7: Custom Hooks for Shared Logic

#### [NEW] [useProblemSession.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/hooks/useProblemSession.ts)

**Purpose**: Session management hook

**Returns**: `{ currentProblem, progress, submitAnswer, nextProblem, isCompleted }`

---

#### [NEW] [useProblemTimer.ts](file:///c:/Users/wkdal/Desktop/WorkSpace/DayScript/src/modules/practice/hooks/useProblemTimer.ts)

**Purpose**: Timer logic (currently duplicated)

**Returns**: `{ timeRemaining, startTimer, pauseTimer, resetTimer }`

---

## Verification Plan

### Automated Tests

#### 1. Domain Layer Unit Tests

**Test File**: `src/domain/problems/__tests__/ProblemEngine.test.ts`

**Command**: 
```bash
npm test -- ProblemEngine.test.ts
```

**Coverage**:
- Problem loading
- Answer validation
- Score calculation
- Progress tracking

---

#### 2. Service Layer Tests

**Test File**: `src/services/__tests__/problemService.test.ts`

**Command**:
```bash
npm test -- problemService.test.ts
```

**Coverage**:
- API integration
- Business logic
- Error handling

---

#### 3. Integration Tests

**Test File**: `src/modules/practice/__tests__/integration.test.ts`

**Command**:
```bash
npm test -- integration.test.ts
```

**Coverage**:
- Complete problem flow (load → answer → result → next)
- Session completion
- Progress persistence

---

### Manual Verification

#### 1. Problem Flow Consistency

**Steps**:
1. Launch app and navigate to Practice mode
2. Start LV1 (OX) session
3. Complete 3 problems and verify:
   - Timer works consistently
   - Progress bar updates correctly
   - Hint system deducts XP
   - Result screen shows correct stats
4. Repeat for LV2, LV3, LV4, LV5
5. **Expected**: All levels should have identical UX flow

---

#### 2. LV6 New Features

**Steps**:
1. Unlock LV6 (may need to complete LV5 first)
2. Start LV6 collaborative session
3. Verify new collaborative features work
4. **Expected**: LV6 has unique features not present in LV1-5

---

#### 3. API/Service Layer Verification

**Steps**:
1. Enable network logging
2. Complete one problem in each level
3. Verify API calls go through correct endpoints
4. Check that service layer transforms data correctly
5. **Expected**: Clean separation between API calls and business logic

---

#### 4. Import Path Verification

**Steps**:
1. Search codebase for old import paths: `from '../../screens/Practice'`
2. **Expected**: Zero results (all should use new module paths)
3. Run TypeScript compiler: `npm run type-check`
4. **Expected**: No type errors

---

### Build Verification

**Command**:
```bash
npm run build
```

**Expected**: Successful build with no errors or warnings

---

### Performance Verification

**Tool**: React DevTools Profiler

**Steps**:
1. Profile problem screen rendering
2. Verify no unnecessary re-renders
3. Check that ProblemEngine doesn't cause performance regression

**Expected**: Render time < 16ms (60fps)

---

## Migration Checklist

- [ ] Create `src/domain/problems/` directory structure
- [ ] Implement ProblemEngine core
- [ ] Create `src/api/` and `src/services/` directories
- [ ] Implement API layer for all endpoints
- [ ] Implement Service layer with business logic
- [ ] Create `src/modules/` structure
- [ ] Migrate Practice module (LV1-5)
- [ ] Create LV6 module
- [ ] Migrate Community module
- [ ] Migrate User module
- [ ] Migrate Onboarding module
- [ ] Migrate Auth module
- [ ] Update all navigation imports
- [ ] Update `DOCUMENTATION_INDEX.md`
- [ ] Remove old `src/screens/` directory
- [ ] Run all tests
- [ ] Manual QA testing
- [ ] Update `FRONTEND_TODO_CHECKLIST.md`

---

## Rollback Plan

If critical issues arise during migration:

1. **Immediate**: Revert last commit
2. **Short-term**: Keep old structure in parallel until new structure is proven
3. **Long-term**: Feature flag to toggle between old/new architecture

---

## Timeline Estimate

- **Domain Layer**: 2 days
- **API/Service Layer**: 2 days
- **Module Migration**: 5 days (1 day per module)
- **Testing & QA**: 2 days
- **Documentation**: 1 day

**Total**: ~12 days (2.5 weeks)
