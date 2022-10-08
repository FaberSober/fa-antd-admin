import React, {ReactNode} from 'react';


export interface FaLinkProps {
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2022/1/10 11:29
 */
export default function FaHref({ icon, text, onClick }: FaLinkProps) {
  return (
    <a onClick={onClick}>{icon}{text}</a>
  )
}
