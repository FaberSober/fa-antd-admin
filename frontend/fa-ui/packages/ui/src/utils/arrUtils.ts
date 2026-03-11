/*
 * A collection of array utils
 */

/**
 * find the closest item index in arr. (distance is calculated by distanceFunc)
 * @param arr
 * @param distanceFunc
 */
export function findClosestIndex<T>(arr: T[], distanceFunc: (i: T) => number) {
  let index = -1;
  let minGap = null;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const gap = distanceFunc(item);
    if (minGap === null || gap < minGap) {
      minGap = gap;
      index = i;
    }
  }
  return index;
}

/**
 * 只修改原数组并返回它自身
 * @param arr
 * @param start
 * @param deleteCount
 * @param items
 */
export function spliceAndReturnSelf<T>(
  arr: T[],
  start: number,
  deleteCount: number = 1, // 默认删除 1 个
...items: T[]
): T[] {
  arr.splice(start, deleteCount, ...items);
  return arr;
}

/**
 * 将数组中指定位置的两个元素交换，并返回一个新的数组（不会修改原数组）
 *
 * @template T 数组元素的类型
 * @param arr 原数组
 * @param from 需要交换的第一个元素下标
 * @param to 需要交换的第二个元素下标
 * @returns 返回交换后生成的新数组
 *
 * @throws {Error} 如果 from 或 to 超出数组范围，则抛出错误
 */
export function arrTransfer<T>(arr: T[], from: number, to: number): T[] {
  // 复制一份数组，避免修改原数组
  const newArr = [...arr];

  // 边界检查
  if (
    from < 0 || from >= newArr.length ||
    to < 0 || to >= newArr.length
  ) {
    throw new Error("from 或 to 超出数组范围");
  }

  // 交换
  [newArr[from], newArr[to]] = [newArr[to], newArr[from]];

  return newArr;
}

