import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useInterval, useSize } from "ahooks";


export interface FaScrollListProps<T> {
  list: T[];
  renderItem: (item: T, index: number) => ReactNode;
  key?: string;
  num?: number;
  interval?: number;
}

/**
 * @author xu.pengfei
 * @date 2025/4/22 16:50
 */
export default function FaScrollList<T>({ list, renderItem, key = 'id', num = 10, interval = 5000 }: FaScrollListProps<T>) {
  const hoverRef = useRef(false)
  const [arrayShow, setArrayShow] = useState<T[]>([]);
  const [arrayIndex, setArrayIndex] = useState<number>(0);
  const domRef = useRef<any | null>();
  const size = useSize(domRef);

  useEffect(() => {
    if (list.length <= num) {
      setArrayShow(list)
      return;
    }

    // cal window: (arrayIndex-1, [arrayIndex, arrayIndex+num-1], arrayIndex+num)
    const tripleList = [ ...list, ...list, ...list ]
    const showArr = tripleList.slice(arrayIndex + list.length - 1, arrayIndex + list.length + num + 1)
    setArrayShow(showArr)
  }, [list, arrayIndex])

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
    setArrayIndex(index)
  }

  function scrollUp() {
    if (list.length < num) return;
    updateIndex(arrayIndex - 1)
  }

  function scrollDown() {
    if (list.length < num) return;
    updateIndex(arrayIndex + 1)
  }

  let height = 80;
  if (size && size.height) {
    height = size.height / num;
  }
  return (
    <div
      ref={domRef}
      className="fa-full fa-relative fa-scroll-hidden"
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
              transition: 'all ease-in-out 0.3s',
              height: height,
              position: 'absolute',
              top: (i - 1) * height,
              left: 0,
              right: 0,
            }}
          >
            <div className="fa-relative fa-full">
              {renderItem(v, i)}
            </div>
          </div>
        )
      })}
    </div>
  );
}
