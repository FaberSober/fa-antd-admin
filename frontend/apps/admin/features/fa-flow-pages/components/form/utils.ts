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

/**
 * 递归更新表单项
 * @param items 表单项数组
 * @param id 要更新的表单项 ID
 * @param updates 要更新的属性
 * @returns 更新后的表单项数组
 */
export function updateFormItemById(
  items: Flow.FlowFormItem[],
  id: string,
  updates: Partial<Flow.FlowFormItem>
): Flow.FlowFormItem[] {
  return items.map((item) => {
    if (item.id === id) {
      // 找到目标项,合并更新
      return { ...item, ...updates };
    }
    // 如果有 children,递归更新
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: updateFormItemById(item.children, id, updates),
      };
    }
    return item;
  });
}

/**
 * 递归删除表单项
 * @param items 表单项数组
 * @param id 要删除的表单项 ID
 * @returns 删除后的表单项数组
 */
export function removeFormItemById(
  items: Flow.FlowFormItem[],
  id: string
): Flow.FlowFormItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => {
      // 如果有 children,递归删除
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: removeFormItemById(item.children, id),
        };
      }
      return item;
    });
}
