# DayScript Backend - TODO List

## 즉시 해야 할 작업

### Phase 1 완료 작업
- [ ] `npm install` 실행
- [ ] Docker Compose 실행: `docker-compose up -d`
- [ ] PostgreSQL 연결 확인: `docker exec -it dayscript_postgres psql -U dayscript -d dayscript_db`

### Phase 2 시작
- [ ] Prisma 스키마 완성
- [ ] Prisma 마이그레이션: `npx prisma migrate dev --name init`
- [ ] Prisma Client 생성: `npx prisma generate`
- [ ] 시드 데이터 작성
- [ ] 시드 실행: `npm run seed`

---

## Phase 3: API 구현

### 인증 API
- [ ] `src/config/database.ts` - Prisma 클라이언트 초기화
- [ ] `src/middleware/auth.middleware.ts` - JWT 검증 미들웨어
- [ ] `src/controllers/auth.controller.ts` - 회원가입, 로그인, 로그아웃
- [ ] `src/routes/auth.routes.ts` - 인증 라우트
- [ ] `src/utils/jwt.ts` - JWT 유틸리티 함수

### 문제 API
- [ ] `src/controllers/problems.controller.ts`
- [ ] `src/services/problems.service.ts`
- [ ] `src/routes/problems.routes.ts`
- [ ] 답안 제출 트랜잭션 로직

### 진행 상황 API
- [ ] `src/controllers/progress.controller.ts`
- [ ] `src/services/progress.service.ts`
- [ ] `src/routes/progress.routes.ts`

### 커뮤니티 API
- [ ] `src/controllers/community.controller.ts`
- [ ] `src/services/community.service.ts`
- [ ] `src/routes/community.routes.ts`

---

## Phase 4: 프론트엔드 연결

- [ ] CORS 설정 확인
- [ ] API 문서 작성 (Swagger/OpenAPI)
- [ ] 프론트엔드 API 클라이언트 수정
- [ ] Mock 데이터 제거
- [ ] 통합 테스트

---

## Phase 5: 테스트 & 배포

- [ ] Jest 설정
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 성능 테스트
- [ ] 보안 점검
- [ ] 배포 준비

---

## 참고 문서

- `BACKEND_IMPLEMENTATION_PLAN.md` - 전체 구현 계획
- `DATABASE_SCHEMA_SPECIFICATION.md` - 데이터베이스 스키마
- `backend-api-design.md` - API 설계 문서
- `docs/DATABASE_COMPARISON.md` - PostgreSQL 선택 이유
