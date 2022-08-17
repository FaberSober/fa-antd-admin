import React, { useContext, useEffect, useState } from 'react';
import { difference, each, groupBy } from 'lodash';
import { Button, Card, Checkbox, Spin, Tabs } from 'antd';
import menuService from '@/services/admin/menu';
import elementService from '@/services/admin/element';
import resourceAuthorityService from '@/services/admin/resourceAuthority';
import { RES_CODE } from '@/configs/server.config';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import { showResponse } from '@/utils/utils';
import './GroupAuthCheck.less';
import { UserContext } from '@/layout/UserSimpleLayout';
import MenuBlock from "@/pages/system/base/menu/cube/MenuBlock";
import MenuManageContext, {MenuManageContextProps} from "@/pages/system/base/menu/context/MenuManageContext";


interface IProps {
  groupId?: number;
}

/**
 * @author xu.pengfei
 * @date 2020/12/30
 */
export default function GroupAuthCheck({ groupId }: IProps) {
  const { user } = useContext(UserContext);

  const [viewBlock, setViewBlock] = useState<Admin.MenuBlock>()

  const [curMenuCheckIds, setCurMenuCheckIds] = useState<number[]>([]); // 当前登录账户的Menu权限IDs
  const [curElementCheckIds, setCurElementCheckIds] = useState<number[]>([]); // 当前登录账户的Element权限IDs
  const [menuTree, setMenuTree] = useState<FaberBase.TreeNode[]>([]); // 菜单Tree
  const [elementMap, setElementMap] = useState<{ [key: number]: Admin.Element[] }>({}); // 权限点
  const [oldMenuCheckIds, setOldMenuCheckIds] = useState<number[]>([]);
  const [menuCheckIds, setMenuCheckIds] = useState<number[]>([]);
  const [oldElementCheckIds, setOldElementCheckIds] = useState<number[]>([]);
  const [elementCheckIds, setElementCheckIds] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false); // 是否在加载角色权限
  const [loading, setLoading] = useState(false); // 是否提交角色权限修改

  useEffect(() => {
    setCurMenuCheckIds(user.menus.map((v) => v.id));
    setCurElementCheckIds(user.elements.map((v) => v.id));
  }, [user]);

  useEffect(() => {
    if (viewBlock === undefined) return;

    // 获取所有菜单Tree
    setRefreshing(true)
    menuService.blockAllTree(viewBlock.id).then((res) => {
      setRefreshing(false)
      if (res && res.status === RES_CODE.OK) {
        setMenuTree(res.data);
      }
    }).catch(() => setRefreshing(false))

    // 获取所有Element
    elementService.list({ delState: '0', blockId: viewBlock.id }).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        // 根据menuId分组
        const eleMap = groupBy(res.data, (i) => i.menuId);
        setElementMap(eleMap);
      }
    });
  }, [viewBlock]);

  useEffect(() => {
    fetchGroupAuth();
  }, [groupId]);

  /** 获取角色权限关联 */
  function fetchGroupAuth() {
    if (groupId === undefined) return;
    setRefreshing(true);
    resourceAuthorityService
      .list({ authorityId: groupId, authorityType: Admin.AuthorityType.GROUP })
      .then((res) => {
        if (res && res.status === RES_CODE.OK) {
          const authMenuIds: number[] = [];
          const authEleIds: number[] = [];
          each(res.data, (v) => {
            if (v.resourceType === 'menu') {
              authMenuIds.push(Number(v.resourceId));
            }
            if (v.resourceType === 'button') {
              authEleIds.push(Number(v.resourceId));
            }
          });
          setOldMenuCheckIds(authMenuIds);
          setMenuCheckIds(authMenuIds);
          setOldElementCheckIds(authEleIds);
          setElementCheckIds(authEleIds);
        }
        setRefreshing(false);
      }).catch(() => setRefreshing(false));
  }

  function handleMenuChecked(menuId: number, checked: boolean) {
    if (checked) {
      setMenuCheckIds([...menuCheckIds, menuId]);
    } else {
      setMenuCheckIds(menuCheckIds.filter((v) => v !== menuId));
    }
  }

  function handleElementChecked(elementId: number, checked: boolean) {
    if (checked) {
      setElementCheckIds([...elementCheckIds, elementId]);
    } else {
      setElementCheckIds(elementCheckIds.filter((v) => v !== elementId));
    }
  }

  /** 菜单Menu Checkbox */
  function renderMenuCheckbox(menu: FaberBase.TreeNode, tabLabel?: boolean) {
    const hasPermission = user.id === '1' || curMenuCheckIds.indexOf(menu.id) > -1; // 是否有赋值权限，保留userId=1超级管理员拥有所有权限
    const currentCheck = menuCheckIds.indexOf(menu.id) > -1; // 本次操作是否勾选
    if (tabLabel) {
      return (
        <div>
          <Checkbox disabled={!hasPermission} checked={currentCheck} onChange={(e) => handleMenuChecked(menu.id, e.target.checked)} key={menu.id} />
          <span style={{ padding: '0 8px' }}>{menu.name}</span>
        </div>
      );
    }
    return (
      <Checkbox disabled={!hasPermission} checked={currentCheck} onChange={(e) => handleMenuChecked(menu.id, e.target.checked)} key={menu.id}>
        {menu.name}
      </Checkbox>
    );
  }

  /** Element Checkbox */
  function renderElementCheckbox(element: Admin.Element) {
    const hasPermission = user.id === '1' || curElementCheckIds.indexOf(element.id) > -1; // 是否有赋值权限，保留userId=1超级管理员拥有所有权限
    const currentCheck = elementCheckIds.indexOf(element.id) > -1; // 本次操作是否勾选
    return (
      <Checkbox disabled={!hasPermission} checked={currentCheck} onChange={(e) => handleElementChecked(element.id, e.target.checked)} key={element.id}>
        {element.name}
      </Checkbox>
    );
  }

  /** 提交修改权限配置 */
  function handleSubmit() {
    if (groupId === undefined) return;
    setLoading(true);

    // menu add
    const menuAddIds = difference(menuCheckIds, oldMenuCheckIds);
    // menu remove
    const menuRemoveIds = difference(oldMenuCheckIds, menuCheckIds);

    // element add
    const elementAddIds = difference(elementCheckIds, oldElementCheckIds);
    // element remove
    const elementRemoveIds = difference(oldElementCheckIds, elementCheckIds);

    const params = { groupId, menuAddIds, menuRemoveIds, elementAddIds, elementRemoveIds };
    resourceAuthorityService
      .updateGroupAuth(params)
      .then((res) => {
        showResponse(res, '更新角色权限');
        setLoading(false);
        fetchGroupAuth();
      })
      .catch(() => setLoading(false));
  }

  const context:MenuManageContextProps = {
    viewBlock,
    changeViewBlock: (v) => {
      // 保存之前的修改
      if (viewBlock !== undefined) {
        handleSubmit()
      }
      setViewBlock(v)
    },
    viewMenu: undefined,
    changeViewMenu: (v) => {},
  }

  return (
    <MenuManageContext.Provider value={context}>
      <Card>
        <Spin spinning={refreshing}>
          <MenuBlock />
          <Tabs defaultActiveKey="2" type="card" style={{ marginTop: 12 }}>
            {menuTree.map((v, i) => (
              <Tabs.TabPane tab={renderMenuCheckbox(v, true)} key={v.id}>
                <div style={{ display: 'flex' }}>
                  <div className="func2Head">二级菜单</div>
                  <div className="func3Head">三级菜单</div>
                  <div className="func4Head">功能</div>
                </div>
                {/* 二级菜单 */}
                {v.children &&
                  v.children.map((d2) => (
                    <div style={{ display: 'flex' }} key={d2.id}>
                      <div className="func2Value">{renderMenuCheckbox(d2)}</div>
                      <div style={{ display: 'inline-block', flex: 1 }}>
                        {/* 三级菜单 */}
                        {d2.children &&
                          d2.children.map((d3) => (
                            <div style={{ display: 'flex' }} key={d3.id}>
                              <div className="func3Value">{renderMenuCheckbox(d3)}</div>
                              <div className="func4Value">
                                {/* 功能 */}
                                {elementMap[d3.id] && elementMap[d3.id].map((d4) => renderElementCheckbox(d4))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Spin>
        <Button loading={loading} type="primary" style={{ marginTop: 12 }} onClick={handleSubmit}>
          修改权限
        </Button>
      </Card>
    </MenuManageContext.Provider>
  );
}
