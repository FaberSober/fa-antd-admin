import React from 'react';
import { Table } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

export interface UpdateLogTableProps {
  content: string;
}

/**
 * @author xu.pengfei
 * @date 2022/10/13
 */
export default function UpdateLogTable({ content }: UpdateLogTableProps) {
  let array = [];
  try {
    array = JSON.parse(content);
  } catch (e) {
    console.error(e);
  }

  function renderVal(value: any, rich: any) {
    if (rich) {
      return <div style={{ minWidth: 100 }} dangerouslySetInnerHTML={{ __html: value }} />;
    }
    return <span>{value}</span>;
  }

  return (
    <Table
      bordered
      showHeader={false}
      dataSource={array}
      columns={[
        { dataIndex: 'name', title: '属性', width: 100 },
        { dataIndex: 'old', title: '变更前', render: (val, record) => renderVal(val, record.rich) },
        { dataIndex: 'field', title: 'field', render: () => <ArrowRightOutlined />, width: 30 },
        { dataIndex: 'new', title: '变更后', render: (val, record) => renderVal(val, record.rich) },
      ]}
      rowKey="field"
      size="small"
      pagination={false}
    />
  );
}
