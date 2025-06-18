import React, { useRef } from 'react';
import type { Admin } from '@/types';
import { Descriptions } from 'antd';
// import MonacoEditor from 'react-monaco-editor';
import { useSize } from 'ahooks';

export interface SystemUpdateLogViewProps {
  record: Admin.SystemUpdateLog;
}

/**
 * @author xu.pengfei
 * @date 2023/2/20 14:57
 */
export default function SystemUpdateLogView({ record }: SystemUpdateLogViewProps) {
  const domRef = useRef<any | null>();
  const size = useSize(domRef);

  return (
    <Descriptions bordered column={1} labelStyle={{ width: 120 }}>
      <Descriptions.Item label="模块编码">{record.no}</Descriptions.Item>
      <Descriptions.Item label="模块名称">{record.name}</Descriptions.Item>
      <Descriptions.Item label="版本号">{record.ver}</Descriptions.Item>
      <Descriptions.Item label="版本编码">{record.verNo}</Descriptions.Item>
      <Descriptions.Item label="备注信息">{record.remark}</Descriptions.Item>
      <Descriptions.Item label="SQL执行内容">
        <div ref={domRef} style={{ height: 600 }}>
          {size && size.height && (
            <div className="fa-break-word">{record.log}</div>
            // <MonacoEditor
            //   height={size.height}
            //   language="sql"
            //   theme="vs-dark"
            //   value={record.log}
            //   options={{
            //     readOnly: true,
            //     selectOnLineNumbers: true,
            //     folding: true,
            //     minimap: { enabled: true },
            //   }}
            // />
          )}
        </div>
      </Descriptions.Item>
    </Descriptions>
  );
}
