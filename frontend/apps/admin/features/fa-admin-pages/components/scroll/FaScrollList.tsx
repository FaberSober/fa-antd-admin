import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useInterval, useSize } from "ahooks";


export interface FaScrollListProps<T> {
  list: T[];
  renderItem: (item: T, index: number, seq: number) => ReactNode;
  key?: string;
  num?: number;
  interval?: number;
  itemMinHeight?: number;
}

/**
 * @author xu.pengfei
 * @date 2025/4/22 16:50
 */
export default function FaScrollList<T>({ list, renderItem, key = 'id', num = 10, interval = 5000, itemMinHeight = 30 }: FaScrollListProps<T>) {
  const hoverRef = useRef(false)
  const [arrayShow, setArrayShow] = useState<(T & { _seq: number })[]>([]);
  const [arrayIndex, setArrayIndex] = useState<number>(0);
  const domRef = useRef<any | null>();
  const size = useSize(domRef);
  const [showNum, setShowNum] = useState(num)

  useEffect(() => {
    // 根据item最小高度计算最大能展示的item数量
    let showNumCal = num;
    if (size && size.height && itemMinHeight > 0) {
      const maxNum = Math.floor(size.height / itemMinHeight)
      if (showNumCal > maxNum) {
        showNumCal = maxNum;
      }
    }
    setShowNum(showNumCal)
  }, [size])

  let height = 80;
  if (size && size.height) {
    height = size.height / showNum;
  }

  useEffect(() => {
    const listClone = list.map((item, index) => ({ ...item, _seq: index }))
    if (listClone.length <= showNum) {
      setArrayShow(listClone)
      return;
    }

    // cal window: (arrayIndex-1, [arrayIndex, arrayIndex+num-1], arrayIndex+num)
    const tripleList = [ ...listClone, ...listClone, ...listClone ]
    const showArr = tripleList.slice(arrayIndex + listClone.length, arrayIndex + listClone.length + showNum + 1)
    setArrayShow(showArr)
  }, [list, arrayIndex, showNum])

  useInterval(() => {
    if (hoverRef.current) return;
    scrollDown()
  }, interval)

  function updateIndex(newIndex: number) {
    let index = newIndex;
    if (index < 0) {
      index = list.length - 1
    }
    if (index >= list.length) {
      index = 0
    }
    if (index !== arrayIndex) {
      setArrayIndex(index)
    }
  }

  function scrollUp() {
    if (list.length <= showNum) return;
    updateIndex(arrayIndex - 1)
  }

  function scrollDown() {
    if (list.length <= showNum) return;
    updateIndex(arrayIndex + 1)
  }

  return (
    <div
      ref={domRef}
      className="fa-full fa-relative fa-scroll-hidden"
      onFocus={() => hoverRef.current = true}
      onMouseOver={() => hoverRef.current = true}
      onMouseLeave={() => hoverRef.current = false}
      onWheel={e => {
        if (e.deltaY > 0) { // wheel up
          scrollUp()
        } else { // wheel down
          scrollDown()
        }
      }}
    >
      {arrayShow.map((v, i) => {
        return (
          <div
            // @ts-ignore
            key={v[key]}
            style={{
              transition: (i >= showNum) ? '' : 'all ease-in-out 0.3s',
              height: height,
              position: 'absolute',
              top: (i) * height,
              left: 0,
              right: 0,
            }}
          >
            <div className="fa-relative fa-full">
              {renderItem(v, i, v._seq)}
            </div>
          </div>
        )
      })}
    </div>
  );
}
