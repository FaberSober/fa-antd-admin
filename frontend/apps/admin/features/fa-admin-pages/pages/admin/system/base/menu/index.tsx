import React, { useContext, useEffect, useState } from 'react';
import { ApiEffectLayoutContext, AuthDelBtn, BaseTree, type Fa, FaEnums, FaFlexRestLayout, FaHref, FaUtils, useDelete } from '@fa/ui';
import { FaIcon } from '@fa/icons';
import RbacMenuModal from './modal/RbacMenuModal';
import type { Rbac } from '@/types';
import { EditOutlined, PlusOutlined, SafetyCertificateOutlined, SettingOutlined, SisternodeOutlined } from '@ant-design/icons';
import { Button, Segmented, Space, Switch, Tag } from 'antd';
import { useCounter } from 'react-use';
import { rbacMenuApi } from '@features/fa-admin-pages/services';
import './index.scss';

/**
 * RBAC Menu Manage
 * @author xu.pengfei
 * @date 2022/12/15 15:57
 */
export default function Menu() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [edit, setEdit] = useState<Fa.TreeNode<Rbac.RbacMenu, string>>();
  const [open, setOpen] = useState(false);
  const [current, { inc }] = useCounter(0);
  const [scope, setScope] = useState<FaEnums.RbacMenuScopeEnum>(FaEnums.RbacMenuScopeEnum.WEB);

  useEffect(() => {
    refreshData();
  }, [scope]);

  function refreshData() {
    setOpen(false);
    inc();
  }

  const [handleDelete] = useDelete<string>(rbacMenuApi.remove, refreshData, '菜单');

  function showEditModal(item: Fa.TreeNode<Rbac.RbacMenu, string>) {
    setEdit(item);
    setOpen(true);
  }

  const loadingTree = loadingEffect[rbacMenuApi.getUrl('allTree')];
  return (
    <div className="fa-full-content fa-flex-column fa-menu-div">
      <div className="fa-p12 fa-flex-column">
        <div>
          <Segmented
            value={scope}
            onChange={(v: any) => setScope(v)}
            options={[
              {
                label: '网页',
                value: FaEnums.RbacMenuScopeEnum.WEB,
                icon: <SettingOutlined />,
              },
              {
                label: 'APP',
                value: FaEnums.RbacMenuScopeEnum.APP,
                icon: <SafetyCertificateOutlined />,
              },
            ]}
          />
        </div>

        <Space style={{ marginTop: 12 }}>
          <Button onClick={refreshData} loading={loadingTree}>
            刷新
          </Button>
          <RbacMenuModal title="新增菜单" scope={scope} fetchFinish={refreshData}>
            <Button type="primary" icon={<PlusOutlined />} loading={loadingTree}>
              新增菜单
            </Button>
          </RbacMenuModal>
        </Space>
      </div>

      <FaFlexRestLayout>
        <BaseTree
          // showRoot
          showOprBtn
          // onSelect={(keys) => console.log('onSelect', keys)}
          onAfterDelItem={() => {}}
          // 自定义配置
          serviceName="Tree"
          ServiceModal={RbacMenuModal}
          serviceApi={{
            ...rbacMenuApi,
            allTree: () => rbacMenuApi.getTree({ query: { scope } }),
          }}
          bodyStyle={{ width: '100%', height: '100%' }}
          showTips={false}
          showTopBtn={false}
          // @ts-ignore
          titleRender={(item: Fa.TreeNode<Rbac.RbacMenu, string> & { updating: boolean }) => (
            <div className="fa-menu-item">
              <div style={{ flex: 1 }} onClick={() => FaUtils.copyToClipboard(item.name)}>{item.name}</div>
              <div style={{ width: 30 }}>{item.sourceData.icon ? <FaIcon icon={item.sourceData.icon} /> : null}</div>
              <div style={{ width: 100 }} onClick={() => FaUtils.copyToClipboard(item.sourceData.id)}>{item.sourceData.id}</div>
              <div className="fa-plr12">
                {item.sourceData.level === FaEnums.RbacMenuLevelEnum.APP && <Tag color="#f50">{FaEnums.RbacMenuLevelEnumMap[item.sourceData.level]}</Tag>}
                {item.sourceData.level === FaEnums.RbacMenuLevelEnum.MENU && <Tag color="#2db7f5">{FaEnums.RbacMenuLevelEnumMap[item.sourceData.level]}</Tag>}
                {item.sourceData.level === FaEnums.RbacMenuLevelEnum.BUTTON && <Tag color="#87d068">{FaEnums.RbacMenuLevelEnumMap[item.sourceData.level]}</Tag>}
              </div>
              <div className="fa-plr12">
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  checked={item.sourceData.status}
                  loading={item.updating || false}
                  onChange={(checked) => {
                    item.sourceData.status = checked;
                    item.updating = true;
                    rbacMenuApi.update(item.sourceData.id, { ...item.sourceData, status: checked }).then(() => {
                      // refreshData();
                      item.updating = false;
                    });
                  }}
                />
              </div>
              <div className="fa-plr12" style={{ width: 400 }} onClick={() => FaUtils.copyToClipboard(item.sourceData.linkUrl)}>
                {item.sourceData.linkUrl}
              </div>
              <Space>
                <RbacMenuModal title="新增菜单" scope={scope} parentId={item.id} fetchFinish={refreshData}>
                  <FaHref icon={<SisternodeOutlined />} text="新增子节点" />
                </RbacMenuModal>
                <FaHref icon={<EditOutlined />} text="编辑" onClick={() => showEditModal(item)} />
                <AuthDelBtn handleDelete={() => handleDelete(item.id)} />
              </Space>
            </div>
          )}
          showLine={false}
          draggable
          extraEffectArgs={[current]}
        />
      </FaFlexRestLayout>

      <RbacMenuModal title="编辑菜单" record={edit?.sourceData} scope={scope} fetchFinish={refreshData} open={open} onCancel={() => setOpen(false)} />
    </div>
  );
}
