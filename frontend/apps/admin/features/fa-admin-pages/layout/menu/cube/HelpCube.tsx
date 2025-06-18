import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Menu, Popover } from 'antd';
import { SITE_INFO } from '@/configs';
import { find, isNil } from 'lodash';

const HelpCubeContent = () => {
  function handleHeadDropdownClick(key: any) {
    const doc = find(SITE_INFO.HELP_DOCS, (i) => i.name === key);
    window.open(doc!.url, '_blank');
  }

  return (
    <div style={{ minWidth: 160 }}>
      <Menu
        onClick={(menu) => handleHeadDropdownClick(menu.key)}
        items={SITE_INFO.HELP_DOCS.map((i) => ({
          label: i.name,
          key: i.name,
        }))}
        style={{ border: 'none' }}
      />
    </div>
  );
};

/**
 * @author xu.pengfei
 * @date 2021/6/10
 */
export default function HelpCube() {
  if (isNil(SITE_INFO.HELP_DOCS) || SITE_INFO.HELP_DOCS.length === 0) return null;

  return (
    <div className="fa-link-grey fa-flex-center">
      <Popover placement="bottomRight" content={<HelpCubeContent />} trigger="click" getPopupContainer={() => document.body} overlayInnerStyle={{ padding: 0 }}>
        <a className="fa-menu-help-cube">
          <QuestionCircleOutlined /> 帮助文档
        </a>
      </Popover>
    </div>
  );
}
