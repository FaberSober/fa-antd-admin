import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { SITE_INFO } from '@/configs/server.config';

/**
 * @author xu.pengfei
 * @date 2021/6/10
 */
export default function HelpCube() {
  return (
    <div style={{ padding: '0 12px', cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Tooltip title="系统帮助文档" getPopupContainer={() => document.body}>
        <a href={SITE_INFO.HELP_DOC_SITE} target="_blank" rel="noopener noreferrer" style={{ color: '#eee', margin: '0 4px' }}>
          <QuestionCircleOutlined /> 帮助文档
        </a>
      </Tooltip>
    </div>
  );
}
