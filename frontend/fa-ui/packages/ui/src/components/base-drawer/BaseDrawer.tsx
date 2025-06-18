import React, { createContext, ReactNode, useEffect, useState } from 'react';
import {Drawer, DrawerProps} from "antd";
import { FaResizeHorizontal } from "@ui/components";
import { FaUtils } from "@ui/utils";

export interface BaseDrawerContextProps {
  closeDrawer: () => void;
}

export const BaseDrawerContext = createContext<BaseDrawerContextProps>({ closeDrawer: () => {} });

export interface BaseDrawerProps extends DrawerProps {
  hideResize?: boolean;
  triggerDom?: ReactNode;
}

/**
 * @author xu.pengfei
 * @date 2022/12/28 10:41
 */
export default function BaseDrawer({children, hideResize = false, triggerDom, bodyStyle, onClose, ...props }: BaseDrawerProps) {
  const [open, setOpen] = useState(false);
  const [id] = useState(FaUtils.uuid())
  const [id1] = useState(FaUtils.uuid())

  useEffect(() => {
    setParentId()
  }, [open])

  function setParentId(delay = 500) {
    setTimeout(() => {
      const dom = document.getElementById(id1)
      if (dom) {
        dom.parentElement?.setAttribute("id", id)
      }
    }, delay)
  }

  return (
    <BaseDrawerContext.Provider value={{closeDrawer: () => setOpen(false)}}>
      <span>
        <span
          onClick={() => {
            setOpen(true)
            setParentId()
          }}
        >{triggerDom}</span>
        <Drawer
          title="查看详情"
          open={open}
          onClose={(e) => {
            setOpen(false)
            if (onClose) onClose(e)
          }}
          width={700}
          styles={{ body: { position: 'relative', ...bodyStyle } }}
          id={id1}
          {...props}
        >
          {(open || props.forceRender) && (
            <>
              {children}
              {!hideResize && <FaResizeHorizontal domId={id} position="left" style={{left: 0}} minWidth={200} />}
            </>
          )}
        </Drawer>
      </span>
    </BaseDrawerContext.Provider>
  )
}
