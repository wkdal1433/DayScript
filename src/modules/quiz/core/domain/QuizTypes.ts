/**
 * 구체적인 Quiz 타입 구현체들
 * SOLID 원칙 중 LSP(리스코프 치환) 적용 - QuizBase를 상속받아 타입별 구현
 */

import { QuizBase, QuizType, QuizLevel, QuizDifficulty, QuizHint } from './QuizBase';

// LV1: O/X 문제
export class OXQuiz extends QuizBase {
  readonly id: string;
  readonly type = QuizType.OX;
  readonly level = QuizLevel.LV1;
  readonly difficulty: QuizDifficulty;
  readonly question: string;
  readonly category: string;
  readonly tags: string[];
  readonly timeLimit?: number;
  readonly points: number;
  readonly correctAnswer: boolean;
  readonly explanation: string;
  readonly hints: QuizHint[];

  constructor(data: OXQuizData) {
    super();
    this.id = data.id;
    this.difficulty = data.difficulty;
    this.question = data.question;
    this.category = data.category;
    this.tags = data.tags;
    this.timeLimit = data.timeLimit;
    this.points = data.points;
    this.correctAnswer = data.correctAnswer;
    this.explanation = data.explanation;
    this.hints = data.hints;
  }

  validateAnswer(userAnswer: boolean): boolean {
    return userAnswer === this.correctAnswer;
  }

  getHints(): QuizHint[] {
    return this.hints;
  }

  getExplanation(): string {
    return this.explanation;
  }
}

// LV2: 객관식 문제
export class MultipleChoiceQuiz extends QuizBase {
  readonly id: string;
  readonly type = QuizType.MULTIPLE_CHOICE;
  readonly level = QuizLevel.LV2;
  readonly difficulty: QuizDifficulty;
  readonly question: string;
  readonly category: string;
  readonly tags: string[];
  readonly timeLimit?: number;
  readonly points: number;
  readonly options: MultipleChoiceOption[];
  readonly correctAnswerIndex: number;
  readonly explanation: string;
  readonly hints: QuizHint[];

  constructor(data: MultipleChoiceQuizData) {
    super();
    this.id = data.id;
    this.difficulty = data.difficulty;
    this.question = data.question;
    this.category = data.category;
    this.tags = data.tags;
    this.timeLimit = data.timeLimit;
    this.points = data.points;
    this.options = data.options;
    this.correctAnswerIndex = data.correctAnswerIndex;
    this.explanation = data.explanation;
    this.hints = data.hints;
  }

  validateAnswer(userAnswer: number): boolean {
    return userAnswer === this.correctAnswerIndex;
  }

  getHints(): QuizHint[] {
    return this.hints;
  }

  getExplanation(): string {
    return this.explanation;
  }

  getCorrectOption(): MultipleChoiceOption {
    return this.options[this.correctAnswerIndex];
  }
}

// LV3: 빈칸 채우기 문제
export class FillInBlankQuiz extends QuizBase {
  readonly id: string;
  readonly type = QuizType.FILL_IN_BLANK;
  readonly level = QuizLevel.LV3;
  readonly difficulty: QuizDifficulty;
  readonly question: string;
  readonly category: string;
  readonly tags: string[];
  readonly timeLimit?: number;
  readonly points: number;
  readonly blanks: BlankField[];
  readonly codeContext: string;
  readonly explanation: string;
  readonly hints: QuizHint[];

  constructor(data: FillInBlankQuizData) {
    super();
    this.id = data.id;
    this.difficulty = data.difficulty;
    this.question = data.question;
    this.category = data.category;
    this.tags = data.tags;
    this.timeLimit = data.timeLimit;
    this.points = data.points;
    this.blanks = data.blanks;
    this.codeContext = data.codeContext;
    this.explanation = data.explanation;
    this.hints = data.hints;
  }

  validateAnswer(userAnswers: string[]): boolean {
    if (userAnswers.length !== this.blanks.length) {
      return false;
    }

    return this.blanks.every((blank, index) => {
      const userAnswer = userAnswers[index]?.trim().toLowerCase();
      return blank.acceptedAnswers.some(accepted =>
        accepted.toLowerCase() === userAnswer
      );
    });
  }

  getHints(): QuizHint[] {
    return this.hints;
  }

  getExplanation(): string {
    return this.explanation;
  }

  getFormattedCodeWithBlanks(): string {
    let formattedCode = this.codeContext;
    this.blanks.forEach((blank, index) => {
      formattedCode = formattedCode.replace(
        `{{blank_${index}}}`,
        `[입력 필드 ${index + 1}]`
      );
    });
    return formattedCode;
  }
}

// 인터페이스 정의
export interface OXQuizData {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  category: string;
  tags: string[];
  timeLimit?: number;
  points: number;
  correctAnswer: boolean;
  explanation: string;
  hints: QuizHint[];
}

export interface MultipleChoiceQuizData {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  category: string;
  tags: string[];
  timeLimit?: number;
  points: number;
  options: MultipleChoiceOption[];
  correctAnswerIndex: number;
  explanation: string;
  hints: QuizHint[];
}

export interface FillInBlankQuizData {
  id: string;
  difficulty: QuizDifficulty;
  question: string;
  category: string;
  tags: string[];
  timeLimit?: number;
  points: number;
  blanks: BlankField[];
  codeContext: string;
  explanation: string;
  hints: QuizHint[];
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCode?: boolean;
  explanation?: string;
}

export interface BlankField {
  id: string;
  position: number;
  acceptedAnswers: string[];
  hint?: string;
  placeholder?: string;
}

// 팩토리 패턴으로 Quiz 인스턴스 생성
export class QuizFactory {
  static createQuiz(type: QuizType, data: any): QuizBase {
    switch (type) {
      case QuizType.OX:
        return new OXQuiz(data as OXQuizData);
      case QuizType.MULTIPLE_CHOICE:
        return new MultipleChoiceQuiz(data as MultipleChoiceQuizData);
      case QuizType.FILL_IN_BLANK:
        return new FillInBlankQuiz(data as FillInBlankQuizData);
      default:
        throw new Error(`Unsupported quiz type: ${type}`);
    }
  }
}