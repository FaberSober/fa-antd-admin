import React from 'react';
import {
  ContactsOutlined,
  EyeOutlined,
  FontColorsOutlined,
  HomeOutlined,
  MenuOutlined,
  MessageOutlined,
  NotificationOutlined,
  SettingFilled,
} from '@ant-design/icons';
import LayoutProps from '@/props/base/LayoutProps';
import {IconFont} from '@/components/antd-pro';

interface Props {
  HOME: LayoutProps.HeaderModal;
  SYSTEM: LayoutProps.HeaderModal;
}

const modal: Props = {
  // Home
  HOME: {
    name: 'base.modal.home',
    link: '/home/dashboard',
    img: '/static/modal/datav-show.png',
    topMenus: [
      {
        permission: 'top-home-manage',
        menu: 'menu.top.home',
        modal: 'home',
        redirect: '/home/dashboard',
        routes: [
          // 工作台
          {
            permission: 'home.dashboard',
            name: 'home.dashboard',
            path: '/home/dashboard',
            icon: () => <HomeOutlined />,
          },
        ],
      },
    ],
  },

  // 系统管理
  SYSTEM: {
    name: 'base.modal.system',
    link: '/system/account/base',
    img: '/static/modal/sysmanage.png',
    topMenus: [
      {
        permission: 'top-human-manage',
        menu: 'menu.top.human',
        modal: 'human_manage',
        redirect: '/system/human_manage/user',
        icon: () => <IconFont type="icon-users" />,
        routes: [
          // 基本用户管理
          {
            permission: 'system:base:user',
            name: 'human_manage.user',
            path: '/system/human_manage/user',
            icon: () => <IconFont type="icon-users" />,
          },
          // 部门管理
          {
            permission: 'system:base:department',
            name: 'human_manage.department',
            path: '/system/human_manage/department',
            icon: () => <IconFont type="icon-usermanagement" />,
          },
          // 角色权限管理
          {
            permission: 'system:base:groupAuthManage',
            name: 'human_manage.groupAuthManage',
            path: '/system/human_manage/role_auth',
            icon: () => <IconFont type="icon-user_management" />,
          },
        ],
      },
      // 系统配置
      {
        permission: 'top-system-setting',
        menu: 'menu.top.system',
        modal: 'sys_setting',
        redirect: '/system/base/menu',
        icon: () => <SettingFilled />,
        routes: [
          // 菜单管理
          {
            permission: 'system:base:menuManager',
            name: 'system.menu',
            path: '/system/base/menu',
            icon: () => <MenuOutlined />,
          },
          // 字典管理
          {
            permission: 'system:base:dict',
            name: 'system.dict',
            path: '/system/base/dict',
            icon: () => <FontColorsOutlined />,
          },
          // 中国地区管理
          {
            permission: 'system:base:area',
            name: 'system.area',
            path: '/system/base/area',
            icon: () => <IconFont type="icon-china" />,
          },
          // 定时任务
          {
            permission: 'system:base:job',
            name: 'system.job',
            path: '/system/base/job',
            icon: () => <IconFont type="icon-clock" />,
          },
          // 请求日志
          {
            permission: 'system:base:gateLog',
            name: 'system.gateLog',
            path: '/system/base/gateLog',
            icon: () => <IconFont type="icon-clock" />,
          },
          // 通知与公告
          {
            permission: 'system:base:notice',
            name: 'system.notice',
            path: '/system/base/notice',
            icon: () => <NotificationOutlined />,
          },
        ],
      },
      // 个人中心
      {
        permission: 'top-myCenter',
        menu: 'menu.top.account',
        modal: 'account',
        redirect: '/system/account/base',
        icon: () => <ContactsOutlined />,
        routes: [
          // 基本信息
          {
            permission: 'myCenter:base',
            name: 'account.base',
            path: '/system/account/base',
            icon: () => <ContactsOutlined />
          },
          // 更新密码
          {
            permission: 'myCenter:security',
            name: 'account.security',
            path: '/system/account/security',
            icon: () => <EyeOutlined />
          },
          // { name: 'account.api_token', path: '/system/account/api_token', icon: () => <KeyOutlined /> }, // 密钥管理
          // 消息中心
          {
            permission: 'myCenter:msg',
            name: 'account.msg',
            path: '/system/account/msg',
            icon: () => <MessageOutlined />
          },
        ],
      },
    ],
  },

};

export default modal;
