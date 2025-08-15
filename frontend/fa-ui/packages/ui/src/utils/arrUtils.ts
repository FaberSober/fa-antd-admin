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
