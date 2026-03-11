import React, { useContext, useMemo } from 'react';
import { LogoutOutlined, MessageOutlined, SecurityScanOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Divider, Menu, Popover, Switch } from 'antd';
import { useIntl } from 'react-intl';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import { InputColor, ThemeLayoutContext } from '@fa/ui';
import UserLayoutContext from '../../user/context/UserLayoutContext';
import MenuLayoutContext from '../context/MenuLayoutContext';
import './UserAvatar.scss';

const UserPopoverContent = () => {
  const intl = useIntl();
  const { setColorPrimary, themeDark, setThemeDark } = useContext(ThemeLayoutContext);
  const { logout } = useContext(UserLayoutContext);
  const { addTab, showTabs, setShowTabs } = useContext(MenuLayoutContext);
  const { user } = useContext(UserLayoutContext);

  // 头像下拉弹框-菜单点击
  function handleHeadDropdownClick(key: any) {
    // FIX-ME: 这里打开个人中心菜单后，需要在tabBar中打开对于的标签页
    switch (key) {
      case 'base':
        addTab({
          key: key,
          path: '/admin/system/account/base',
          name: intl.formatMessage({ id: 'menu.account.center' }),
        });
        break;
      case 'security':
        addTab({
          key: key,
          path: '/admin/system/account/security',
          name: intl.formatMessage({ id: 'menu.account.security' }),
        });
        break;
      case 'msg':
        addTab({
          key: key,
          path: '/admin/system/account/msg',
          name: intl.formatMessage({ id: 'menu.account.msg' }),
        });
        break;
      case 'logout':
        logout();
        break;
    }
  }

  const items = useMemo(
    () => [
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
      },
    ],
    [],
  );

  function handleChangeThemeColor(color: string) {
    // set antd theme primary color
    setColorPrimary(color);

    // set css theme color
    const rootDom = document.getElementsByTagName('body')[0].style;
    rootDom.setProperty('--primary-color', color);
  }

  const primaryColor = document.body.style.getPropertyValue('--primary-color');

  return (
    <div style={{ minWidth: 240 }}>
      {/* <div className="fa-flex-row-center" >
        <InputColor value={primaryColor} onChange={(v: string) => handleChangeThemeColor(v)} style={{ width: 25, height: 25 }} />

        <div className="fa-flex-row-center fa-mr8">
          {['#F5222D', '#faad14', '#50CEE3', '#1677ff', '#722ED1', '#053553'].map((i) => (
            <div key={i} className="fa-hover" style={{ width: 25, height: 25, background: i }} onClick={() => handleChangeThemeColor(i)} />
          ))}
        </div>

        <Switch checkedChildren="暗色" unCheckedChildren="亮色" checked={themeDark} onChange={setThemeDark} />
      </div>

      <div className="fa-flex-row-center fa-mt12 fa-mb12" >
        <div className="fa-flex-1" style={{ paddingLeft: 20 }}>
          是否展示标签栏
        </div>
        <div>
          <Switch checkedChildren="展示" unCheckedChildren="隐藏" checked={showTabs} onChange={setShowTabs} />
        </div>
      </div> */}

      <div className='fa-p12 fa-flex-row fa-border-b'>
        <div className="fa-user-avatar-big">
          <img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />
          <div className='fa-user-online-badge' />
        </div>
        <div className='fa-ml12'>
          <div className='fa-text-bold'>{user.name}</div>
          <div className='fa-text-muted'>{user.email}</div>
        </div>
      </div>
      <Menu selectedKeys={[]} onClick={(menu) => handleHeadDropdownClick(menu.key)} items={items} style={{ border: 'none' }} />
    </div>
  );
};

/**
 * 用户头像+用户名
 */
export default function UserAvatar() {
  const { user } = useContext(UserLayoutContext);
  return (
    <Popover
      placement="bottom"
      content={<UserPopoverContent />}
      // trigger="click"
      getPopupContainer={() => document.body}
      styles={{
        container: {
          padding: 0,
        },
      }}
    >
      <div className="fa-user-avatar">
        <img src={fileSaveApi.genLocalGetFilePreview(user.img)} alt={user.name} />
        <div className='fa-user-online-badge' />
        {/* <span style={{ marginLeft: 12 }}>{user?.name}</span> */}
      </div>
    </Popover>
  );
}
