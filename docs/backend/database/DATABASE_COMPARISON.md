# 🗄️ 데이터베이스 선택: PostgreSQL vs MySQL vs MongoDB

## TL;DR: PostgreSQL 추천 ⭐⭐⭐⭐⭐

**DayScript 프로젝트에 가장 적합한 이유**:
1. 복잡한 쿼리 성능 우수 (학습 통계, 랭킹 시스템)
2. JSON 데이터 타입 지원 (문제 데이터, 힌트 배열)
3. 트랜잭션 안정성 (답안 제출, 포인트 계산)
4. 무료 오픈소스 + 상용 수준 기능

---

## 상세 비교

### 1. PostgreSQL ⭐⭐⭐⭐⭐

#### 장점
✅ **복잡한 쿼리 최적화**
- DayScript의 핵심: 학습 통계, 랭킹, 추천 알고리즘
- Window Functions, CTE, Recursive Query 지원
- 예: "최근 7일간 정답률 상위 10% 사용자" 같은 복잡한 쿼리 효율적

✅ **JSON/JSONB 네이티브 지원**
```sql
-- 문제 데이터 예시
CREATE TABLE problems (
  id UUID PRIMARY KEY,
  content JSONB,  -- { "title": "...", "hints": [...], "testCases": [...] }
  metadata JSONB  -- 유연한 확장 가능
);

-- JSONB 쿼리 가능
SELECT * FROM problems WHERE content->'difficulty' = '"hard"';
```

✅ **데이터 무결성**
- Foreign Key, Check Constraints 엄격
- ACID 트랜잭션 완벽 지원
- 답안 제출 시 포인트/경험치 계산 안전

✅ **확장성**
- 파티셔닝 (문제 데이터를 레벨별로 분할)
- Full-text Search (커뮤니티 게시글 검색)
- PostGIS (향후 위치 기반 기능 추가 시)

✅ **개발 경험**
- pgAdmin, DBeaver 같은 훌륭한 GUI 도구
- TypeScript와 궁합 좋음 (TypeORM, Prisma)
- 에러 메시지 명확

#### 단점
⚠️ 초기 설정 약간 복잡 (하지만 Docker로 해결)
⚠️ MySQL보다 메모리 사용 약간 많음 (큰 문제 아님)

---

### 2. MySQL ⭐⭐⭐

#### 장점
✅ 설정 간단
✅ 레퍼런스 많음
✅ 가벼움

#### 단점
❌ **JSON 지원 약함** (MySQL 5.7+에서 추가되었지만 PostgreSQL보다 기능 부족)
❌ **복잡한 쿼리 성능 떨어짐**
- Window Functions 지원 늦음 (MySQL 8.0+)
- CTE 지원 약함
❌ **트랜잭션 격리 수준** 기본 설정이 PostgreSQL보다 약함

#### DayScript에 부적합한 이유
- 학습 통계 쿼리가 복잡함 → PostgreSQL이 유리
- 문제 데이터가 JSON 구조 → PostgreSQL JSONB가 훨씬 강력

---

### 3. MongoDB ⭐⭐

#### 장점
✅ JSON 네이티브 (NoSQL)
✅ 스키마 유연

#### 단점
❌ **관계형 데이터에 부적합**
- DayScript는 관계가 많음: 사용자 ↔ 문제 ↔ 답안 ↔ 세션 ↔ 커뮤니티
- JOIN 없음 → 애플리케이션 레벨에서 처리 (비효율)

❌ **트랜잭션 복잡**
- 답안 제출 시 여러 컬렉션 업데이트 필요 (사용자 포인트, 세션 기록, 랭킹)
- MongoDB 트랜잭션은 복잡하고 성능 떨어짐

❌ **집계 쿼리 복잡**
- 학습 통계, 랭킹 계산이 어려움

---

## DayScript 요구사항 분석

### 핵심 기능별 DB 요구사항

| 기능 | PostgreSQL | MySQL | MongoDB |
|------|-----------|-------|---------|
| **복잡한 학습 통계** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **실시간 랭킹** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **JSON 문제 데이터** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **트랜잭션 안정성** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **관계형 데이터** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| **전문 검색** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **설정 난이도** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 실제 사용 예시

### PostgreSQL로 DayScript 핵심 쿼리

#### 1. 학습 통계 (복잡한 집계)
```sql
-- 최근 7일간 레벨별 정답률
WITH daily_stats AS (
  SELECT 
    DATE(created_at) as date,
    problem_level,
    COUNT(*) FILTER (WHERE is_correct) as correct_count,
    COUNT(*) as total_count
  FROM problem_attempts
  WHERE user_id = $1 
    AND created_at >= NOW() - INTERVAL '7 days'
  GROUP BY DATE(created_at), problem_level
)
SELECT 
  problem_level,
  AVG(correct_count::float / total_count * 100) as avg_accuracy
FROM daily_stats
GROUP BY problem_level;
```

#### 2. 실시간 랭킹 (Window Function)
```sql
SELECT 
  user_id,
  total_points,
  RANK() OVER (ORDER BY total_points DESC) as rank,
  PERCENT_RANK() OVER (ORDER BY total_points DESC) as percentile
FROM user_stats
WHERE updated_at >= NOW() - INTERVAL '1 day'
LIMIT 100;
```

#### 3. JSON 문제 데이터 쿼리
```sql
-- 난이도 'hard'이고 카테고리에 '배열'이 포함된 문제
SELECT * FROM problems
WHERE 
  metadata->>'difficulty' = 'hard'
  AND metadata->'categories' ? 'array';
```

---

## 최종 권장사항

### ✅ PostgreSQL 선택 이유 요약

1. **DayScript의 데이터 특성**
   - 복잡한 관계형 데이터 (사용자, 문제, 답안, 커뮤니티)
   - JSON 문제 데이터 (유연성 필요)
   - 복잡한 통계 쿼리 (학습 분석, 랭킹)

2. **성능 & 안정성**
   - 트랜잭션 안정성 (포인트 계산, 답안 제출)
   - 복잡한 쿼리 최적화
   - 확장성 (파티셔닝, 인덱싱)

3. **개발 생산성**
   - TypeScript 생태계와 궁합 (Prisma, TypeORM)
   - 풍부한 기능 (Full-text Search, JSON, Array)
   - 명확한 에러 메시지

4. **비용**
   - 완전 무료 오픈소스
   - 상용 DB 수준의 기능
   - 클라우드 호스팅 옵션 많음 (AWS RDS, Heroku, Supabase)

---

## 시작하기

### Docker로 PostgreSQL 설치 (가장 쉬움)
```bash
# docker-compose.yml 생성 후
docker-compose up -d

# 접속
psql -h localhost -U dayscript -d dayscript_db
```

### 또는 로컬 설치
- Windows: https://www.postgresql.org/download/windows/
- GUI 도구: pgAdmin, DBeaver

---

**결론**: PostgreSQL은 DayScript 프로젝트에 완벽하게 맞는 선택입니다! 🎯
