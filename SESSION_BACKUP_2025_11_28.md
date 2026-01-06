# 💾 DayScript 백엔드 작업 세션 백업 (2025-11-28)

> **목적**: Docker 재설치를 위한 시스템 재부팅 전 작업 상태 저장
> **상태**: Phase 1 진행 중 (Prisma 마이그레이션 단계에서 Docker 연결 실패로 중단)

---

## 📅 작업 진행 상황

### 1. 완료된 작업
- [x] **서버 기본 구조 생성**
    - `src/server.ts`: 서버 진입점 (DB 연결 및 서버 실행)
    - `src/app.ts`: Express 앱 설정 (미들웨어, 라우트)
    - `src/config/database.ts`: Prisma 클라이언트 인스턴스
- [x] **데이터베이스 설정**
    - `prisma/schema.prisma`: 스키마 관계 오류 수정 (ProblemAttempt <-> MistakeNote, PostVote)
    - `prisma/seed.ts`: 초기 데이터 시딩 스크립트 작성
- [x] **패키지 관리**
    - `npm install` 완료 (Prisma 버전 호환성 문제 해결 시도)

### 2. 중단된 작업 (재개 필요)
- [ ] **Docker 실행 및 DB 구동**
    - Docker Desktop 실행 필요
    - `docker-compose up -d` 명령어로 PostgreSQL 컨테이너 실행
- [ ] **Prisma 마이그레이션**
    - `npm run prisma:migrate -- --name init` 실행하여 DB 테이블 생성
- [ ] **시드 데이터 주입**
    - `npm run seed` 실행

---

## 📝 수정된 파일 목록

### `backend/src/server.ts`
```typescript
import app from './app';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
// ... (DB 연결 및 서버 실행 로직)
```

### `backend/src/app.ts`
```typescript
import express from 'express';
// ... (미들웨어 설정)
```

### `backend/prisma/schema.prisma`
- `ProblemAttempt`와 `MistakeNote` 간의 관계 명시 (`@relation("FirstAttempt")`, `@relation("LastAttempt")`)
- `PostVote` 모델의 다형성 관계(Polymorphic Association) 제거 및 명시적 FK(`postId`, `commentId`)로 변경

---

## 🚀 재개 가이드 (Docker 설치 후)

1. **Docker Desktop 실행**
2. **PostgreSQL 컨테이너 실행**
   ```bash
   cd backend
   docker-compose up -d
   ```
3. **마이그레이션 재시도**
   ```bash
   npm run prisma:migrate -- --name init
   ```
4. **시드 데이터 주입**
   ```bash
   npm run seed
   ```
5. **서버 실행 테스트**
   ```bash
   npm run dev
   ```

---

**⚠️ 주의사항**: 이 파일은 작업 재개 후 삭제해주세요.
