# SOLID Architecture Refactoring - Task Breakdown

## Overview
Comprehensive refactoring to achieve 100% SOLID compliance based on detailed feedback.

---

## Phase 1: Domain Layer Creation (2 days)

### Problem Engine Core
- [ ] Create `src/domain/problems/` directory structure
- [ ] Implement `ProblemTypes.ts` - Unified type definitions
- [ ] Implement `ProblemEngine.ts` - Core problem lifecycle management
- [ ] Implement `ProblemValidator.ts` - Answer validation for each type
- [ ] Implement `ProblemHintEngine.ts` - Centralized hint system
- [ ] Implement `ProblemProgressManager.ts` - Session progress tracking
- [ ] Write unit tests for ProblemEngine
- [ ] Write unit tests for ProblemValidator

---

## Phase 2: API & Service Layer Separation (2 days)

### API Layer (I/O Operations)
- [ ] Create `src/api/` directory
- [ ] Implement `onboardingApi.ts` - Onboarding HTTP calls
- [ ] Implement `progressApi.ts` - Learning progress endpoints
- [ ] Implement `problemsApi.ts` - Problem CRUD operations
- [ ] Implement `communityApi.ts` - Community features API
- [ ] Implement `userApi.ts` - User profile endpoints

### Service Layer (Business Logic)
- [ ] Create `src/services/` directory
- [ ] Implement `onboardingService.ts` - Onboarding flow logic
- [ ] Implement `problemService.ts` - Problem selection & scoring
- [ ] Implement `communityService.ts` - Post filtering & voting logic
- [ ] Implement `userService.ts` - Profile management logic
- [ ] Write integration tests for services

---

## Phase 3: Module-based Structure Migration (5 days)

### Day 1: Practice Module
- [ ] Create `src/modules/practice/` structure
- [ ] Create shared components:
  - [ ] `ProblemHeader.tsx`
  - [ ] `ProgressBar.tsx`
  - [ ] `ResultView.tsx`
- [ ] Create shared hooks:
  - [ ] `useProblemSession.ts`
  - [ ] `useProblemTimer.ts`

### Day 2: LV1 & LV2 Migration
- [ ] Migrate LV1 OX Problem
  - [ ] Create `modules/practice/screens/LV1/OXScreen.tsx`
  - [ ] Create `modules/practice/screens/LV1/OXPresenter.ts`
  - [ ] Integrate with ProblemEngine
  - [ ] Remove duplicated logic
- [ ] Migrate LV2 Multiple Choice
  - [ ] Create `modules/practice/screens/LV2/MultipleChoiceScreen.tsx`
  - [ ] Create `modules/practice/screens/LV2/MultipleChoicePresenter.ts`
  - [ ] Integrate with ProblemEngine

### Day 3: LV3 & LV4 Migration
- [ ] Migrate LV3 Fill Blank
  - [ ] Create `modules/practice/screens/LV3/FillBlankScreen.tsx`
  - [ ] Create `modules/practice/screens/LV3/FillBlankPresenter.ts`
  - [ ] Integrate with ProblemEngine
- [ ] Migrate LV4 Debugging
  - [ ] Create `modules/practice/screens/LV4/DebuggerScreen.tsx`
  - [ ] Create `modules/practice/screens/LV4/DebuggerPresenter.ts`
  - [ ] Integrate with ProblemEngine

### Day 4: LV5 Refactor & LV6 Creation
- [ ] Refactor LV5 Expert Mode
  - [ ] Remove collaborative features from LV5
  - [ ] Create `modules/practice/screens/LV5/ExpertScreen.tsx`
  - [ ] Create `modules/practice/screens/LV5/ExpertPresenter.ts`
  - [ ] Align with LV1-4 structure
- [ ] Create LV6 Collaborative Mode
  - [ ] Create `modules/practice/screens/LV6/CollaborativeScreen.tsx`
  - [ ] Create `modules/practice/screens/LV6/CollaborativePresenter.ts`
  - [ ] Implement collaborative features
  - [ ] **Decision needed**: User progress migration strategy

### Day 5: Other Modules
- [ ] Migrate Community Module
  - [ ] Create `src/modules/community/` structure
  - [ ] Move screens: `CommunityHomeScreen`, `PostDetailScreen`, `CreatePostScreen`
  - [ ] Move components: `PostCard`, `CommentSection`
  - [ ] Create `useCommunityData.ts` hook
- [ ] Migrate User Module
  - [ ] Create `src/modules/user/` structure
  - [ ] Move screens: `ProfileScreen`, `SettingsScreen`
  - [ ] Move components: `UserSummaryHeader`, `LearningInsights`
  - [ ] Create `useUserProfile.ts` hook
- [ ] Migrate Onboarding Module
  - [ ] Create `src/modules/onboarding/` structure
  - [ ] Move all onboarding screens
  - [ ] Move onboarding components
- [ ] Migrate Auth Module
  - [ ] Create `src/modules/auth/` structure
  - [ ] Move login/signup screens
  - [ ] Create `useAuth.ts` hook

---

## Phase 4: Navigation & Import Updates (1 day)

- [ ] Update `src/navigation/AppNavigator.tsx`
  - [ ] Update all screen imports to new module paths
  - [ ] Add LV6 route
  - [ ] Verify all routes work
- [ ] Global import path update
  - [ ] Search and replace old import paths
  - [ ] Fix all TypeScript errors
  - [ ] Run `npm run type-check`

---

## Phase 5: Testing & Verification (2 days)

### Automated Tests
- [ ] Run all unit tests: `npm test`
- [ ] Run integration tests
- [ ] Verify test coverage > 80%
- [ ] Fix any failing tests

### Manual QA
- [ ] Test LV1 (OX) complete flow
- [ ] Test LV2 (Multiple Choice) complete flow
- [ ] Test LV3 (Fill Blank) complete flow
- [ ] Test LV4 (Debugging) complete flow
- [ ] Test LV5 (Expert) complete flow
- [ ] Test LV6 (Collaborative) complete flow
- [ ] Verify timer consistency across all levels
- [ ] Verify progress bar consistency
- [ ] Verify hint system consistency
- [ ] Test Community features
- [ ] Test User profile features
- [ ] Test Onboarding flow

### Build Verification
- [ ] Run `npm run build`
- [ ] Verify no build errors
- [ ] Check bundle size (should not increase significantly)

### Performance Testing
- [ ] Profile problem screen rendering with React DevTools
- [ ] Verify render time < 16ms (60fps)
- [ ] Check for memory leaks

---

## Phase 6: Cleanup & Documentation (1 day)

- [ ] Remove old `src/screens/` directory
- [ ] Update `DOCUMENTATION_INDEX.md`
  - [ ] Add new architecture documentation
  - [ ] Update file paths
  - [ ] Add domain layer explanation
- [ ] Update `FRONTEND_TODO_CHECKLIST.md`
  - [ ] Mark completed items
  - [ ] Add new items if needed
- [ ] Create architecture diagram
- [ ] Write migration guide for future developers
- [ ] Update README.md with new structure

---

## Critical Decisions Needed

> **User Input Required**

1. **LV5 User Progress Migration**
   - Option A: Keep existing LV5 progress, migrate to new LV5
   - Option B: Migrate existing LV5 progress to new LV6
   - Option C: Reset all LV5 progress (not recommended)

2. **Breaking Changes Approval**
   - Confirm folder structure reorganization
   - Confirm import path changes across entire codebase

---

## Risk Mitigation

- [ ] Create feature branch: `refactor/solid-architecture`
- [ ] Keep old structure in parallel during migration
- [ ] Implement feature flag for gradual rollout
- [ ] Prepare rollback plan

---

## Success Criteria

- ✅ All problem screens (LV1-6) use ProblemEngine
- ✅ Zero duplicated timer/progress/hint logic
- ✅ Clear module boundaries (practice/community/user/onboarding/auth)
- ✅ API and Service layers properly separated
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ Build successful
- ✅ Performance maintained (no regression)
- ✅ Documentation updated

---

## Timeline

**Total Estimate**: 12 days (2.5 weeks)

- Phase 1: Days 1-2
- Phase 2: Days 3-4
- Phase 3: Days 5-9
- Phase 4: Day 10
- Phase 5: Days 11-12
- Phase 6: Day 12 (parallel with Phase 5)

**Start Date**: TBD (after user approval)
**Target Completion**: TBD
