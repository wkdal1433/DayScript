/**
 * 간단한 메모리 캐시 구현체
 * SOLID 원칙 중 ISP(인터페이스 분리) 적용
 */

import { IQuizCache } from '../../quiz/core/domain/IQuizRepository';

interface CacheItem<T> {
  data: T;
  expiry: number;
}

export class SimpleCache implements IQuizCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 3600; // 1시간

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 만료 검사
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiry = Date.now() + ((ttl || this.defaultTTL) * 1000);

    this.cache.set(key, {
      data: value,
      expiry,
    });
  }

  async invalidate(pattern: string): Promise<void> {
    // 간단한 패턴 매칭 (와일드카드 * 지원)
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  // 캐시 통계 메서드들
  getSize(): number {
    return this.cache.size;
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // 만료된 항목들 정리
  cleanup(): void {
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}