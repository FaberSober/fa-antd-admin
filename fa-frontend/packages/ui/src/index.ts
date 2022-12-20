// import DragModalProps from '@/components/modal/DragModal';

export type { default as FaUi } from '@/types/FaUi';
export type { default as BaseTreeProps } from '@/types/BaseTreeProps';
// export type { DragModalProps }

export * from '@/components/antd-pro';
export * from '@/components/auth';
export * from '@/components/base-cascader';
export * from '@/components/base-drag';
export * from '@/components/base-input';
export * from '@/components/base-layout';
export * from '@/components/base-search-select';
export * from '@/components/base-select';
export * from '@/components/base-title';
export * from '@/components/base-tree';
export * from '@/components/container';
export * from '@/components/decorator';
export * from '@/components/icons';
export * from '@/components/modal';

export { default as Button } from '@/components/Button';

// 添加fontawesome icons图标
console.log('添加fontawesome icons图标');
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
