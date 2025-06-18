import React, { useContext, useState } from 'react';
import { Disk } from '@/types';
import styles from './index.module.scss';
import { ApiEffectLayoutContext, AuthDelBtn, BaseTree, Fa, FaHref, useDelete } from '@fa/ui';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { storeTagApi, storeTagApi as api } from '@/services';
import { DiskContext } from '@/layout';
import StoreTagModal from "@features/fa-disk-pages/pages/admin/disk/store/tags/modal/StoreTagModal";
import { useCounter } from "react-use";

/**
 * Store Tag Menu Manage
 * @author xu.pengfei
 * @date 2022/12/15 15:57
 */
export default function index() {
  const { bucket } = useContext(DiskContext);
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [edit, setEdit] = useState<Fa.TreeNode<Disk.StoreTag, number>>();
  const [open, setOpen] = useState(false);
  const [current, { inc }] = useCounter(0);

  function refreshData() {
    setOpen(false);
    inc()
  }

  const [handleDelete] = useDelete<number>(storeTagApi.remove, refreshData, '菜单');

  function showEditModal(item: Fa.TreeNode<Disk.StoreTag, number>) {
    setEdit(item);
    setOpen(true);
  }

  const loadingTree = loadingEffect[storeTagApi.getUrl('allTree')];
  return (
    <div className={['fa-full-content', 'fa-flex-column', styles.menuDiv].join(' ')}>
      <Space style={{ margin: 12 }}>
        <Button onClick={refreshData} loading={loadingTree}>
          刷新
        </Button>
        <StoreTagModal title="新增标签" fetchFinish={refreshData}>
          <Button type="primary" icon={<PlusOutlined />} loading={loadingTree}>
            新增标签
          </Button>
        </StoreTagModal>
      </Space>

      <BaseTree
        // showRoot
        showOprBtn
        // onSelect={(keys) => console.log('onSelect', keys)}
        onAfterDelItem={() => {}}
        // 自定义配置
        serviceName="Tree"
        ServiceModal={StoreTagModal}
        serviceApi={{
          ...storeTagApi,
          allTree: () => api.getTree({ query: { bucketId: bucket.id } }),
        }}
        extraEffectArgs={[bucket, current]}
        bodyStyle={{ width: '100%', height: '100%' }}
        showTips={false}
        showTopBtn={false}
        // @ts-ignore
        titleRender={(item: Fa.TreeNode<Disk.StoreTag, number>) => (
          <div className={styles.item}>
            <div style={{ width: 15, height: 15, background: item.sourceData.color, marginRight: 8 }} />
            <div style={{ flex: 1 }}>
              <div>{item.name}</div>
            </div>
            <Space>
              <FaHref icon={<EditOutlined />} text="编辑" onClick={() => showEditModal(item)} />
              <AuthDelBtn handleDelete={() => handleDelete(item.id)} />
            </Space>
          </div>
        )}
        showLine={false}
        draggable
      />

      <StoreTagModal title="编辑标签" record={edit?.sourceData} fetchFinish={refreshData} open={open} onCancel={() => setOpen(false)} />
    </div>
  );
}
