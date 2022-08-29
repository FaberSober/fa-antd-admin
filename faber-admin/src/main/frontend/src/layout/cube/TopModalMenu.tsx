import React, { useContext } from 'react';
import LayoutProps from '@/props/base/LayoutProps';
import { Menu } from 'antd';
import {FormattedMessage, useIntl} from 'react-intl';
import { UserMenuContext } from '@/layout/UserMenuLayout';
import {UserContext} from "@/layout/UserSimpleLayout";
import {hasPermission} from "@/utils/utils";
import type { MenuProps } from 'antd';


interface IProps {
  /** 顶部菜单模块配置 */
  headerModal: LayoutProps.HeaderModal;
}

const TopModalMenu = ({ headerModal }: IProps) => {
  const intl = useIntl();

  const { curTopMenu, changeCurTopMenu } = useContext(UserMenuContext);
  const { user } = useContext(UserContext);

  const { topMenus } = headerModal;
  const selectedKeys = curTopMenu ? [curTopMenu] : [];

  const items: MenuProps['items'] = topMenus
    .filter((item) => hasPermission(user.menus, item.permission))
    .map((tm) => {
      return {
        label: intl.formatMessage({ id: tm.menu }),
        key: tm.menu,
        icon: tm.icon ? tm.icon() : undefined,
        route: tm.redirect
      }
    })

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={selectedKeys}
      style={{ flex: 1 }}
      items={items}
      onClick={(tm) => {
        // tm.key = tm.menu
        changeCurTopMenu(tm.key)
      }}
    />
  );
};

export default TopModalMenu;
