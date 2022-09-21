import React, {useEffect, useRef, useState} from 'react';
import {Input, InputProps} from "antd";
import { sum } from 'lodash'


export interface AutoWidthInput extends InputProps {
  defaultWidth: number;
  maxWidth?: number;
}

/**
 * @author xu.pengfei
 * @date 2021/12/3 15:08
 */
export default function AutoWidthInput({ defaultWidth = 200, maxWidth = 500, onChange, ...props }: AutoWidthInput) {
  const inputRef = useRef<any|null>()
  const [width, setWidth] = useState<number>(() => {
    return calWidth(props.value || props.defaultValue);
  })

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.input.style.width = `${calWidth(props.value || props.defaultValue)}px`
    }
  }, [props.value, props.defaultValue])

  function calWidth(value:any) {
    if (value === undefined) return defaultWidth
    const ss = value.split('');
    const lengthArr = ss.map((s:any) => {
      if (/[\u4e00-\u9fa5]/.test(s)) {
        return 16;
      } else if (/[\.\!]/.test(s)) {
        return 2;
      } else if (/[A-Z]/.test(s)) {
        return 12;
      } else if (/[a-z0-9]/.test(s)) {
        return 8;
      }
      return 4;
    })

    let newWidth = sum(lengthArr) + 55
    newWidth = newWidth < defaultWidth ? defaultWidth : newWidth;
    newWidth = maxWidth > maxWidth ? maxWidth : newWidth;
    return newWidth;
  }

  function changeWidth(e:any) {
    inputRef.current.input.style.width = `${calWidth(e.target.value)}px`

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <Input
      ref={inputRef}
      style={{ width }}
      onChange={(e) => changeWidth(e)}
      {...props}
    />
  )
}
