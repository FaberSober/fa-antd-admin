import React, { useContext } from 'react';
import LayoutProps from '@/props/base/LayoutProps';
import { Menu } from 'antd';
import { FormattedMessage } from 'react-intl';
import { UserMenuContext } from '@/layout/UserMenuLayout';
import {UserContext} from "@/layout/UserSimpleLayout";
import {hasPermission} from "@/utils/utils";

interface IProps {
  /** 顶部菜单模块配置 */
  headerModal: LayoutProps.HeaderModal;
}

const TopModalMenu = ({ headerModal }: IProps) => {
  const { curTopMenu, changeCurTopMenu } = useContext(UserMenuContext);
  const { user } = useContext(UserContext);

  const { topMenus } = headerModal;
  const selectedKeys = curTopMenu ? [curTopMenu] : [];

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} style={{ flex: 1 }}>
      {topMenus
        // 顶部菜单权限过滤
        .filter((item) => hasPermission(user.menus, item.permission))
        .map((tm) => (
          <Menu.Item key={tm.menu} onClick={() => changeCurTopMenu(tm.menu)}>
            {tm.icon && <span style={{ marginRight: 6 }}>{tm.icon()}</span>}
            <FormattedMessage id={tm.menu} />
          </Menu.Item>
        ))}
    </Menu>
  );
};

export default TopModalMenu;
