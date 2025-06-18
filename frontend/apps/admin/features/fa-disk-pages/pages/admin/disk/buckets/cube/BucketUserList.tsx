import React, { useContext, useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Disk } from '@/types';
import { storeBucketUserApi } from '@/services';
import { ApiEffectLayoutContext, AuthDelBtn, BizUserSelect, FaEnums, FaUtils, SelectedUser, useDelete } from '@fa/ui';

export interface BucketUserListProps {
  bucketId: number;
}

/**
 * @author xu.pengfei
 * @date 2022/12/28 11:08
 */
export default function BucketUserList({ bucketId }: BucketUserListProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);

  const [array, setArray] = useState<Disk.StoreBucketUser[]>([]);
  const [ids, setIds] = useState<SelectedUser[]>([]);

  useEffect(() => {
    refreshList();
  }, [bucketId]);

  function refreshList() {
    storeBucketUserApi.list({ query: { bucketId } }).then((res) => {
      setArray(res.data);
      setIds(res.data.map((i) => ({ id: i.userId, allowRemove: i.type !== FaEnums.StoreBucketUserTypeEnum.CREATOR })));
    });
  }

  const [handleDelete] = useDelete<number>(storeBucketUserApi.remove, refreshList, '库人员');

  function handleChangeUsers(users: SelectedUser[], callback: any) {
    const params = users.map((i) => ({ userId: i.id, bucketId }));
    storeBucketUserApi.updateBucketUser(params).then((res) => {
      FaUtils.showResponse(res, '更新库人员');
      callback();
      refreshList();
    });
  }

  const loading = loadingEffect[storeBucketUserApi.getUrl('list')];
  return (
    <div>
      <Space className="fa-mb12">
        <BizUserSelect selectedUsers={ids} onChange={handleChangeUsers}>
          <Button icon={<PlusOutlined />} type="primary">
            新增用户
          </Button>
        </BizUserSelect>
      </Space>

      <Table
        rowKey="id"
        columns={[
          { dataIndex: ['user', 'username'], title: '账户' },
          { dataIndex: ['user', 'name'], title: '名称' },
          { dataIndex: 'crtTime', title: '创建时间' },
          {
            title: '操作',
            dataIndex: 'menu',
            render: (_, r) => (
              <Space>{r.type !== FaEnums.StoreBucketUserTypeEnum.CREATOR && <AuthDelBtn handleDelete={() => handleDelete(r.id)} />}</Space>
            ),
            width: 80,
            fixed: 'right',
          },
        ]}
        dataSource={array}
        loading={loading}
        pagination={false}
        size="small"
      />
    </div>
  );
}
