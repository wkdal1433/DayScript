/**
 * Module Navigation Bridge
 * SOLID 원칙 중 OCP(개방-폐쇄)를 적용한 네비게이션 브릿지
 * 기존 네비게이션 시스템과 새 모듈 구조 간의 원활한 통합을 위한 어댑터
 */

import { ScreenName } from './AppNavigator';

// 레거시 화면과 새 모듈 화면 간의 매핑
export interface ScreenMapping {
  legacy: ScreenName;
  modular: ScreenName;
  level?: number;
  enabled: boolean;
}

// 화면 매핑 설정
const SCREEN_MAPPINGS: ScreenMapping[] = [
  {
    legacy: 'OXProblem',
    modular: 'Lv1OXProblem',
    level: 1,
    enabled: true, // 새 모듈 화면 활성화 여부
  },
  // TODO: 추후 LV2, LV3 매핑 추가
  // {
  //   legacy: 'MultipleChoiceProblem',
  //   modular: 'Lv2MultipleChoiceProblem',
  //   level: 2,
  //   enabled: false,
  // },
];

// 네비게이션 브릿지 클래스
export class ModuleNavigationBridge {
  private mappings: Map<string, ScreenMapping>;

  constructor() {
    this.mappings = new Map();
    this.initializeMappings();
  }

  private initializeMappings(): void {
    SCREEN_MAPPINGS.forEach(mapping => {
      this.mappings.set(mapping.legacy, mapping);
    });
  }

  /**
   * 레거시 화면 이름을 새 모듈 화면 이름으로 변환
   * @param legacyScreen 레거시 화면 이름
   * @param level 레벨 (선택적)
   * @returns 변환된 화면 이름 또는 원래 화면 이름
   */
  resolveScreen(legacyScreen: ScreenName, level?: number): ScreenName {
    const mapping = this.mappings.get(legacyScreen);

    if (!mapping || !mapping.enabled) {
      return legacyScreen; // 매핑이 없거나 비활성화된 경우 원래 화면 반환
    }

    // 레벨이 지정된 경우 해당 레벨과 일치하는지 확인
    if (level && mapping.level && mapping.level !== level) {
      return legacyScreen;
    }

    return mapping.modular;
  }

  /**
   * 특정 화면이 새 모듈로 마이그레이션되었는지 확인
   * @param screen 화면 이름
   * @returns 마이그레이션 여부
   */
  isMigrated(screen: ScreenName): boolean {
    const mapping = this.mappings.get(screen);
    return mapping ? mapping.enabled : false;
  }

  /**
   * 마이그레이션된 모든 화면 목록 반환
   * @returns 마이그레이션된 화면 매핑 배열
   */
  getMigratedScreens(): ScreenMapping[] {
    return Array.from(this.mappings.values()).filter(mapping => mapping.enabled);
  }

  /**
   * 특정 레벨의 화면들 반환
   * @param level 레벨
   * @returns 해당 레벨의 화면 매핑 배열
   */
  getScreensByLevel(level: number): ScreenMapping[] {
    return Array.from(this.mappings.values()).filter(
      mapping => mapping.level === level && mapping.enabled
    );
  }

  /**
   * 화면 매핑 동적 업데이트 (런타임에 기능 플래그 토글)
   * @param legacyScreen 레거시 화면 이름
   * @param enabled 활성화 여부
   */
  toggleScreenMapping(legacyScreen: ScreenName, enabled: boolean): void {
    const mapping = this.mappings.get(legacyScreen);
    if (mapping) {
      mapping.enabled = enabled;
    }
  }

  /**
   * 네비게이션 파라미터 변환
   * 레거시 파라미터를 새 모듈 파라미터로 변환
   */
  transformParams(
    screen: ScreenName,
    legacyParams: any
  ): any {
    const mapping = this.mappings.get(screen);

    if (!mapping || !mapping.enabled) {
      return legacyParams;
    }

    // 기본 변환 로직
    const transformedParams = {
      ...legacyParams,
      level: mapping.level,
    };

    // 화면별 특별한 변환 로직
    switch (mapping.modular) {
      case 'Lv1OXProblem':
        return {
          ...transformedParams,
          quizId: legacyParams.problemId || `lv1_ox_${Date.now()}`,
          returnRoute: legacyParams.returnRoute || 'Practice',
        };
      default:
        return transformedParams;
    }
  }
}

// 싱글톤 인스턴스 생성
export const navigationBridge = new ModuleNavigationBridge();

// 편의 함수들
export const resolveNavigation = (screen: ScreenName, level?: number): ScreenName => {
  return navigationBridge.resolveScreen(screen, level);
};

export const isModularScreen = (screen: ScreenName): boolean => {
  return navigationBridge.isMigrated(screen);
};

export const transformNavigationParams = (screen: ScreenName, params: any): any => {
  return navigationBridge.transformParams(screen, params);
};