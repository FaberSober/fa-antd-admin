import React, {ReactNode} from 'react';
import {SortableContainer, SortableContainerProps} from "react-sortable-hoc";
import {Fa} from "@/props/base";

/**
 * @author xu.pengfei
 * @date 2022/11/11 20:11
 */
export default function FaSortableContainer(props: Fa.BaseChildProps & SortableContainerProps) {

  const FaSortableContainer = SortableContainer((props: { children: ReactNode }) => <div>{props.children}</div>)

  return (
    <FaSortableContainer {...props} />
  )
}
