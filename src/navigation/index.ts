/**
 * Navigation System Export Index
 * SOLID 원칙을 따른 네비게이션 시스템 통합
 */

export { default as AppNavigator } from './AppNavigator';
export type { TabName, ScreenName } from './AppNavigator';

// Navigation bridge exports
export {
  ModuleNavigationBridge,
  navigationBridge,
  resolveNavigation,
  isModularScreen,
  transformNavigationParams,
} from './ModuleNavigationBridge';
export type { ScreenMapping } from './ModuleNavigationBridge';