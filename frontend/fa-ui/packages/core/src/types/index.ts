/** -------------------------------- BASE -------------------------------- */
export type { default as Admin } from './base/Admin';
export type { default as Rbac } from './base/Rbac';

/** -------------------------------- CORE -------------------------------- */
export { default as Fa } from './core/Fa';
export { default as FaEnums } from './core/FaEnums';
export type { default as FaUi } from './core/FaUi';
export type { default as BaseTreeProps } from './core/BaseTreeProps';
export { default as ConditionQuery } from './core/ConditionQuery';

/** -------------------------------- declare global -------------------------------- */
declare global {
  interface Window {
    FaFrom: any;
    FaVersionCode: any;
    FaVersionName: any;
  }
}