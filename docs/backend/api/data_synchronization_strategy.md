# 데이터 동기화 전략 수립

## 1. 프론트엔드-백엔드 동기화 아키텍처

### 동기화 계층 구조
```typescript
interface SynchronizationLayers {
  // L1: 즉시 동기화 (Critical Data)
  immediate: {
    answerSubmissions: 'real-time';
    sessionProgress: 'real-time';
    levelCompletion: 'real-time';
  };

  // L2: 주기적 동기화 (Important Data)
  periodic: {
    userProgression: 'every 30s';
    sessionStats: 'every 60s';
    problemMetrics: 'every 5min';
  };

  // L3: 배치 동기화 (Non-Critical Data)
  batch: {
    detailedAnalytics: 'hourly';
    performanceReports: 'daily';
    systemMetrics: 'daily';
  };
}
```

### 상태 관리 패턴
```typescript
// Frontend State Management
interface SyncState {
  // 로컬 상태 (즉시 업데이트)
  localState: {
    currentSession: TestSession | null;
    currentProblem: Problem | null;
    answers: SessionAnswer[];
    timeElapsed: number;
  };

  // 서버 동기화 상태
  syncState: {
    lastSyncTime: Date;
    pendingUpdates: PendingUpdate[];
    conflictResolution: ConflictResolutionStrategy;
    syncStatus: 'synced' | 'pending' | 'error' | 'offline';
  };

  // 캐시된 서버 상태
  serverState: {
    userProgression: UserProgressionState;
    levelStats: LevelStats;
    cachedAt: Date;
    expiresAt: Date;
  };
}

class StateManager {
  private localState: SyncState;
  private syncQueue: SyncQueue;
  private conflictResolver: ConflictResolver;

  // 로컬 상태 즉시 업데이트, 서버 동기화는 비동기
  async updateState(update: StateUpdate): Promise<void> {
    // 1. 로컬 상태 즉시 업데이트 (Optimistic Update)
    this.applyLocalUpdate(update);

    // 2. 서버 동기화 큐에 추가
    this.syncQueue.enqueue({
      type: update.type,
      data: update.data,
      timestamp: new Date(),
      retryCount: 0
    });

    // 3. 즉시 동기화가 필요한 경우 바로 처리
    if (this.isImmediateSync(update.type)) {
      await this.processSyncQueue();
    }
  }
}
```

## 2. 실시간 동기화 시스템

### WebSocket 기반 실시간 통신
```typescript
interface WebSocketEvents {
  // Client → Server
  'session:start': SessionStartData;
  'answer:submit': AnswerSubmissionData;
  'session:heartbeat': HeartbeatData;
  'session:complete': SessionCompleteData;

  // Server → Client
  'answer:validated': AnswerValidationResult;
  'progression:updated': ProgressionUpdateEvent;
  'session:expired': SessionExpiredEvent;
  'sync:conflict': SyncConflictEvent;
}

class RealTimeSyncManager {
  private ws: WebSocket;
  private heartbeatInterval: NodeJS.Timeout;
  private reconnectAttempts: number = 0;

  async initialize(sessionId: string): Promise<void> {
    // 1. WebSocket 연결 설정
    this.ws = new WebSocket(`ws://api.example.com/sessions/${sessionId}/sync`);

    // 2. 이벤트 핸들러 등록
    this.setupEventHandlers();

    // 3. 하트비트 시작
    this.startHeartbeat();

    // 4. 초기 상태 동기화
    await this.performInitialSync();
  }

  private setupEventHandlers(): void {
    // 답변 검증 결과 수신
    this.ws.on('answer:validated', (result: AnswerValidationResult) => {
      this.handleAnswerValidation(result);
    });

    // 진행 상태 업데이트 수신
    this.ws.on('progression:updated', (update: ProgressionUpdateEvent) => {
      this.handleProgressionUpdate(update);
    });

    // 동기화 충돌 처리
    this.ws.on('sync:conflict', (conflict: SyncConflictEvent) => {
      this.resolveConflict(conflict);
    });

    // 연결 끊김 처리
    this.ws.on('close', () => {
      this.handleDisconnection();
    });
  }

  private async handleDisconnection(): Promise<void> {
    // 1. 재연결 시도
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      await this.delay(RECONNECT_DELAY * this.reconnectAttempts);
      await this.reconnect();
    } else {
      // 2. 오프라인 모드 전환
      this.enterOfflineMode();
    }
  }
}
```

### 오프라인 지원 시스템
```typescript
interface OfflineCapability {
  // 오프라인 저장소
  storage: {
    answers: IndexedDB; // 답변 임시 저장
    progression: LocalStorage; // 진행 상태 캐시
    problems: IndexedDB; // 문제 캐시
  };

  // 동기화 큐
  syncQueue: {
    pendingAnswers: QueuedAnswer[];
    pendingUpdates: QueuedUpdate[];
    maxQueueSize: number;
    persistenceStrategy: 'localStorage' | 'indexedDB';
  };
}

class OfflineManager {
  private db: IDBDatabase;
  private syncQueue: OfflineSyncQueue;

  async enterOfflineMode(): Promise<void> {
    // 1. 오프라인 데이터베이스 초기화
    this.db = await this.initOfflineDB();

    // 2. 현재 세션 상태 저장
    await this.saveCurrentSessionOffline();

    // 3. 문제 데이터 캐시
    await this.cacheProblemsForLevel();

    // 4. UI에 오프라인 상태 표시
    this.notifyOfflineStatus();
  }

  async submitAnswerOffline(answer: AnswerSubmission): Promise<void> {
    // 1. 로컬 검증 (기본적인 형식 검사)
    const localValidation = this.performLocalValidation(answer);

    // 2. 오프라인 저장소에 저장
    await this.saveAnswerToQueue(answer);

    // 3. 로컬 상태 업데이트
    this.updateLocalProgress(answer, localValidation);

    // 4. 연결 복구 시 동기화 예약
    this.scheduleSync();
  }

  async synchronizeWhenOnline(): Promise<void> {
    // 1. 네트워크 연결 확인
    if (!navigator.onLine) return;

    // 2. 큐에서 대기 중인 데이터 처리
    const queuedItems = await this.getQueuedItems();

    // 3. 서버와 순차적 동기화
    for (const item of queuedItems) {
      try {
        await this.syncItem(item);
        await this.removeFromQueue(item.id);
      } catch (error) {
        // 실패한 항목은 큐에 유지하고 재시도
        this.handleSyncError(item, error);
      }
    }

    // 4. 서버 상태와 로컬 상태 병합
    await this.mergeServerState();
  }
}
```

## 3. 충돌 해결 전략

### 충돌 감지 및 해결
```typescript
interface ConflictResolution {
  // 충돌 유형
  conflictTypes: {
    CONCURRENT_MODIFICATION: 'server와 client 동시 수정';
    VERSION_MISMATCH: '버전 불일치';
    SEQUENCE_ERROR: '순서 오류';
    DATA_CORRUPTION: '데이터 손상';
  };

  // 해결 전략
  resolutionStrategies: {
    SERVER_WINS: '서버 우선';
    CLIENT_WINS: '클라이언트 우선';
    MERGE: '병합';
    MANUAL: '수동 해결';
  };
}

class ConflictResolver {
  async resolveConflict(conflict: SyncConflict): Promise<ConflictResolution> {
    switch (conflict.type) {
      case 'CONCURRENT_MODIFICATION':
        return this.resolveConcurrentModification(conflict);

      case 'VERSION_MISMATCH':
        return this.resolveVersionMismatch(conflict);

      case 'SEQUENCE_ERROR':
        return this.resolveSequenceError(conflict);

      default:
        return this.resolveGenericConflict(conflict);
    }
  }

  private async resolveConcurrentModification(
    conflict: ConcurrentModificationConflict
  ): Promise<ConflictResolution> {
    // 1. 변경 사항 분석
    const serverChanges = conflict.serverState;
    const clientChanges = conflict.clientState;

    // 2. 중요도 기반 우선순위 결정
    if (this.isCriticalServerChange(serverChanges)) {
      // 서버 변경사항이 중요한 경우 (예: 레벨 완료, 점수 확정)
      return {
        strategy: 'SERVER_WINS',
        resolvedState: serverChanges,
        discardedChanges: clientChanges
      };
    }

    // 3. 병합 가능한 경우 병합 시도
    if (this.canMerge(serverChanges, clientChanges)) {
      const mergedState = await this.mergeStates(serverChanges, clientChanges);
      return {
        strategy: 'MERGE',
        resolvedState: mergedState,
        mergeReport: this.generateMergeReport(serverChanges, clientChanges)
      };
    }

    // 4. 수동 해결 필요
    return {
      strategy: 'MANUAL',
      conflictData: conflict,
      userAction: 'REQUIRED'
    };
  }

  private async mergeStates(
    serverState: any,
    clientState: any
  ): Promise<any> {
    // 1. 타임스탬프 기반 병합
    const merged = { ...serverState };

    // 2. 클라이언트 변경사항 중 최신 것만 적용
    for (const [key, value] of Object.entries(clientState)) {
      if (this.isClientChangeNewer(key, value, serverState[key])) {
        merged[key] = value;
      }
    }

    // 3. 데이터 무결성 검증
    this.validateMergedState(merged);

    return merged;
  }
}
```

## 4. 성능 최적화 동기화

### 배치 처리 및 압축
```typescript
interface BatchSyncStrategy {
  // 배치 정책
  batchPolicy: {
    maxBatchSize: number;
    maxWaitTime: number; // ms
    priorityItems: string[]; // 우선 처리 항목
  };

  // 압축 전략
  compression: {
    enabled: boolean;
    algorithm: 'gzip' | 'lz4';
    threshold: number; // bytes
  };

  // 델타 동기화
  deltaSync: {
    enabled: boolean;
    hashAlgorithm: 'sha256';
    maxDeltaAge: number; // ms
  };
}

class BatchSyncProcessor {
  private batchQueue: SyncItem[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  async addToBatch(item: SyncItem): Promise<void> {
    this.batchQueue.push(item);

    // 1. 배치 크기 확인
    if (this.batchQueue.length >= this.config.maxBatchSize) {
      await this.processBatch();
      return;
    }

    // 2. 우선순위 항목 확인
    if (this.hasPriorityItem()) {
      await this.processBatch();
      return;
    }

    // 3. 타이머 설정 (최대 대기 시간)
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.processBatch();
      }, this.config.maxWaitTime);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    // 1. 배치 준비
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    this.clearBatchTimer();

    // 2. 데이터 압축
    const compressedBatch = await this.compressBatch(batch);

    // 3. 서버 전송
    try {
      const response = await this.sendBatch(compressedBatch);
      await this.handleBatchResponse(response, batch);
    } catch (error) {
      await this.handleBatchError(error, batch);
    }
  }

  private async compressBatch(batch: SyncItem[]): Promise<CompressedBatch> {
    // 1. 델타 계산
    const deltas = await this.calculateDeltas(batch);

    // 2. 중복 제거
    const deduplicated = this.deduplicateItems(deltas);

    // 3. 압축 수행
    if (this.shouldCompress(deduplicated)) {
      return {
        data: await this.compress(deduplicated),
        compressed: true,
        originalSize: JSON.stringify(batch).length
      };
    }

    return {
      data: deduplicated,
      compressed: false,
      originalSize: JSON.stringify(batch).length
    };
  }
}
```

## 5. 동기화 모니터링 및 메트릭

### 동기화 상태 추적
```typescript
interface SyncMetrics {
  // 성능 메트릭
  performance: {
    averageSyncTime: number;
    syncSuccessRate: number;
    batchEfficiency: number;
    compressionRatio: number;
  };

  // 오류 메트릭
  errors: {
    conflictRate: number;
    failureRate: number;
    retryRate: number;
    timeoutRate: number;
  };

  // 사용자 경험 메트릭
  userExperience: {
    perceivedLatency: number;
    offlineCapability: number;
    dataLossRate: number;
  };
}

class SyncMonitor {
  private metrics: SyncMetrics;
  private healthChecker: HealthChecker;

  startMonitoring(): void {
    // 1. 메트릭 수집 시작
    this.startMetricsCollection();

    // 2. 건강 상태 모니터링
    this.healthChecker.start();

    // 3. 자동 복구 메커니즘 활성화
    this.enableAutoRecovery();

    // 4. 사용자 피드백 수집
    this.startUserFeedbackCollection();
  }

  private async detectSyncIssues(): Promise<SyncIssue[]> {
    const issues: SyncIssue[] = [];

    // 1. 성능 이슈 감지
    if (this.metrics.performance.averageSyncTime > PERFORMANCE_THRESHOLD) {
      issues.push({
        type: 'PERFORMANCE_DEGRADATION',
        severity: 'WARNING',
        metric: 'averageSyncTime',
        value: this.metrics.performance.averageSyncTime
      });
    }

    // 2. 충돌률 이슈 감지
    if (this.metrics.errors.conflictRate > CONFLICT_THRESHOLD) {
      issues.push({
        type: 'HIGH_CONFLICT_RATE',
        severity: 'ERROR',
        metric: 'conflictRate',
        value: this.metrics.errors.conflictRate
      });
    }

    // 3. 데이터 손실 이슈 감지
    if (this.metrics.userExperience.dataLossRate > DATA_LOSS_THRESHOLD) {
      issues.push({
        type: 'DATA_LOSS_DETECTED',
        severity: 'CRITICAL',
        metric: 'dataLossRate',
        value: this.metrics.userExperience.dataLossRate
      });
    }

    return issues;
  }

  async performAutoRecovery(issue: SyncIssue): Promise<void> {
    switch (issue.type) {
      case 'PERFORMANCE_DEGRADATION':
        await this.optimizeSync();
        break;

      case 'HIGH_CONFLICT_RATE':
        await this.adjustConflictResolution();
        break;

      case 'DATA_LOSS_DETECTED':
        await this.initiateDataRecovery();
        break;
    }
  }
}
```

이 동기화 전략은 프론트엔드의 세션 관리와 완벽히 연동되어 안정적이고 효율적인 데이터 동기화를 보장합니다.