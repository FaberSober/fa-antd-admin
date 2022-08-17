import React, {useContext} from 'react';
import {LogoutOutlined} from '@ant-design/icons';
import {Avatar, Menu, Popover} from 'antd';
import {MenuInfo} from 'rc-menu/lib/interface';
import {FormattedMessage} from 'react-intl';
import {UserContext} from '@/layout/UserSimpleLayout';

const UserPopoverContent = () => {
  const { logout } = useContext(UserContext);

  // 头像下拉弹框-菜单点击
  function handleHeadDropdownClick(menu: MenuInfo) {
    if (menu.key === 'logout') {
      logout();
    }
  }

  return (
    <div style={{ minWidth: 160 }}>
      <Menu selectedKeys={[]} onClick={(menu) => handleHeadDropdownClick(menu)}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" />
        </Menu.Item>
      </Menu>
    </div>
  );
};

/**
 * 用户头像+用户名
 */
const UserAvatar = () => {
  const { user } = useContext(UserContext);
  return (
    <Popover placement="bottomRight" content={<UserPopoverContent />} trigger="click" getPopupContainer={() => document.body}>
      <div style={{ padding: '0 12px', cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size="small" src={user?.img} />
        <span style={{ color: '#eee', marginLeft: 12 }}>{user.name}</span>
      </div>
    </Popover>
  );
};

export default UserAvatar;
