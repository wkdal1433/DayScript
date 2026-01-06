# 🚀 DayScript 로컬 테스트 가이드

## 📋 사전 준비 체크리스트

시작하기 전에 다음 항목들이 설치되어 있는지 확인하세요:

- ✅ Docker Desktop (실행 중)
- ✅ Node.js (v20+)
- ✅ npm (또는 yarn)
- ✅ React Native CLI (선택사항, Expo 사용 시 불필요)
- ✅ Android Studio / Xcode (모바일 앱 테스트 시)

---

## 🎯 Step 1: 백엔드 서버 실행

### 1-1. PostgreSQL 시작
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript\backend
docker-compose up -d
```

**확인**:
```powershell
docker ps
# dayscript_postgres 컨테이너가 Up 상태여야 함
```

### 1-2. 백엔드 개발 서버 시작
```powershell
# 백엔드 디렉토리에서
npm run dev
```

**성공 메시지**:
```
✅ Connected to Database
🚀 Server is running on port 3000
```

### 1-3. 백엔드 Health Check
새 터미널을 열고:
```powershell
curl http://localhost:3000/health
```

**예상 응답**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T03:30:00.000Z"
}
```

---

## 📱 Step 2: 프론트엔드 앱 실행

### 2-1. 새 터미널 열기
**중요**: 백엔드 서버는 계속 실행되도록 둔 채로 새 터미널을 엽니다.

### 2-2. 프론트엔드 디렉토리로 이동
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript
```

### 2-3. Metro Bundler 시작
```powershell
npm start
# 또는
npx react-native start
```

**성공 시 나타나는 메뉴**:
```
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
```

### 2-4. 앱 실행

#### Android 에뮬레이터/기기:
```powershell
# 새 터미널에서 (Metro는 계속 실행)
npm run android
# 또는
npx react-native run-android
```

#### iOS 시뮬레이터 (Mac만 가능):
```powershell
npm run ios
# 또는
npx react-native run-ios
```

#### 웹 브라우저 (Expo 사용 시):
```powershell
npm run web
```

---

## 🔗 Step 3: API 연동 설정

### 3-1. API Base URL 설정

프론트엔드에서 백엔드 API를 호출하려면 BASE URL을 설정해야 합니다.

**파일 위치**: `src/services/api.ts` 또는 `src/config/api.ts`

#### Android 에뮬레이터 사용 시:
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

#### 실제 기기 사용 시:
```typescript
// 내 컴퓨터의 로컬 IP 주소를 사용
const API_BASE_URL = 'http://192.168.x.x:3000/api';
```

**내 IP 확인 방법**:
```powershell
ipconfig
# "IPv4 주소" 항목 확인
```

#### Expo 사용 시:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';
```

---

## 🧪 Step 4: 전체 흐름 테스트

### 테스트 시나리오 1: 회원가입 → 로그인

#### 1. 앱 실행 및 회원가입
1. 앱에서 **회원가입** 화면으로 이동
2. 정보 입력:
   - Email: `testuser@example.com`
   - Username: `testuser123`
   - Password: `password123`
3. **가입하기** 버튼 클릭

#### 2. 로그인
1. 가입한 계정으로 **로그인**
2. JWT 토큰이 저장되는지 확인

#### 3. 백엔드 로그 확인
백엔드 터미널에서 다음과 같은 로그가 보여야 합니다:
```
POST /api/auth/register 201
POST /api/auth/login 200
```

### 테스트 시나리오 2: 문제 풀기

#### 1. 레벨 선택
1. 메인 화면에서 **LV1** 선택
2. **시작하기** 버튼 클릭

#### 2. 문제 조회
- 5개의 랜덤 OX 문제가 로드되는지 확인

백엔드 로그:
```
GET /api/problems/random?level=1&count=5 200
```

#### 3. 문제 풀이
1. 첫 번째 문제 읽기
2. O 또는 X 선택
3. **제출** 버튼 클릭

백엔드 로그:
```
POST /api/problems/submit 200
```

#### 4. 결과 확인
- ✅ 정답: 축하 메시지 + 점수 표시
- ❌ 오답: 정답 및 설명 표시

### 테스트 시나리오 3: 진행 상태 확인

#### 1. 마이 페이지 이동
1. **마이 페이지** 또는 **프로필** 탭 클릭
2. 현재 레벨, 진행률 확인

백엔드 로그:
```
GET /api/progress 200
GET /api/progress/attempts 200
```

---

## 🔍 실시간 모니터링

### 백엔드 로그 (별도 터미널)
실시간으로 API 호출을 모니터링:
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript\backend
npm run dev
```

### 데이터베이스 확인 (Prisma Studio)
데이터베이스 내용을 GUI로 확인:
```powershell
# 새 터미널
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript\backend
npx prisma studio
```

브라우저에서 `http://localhost:5555` 열림 → 테이블 확인 가능

---

## 🐛 문제 해결

### 문제 1: "Network request failed"

**원인**: 프론트엔드가 백엔드 서버에 연결하지 못함

**해결 방법**:
1. 백엔드 서버가 실행 중인지 확인 (`http://localhost:3000/health`)
2. API Base URL 확인 (Android 에뮬레이터는 `10.0.2.2` 사용)
3. CORS 설정 확인 (백엔드 `app.ts`에서 `cors()` 활성화됨)

### 문제 2: "Unauthorized" 에러

**원인**: JWT 토큰이 없거나 만료됨

**해결 방법**:
1. 로그아웃 후 다시 로그인
2. AsyncStorage에서 토큰 확인
3. 토큰을 헤더에 제대로 포함시켰는지 확인:
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

### 문제 3: Docker 컨테이너가 시작되지 않음

**해결 방법**:
```powershell
# Docker 재시작
docker-compose down
docker-compose up -d

# 로그 확인
docker logs dayscript_postgres
```

### 문제 4: Metro bundler 에러

**해결 방법**:
```powershell
# 캐시 삭제 후 재시작
npm start -- --reset-cache
```

---

## 📊 테스트 체크리스트

작업 전 모든 항목을 체크하세요:

### 백엔드
- [ ] Docker Desktop 실행 중
- [ ] PostgreSQL 컨테이너 Up
- [ ] 백엔드 서버 실행 (`npm run dev`)
- [ ] Health check 성공 (`http://localhost:3000/health`)

### 프론트엔드
- [ ] Metro bundler 실행 중
- [ ] 앱이 에뮬레이터/기기에서 실행 중
- [ ] API Base URL 올바르게 설정

### 연동 테스트
- [ ] 회원가입 성공
- [ ] 로그인 성공
- [ ] 문제 조회 성공
- [ ] 답안 제출 성공
- [ ] 진행 상태 조회 성공

---

## 🎯 빠른 시작 명령어 모음

### 터미널 1: 백엔드
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript\backend
docker-compose up -d
npm run dev
```

### 터미널 2: 프론트엔드
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript
npm start
```

### 터미널 3: Android 앱 실행 (Metro 실행 후)
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript
npm run android
```

### 터미널 4 (선택): Prisma Studio
```powershell
cd C:\Users\wkdal\Desktop\WorkSpace\DayScript\backend
npx prisma studio
```

---

## 🔥 Hot Reload 활용

### 백엔드
- 파일 수정 시 **자동 재시작** (nodemon)
- 저장만 하면 즉시 반영

### 프론트엔드
- Metro bundler의 **Fast Refresh** 활용
- 파일 수정 시 앱이 자동으로 새로고침
- 에뮬레이터에서 `R` 키: 수동 리로드
- 에뮬레이터에서 `Ctrl+M` (Android) / `Cmd+D` (iOS): 개발자 메뉴

---

## 🎉 성공 확인

모든 것이 정상 작동하면:

1. ✅ 백엔드 로그에서 API 요청 확인
2. ✅ 프론트엔드에서 데이터 정상 표시
3. ✅ Prisma Studio에서 DB 데이터 확인
4. ✅ 사용자 흐름이 끊김 없이 작동

**축하합니다! 🎊 전체 시스템이 정상 작동하고 있습니다!**
