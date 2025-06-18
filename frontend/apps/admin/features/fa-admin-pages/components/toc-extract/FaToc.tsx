import React, { type CSSProperties, type HTMLAttributes, useEffect, useState } from 'react';
import { useScroll } from 'ahooks';
import './FaToc.scss';
import { isNil } from 'lodash';

/**
 * @returns 随机生产长size位的字母[a-z]
 */
export function generateId(size = 8) {
  let str = '';
  for (let i = 0; i < size; i++) {
    const code = Math.floor(Math.random() * 26);
    str += String.fromCharCode('a'.charCodeAt(0) + code);
  }
  return str;
}

function extractLevel(heading: Element) {
  if (heading.tagName.length !== 2 || heading.tagName[0].toLowerCase() !== 'h') {
    // throw new Error(`encountered invalid heading tagName ${heading.tagName}`)
    return 1;
  }

  return Number(heading.tagName.substring(1));
}

export interface FaTocProps extends HTMLAttributes<any> {
  parentDomId: string; // 滚动容器dom的id，监听dom的滚动位置
  domId: string; // html富文本内容，侦测此dom元素的h标签结构
  style?: CSSProperties;
  onClickToc?: (toc: CalElement) => void;
}

interface CalElement {
  id: string;
  element: HTMLElement;
  top: number;
  bottom: number;
  level: number;
}

let TOP_GAP = 109; // 距离顶部的高度默认距离

/**
 * 识别dom元素中的h标签，生成目录
 * @author xu.pengfei
 * @date 2023/7/3 15:53
 */
export default function FaToc({ parentDomId, domId, onClickToc, style, ...props }: FaTocProps) {
  const [calElements, setCalElements] = useState<CalElement[]>([]);

  const scroll = useScroll(document.getElementById(parentDomId));
  // console.log('scroll', scroll)

  useEffect(() => {
    const dom = document.getElementById(domId);
    if (isNil(dom)) return;

    const headings: HTMLElement[] = Array.from(dom!.querySelectorAll('h1,h2,h3,h4,h5,h6'));

    const calElements: CalElement[] = headings.map((v, i) => {
      let bottom = 9999999;
      if (i < headings.length - 1) {
        const nextEle = headings[i + 1];
        bottom = nextEle.offsetTop;
      }
      const id = generateId();
      v.setAttribute('id', id);

      const level = extractLevel(v); // 识别h1、h2的后缀数字
      return {
        id,
        element: v,
        top: v.offsetTop,
        bottom,
        level,
      };
    });
    // console.log('calElements', calElements)
    setCalElements(calElements);

    if (calElements && calElements[0]) {
      TOP_GAP = calElements[0].top;
    }
  }, [domId]);

  function handleClickTocLink(toc: CalElement) {
    const parentDom = document.getElementById(parentDomId);
    if (parentDom) {
      parentDom.scrollTo(0, toc.top);
    }
    const originBg = toc.element.style.backgroundColor;
    toc.element.style.transition = 'var(--fa-transition)';
    toc.element.style.backgroundColor = 'var(--primary-color)';
    setTimeout(() => {
      toc.element.style.backgroundColor = originBg;
    }, 1000);

    if (onClickToc) {
      onClickToc(toc);
    }
  }

  return (
    <div style={{ ...style }} className="fa-toc fa-scroll-auto-y" {...props}>
      {/*{loopToc(array, 0)}*/}
      {/* 使用计算后的flatTreeList生成列表 */}
      {calElements.map((toc, index) => {
        let sel = false;
        if (scroll) {
          const fixScrollTop = scroll.top + TOP_GAP;
          if (fixScrollTop >= toc.top && fixScrollTop < toc.bottom) {
            sel = true;
          }
        }
        // 初始化未滚动的情况
        if (index === 0) {
          if (scroll === undefined || scroll.top === 0) {
            sel = true;
          }
        }
        return (
          <div
            key={toc.id}
            className={sel ? 'fa-toc-item-sel' : 'fa-toc-item'}
            style={{ paddingLeft: toc.level * 12 + 6 }}
            fa-toc-id={toc.id}
            onClick={() => handleClickTocLink(toc)}
          >
            <span>{toc.element.innerText}</span>
            {sel && <div className="fa-toc-item-slider" />}
          </div>
        );
      })}
    </div>
  );
}
