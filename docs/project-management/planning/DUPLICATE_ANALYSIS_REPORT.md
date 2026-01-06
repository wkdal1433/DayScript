# 📋 중복 내용 분석 보고서

> **분석 일자**: 2025-11-20  
> **목적**: MD 파일 간 중복 내용 식별 및 통합 권장사항 제시

---

## 🔍 분석 결과

### 1. backend-api-design.md vs api_endpoints.md

**분석 대상**:
- `backend-api-design.md` (32KB, 1059줄)
- `api_endpoints.md` (8KB, 375줄)

**중복 내용**:
✅ **상당한 중복 발견** - API 엔드포인트 정의가 두 파일에 모두 존재

#### 중복되는 섹션:
1. **사용자 진행 상태 관리 API**
   - `GET /api/users/{userId}/progression`
   - `POST /api/users/{userId}/progression/complete-level`
   - `PUT /api/users/{userId}/progression`

2. **테스트 세션 관리 API**
   - `POST /api/sessions`
   - `GET /api/sessions/{sessionId}`
   - `POST /api/sessions/{sessionId}/submit-answer`
   - `POST /api/sessions/{sessionId}/complete`

3. **문제 관리 API**
   - `GET /api/problems`
   - `GET /api/problems/random`

4. **통계 API**
   - `GET /api/users/{userId}/statistics`

#### 차이점:
- **backend-api-design.md**: 
  - SQL 스키마 포함 (섹션 1)
  - 보안 구현 코드 (Java) 포함 (섹션 3)
  - 데이터 검증 코드 포함
  - 더 상세한 설명과 구현 예제

- **api_endpoints.md**:
  - API 엔드포인트만 집중
  - TypeScript 타입 정의 사용
  - 더 간결하고 참조하기 쉬움
  - 에러 코드 및 보안 고려사항 요약

**권장사항**: ⚠️ **부분 통합**
- `api_endpoints.md`를 **Quick Reference**로 유지
- `backend-api-design.md`를 **상세 설계 문서**로 유지
- `api_endpoints.md` 상단에 다음 안내 추가:
  > "이 문서는 API 빠른 참조용입니다. 상세한 구현 사항은 [backend-api-design.md](./backend-api-design.md)를 참조하세요."

---

### 2. backend_data_models.md vs DATABASE_SCHEMA_SPECIFICATION.md

**분석 대상**:
- `backend_data_models.md` (4KB, 186줄)
- `DATABASE_SCHEMA_SPECIFICATION.md` (37KB, 1137줄)

**중복 내용**:
✅ **일부 중복 발견** - 데이터 모델 정의

#### 중복되는 내용:
1. **User 엔티티 정의**
2. **UserProgression 구조**
3. **TestSession 인터페이스**

#### 차이점:
- **backend_data_models.md**:
  - TypeScript 인터페이스 중심
  - 프론트엔드 호환성 강조
  - 간결한 엔티티 관계 설명

- **DATABASE_SCHEMA_SPECIFICATION.md**:
  - SQL 스키마 중심
  - 15개 테이블 전체 정의
  - 인덱스, 제약조건, ERD 포함
  - 훨씬 더 포괄적

**권장사항**: ✅ **현재 상태 유지**
- 두 문서는 서로 다른 목적을 가짐
- `backend_data_models.md`: 프론트엔드 개발자용 TypeScript 참조
- `DATABASE_SCHEMA_SPECIFICATION.md`: 백엔드 개발자용 DB 설계서
- 상호 참조 링크만 추가

---

### 3. 기타 검토 파일

#### src/components/Modals/ 내 문서들
**분석 대상**:
- `DIFFICULTY_SCALING_IMPLEMENTATION.md`
- `RANDOM_NAVIGATION_INTEGRATION.md`
- `SCALING_SUMMARY.md`
- `DifficultySelectionModal.IMPLEMENTATION_NOTES.md`
- `README.md`

**결과**: ⚠️ **검토 필요**
- 내용이 겹칠 가능성 있음
- 다음 세션에서 상세 분석 예정

---

## 📊 통합 우선순위

| 우선순위 | 파일 쌍 | 작업 | 예상 시간 |
|---------|--------|------|----------|
| P1 | SCALING_SUMMARY.md | 삭제 후 내용을 DIFFICULTY_SCALING_IMPLEMENTATION.md에 통합 | 10분 |
| P2 | api_endpoints.md | ✅ 상호 참조 링크 추가 완료 | - |
| P3 | backend_data_models.md | ✅ 상호 참조 링크 추가 완료 | - |
| P4 | Practice 화면 문서들 | 공통 템플릿 문서 생성 (선택사항) | 15분 |

---

## ✅ 즉시 실행 가능한 개선사항

### 1. api_endpoints.md 업데이트
파일 상단에 다음 섹션 추가:
```markdown
> **📖 관련 문서**  
> - 상세 구현: [backend-api-design.md](./backend-api-design.md)  
> - 데이터베이스: [DATABASE_SCHEMA_SPECIFICATION.md](./DATABASE_SCHEMA_SPECIFICATION.md)  
> - 보안: [security_data_integrity.md](./security_data_integrity.md)
```

### 2. backend_data_models.md 업데이트
파일 상단에 다음 섹션 추가:
```markdown
> **📖 관련 문서**  
> - SQL 스키마: [DATABASE_SCHEMA_SPECIFICATION.md](./DATABASE_SCHEMA_SPECIFICATION.md)  
> - API 설계: [backend-api-design.md](./backend-api-design.md)
```

---

## 🎯 다음 단계

1. ✅ **Phase 1 완료**: 주요 백엔드 문서 중복 분석 완료
2. ⏭️ **Phase 2**: 프론트엔드 문서 중복 분석
3. ⏭️ **Phase 3**: Modals 및 Practice 화면 문서 통합
4. ⏭️ **Phase 4**: 최종 정리 및 인덱스 업데이트

---

**💡 결론**: 대부분의 "중복"은 실제로는 서로 다른 관점(Quick Reference vs 상세 설계)을 제공하므로, 완전 통합보다는 **상호 참조 강화**가 더 적절합니다.
