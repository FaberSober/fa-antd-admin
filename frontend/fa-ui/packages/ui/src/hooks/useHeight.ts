import { useEffect, useState } from 'react';
import { useSize } from 'ahooks';

/**
 * 获取ref的高
 * @author xu.pengfei
 * @date 2022/10/14
 */
export default function useHeight(ref: any) {
  const size = useSize(ref);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    if (height !== undefined) return;
    if (size && size.height) {
      setHeight(size.height);
    }
  }, [size]);

  return height;
}
