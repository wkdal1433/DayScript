/**
 * 공통 유효성 검사 함수들
 * 일관된 데이터 검증을 위한 유틸리티
 */

// 기본 유효성 검사 함수들
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const isMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const isNumeric = (value: string): boolean => {
  return /^\d+$/.test(value);
};

export const isFloat = (value: string): boolean => {
  return /^\d+(\.\d+)?$/.test(value);
};

export const isInteger = (value: string): boolean => {
  return Number.isInteger(Number(value));
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// 패스워드 유효성 검사
export const isStrongPassword = (password: string): boolean => {
  // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const passwordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
};

// URL 유효성 검사
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 한국어 이름 유효성 검사
export const isKoreanName = (name: string): boolean => {
  const koreanNameRegex = /^[가-힣]{2,10}$/;
  return koreanNameRegex.test(name);
};

// 사용자명 유효성 검사
export const isValidUsername = (username: string): boolean => {
  // 3-20자, 영문자, 숫자, 언더스코어만 허용
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// 전화번호 유효성 검사 (한국)
export const isKoreanPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(010|011|016|017|018|019)-\d{3,4}-\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

// 파일 유효성 검사
export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

export const isValidImageFile = (filename: string): boolean => {
  return isValidFileType(filename, ['jpg', 'jpeg', 'png', 'gif', 'webp']);
};

export const isValidVideoFile = (filename: string): boolean => {
  return isValidFileType(filename, ['mp4', 'avi', 'mov', 'wmv', 'flv']);
};

// 날짜 유효성 검사
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

// 복합 유효성 검사
export interface ValidationRule {
  field: string;
  value: any;
  rules: Array<{
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    params?: any;
    message?: string;
    validator?: (value: any) => boolean;
  }>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateField = (rule: ValidationRule): { isValid: boolean; error?: string } => {
  for (const validation of rule.rules) {
    let isValid = true;
    let defaultMessage = '';

    switch (validation.type) {
      case 'required':
        isValid = isRequired(rule.value);
        defaultMessage = `${rule.field}은(는) 필수 항목입니다.`;
        break;
      case 'email':
        isValid = isEmail(rule.value);
        defaultMessage = '올바른 이메일 형식을 입력해주세요.';
        break;
      case 'minLength':
        isValid = isMinLength(rule.value, validation.params);
        defaultMessage = `${rule.field}은(는) 최소 ${validation.params}자 이상이어야 합니다.`;
        break;
      case 'maxLength':
        isValid = isMaxLength(rule.value, validation.params);
        defaultMessage = `${rule.field}은(는) 최대 ${validation.params}자까지 입력 가능합니다.`;
        break;
      case 'pattern':
        isValid = validation.params.test(rule.value);
        defaultMessage = `${rule.field}의 형식이 올바르지 않습니다.`;
        break;
      case 'custom':
        isValid = validation.validator ? validation.validator(rule.value) : true;
        defaultMessage = `${rule.field} 유효성 검사 실패`;
        break;
    }

    if (!isValid) {
      return {
        isValid: false,
        error: validation.message || defaultMessage,
      };
    }
  }

  return { isValid: true };
};

export const validateForm = (rules: ValidationRule[]): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const rule of rules) {
    const result = validateField(rule);
    if (!result.isValid && result.error) {
      errors[rule.field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// 퀴즈 관련 유효성 검사
export const isValidQuizAnswer = (answer: any, expectedType: 'boolean' | 'string' | 'number' | 'array'): boolean => {
  switch (expectedType) {
    case 'boolean':
      return typeof answer === 'boolean';
    case 'string':
      return typeof answer === 'string' && answer.trim().length > 0;
    case 'number':
      return typeof answer === 'number' && !isNaN(answer);
    case 'array':
      return Array.isArray(answer) && answer.length > 0;
    default:
      return false;
  }
};

export const isValidQuizTime = (timeInSeconds: number): boolean => {
  return timeInSeconds > 0 && timeInSeconds <= 3600; // 최대 1시간
};

export const isValidDifficultyLevel = (level: number): boolean => {
  return Number.isInteger(level) && level >= 1 && level <= 5;
};