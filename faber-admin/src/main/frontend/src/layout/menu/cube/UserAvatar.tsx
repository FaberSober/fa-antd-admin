import React, {useContext, useMemo} from 'react';
import {LogoutOutlined, MessageOutlined, SecurityScanOutlined, UserOutlined} from '@ant-design/icons';
import {Avatar, Menu, Popover} from 'antd';
import {useIntl} from 'react-intl';
import {UserLayoutContext} from "@/layout/UserLayout";
import {useNavigate} from "react-router-dom";

const UserPopoverContent = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { logout } = useContext(UserLayoutContext);

  // 头像下拉弹框-菜单点击
  function handleHeadDropdownClick(key: string) {
    // FIXME: 这里打开个人中心菜单后，需要在tabBar中打开对于的标签页
    switch (key) {
      case 'base':
        navigate('/admin/system/account/base');
        break;
      case 'security':
        navigate('/admin/system/account/security');
        break;
      case 'msg':
        navigate('/admin/system/account/msg');
        break;
      case 'logout':
        logout();
        break;
    }
  }

  const items = useMemo(() => ([
    {
      label: intl.formatMessage({ id: 'menu.account.center' }),
      key: 'base',
      icon: <UserOutlined />,
    },
    {
      label: intl.formatMessage({ id: 'menu.account.security' }),
      key: 'security',
      icon: <SecurityScanOutlined />,
    },
    {
      label: intl.formatMessage({ id: 'menu.account.msg' }),
      key: 'msg',
      icon: <MessageOutlined />,
    },
    {
      label: intl.formatMessage({ id: 'menu.account.logout' }),
      key: 'logout',
      icon: <LogoutOutlined />,
    }
  ]), [])

  return (
    <div style={{ minWidth: 160 }}>
      <Menu
        selectedKeys={[]}
        onClick={(menu) => handleHeadDropdownClick(menu.key)}
        items={items}
      />
    </div>
  );
};

/**
 * 用户头像+用户名
 */
export default function UserAvatar() {
  const { user } = useContext(UserLayoutContext);
  return (
    <Popover placement="bottomRight" content={<UserPopoverContent />} trigger="click" getPopupContainer={() => document.body}>
      <div style={{ padding: '0 12px', cursor: 'pointer', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Avatar size="small" src={user?.img} />
        <span style={{ color: '#eee', marginLeft: 12 }}>{user.name}</span>
      </div>
    </Popover>
  );
};
