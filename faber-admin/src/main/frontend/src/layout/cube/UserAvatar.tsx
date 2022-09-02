import React, {useContext, useMemo} from 'react';
import {LogoutOutlined} from '@ant-design/icons';
import {Avatar, Menu, Popover} from 'antd';
import {useIntl} from 'react-intl';
import {UserContext} from '@/layout/UserSimpleLayout';

const UserPopoverContent = () => {
  const intl = useIntl();
  const { logout } = useContext(UserContext);

  // 头像下拉弹框-菜单点击
  function handleHeadDropdownClick(key: string) {
    if (key === 'logout') {
      logout();
    }
  }

  return (
    <div style={{ minWidth: 160 }}>
      <Menu
        selectedKeys={[]}
        onClick={(menu) => handleHeadDropdownClick(menu.key)}
        items={[
          {
            label: intl.formatMessage({ id: 'menu.account.logout' }),
            key: 'logout',
            icon: <LogoutOutlined />,
          }
        ]}
      />
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
