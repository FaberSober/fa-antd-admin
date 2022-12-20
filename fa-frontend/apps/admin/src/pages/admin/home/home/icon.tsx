import React, { useState } from 'react';
import { FontAwesomeSelect } from '@fa/ui';
import { Card, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * @author xu.pengfei
 * @date 2022/9/24 20:56
 */
export default function icon() {
  const [value, setValue] = useState<string>();

  return (
    <div className="fa-full-content fa-bg-white fa-p12" style={{ fontSize: '30px' }}>
      <Card title="使用<FontAwesomeIcon />" className="fa-mb12">
        <Space>
          <FontAwesomeIcon icon="fa-solid fa-check-square" size="2xl" />
          <FontAwesomeIcon icon="fa-solid fa-check-square" size="2xl" />
          <FontAwesomeIcon icon="fa-solid fa-circle" size="2xl" />
          <FontAwesomeIcon icon="fa-solid fa-rocket" size="2xl" />
        </Space>
      </Card>

      <Card title="选择图标" className="fa-mb12">
        <FontAwesomeSelect value={value} onChange={setValue} />
      </Card>
    </div>
  );
}
