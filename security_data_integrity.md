# 보안 및 데이터 무결성 고려사항

## 1. 인증 및 권한 관리

### JWT 기반 인증 시스템
```typescript
interface SecurityLayer {
  authentication: {
    method: 'JWT';
    tokenLifetime: '15min'; // Access Token
    refreshTokenLifetime: '7days';
    tokenRotation: true;
    multiDeviceSupport: true;
  };

  authorization: {
    rbac: boolean; // Role-Based Access Control
    levelBasedAccess: boolean; // 레벨별 접근 제어
    sessionValidation: boolean; // 세션 권한 검증
  };

  encryption: {
    dataAtRest: 'AES-256-GCM';
    dataInTransit: 'TLS 1.3';
    sensitiveFields: string[]; // 민감 데이터 필드
  };
}

class AuthenticationManager {
  async authenticateUser(credentials: UserCredentials): Promise<AuthResult> {
    // 1. 자격 증명 검증
    const user = await this.validateCredentials(credentials);

    // 2. 계정 상태 확인
    this.validateAccountStatus(user);

    // 3. 토큰 생성
    const tokens = await this.generateTokens(user);

    // 4. 세션 생성
    const session = await this.createUserSession(user, tokens);

    // 5. 보안 로그 기록
    await this.logSecurityEvent('USER_LOGIN', user.id, {
      ip: credentials.clientIP,
      userAgent: credentials.userAgent,
      timestamp: new Date()
    });

    return {
      user: this.sanitizeUserData(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      sessionId: session.id
    };
  }

  async validateSessionAccess(
    sessionId: string,
    userId: string,
    levelId: LevelId
  ): Promise<boolean> {
    // 1. 세션 유효성 검증
    const session = await this.getActiveSession(sessionId);
    if (!session || session.userId !== userId) {
      throw new UnauthorizedError('Invalid session');
    }

    // 2. 레벨 접근 권한 확인
    const progression = await this.getUserProgression(userId);
    if (!progression.unlockedLevels.includes(levelId)) {
      throw new ForbiddenError('Level not unlocked');
    }

    // 3. 시간 기반 검증
    if (this.isSessionExpired(session)) {
      throw new SessionExpiredError('Session expired');
    }

    return true;
  }
}
```

### 레벨 기반 접근 제어
```typescript
interface AccessControl {
  permissions: {
    [levelId in LevelId]: {
      read: boolean;
      attempt: boolean;
      view_solutions: boolean;
      reset_progress: boolean;
    };
  };

  conditions: {
    sequential_unlock: boolean; // 순차적 해제 필수
    attempt_limits: { [levelId: string]: number };
    time_restrictions: { [levelId: string]: TimeRestriction };
  };
}

class LevelAccessController {
  async checkLevelAccess(
    userId: string,
    levelId: LevelId,
    action: AccessAction
  ): Promise<AccessResult> {
    // 1. 기본 권한 확인
    const baseAccess = await this.checkBasePermissions(userId, levelId);

    // 2. 조건부 접근 확인
    const conditionalAccess = await this.checkConditionalAccess(
      userId,
      levelId,
      action
    );

    // 3. 시도 제한 확인
    const attemptLimit = await this.checkAttemptLimits(userId, levelId);

    // 4. 시간 제한 확인
    const timeRestriction = await this.checkTimeRestrictions(userId, levelId);

    // 5. 종합 결과 반환
    return {
      allowed: baseAccess && conditionalAccess && attemptLimit && timeRestriction,
      restrictions: {
        attemptsRemaining: attemptLimit.remaining,
        nextAvailableTime: timeRestriction.nextAvailable,
        unlockCondition: this.getUnlockCondition(levelId)
      }
    };
  }

  private async checkConditionalAccess(
    userId: string,
    levelId: LevelId,
    action: AccessAction
  ): Promise<boolean> {
    // 순차적 해제 검증
    if (this.config.sequential_unlock) {
      const progression = await this.getUserProgression(userId);
      const levelIndex = LEVEL_ORDER.indexOf(levelId);

      // 이전 레벨 완료 확인
      if (levelIndex > 0) {
        const previousLevel = LEVEL_ORDER[levelIndex - 1];
        if (!progression.completedLevels.includes(previousLevel)) {
          return false;
        }
      }
    }

    return true;
  }
}
```

## 2. 답안 검증 보안

### 서버 측 검증 시스템
```typescript
interface AnswerSecurityValidation {
  // 클라이언트 데이터 무시
  ignoreClientData: {
    correctAnswers: boolean; // 클라이언트 정답 정보 무시
    problemSolutions: boolean; // 문제 해답 무시
    scoreCalculations: boolean; // 점수 계산 무시
  };

  // 타이밍 검증
  timingValidation: {
    minimumTimePerProblem: number;
    maximumTimePerProblem: number;
    sequentialTimeValidation: boolean;
  };

  // 패턴 분석
  patternAnalysis: {
    suspiciousAccuracy: number; // 의심스러운 정확도 임계치
    rapidSubmissions: number; // 빠른 제출 임계치
    identicalTimings: boolean; // 동일한 시간 패턴 감지
  };
}

class SecureAnswerValidator {
  async validateAnswerSubmission(
    submission: AnswerSubmission,
    session: TestSession
  ): Promise<SecureValidationResult> {
    // 1. 기본 보안 검증
    await this.performSecurityChecks(submission, session);

    // 2. 서버 측 정답 조회 (클라이언트 데이터 무시)
    const problem = await this.getServerProblem(submission.problemId);

    // 3. 독립적 답안 검증
    const validationResult = await this.performServerValidation(
      problem,
      submission.userAnswer
    );

    // 4. 타이밍 분석
    const timingAnalysis = await this.analyzeSubmissionTiming(
      submission,
      session
    );

    // 5. 패턴 분석
    const patternAnalysis = await this.analyzeSubmissionPattern(
      submission,
      session
    );

    // 6. 위험도 평가
    const riskScore = this.calculateRiskScore({
      timingAnalysis,
      patternAnalysis,
      submission
    });

    // 7. 보안 조치 적용
    if (riskScore > SECURITY_THRESHOLD) {
      await this.applySecurity Measures(submission, session, riskScore);
    }

    return {
      ...validationResult,
      securityAnalysis: {
        riskScore,
        timingAnalysis,
        patternAnalysis,
        actionsTaken: this.getSecurityActions(riskScore)
      }
    };
  }

  private async performSecurityChecks(
    submission: AnswerSubmission,
    session: TestSession
  ): Promise<void> {
    // 1. 세션 무결성 확인
    if (submission.sessionId !== session.id) {
      throw new SecurityViolationError('Session ID mismatch');
    }

    // 2. 사용자 권한 확인
    if (submission.userId !== session.userId) {
      throw new SecurityViolationError('User ID mismatch');
    }

    // 3. 문제 순서 확인
    const expectedProblemIndex = session.currentProblemIndex;
    const actualProblemIndex = session.problems.findIndex(
      p => p.id === submission.problemId
    );

    if (actualProblemIndex !== expectedProblemIndex) {
      throw new SecurityViolationError('Problem sequence violation');
    }

    // 4. 중복 제출 확인
    const existingAnswer = await this.findExistingAnswer(
      session.id,
      submission.problemId
    );

    if (existingAnswer) {
      throw new SecurityViolationError('Duplicate submission detected');
    }

    // 5. 시간 범위 확인
    const submissionTime = new Date(submission.timestamp);
    const sessionStartTime = new Date(session.startTime);
    const maxSessionTime = sessionStartTime.getTime() + (session.timeLimit || MAX_SESSION_TIME);

    if (submissionTime.getTime() > maxSessionTime) {
      throw new SecurityViolationError('Submission after time limit');
    }
  }
}
```

### 부정행위 탐지 시스템
```typescript
interface FraudDetectionSystem {
  // 실시간 모니터링
  realTimeMonitoring: {
    rapidSubmissions: boolean;
    suspiciousPatterns: boolean;
    deviceFingerprinting: boolean;
    behaviorAnalysis: boolean;
  };

  // 사후 분석
  postAnalysis: {
    statisticalAnalysis: boolean;
    crossUserComparison: boolean;
    temporalPatternAnalysis: boolean;
    accuracyDistributionAnalysis: boolean;
  };

  // 대응 조치
  responseActions: {
    immediateBlock: boolean;
    additionalVerification: boolean;
    sessionInvalidation: boolean;
    accountSuspension: boolean;
  };
}

class FraudDetector {
  async detectFraudulentActivity(
    session: TestSession,
    answers: SessionAnswer[]
  ): Promise<FraudDetectionResult> {
    // 1. 통계적 이상 탐지
    const statisticalAnomalies = this.detectStatisticalAnomalies(answers);

    // 2. 시간 패턴 분석
    const timePatternAnomalies = this.analyzeTimePatterns(answers);

    // 3. 정확도 분포 분석
    const accuracyAnomalies = this.analyzeAccuracyDistribution(answers);

    // 4. 행동 패턴 분석
    const behaviorAnomalies = await this.analyzeBehaviorPatterns(session);

    // 5. 교차 검증
    const crossValidation = await this.performCrossValidation(session.userId);

    // 6. 종합 위험도 계산
    const overallRisk = this.calculateOverallRisk({
      statisticalAnomalies,
      timePatternAnomalies,
      accuracyAnomalies,
      behaviorAnomalies,
      crossValidation
    });

    return {
      riskLevel: overallRisk.level,
      confidence: overallRisk.confidence,
      anomalies: {
        statistical: statisticalAnomalies,
        timing: timePatternAnomalies,
        accuracy: accuracyAnomalies,
        behavior: behaviorAnomalies
      },
      recommendedActions: this.getRecommendedActions(overallRisk)
    };
  }

  private detectStatisticalAnomalies(answers: SessionAnswer[]): StatisticalAnomaly[] {
    const anomalies: StatisticalAnomaly[] = [];

    // 1. 답변 시간 분포 분석
    const timings = answers.map(a => a.timeSpent);
    const avgTiming = timings.reduce((a, b) => a + b, 0) / timings.length;
    const stdDev = this.calculateStandardDeviation(timings);

    // 2. 이상치 탐지 (Z-Score > 3)
    for (const answer of answers) {
      const zScore = Math.abs(answer.timeSpent - avgTiming) / stdDev;
      if (zScore > 3) {
        anomalies.push({
          type: 'EXTREME_TIMING',
          problemId: answer.problemId,
          value: answer.timeSpent,
          expectedRange: [avgTiming - 2 * stdDev, avgTiming + 2 * stdDev],
          severity: zScore > 4 ? 'HIGH' : 'MEDIUM'
        });
      }
    }

    // 3. 일관성 분석
    const correctTimings = answers.filter(a => a.isCorrect).map(a => a.timeSpent);
    const incorrectTimings = answers.filter(a => !a.isCorrect).map(a => a.timeSpent);

    // 정답 시간이 오답 시간보다 현저히 빠른 경우 (의심)
    if (correctTimings.length > 0 && incorrectTimings.length > 0) {
      const avgCorrect = correctTimings.reduce((a, b) => a + b, 0) / correctTimings.length;
      const avgIncorrect = incorrectTimings.reduce((a, b) => a + b, 0) / incorrectTimings.length;

      if (avgCorrect < avgIncorrect * 0.3) {
        anomalies.push({
          type: 'SUSPICIOUS_ACCURACY_TIMING',
          description: 'Correct answers significantly faster than incorrect ones',
          severity: 'HIGH'
        });
      }
    }

    return anomalies;
  }
}
```

## 3. 데이터 무결성 보장

### 데이터베이스 무결성 제약
```typescript
interface DatabaseIntegrityConstraints {
  // 외래 키 제약
  foreignKeys: {
    'user_progression.user_id': 'users.id';
    'test_session.user_id': 'users.id';
    'session_answer.session_id': 'test_sessions.id';
    'session_answer.problem_id': 'problems.id';
  };

  // 체크 제약
  checkConstraints: {
    'user_progression.unlocked_levels': 'valid_level_sequence';
    'user_progression.completed_levels': 'subset_of_unlocked';
    'session_answer.time_spent': 'positive_value';
    'test_session.current_problem_index': 'within_problem_count';
  };

  // 고유 제약
  uniqueConstraints: {
    'user_progression': ['user_id'];
    'session_answer': ['session_id', 'problem_id'];
    'test_session': ['id'];
  };
}

class DatabaseIntegrityManager {
  async enforceProgressionIntegrity(
    userId: string,
    update: ProgressionUpdate
  ): Promise<void> {
    // 1. 트랜잭션 시작
    const transaction = await this.db.beginTransaction();

    try {
      // 2. 현재 상태 잠금 (SELECT FOR UPDATE)
      const currentProgression = await this.db.query(
        'SELECT * FROM user_progression WHERE user_id = ? FOR UPDATE',
        [userId]
      );

      // 3. 무결성 검증
      this.validateProgressionUpdate(currentProgression, update);

      // 4. 순차적 진행 검증
      this.validateSequentialProgression(update.unlockedLevels);

      // 5. 레벨 통계 일관성 검증
      await this.validateLevelStatsConsistency(userId, update, transaction);

      // 6. 업데이트 실행
      await this.executeProgressionUpdate(userId, update, transaction);

      // 7. 커밋
      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw new IntegrityViolationError(
        `Progression update failed for user ${userId}`,
        error
      );
    }
  }

  private validateSequentialProgression(unlockedLevels: LevelId[]): void {
    const levelOrder = ['beginner', 'elementary', 'intermediate', 'advanced', 'challenge'];

    // 순차적 해제 검증
    for (let i = 0; i < unlockedLevels.length; i++) {
      const levelIndex = levelOrder.indexOf(unlockedLevels[i]);

      // 이전 레벨들이 모두 해제되어 있는지 확인
      for (let j = 0; j < levelIndex; j++) {
        if (!unlockedLevels.includes(levelOrder[j] as LevelId)) {
          throw new IntegrityViolationError(
            `Level ${unlockedLevels[i]} cannot be unlocked without ${levelOrder[j]}`
          );
        }
      }
    }
  }
}
```

### 암호화 및 민감 데이터 보호
```typescript
interface DataProtectionStrategy {
  // 필드 레벨 암호화
  fieldEncryption: {
    encryptedFields: string[]; // 암호화할 필드 목록
    keyRotation: boolean; // 키 순환
    keyDerivation: 'PBKDF2' | 'scrypt' | 'argon2';
  };

  // 개인정보 보호
  personalDataProtection: {
    dataMinimization: boolean; // 최소 데이터 수집
    purposeLimitation: boolean; // 목적 제한
    storageMinimization: boolean; // 보관 기간 제한
    anonymization: boolean; // 익명화 처리
  };

  // 로깅 보안
  secureLogging: {
    logEncryption: boolean;
    piiRedaction: boolean; // 개인식별정보 삭제
    logRetention: number; // 로그 보관 기간 (일)
    logIntegrity: boolean; // 로그 무결성 검증
  };
}

class DataProtectionService {
  async encryptSensitiveData(data: any): Promise<EncryptedData> {
    // 1. 민감 필드 식별
    const sensitiveFields = this.identifySensitiveFields(data);

    // 2. 필드별 암호화
    const encryptedData = { ...data };
    for (const field of sensitiveFields) {
      if (data[field]) {
        encryptedData[field] = await this.encryptField(
          data[field],
          field
        );
      }
    }

    // 3. 메타데이터 추가
    return {
      ...encryptedData,
      _encrypted: true,
      _encryptedFields: sensitiveFields,
      _encryptionTimestamp: new Date(),
      _keyVersion: this.getCurrentKeyVersion()
    };
  }

  async decryptSensitiveData(encryptedData: EncryptedData): Promise<any> {
    if (!encryptedData._encrypted) {
      return encryptedData;
    }

    // 1. 복호화할 필드 확인
    const fieldsToDecrypt = encryptedData._encryptedFields || [];

    // 2. 필드별 복호화
    const decryptedData = { ...encryptedData };
    for (const field of fieldsToDecrypt) {
      if (encryptedData[field]) {
        decryptedData[field] = await this.decryptField(
          encryptedData[field],
          field,
          encryptedData._keyVersion
        );
      }
    }

    // 3. 메타데이터 제거
    delete decryptedData._encrypted;
    delete decryptedData._encryptedFields;
    delete decryptedData._encryptionTimestamp;
    delete decryptedData._keyVersion;

    return decryptedData;
  }

  private async encryptField(
    value: string,
    fieldName: string
  ): Promise<string> {
    // 1. 필드별 키 파생
    const fieldKey = await this.deriveFieldKey(fieldName);

    // 2. 초기화 벡터 생성
    const iv = crypto.randomBytes(16);

    // 3. 암호화 수행
    const cipher = crypto.createCipher('aes-256-gcm', fieldKey);
    cipher.setAAD(Buffer.from(fieldName, 'utf8'));

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // 4. 결과 조합
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }
}
```

## 4. 보안 모니터링 및 감사

### 보안 이벤트 로깅
```typescript
interface SecurityAuditLog {
  // 이벤트 분류
  eventTypes: {
    AUTHENTICATION: 'login, logout, token_refresh';
    AUTHORIZATION: 'access_granted, access_denied, privilege_escalation';
    DATA_ACCESS: 'read, write, delete, export';
    SECURITY_VIOLATION: 'fraud_detected, suspicious_activity, policy_violation';
  };

  // 로그 구조
  logStructure: {
    timestamp: Date;
    eventType: string;
    userId: string;
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    resource: string;
    action: string;
    result: 'success' | 'failure' | 'blocked';
    riskScore: number;
    additionalData: any;
  };

  // 보안 메트릭
  securityMetrics: {
    failedLoginAttempts: number;
    suspiciousActivities: number;
    dataAccessPatterns: any;
    securityViolations: number;
  };
}

class SecurityAuditLogger {
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    // 1. 이벤트 정규화
    const normalizedEvent = this.normalizeEvent(event);

    // 2. 민감 정보 마스킹
    const maskedEvent = this.maskSensitiveData(normalizedEvent);

    // 3. 위험도 계산
    const riskScore = await this.calculateRiskScore(maskedEvent);

    // 4. 로그 기록
    await this.writeSecurityLog({
      ...maskedEvent,
      riskScore,
      timestamp: new Date(),
      logId: this.generateLogId()
    });

    // 5. 실시간 알림 (고위험 이벤트)
    if (riskScore > HIGH_RISK_THRESHOLD) {
      await this.sendSecurityAlert(maskedEvent, riskScore);
    }

    // 6. 패턴 분석 큐에 추가
    await this.addToPatternAnalysis(maskedEvent);
  }

  async analyzeSecurityPatterns(): Promise<SecurityInsights> {
    // 1. 최근 로그 데이터 수집
    const recentLogs = await this.getRecentSecurityLogs();

    // 2. 패턴 분석
    const patterns = this.identifySecurityPatterns(recentLogs);

    // 3. 이상 탐지
    const anomalies = this.detectSecurityAnomalies(recentLogs);

    // 4. 위협 평가
    const threats = this.assessThreats(patterns, anomalies);

    // 5. 권장사항 생성
    const recommendations = this.generateSecurityRecommendations(threats);

    return {
      patterns,
      anomalies,
      threats,
      recommendations,
      analysisTimestamp: new Date()
    };
  }
}
```

이 보안 및 데이터 무결성 시스템은 프론트엔드와 백엔드 전반에 걸쳐 포괄적인 보안을 제공하면서, 사용자 경험을 해치지 않는 균형잡힌 접근 방식을 제공합니다.