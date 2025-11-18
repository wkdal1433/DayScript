# 답변 검증 및 진행 상태 업데이트 로직

## 1. 답변 검증 시스템

### 문제 타입별 검증 로직

#### OX 문제 검증
```typescript
interface OXValidationResult {
  isCorrect: boolean;
  userAnswer: 'O' | 'X';
  correctAnswer: 'O' | 'X';
  explanation: string;
  confidence: number; // 1.0 (확실)
}

class OXAnswerValidator implements AnswerValidator {
  validate(
    problem: OXProblem,
    userAnswer: string,
    context: ValidationContext
  ): OXValidationResult {
    // 1. 입력 값 정규화
    const normalizedAnswer = this.normalizeOXAnswer(userAnswer);

    // 2. 정답 비교
    const isCorrect = normalizedAnswer === problem.correctAnswer;

    // 3. 결과 반환
    return {
      isCorrect,
      userAnswer: normalizedAnswer,
      correctAnswer: problem.correctAnswer,
      explanation: problem.explanation,
      confidence: 1.0
    };
  }

  private normalizeOXAnswer(answer: string): 'O' | 'X' {
    const normalized = answer.toUpperCase().trim();
    if (normalized === 'O' || normalized === '○' || normalized === 'TRUE') {
      return 'O';
    }
    if (normalized === 'X' || normalized === '×' || normalized === 'FALSE') {
      return 'X';
    }
    throw new ValidationError('Invalid OX answer format');
  }
}
```

#### 객관식 문제 검증
```typescript
interface MultipleChoiceValidationResult {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  confidence: number;
  choiceAnalysis: {
    selectedChoice: Choice;
    correctChoice: Choice;
    allChoices: Choice[];
  };
}

class MultipleChoiceValidator implements AnswerValidator {
  validate(
    problem: MultipleChoiceProblem,
    userAnswer: string,
    context: ValidationContext
  ): MultipleChoiceValidationResult {
    // 1. 선택지 검증
    const selectedChoice = this.findChoice(problem.choices, userAnswer);
    if (!selectedChoice) {
      throw new ValidationError('Invalid choice selection');
    }

    // 2. 정답 확인
    const correctChoice = problem.choices.find(choice => choice.isCorrect);
    const isCorrect = selectedChoice.isCorrect;

    // 3. 상세 분석
    return {
      isCorrect,
      userAnswer: selectedChoice.id,
      correctAnswer: correctChoice?.id || '',
      explanation: problem.explanation,
      confidence: 1.0,
      choiceAnalysis: {
        selectedChoice,
        correctChoice: correctChoice!,
        allChoices: problem.choices
      }
    };
  }
}
```

#### 빈칸 채우기 문제 검증
```typescript
interface FillInBlankValidationResult {
  isCorrect: boolean;
  userAnswers: { [blankId: string]: string };
  correctAnswers: { [blankId: string]: string };
  explanation: string;
  confidence: number;
  blankAnalysis: BlankAnalysis[];
  partialCredit: number; // 0.0 - 1.0
}

interface BlankAnalysis {
  blankId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  similarity: number; // 유사도 점수
  suggestions?: string[]; // 수정 제안
}

class FillInBlankValidator implements AnswerValidator {
  validate(
    problem: FillInBlankProblem,
    userAnswers: { [blankId: string]: string },
    context: ValidationContext
  ): FillInBlankValidationResult {
    const blankAnalyses: BlankAnalysis[] = [];
    let totalBlanks = 0;
    let correctBlanks = 0;

    // 1. 각 빈칸별 검증
    for (const [blankId, correctAnswer] of Object.entries(problem.correctAnswers)) {
      totalBlanks++;
      const userAnswer = userAnswers[blankId] || '';

      // 2. 유연한 답안 매칭
      const analysis = this.analyzeBlankAnswer(
        blankId,
        userAnswer,
        correctAnswer,
        problem.acceptableVariations?.[blankId] || []
      );

      blankAnalyses.push(analysis);
      if (analysis.isCorrect) {
        correctBlanks++;
      }
    }

    // 3. 전체 결과 계산
    const partialCredit = totalBlanks > 0 ? correctBlanks / totalBlanks : 0;
    const isCorrect = partialCredit >= (problem.passingThreshold || 0.8);

    return {
      isCorrect,
      userAnswers,
      correctAnswers: problem.correctAnswers,
      explanation: problem.explanation,
      confidence: this.calculateConfidence(blankAnalyses),
      blankAnalysis: blankAnalyses,
      partialCredit
    };
  }

  private analyzeBlankAnswer(
    blankId: string,
    userAnswer: string,
    correctAnswer: string,
    acceptableVariations: string[]
  ): BlankAnalysis {
    // 1. 정확한 일치 확인
    if (this.normalizeAnswer(userAnswer) === this.normalizeAnswer(correctAnswer)) {
      return {
        blankId,
        userAnswer,
        correctAnswer,
        isCorrect: true,
        similarity: 1.0
      };
    }

    // 2. 허용된 변형 확인
    const normalizedUser = this.normalizeAnswer(userAnswer);
    for (const variation of acceptableVariations) {
      if (normalizedUser === this.normalizeAnswer(variation)) {
        return {
          blankId,
          userAnswer,
          correctAnswer,
          isCorrect: true,
          similarity: 0.9
        };
      }
    }

    // 3. 유사도 계산 (부분 점수용)
    const similarity = this.calculateSimilarity(userAnswer, correctAnswer);
    const suggestions = this.generateSuggestions(userAnswer, correctAnswer);

    return {
      blankId,
      userAnswer,
      correctAnswer,
      isCorrect: false,
      similarity,
      suggestions
    };
  }

  private normalizeAnswer(answer: string): string {
    return answer
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/['"]/g, '') // 따옴표 제거
      .replace(/;$/, ''); // 세미콜론 제거
  }

  private calculateSimilarity(userAnswer: string, correctAnswer: string): number {
    // Levenshtein distance 기반 유사도 계산
    const distance = this.levenshteinDistance(
      this.normalizeAnswer(userAnswer),
      this.normalizeAnswer(correctAnswer)
    );

    const maxLength = Math.max(userAnswer.length, correctAnswer.length);
    return maxLength > 0 ? 1 - (distance / maxLength) : 1;
  }
}
```

## 2. 진행 상태 업데이트 시스템

### 세션 완료 처리
```typescript
interface SessionCompletionResult {
  sessionId: string;
  userId: string;
  levelId: LevelId;

  // 세션 결과
  finalScore: number;
  accuracy: number;
  totalTime: number;
  answersCorrect: number;
  answersTotal: number;

  // 진행 상태 변화
  progressionUpdates: ProgressionUpdate[];
  levelCompleted: boolean;
  nextLevelUnlocked: LevelId | null;

  // 성취 및 보상
  achievements: Achievement[];
  bonusPoints: number;
}

class SessionCompletionProcessor {
  async processSessionCompletion(
    sessionId: string
  ): Promise<SessionCompletionResult> {
    // 1. 세션 데이터 조회 및 검증
    const session = await this.sessionService.getSession(sessionId);
    this.validateSessionForCompletion(session);

    // 2. 답변 재검증 및 점수 계산
    const validationResults = await this.revalidateAllAnswers(session);
    const scoreCalculation = this.calculateFinalScore(
      validationResults,
      session.timeSpent
    );

    // 3. 레벨 완료 조건 확인
    const levelCompletion = await this.checkLevelCompletion(
      session.userId,
      session.levelId,
      scoreCalculation
    );

    // 4. 진행 상태 업데이트
    const progressionUpdates = await this.updateUserProgression(
      session.userId,
      session.levelId,
      levelCompletion,
      scoreCalculation
    );

    // 5. 성취 확인 및 처리
    const achievements = await this.checkAndAwardAchievements(
      session.userId,
      session.levelId,
      scoreCalculation,
      levelCompletion
    );

    // 6. 결과 반환
    return {
      sessionId: session.id,
      userId: session.userId,
      levelId: session.levelId,
      ...scoreCalculation,
      progressionUpdates,
      levelCompleted: levelCompletion.isCompleted,
      nextLevelUnlocked: levelCompletion.nextLevelUnlocked,
      achievements,
      bonusPoints: this.calculateBonusPoints(scoreCalculation, achievements)
    };
  }

  private async checkLevelCompletion(
    userId: string,
    levelId: LevelId,
    score: ScoreCalculation
  ): Promise<LevelCompletionCheck> {
    // 1. 레벨 완료 기준 조회
    const completionCriteria = await this.getCompletionCriteria(levelId);

    // 2. 완료 조건 검증
    const isCompleted = this.evaluateCompletionCriteria(
      score,
      completionCriteria
    );

    // 3. 다음 레벨 해제 확인
    let nextLevelUnlocked: LevelId | null = null;
    if (isCompleted) {
      nextLevelUnlocked = this.getNextLevel(levelId);
    }

    return {
      isCompleted,
      nextLevelUnlocked,
      criteria: completionCriteria,
      metCriteria: this.getMetCriteria(score, completionCriteria)
    };
  }
}
```

### 진행 상태 업데이트 로직
```typescript
interface ProgressionUpdate {
  type: 'LEVEL_COMPLETED' | 'LEVEL_UNLOCKED' | 'STATS_UPDATED';
  levelId: LevelId;
  timestamp: Date;
  details: any;
}

class ProgressionUpdateService {
  async updateUserProgression(
    userId: string,
    levelId: LevelId,
    completion: LevelCompletionCheck,
    score: ScoreCalculation
  ): Promise<ProgressionUpdate[]> {
    const updates: ProgressionUpdate[] = [];

    // 1. 현재 진행 상태 조회
    const currentProgression = await this.getProgression(userId);

    // 2. 낙관적 잠금으로 동시성 제어
    const transaction = await this.startTransaction();

    try {
      // 3. 레벨 통계 업데이트
      const statsUpdate = await this.updateLevelStats(
        userId,
        levelId,
        score,
        transaction
      );
      updates.push(statsUpdate);

      // 4. 레벨 완료 처리
      if (completion.isCompleted && !currentProgression.completedLevels.includes(levelId)) {
        const completionUpdate = await this.markLevelCompleted(
          userId,
          levelId,
          transaction
        );
        updates.push(completionUpdate);

        // 5. 다음 레벨 해제
        if (completion.nextLevelUnlocked) {
          const unlockUpdate = await this.unlockNextLevel(
            userId,
            completion.nextLevelUnlocked,
            transaction
          );
          updates.push(unlockUpdate);
        }
      }

      // 6. 진행 상태 검증
      const updatedProgression = await this.validateProgression(
        userId,
        transaction
      );

      // 7. 트랜잭션 커밋
      await transaction.commit();

      // 8. 캐시 무효화
      await this.invalidateUserCache(userId);

      return updates;

    } catch (error) {
      await transaction.rollback();
      throw new ProgressionUpdateError(
        `Failed to update progression for user ${userId}`,
        error
      );
    }
  }

  private async validateProgression(
    userId: string,
    transaction: Transaction
  ): Promise<UserProgression> {
    const progression = await this.getProgression(userId, transaction);

    // 1. 순차 진행 검증
    this.validateSequentialProgression(progression);

    // 2. 데이터 일관성 검증
    this.validateDataConsistency(progression);

    // 3. 비즈니스 규칙 검증
    this.validateBusinessRules(progression);

    return progression;
  }

  private validateSequentialProgression(progression: UserProgression): void {
    const levelOrder = ['beginner', 'elementary', 'intermediate', 'advanced', 'challenge'];

    // 1. 해제된 레벨이 순차적인지 확인
    for (let i = 1; i < levelOrder.length; i++) {
      const currentLevel = levelOrder[i];
      const previousLevel = levelOrder[i - 1];

      if (progression.unlockedLevels.includes(currentLevel) &&
          !progression.completedLevels.includes(previousLevel)) {
        throw new ValidationError(
          `Level ${currentLevel} is unlocked but ${previousLevel} is not completed`
        );
      }
    }

    // 2. 완료된 레벨이 해제되어 있는지 확인
    for (const completedLevel of progression.completedLevels) {
      if (!progression.unlockedLevels.includes(completedLevel)) {
        throw new ValidationError(
          `Level ${completedLevel} is completed but not unlocked`
        );
      }
    }
  }
}
```

## 3. 실시간 검증 시스템

### 답변 제출 시 실시간 처리
```typescript
class RealTimeAnswerProcessor {
  async processAnswerSubmission(
    sessionId: string,
    problemId: string,
    userAnswer: any,
    submissionTime: Date
  ): Promise<AnswerProcessingResult> {
    // 1. 세션 유효성 검증
    const session = await this.validateActiveSession(sessionId);

    // 2. 문제 유효성 검증
    const problem = await this.validateProblem(problemId, session);

    // 3. 중복 제출 방지
    await this.checkDuplicateSubmission(sessionId, problemId);

    // 4. 시간 제한 검증
    this.validateTimeLimit(session, submissionTime);

    // 5. 답변 검증 수행
    const validationResult = await this.validateAnswer(
      problem,
      userAnswer,
      {
        sessionId,
        userId: session.userId,
        submissionTime,
        timeSpent: submissionTime.getTime() - session.startTime.getTime()
      }
    );

    // 6. 답변 기록 저장
    const answerRecord = await this.saveAnswerRecord({
      sessionId,
      problemId,
      userAnswer: JSON.stringify(userAnswer),
      isCorrect: validationResult.isCorrect,
      timeSpent: validationResult.timeSpent,
      submittedAt: submissionTime,
      validationDetails: validationResult
    });

    // 7. 세션 상태 업데이트
    const sessionUpdate = await this.updateSessionProgress(
      sessionId,
      answerRecord
    );

    // 8. 실시간 피드백 생성
    const feedback = this.generateFeedback(
      validationResult,
      sessionUpdate
    );

    return {
      answerRecord,
      validationResult,
      sessionUpdate,
      feedback,
      nextProblem: sessionUpdate.nextProblem
    };
  }

  private generateFeedback(
    validation: ValidationResult,
    sessionUpdate: SessionUpdate
  ): AnswerFeedback {
    return {
      isCorrect: validation.isCorrect,
      correctAnswer: validation.correctAnswer,
      explanation: validation.explanation,

      // 진행 상태 피드백
      progress: {
        currentIndex: sessionUpdate.currentIndex,
        totalProblems: sessionUpdate.totalProblems,
        correctAnswers: sessionUpdate.correctAnswers,
        accuracy: sessionUpdate.accuracy,
        timeRemaining: sessionUpdate.timeRemaining
      },

      // 학습 가이드
      guidance: this.generateLearningGuidance(validation, sessionUpdate),

      // 다음 단계
      nextAction: sessionUpdate.isCompleted ? 'SESSION_COMPLETE' : 'CONTINUE'
    };
  }
}
```

## 4. 부정행위 방지 시스템

### 클라이언트 검증 vs 서버 검증
```typescript
interface SecurityValidation {
  // 타이밍 검증
  timingValidation: {
    minimumTimePerProblem: number; // 최소 소요 시간
    maximumTimePerProblem: number; // 최대 소요 시간
    suspiciousPatterns: string[]; // 의심스러운 패턴
  };

  // 답변 패턴 검증
  answerPatternValidation: {
    tooConsistent: boolean; // 너무 일관된 답변 시간
    tooFast: boolean; // 너무 빠른 답변
    perfectAccuracy: boolean; // 완벽한 정확도 (의심)
  };

  // 세션 무결성 검증
  sessionIntegrityValidation: {
    expectedProblemSequence: string[];
    actualProblemSequence: string[];
    unexpectedJumps: boolean;
    clientServerTimeDrift: number;
  };
}

class SecurityValidator {
  validateSubmissionSecurity(
    submission: AnswerSubmission,
    session: TestSession
  ): SecurityValidation {
    // 1. 타이밍 분석
    const timingValidation = this.validateTiming(submission, session);

    // 2. 답변 패턴 분석
    const patternValidation = this.analyzeAnswerPatterns(submission, session);

    // 3. 세션 무결성 확인
    const integrityValidation = this.validateSessionIntegrity(submission, session);

    // 4. 종합 평가
    const riskScore = this.calculateSecurityRisk({
      timingValidation,
      patternValidation,
      integrityValidation
    });

    if (riskScore > SECURITY_THRESHOLD) {
      this.flagSuspiciousActivity(submission, session, riskScore);
    }

    return {
      timingValidation,
      answerPatternValidation: patternValidation,
      sessionIntegrityValidation: integrityValidation
    };
  }
}
```

이 시스템은 프론트엔드의 sessionManager와 완벽히 연동되어 안전하고 정확한 답변 처리와 진행 상태 관리를 보장합니다.