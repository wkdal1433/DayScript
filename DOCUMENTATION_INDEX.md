# 📚 DayScript 문서 인덱스

> **최종 업데이트**: 2025-11-25  
> **목적**: 프로젝트 내 모든 문서를 체계적으로 정리하고 빠르게 찾을 수 있도록 안내

---

## 🗂️ 문서 구조

```
docs/
├── backend/                    # 백엔드 설계 문서
│   ├── database/              # 데이터베이스 설계
│   ├── api/                   # API 설계
│   ├── security/              # 보안 관련
│   └── *.md                   # 백엔드 통합 문서
├── frontend/                  # 프론트엔드 문서
│   ├── screens/               # 화면별 구현 가이드
│   └── architecture/          # 아키텍처 문서
├── project-management/        # 프로젝트 관리
│   └── planning/              # 계획 및 분석
└── guides/                    # 기타 가이드
```

---

## 1️⃣ 백엔드 설계 문서 (Backend Design)

### 📂 데이터베이스 설계 (`docs/backend/database/`)

| 문서명 | 설명 | 우선순위 |
|--------|------|----------|
| [DATABASE_SCHEMA_SPECIFICATION.md](./docs/backend/database/DATABASE_SCHEMA_SPECIFICATION.md) | **통합 데이터베이스 스키마** - PostgreSQL/MySQL 스키마, 15개 테이블, ERD, 인덱스 전략 | ⭐⭐⭐ |
| [DB_ARCHITECTURE_SUMMARY.md](./docs/backend/database/DB_ARCHITECTURE_SUMMARY.md) | 데이터베이스 아키텍처 요약 | ⭐⭐ |
| [backend_data_models.md](./docs/backend/database/backend_data_models.md) | **데이터 모델** - TypeScript 인터페이스, 엔티티 관계 | ⭐⭐ |
| [DATABASE_COMPARISON.md](./docs/backend/database/DATABASE_COMPARISON.md) | PostgreSQL vs MySQL vs MongoDB 비교 분석 | ⭐ |

### 📂 API 설계 (`docs/backend/api/`)

| 문서명 | 설명 | 우선순위 |
|--------|------|----------|
| [backend-api-design.md](./docs/backend/api/backend-api-design.md) | **REST API 설계** - 전체 엔드포인트, SQL 스키마, JWT 인증, Rate Limiting | ⭐⭐⭐ |
| [api_endpoints.md](./docs/backend/api/api_endpoints.md) | **API 엔드포인트 사양** - Request/Response 예시, 에러 코드 | ⭐⭐ |
| [answer_validation_logic.md](./docs/backend/api/answer_validation_logic.md) | **답변 검증 로직** - 타입별 검증, 부정행위 방지, 진행 상태 업데이트 | ⭐⭐ |
| [data_synchronization_strategy.md](./docs/backend/api/data_synchronization_strategy.md) | **동기화 전략** - 실시간 WebSocket, 오프라인 지원, 충돌 해결 | ⭐⭐ |
| [problem_set_management.md](./docs/backend/api/problem_set_management.md) | **문제 관리 시스템** - 적응형 문제 선택, 난이도 조정, 캐싱 전략 | ⭐⭐ |

### 📂 보안 (`docs/backend/security/`)

| 문서명 | 설명 | 우선순위 |
|--------|------|----------|
| [security_data_integrity.md](./docs/backend/security/security_data_integrity.md) | **보안 시스템** - JWT 인증, 부정행위 탐지, 암호화, 감사 로깅 | ⭐⭐⭐ |

### 📂 백엔드 통합 문서 (`docs/backend/`)

| 문서명 | 설명 | 우선순위 |
|--------|------|----------|
| [backend_integration_summary.md](./docs/backend/backend_integration_summary.md) | **통합 완료 보고서** - 전체 설계 요약, 3단계 구현 계획 | ⭐⭐ |
| [BACKEND_IMPLEMENTATION_PLAN.md](./docs/backend/BACKEND_IMPLEMENTATION_PLAN.md) | **백엔드 구현 계획** - Phase별 작업 계획, 기술 스택 | ⭐⭐⭐ |

**📌 백엔드 설계 읽는 순서 (추천)**:
1. `backend/backend_integration_summary.md` - 전체 개요 파악
2. `backend/database/DATABASE_SCHEMA_SPECIFICATION.md` - 데이터 구조 이해
3. `backend/api/backend-api-design.md` - API 설계 확인
4. 나머지 문서들 - 필요에 따라 참조

---

## 2️⃣ 프론트엔드 문서 (Frontend)

### 📂 화면 구현 가이드 (`docs/frontend/screens/`)

| 문서명 | 설명 | 상태 |
|--------|------|------|
| [Navigation-Integration.md](./docs/frontend/screens/Navigation-Integration.md) | 네비게이션 통합 가이드 | ✅ |
| [Practice-Screen-Implementation.md](./docs/frontend/screens/Practice-Screen-Implementation.md) | 연습 화면 구현 가이드 | ✅ |
| [Profile-Implementation.md](./docs/frontend/screens/Profile-Implementation.md) | 프로필 화면 구현 가이드 | ✅ |
| [QuickActions-Refactoring.md](./docs/frontend/screens/QuickActions-Refactoring.md) | QuickActions 컴포넌트 리팩토링 가이드 | ✅ |

### 📂 아키텍처 문서 (`docs/frontend/architecture/`)

| 문서명 | 설명 | 상태 |
|--------|------|------|
| [ARCHITECTURE_REPORT.md](./docs/frontend/architecture/ARCHITECTURE_REPORT.md) | **아키텍처 분석 보고서** - 프론트엔드 구조 분석 | ✅ |
| [FRONTEND_TODO_CHECKLIST.md](./docs/frontend/architecture/FRONTEND_TODO_CHECKLIST.md) | **프론트엔드 작업 체크리스트** - P0~P3 우선순위별 작업 목록 | 진행중 |
| [FRONTEND_REFACTORING_TASKS.md](./docs/frontend/architecture/FRONTEND_REFACTORING_TASKS.md) | 프론트엔드 리팩토링 작업 목록 | 진행중 |
| [FRONTEND_SOLID_REFACTORING_PLAN.md](./docs/frontend/architecture/FRONTEND_SOLID_REFACTORING_PLAN.md) | SOLID 원칙 기반 리팩토링 계획 | 계획 |

**📂 컴포넌트별 문서** (src/ 내부):
- `src/components/Modals/README.md` - 모달 컴포넌트 가이드
- `src/components/Modals/DIFFICULTY_SCALING_IMPLEMENTATION.md` - 난이도 스케일링 및 상세 사양
- `src/components/Modals/RANDOM_NAVIGATION_INTEGRATION.md` - 랜덤 네비게이션
- `src/components/Modals/DifficultySelectionModal.IMPLEMENTATION_NOTES.md` - 구현 노트
- `src/screens/Practice/README.md` - 연습 화면 가이드 (Lv1 OX)
- `src/screens/Practice/Lv2MultipleChoiceProblemScreen.md` - LV2 객관식
- `src/screens/Practice/Lv3FillInTheBlankProblemScreen.md` - LV3 빈칸 채우기
- `src/screens/Practice/Challenger/VibeSessionScreen.md` - Vibe 세션

---

## 3️⃣ 프로젝트 관리 문서 (Project Management)

### 📂 계획 및 분석 (`docs/project-management/planning/`)

| 문서명 | 설명 | 용도 |
|--------|------|------|
| [WORK_PRIORITY_ANALYSIS.md](./docs/project-management/planning/WORK_PRIORITY_ANALYSIS.md) | 작업 우선순위 분석 - 백엔드 vs 프론트엔드 | 의사결정 |
| [implementation_plan.md](./docs/project-management/planning/implementation_plan.md) | 구현 계획 - Phase별 작업 계획 | 참고 |
| [REFACTOR_SUMMARY.md](./docs/project-management/planning/REFACTOR_SUMMARY.md) | 리팩토링 요약 | 변경 이력 |
| [analysis_report.md](./docs/project-management/planning/analysis_report.md) | 분석 보고서 | 참고 |
| [DUPLICATE_ANALYSIS_REPORT.md](./docs/project-management/planning/DUPLICATE_ANALYSIS_REPORT.md) | 중복 문서 분석 보고서 | 참고 |

---

## 4️⃣ 기타 가이드 (Guides)

### 📂 가이드 (`docs/guides/`)

| 문서명 | 설명 |
|--------|------|
| [APP_ICON_UPDATE_GUIDE.md](./docs/guides/APP_ICON_UPDATE_GUIDE.md) | 앱 아이콘 업데이트 가이드 |

---

## 🔍 문서 검색 가이드

### 백엔드 관련 정보를 찾을 때
- **데이터베이스 스키마**: `docs/backend/database/DATABASE_SCHEMA_SPECIFICATION.md`
- **API 엔드포인트**: `docs/backend/api/backend-api-design.md` 또는 `api_endpoints.md`
- **보안/인증**: `docs/backend/security/security_data_integrity.md`
- **동기화**: `docs/backend/api/data_synchronization_strategy.md`
- **문제 관리**: `docs/backend/api/problem_set_management.md`

### 프론트엔드 관련 정보를 찾을 때
- **전체 작업 현황**: `docs/frontend/architecture/FRONTEND_TODO_CHECKLIST.md`
- **아키텍처**: `docs/frontend/architecture/ARCHITECTURE_REPORT.md`
- **특정 화면 구현**: `docs/frontend/screens/` 폴더 내 문서들
- **컴포넌트 구현**: `src/` 폴더 내 해당 컴포넌트 디렉토리

### 구현 계획을 세울 때
1. `docs/backend/backend_integration_summary.md` - 전체 로드맵
2. `docs/project-management/planning/implementation_plan.md` - 상세 구현 계획
3. `docs/frontend/architecture/FRONTEND_TODO_CHECKLIST.md` - 프론트엔드 작업 목록

---

## 📊 문서 통계

- **총 문서 수**: 26개 (프로젝트 문서만, node_modules 제외)
- **백엔드 문서**: 12개
  - 데이터베이스: 4개
  - API: 5개
  - 보안: 1개
  - 통합: 2개
- **프론트엔드 문서**: 8개
  - 화면: 4개
  - 아키텍처: 4개
- **프로젝트 관리**: 5개
- **가이드**: 1개

---

## � 유지보수 가이드

### 새 문서 추가 시
1. 이 인덱스 파일 업데이트
2. 적절한 카테고리 폴더에 배치
3. 크기, 설명, 우선순위 명시

### 문서 수정 시
- 상단의 "최종 업데이트" 날짜 갱신
- 중요한 변경사항은 README.md에도 반영

### 문서 삭제 시
- 인덱스에서 제거
- 다른 문서에서 참조하는 부분 확인 및 수정

---

## 🎯 빠른 시작 가이드

### 새 팀원이 합류했을 때
1. `README.md` - 프로젝트 개요
2. `docs/backend/backend_integration_summary.md` - 백엔드 전체 구조
3. `docs/frontend/architecture/ARCHITECTURE_REPORT.md` - 프론트엔드 전체 구조
4. 필요한 세부 문서 참조

### 백엔드 개발을 시작할 때
1. `docs/backend/BACKEND_IMPLEMENTATION_PLAN.md` - 구현 계획 확인
2. `docs/backend/database/DATABASE_SCHEMA_SPECIFICATION.md` - DB 스키마 이해
3. `docs/backend/api/backend-api-design.md` - API 설계 확인
4. `backend/` 폴더의 실제 코드 작업 시작

### 프론트엔드 개발을 시작할 때
1. `docs/frontend/architecture/FRONTEND_TODO_CHECKLIST.md` - 작업 목록 확인
2. `docs/frontend/architecture/ARCHITECTURE_REPORT.md` - 구조 이해
3. 해당 화면의 구현 가이드 참조 (`docs/frontend/screens/`)
4. `src/` 폴더의 실제 코드 작업 시작

---

**💡 Tip**: 이 인덱스는 프로젝트의 모든 문서를 한눈에 파악할 수 있는 지도입니다. 새로운 팀원이 합류하거나 특정 정보를 찾을 때 이 문서부터 시작하세요!
