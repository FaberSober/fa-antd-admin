import { FaIcon } from '@fa/icons';
import { Icon, IconProps } from '@iconify/react';
import React from 'react';

export interface FaIconProProps extends IconProps {
  icon: string;
}

/**
 * @author xu.pengfei
 * @date 2026-03-09 14:31:15
 */
export default function FaIconPro({ icon, ...props }: FaIconProProps) {
  if (icon.startsWith('mdi:')) {
    return <Icon icon={icon} fontSize='18px' className='' {...props} />
  }
  return (
    <FaIcon icon={icon} {...props} />
  );
}