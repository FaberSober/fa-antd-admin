import { Flow } from '@/types';

/**
 * 递归查找表单项
 * @param items 表单项数组
 * @param id 要查找的表单项 ID
 * @returns 找到的表单项,如果未找到则返回 undefined
 */
export function findFormItemById(
  items: Flow.FlowFormItem[],
  id: string
): Flow.FlowFormItem | undefined {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
    // 如果有 children,递归查找
    if (item.children && item.children.length > 0) {
      const found = findFormItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
