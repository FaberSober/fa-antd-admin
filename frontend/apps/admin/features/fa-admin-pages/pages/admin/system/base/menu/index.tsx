import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';
import type { Rbac } from '@/types';
import { EditOutlined, PlusOutlined, SafetyCertificateOutlined, SettingOutlined, SisternodeOutlined } from '@ant-design/icons';
import { AuthDelBtn, BaseTree, type Fa, FaEnums, FaFlexRestLayout, FaHref, FaUtils, useApiLoading, useDelete } from '@fa/ui';
import { rbacMenuApi } from '@features/fa-admin-pages/services';
import { Button, Segmented, Space, Switch, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useCounter } from 'react-use';
import './index.scss';
import RbacMenuModal from './modal/RbacMenuModal';

/**
 * RBAC Menu Manage
 * @author xu.pengfei
 * @date 2022/12/15 15:57
 */
export default function Menu() {
  const [current, { inc }] = useCounter(0);
  const [scope, setScope] = useState<FaEnums.RbacMenuScopeEnum>(FaEnums.RbacMenuScopeEnum.WEB);

  useEffect(() => {
    refreshData();
  }, [scope]);

  function refreshData() {
    inc();
  }

  const [handleDelete] = useDelete<string>(rbacMenuApi.remove, refreshData, '菜单');

  const loadingTree = useApiLoading([rbacMenuApi.getUrl('allTree')]);
  return (
    <div className="fa-full-content fa-flex-column fa-menu-div">
      <div className="fa-m12 fa-flex-column" style={{marginBottom: 0}}>
        <Space style={{ marginBottom: 12 }}>
          <Button onClick={refreshData} loading={loadingTree}>
            刷新
          </Button>
          <RbacMenuModal title="新增菜单" scope={scope} fetchFinish={refreshData}>
            <Button type="primary" icon={<PlusOutlined />} loading={loadingTree}>
              新增菜单
            </Button>
          </RbacMenuModal>
        </Space>

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
      </div>

      <FaFlexRestLayout className="fa-full-content-p12 fa-card fa-p0">
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
              <div style={{ width: 30 }} className='fa-flex-center'>{item.sourceData.icon ? <FaIconPro icon={item.sourceData.icon} /> : null}</div>
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
                <RbacMenuModal title="编辑菜单" record={item.sourceData} scope={scope} fetchFinish={refreshData}>
                  <FaHref icon={<EditOutlined />} text="编辑" />
                </RbacMenuModal>
                <AuthDelBtn handleDelete={() => handleDelete(item.id)} />
              </Space>
            </div>
          )}
          showLine={false}
          draggable
          extraEffectArgs={[current]}
        />
      </FaFlexRestLayout>
    </div>
  );
}
