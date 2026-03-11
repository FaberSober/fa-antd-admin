import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";


export interface FaIconProps extends Omit<FontAwesomeIconProps, 'icon'>{
  icon: string;
}

/**
 * @author xu.pengfei
 * @date 2023/1/6 09:47
 */
export default function FaIcon({icon, ...props}: FaIconProps) {
  // 解析图标名称，支持 fa-regular 和 fa-solid 前缀
  let parsedIcon = icon;
  if (icon.startsWith('fa-regular ')) {
    parsedIcon = icon.replace('fa-regular ', 'far ');
  } else if (icon.startsWith('fa-solid ')) {
    parsedIcon = icon.replace('fa-solid ', 'fas ');
  }

  return (
    <FontAwesomeIcon icon={parsedIcon as any} {...props} />
  )
}
