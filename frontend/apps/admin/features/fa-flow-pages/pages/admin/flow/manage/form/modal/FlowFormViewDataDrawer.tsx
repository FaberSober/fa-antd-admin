import { Flow } from '@/types';
import { FileSearchOutlined } from '@ant-design/icons';
import { FaHref } from '@fa/ui';
import { Drawer } from 'antd';
import React, { useState } from 'react';
import FlowFormDataTable from '../cube/data/FlowFormDataTable';
import FormSimpleTable from '../../../view/form/simpleTable/FormSimpleTable';


export interface FlowFormViewDataDrawerProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-19 13:44:06
 */
export default function FlowFormViewDataDrawer({ item }: FlowFormViewDataDrawerProps) {
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true)
  }

  return (
    <span>
      <FaHref onClick={() => handleOpen()} text='数据' icon={<FileSearchOutlined />} />
      <Drawer
        title="查询数据"
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        size={window.document.body.clientWidth}
        resizable
      >
        {open && (
          <div className='fa-full-content'>
            {/* 流程类型表格 */}
            {item.flowProcessId && <FlowFormDataTable flowForm={item} />}
            {/* 普通类型表格 */}
            {!item.flowProcessId && <FormSimpleTable flowForm={item} />}
          </div>
        )}
      </Drawer>
    </span>
  );
}
