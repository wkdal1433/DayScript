# 🚀 DayScript 백엔드 구현 계획

> **목적**: 프론트엔드와 연결 가능한 실제 작동하는 백엔드 API 구축  
> **기술 스택**: Node.js + Express + PostgreSQL + TypeScript  
> **예상 기간**: 2-3주

---

## 📋 Phase 1: 프로젝트 초기 설정 (1-2일)

### 1.1 백엔드 프로젝트 구조 생성
```
DayScript/
  backend/
    src/
      config/          # 설정 파일
      controllers/     # API 컨트롤러
      models/          # 데이터 모델 (Prisma/TypeORM)
      routes/          # API 라우트
      services/        # 비즈니스 로직
      middleware/      # 인증, 에러 핸들링
      utils/           # 유틸리티 함수
      types/           # TypeScript 타입
    prisma/            # Prisma 스키마
      schema.prisma
      migrations/
    tests/             # 테스트 파일
    .env.example
    package.json
    tsconfig.json
    docker-compose.yml
```

### 1.2 필수 패키지 설치
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

### 1.3 PostgreSQL 설정 (Docker)
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dayscript
      POSTGRES_PASSWORD: dev_password_123
      POSTGRES_DB: dayscript_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📋 Phase 2: 데이터베이스 스키마 구현 (2-3일)

### 2.1 Prisma 스키마 작성
기존 `DATABASE_SCHEMA_SPECIFICATION.md` 기반으로 Prisma 스키마 생성

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  username      String   @unique
  passwordHash  String
  displayName   String?
  avatarUrl     String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  progress      LearningProgress?
  sessions      PracticeSessions[]
  attempts      ProblemAttempts[]
  posts         CommunityPosts[]
  comments      Comments[]
  
  @@map("users")
}

model Problem {
  id            String   @id @default(uuid())
  level         Int      // 1-6
  type          String   // 'OX', 'MultipleChoice', 'FillBlank', 'Debugging', 'Expert'
  title         String
  description   String
  content       Json     // 문제 내용 (JSON)
  correctAnswer Json     // 정답 (JSON)
  hints         Json[]   // 힌트 배열
  difficulty    String   // 'easy', 'medium', 'hard'
  category      String
  tags          String[]
  createdAt     DateTime @default(now())
  
  // Relations
  attempts      ProblemAttempts[]
  
  @@index([level, difficulty])
  @@map("problems")
}

model ProblemAttempts {
  id            String   @id @default(uuid())
  userId        String
  problemId     String
  isCorrect     Boolean
  userAnswer    Json
  timeTaken     Int      // seconds
  hintsUsed     Int
  xpEarned      Int
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  problem       Problem  @relation(fields: [problemId], references: [id])
  
  @@index([userId, createdAt])
  @@map("problem_attempts")
}

// ... 나머지 모델들
```

### 2.2 마이그레이션 실행
```bash
# Prisma 초기화
npx prisma init

# 마이그레이션 생성
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate
```

### 2.3 시드 데이터 삽입
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // LV1 OX 문제 샘플
  await prisma.problem.createMany({
    data: [
      {
        level: 1,
        type: 'OX',
        title: 'JavaScript는 객체 지향 언어이다',
        description: '참/거짓을 판단하세요',
        content: { /* ... */ },
        correctAnswer: { answer: 'O' },
        hints: [
          { title: '힌트 1', content: '...' },
          { title: '힌트 2', content: '...' }
        ],
        difficulty: 'easy',
        category: '기본 개념',
        tags: ['JavaScript', 'OOP']
      },
      // ... 더 많은 문제들
    ]
  });
}

main();
```

---

## 📋 Phase 3: 핵심 API 구현 (5-7일)

### 3.1 인증 시스템 (1-2일)

#### API 엔드포인트
```typescript
// src/routes/auth.routes.ts
POST   /api/auth/register      # 회원가입
POST   /api/auth/login         # 로그인
POST   /api/auth/logout        # 로그아웃
GET    /api/auth/me            # 현재 사용자 정보
POST   /api/auth/refresh       # 토큰 갱신
```

#### 구현 예시
```typescript
// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  
  // 비밀번호 해싱
  const passwordHash = await bcrypt.hash(password, 10);
  
  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      progress: {
        create: {
          currentLevel: 1,
          totalXp: 0,
          streak: 0
        }
      }
    }
  });
  
  // JWT 토큰 생성
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
  
  res.json({ user, token });
};
```

### 3.2 문제 관리 API (2-3일)

#### API 엔드포인트
```typescript
GET    /api/problems?level=1&limit=10    # 문제 목록 조회
GET    /api/problems/:id                 # 문제 상세 조회
POST   /api/problems/:id/submit          # 답안 제출
GET    /api/problems/random?level=1      # 랜덤 문제
```

#### 답안 제출 로직
```typescript
// src/controllers/problems.controller.ts
export const submitAnswer = async (req: Request, res: Response) => {
  const { problemId } = req.params;
  const { answer, timeTaken, hintsUsed } = req.body;
  const userId = req.user.id; // JWT 미들웨어에서 추출
  
  // 트랜잭션으로 안전하게 처리
  const result = await prisma.$transaction(async (tx) => {
    // 1. 문제 조회
    const problem = await tx.problem.findUnique({
      where: { id: problemId }
    });
    
    // 2. 정답 확인
    const isCorrect = validateAnswer(problem.correctAnswer, answer);
    
    // 3. XP 계산
    const baseXp = problem.difficulty === 'easy' ? 10 : 
                   problem.difficulty === 'medium' ? 20 : 30;
    const hintPenalty = hintsUsed * 5;
    const xpEarned = isCorrect ? Math.max(baseXp - hintPenalty, 0) : 0;
    
    // 4. 답안 기록 저장
    const attempt = await tx.problemAttempts.create({
      data: {
        userId,
        problemId,
        isCorrect,
        userAnswer: answer,
        timeTaken,
        hintsUsed,
        xpEarned
      }
    });
    
    // 5. 사용자 진행 상황 업데이트
    if (isCorrect) {
      await tx.learningProgress.update({
        where: { userId },
        data: {
          totalXp: { increment: xpEarned },
          problemsSolved: { increment: 1 }
        }
      });
    }
    
    return { attempt, isCorrect, xpEarned };
  });
  
  res.json(result);
};
```

### 3.3 학습 진행 상황 API (1-2일)

```typescript
GET    /api/progress              # 전체 진행 상황
GET    /api/progress/stats        # 통계
GET    /api/sessions              # 세션 목록
POST   /api/sessions              # 새 세션 시작
PATCH  /api/sessions/:id          # 세션 업데이트
```

### 3.4 커뮤니티 API (2일)

```typescript
GET    /api/posts                 # 게시글 목록
POST   /api/posts                 # 게시글 작성
GET    /api/posts/:id             # 게시글 상세
POST   /api/posts/:id/comments    # 댓글 작성
POST   /api/posts/:id/vote        # 좋아요/싫어요
```

---

## 📋 Phase 4: 프론트엔드 연결 (2-3일)

### 4.1 CORS 설정
```typescript
// src/app.ts
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:8081', // React Native 개발 서버
  credentials: true
}));
```

### 4.2 프론트엔드 API 클라이언트 수정
```typescript
// frontend/src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 인증 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4.3 Mock 데이터 → 실제 API 교체
```typescript
// Before (Mock)
const problems = MOCK_PROBLEMS;

// After (Real API)
const { data: problems } = await apiClient.get('/problems?level=1');
```

---

## 📋 Phase 5: 테스트 & 최적화 (2-3일)

### 5.1 단위 테스트
```typescript
// tests/controllers/auth.test.ts
describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.user).toBeDefined();
    expect(response.body.token).toBeDefined();
  });
});
```

### 5.2 성능 최적화
- 데이터베이스 인덱스 추가
- 쿼리 최적화 (N+1 문제 해결)
- Redis 캐싱 (랭킹, 문제 데이터)

---

## 🔄 Claude AI 인계 가이드

### 작업 진행 상황 기록 위치
- `backend/PROGRESS.md` - 각 Phase별 완료 상태
- `backend/TODO.md` - 남은 작업 체크리스트
- `backend/ISSUES.md` - 발생한 문제 및 해결 방법

### 인계 시 전달 사항
1. 완료된 Phase 번호
2. 현재 작업 중인 파일 목록
3. 발생한 에러 및 해결 방법
4. 다음 작업자가 알아야 할 중요 사항

---

## 📊 진행 상황 체크리스트

### Phase 1: 초기 설정
- [ ] 백엔드 프로젝트 구조 생성
- [ ] package.json 설정
- [ ] TypeScript 설정
- [ ] Docker Compose 설정
- [ ] PostgreSQL 실행 확인

### Phase 2: 데이터베이스
- [ ] Prisma 스키마 작성
- [ ] 마이그레이션 실행
- [ ] 시드 데이터 삽입
- [ ] 데이터베이스 연결 테스트

### Phase 3: API 구현
- [ ] 인증 API (회원가입, 로그인)
- [ ] 문제 조회 API
- [ ] 답안 제출 API
- [ ] 진행 상황 API
- [ ] 커뮤니티 API

### Phase 4: 프론트 연결
- [ ] CORS 설정
- [ ] 프론트엔드 API 클라이언트 수정
- [ ] Mock 데이터 제거
- [ ] 통합 테스트

### Phase 5: 테스트
- [ ] 단위 테스트 작성
- [ ] 통합 테스트
- [ ] 성능 테스트
- [ ] 보안 점검

---

**다음 단계**: Phase 1부터 시작합니다! 🚀
