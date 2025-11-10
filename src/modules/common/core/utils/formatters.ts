/**
 * 공통 포매터 함수들
 * 일관된 데이터 표시를 위한 유틸리티
 */

import { Timestamp } from '../types';

// 시간 포매터
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  return formatTime(seconds);
};

// 날짜 포매터
export const formatDate = (timestamp: Timestamp): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp: Timestamp): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (timestamp: Timestamp): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years}년 전`;
  if (months > 0) return `${months}개월 전`;
  if (weeks > 0) return `${weeks}주 전`;
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
};

// 점수 포매터
export const formatScore = (score: number, maxScore?: number): string => {
  if (maxScore) {
    return `${score}/${maxScore}`;
  }
  return score.toString();
};

export const formatPercentage = (value: number, total: number, decimals = 1): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

// 숫자 포매터
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// 텍스트 포매터
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const camelToKebab = (text: string): string => {
  return text.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

export const kebabToCamel = (text: string): string => {
  return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

// 레벨 포매터
export const formatLevel = (level: number): string => {
  return `LV${level}`;
};

export const formatLevelWithName = (level: number): string => {
  const levelNames = {
    1: 'Basic',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Expert',
    5: 'Master',
  };

  return `${formatLevel(level)} ${levelNames[level as keyof typeof levelNames] || 'Unknown'}`;
};

// 난이도 포매터
export const formatDifficulty = (difficulty: string): string => {
  const difficultyMap = {
    easy: '쉬움',
    normal: '보통',
    hard: '어려움',
    expert: '전문가',
  };

  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
};

// 상태 포매터
export const formatStatus = (status: string): string => {
  const statusMap = {
    pending: '대기중',
    in_progress: '진행중',
    completed: '완료',
    failed: '실패',
    paused: '일시정지',
    cancelled: '취소됨',
  };

  return statusMap[status as keyof typeof statusMap] || status;
};

// 에러 메시지 포매터
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }

  return '알 수 없는 오류가 발생했습니다.';
};

// 유효성 검사 메시지 포매터
export const formatValidationMessage = (field: string, rule: string): string => {
  const messages = {
    required: `${field}은(는) 필수 항목입니다.`,
    email: '올바른 이메일 형식을 입력해주세요.',
    minLength: `${field}은(는) 최소 {min}자 이상이어야 합니다.`,
    maxLength: `${field}은(는) 최대 {max}자까지 입력 가능합니다.`,
    pattern: `${field}의 형식이 올바르지 않습니다.`,
    numeric: `${field}은(는) 숫자만 입력 가능합니다.`,
  };

  return messages[rule as keyof typeof messages] || `${field} 유효성 검사 실패`;
};