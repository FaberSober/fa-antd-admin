import React, {ReactNode} from 'react';
import {SortableElement} from "react-sortable-hoc";

export interface SortableItemProps {
  index: number;
  children: ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2022/11/11
 */
export default function FaSortableItem({index, children}: SortableItemProps) {

  const SortableItemComponent = SortableElement(({}: any) => (children));

  return (
    <SortableItemComponent index={index} />
  )

}
