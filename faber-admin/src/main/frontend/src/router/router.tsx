import React from 'react';
import { Redirect, RouteComponentProps, Router } from '@reach/router';
import { HelmetProvider } from 'react-helmet-async';

import { SITE_INFO } from '@/configs/server.config';
// import { APILoader } from '@uiw/react-amap';
// import AMapUILayout from "@/utils/api-loaders/AMapUILayout";

import LangLayout from "@/layout/LangLayout";
import FragmentLayout from "@/layout/FragmentLayout";
import PageLazy from "@/components/biz/lazy/PageLazy";

// 业务模块
import modalConfig from '@/configs/modal.config';
import UserSimpleLayout from "@/layout/UserSimpleLayout";
import UserMenuLayout from "@/layout/UserMenuLayout";


const NotFound = (_: RouteComponentProps) => (
  <div>抱歉，访问的页面不存在。</div>
)

export default function App() {
  return (
    <LangLayout>
      <HelmetProvider>
        {/*<APILoader akay={SITE_INFO.AMAP_KEY}>*/}
        {/*  <AMapUILayout>*/}
            <Router>
              {/* 登录页 */}
              <PageLazy path="login" pageImport={() => import('@/pages/login/Login')} />

              {/* 主页 */}
              <UserSimpleLayout path="/">
                <UserMenuLayout path="/" headerModal={modalConfig.HOME}>
                  <Redirect from='/' to={SITE_INFO.HOME_LINK} />

                  <FragmentLayout path="home">
                    <PageLazy path="dashboard" pageImport={() => import('@/pages/home/Home')} />
                  </FragmentLayout>

                  <NotFound default />
                </UserMenuLayout>
              </UserSimpleLayout>

              {/* 管理后台 */}
              <UserSimpleLayout path="/system">
                <UserMenuLayout path="/" headerModal={modalConfig.SYSTEM}>

                  {/* 智能人事 */}
                  <FragmentLayout path="human_manage">
                    <PageLazy path="user" pageImport={() => import('@/pages/system/human_manage/user/UserDepartmentManage')} />
                    <PageLazy path="department" pageImport={() => import('@/pages/system/human_manage/department/DepartmentList')} />
                    <PageLazy path="role_auth" pageImport={() => import('@/pages/system/human_manage/role_auth/GroupAuthManage')} />
                  </FragmentLayout>

                  {/* 系统管理 */}
                  <FragmentLayout path="base">
                    <PageLazy path="menu" pageImport={() => import('@/pages/system/base/menu/MenuManage')} />
                    <PageLazy path="dict" pageImport={() => import('@/pages/system/base/dict/DictManage')} />
                    <PageLazy path="area" pageImport={() => import('@/pages/system/base/area/AreaList')} />
                    <PageLazy path="job" pageImport={() => import('@/pages/system/base/job/JobList')} />
                    <PageLazy path="gateLog" pageImport={() => import('@/pages/system/base/gateLog/GateLogList')} />
                    <PageLazy path="notice" pageImport={() => import('@/pages/system/base/notice/NoticeList')} />
                  </FragmentLayout>

                  {/* 个人中心 */}
                  <FragmentLayout path="account">
                    <PageLazy path="base" pageImport={() => import('@/pages/system/account/base/AccountBase')} />
                    <PageLazy path="security" pageImport={() => import('@/pages/system/account/security/AccountPwdUpdate')} />
                    <PageLazy path="msg" pageImport={() => import('@/pages/system/account/msg/MsgList')} />
                  </FragmentLayout>
                </UserMenuLayout>
              </UserSimpleLayout>

              <NotFound default />
            </Router>
        {/*  </AMapUILayout>*/}
        {/*</APILoader>*/}
      </HelmetProvider>
    </LangLayout>
  )
}
