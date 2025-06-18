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
  return (
    <FontAwesomeIcon icon={icon as any} {...props} />
  )
}