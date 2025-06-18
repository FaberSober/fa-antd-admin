import React, { useContext, useEffect, useState } from 'react';
import { fileSaveApi, fileBizApi } from '@features/fa-admin-pages/services';
import { ApiEffectLayoutContext, AuthDelBtn, useDelete, UploadFileModal, FaUtils } from '@fa/ui';
import { Button, Space, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Admin } from '@features/fa-admin-pages/types';

export interface FileBizListProps {
  /** 主业务ID */
  mainBizId?: string;
  /** 业务ID */
  bizId?: string;
  /** 业务类型 */
  type?: string;
  /** 展示上传按钮 */
  showUpload?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2023/2/26 19:42
 */
export default function FileBizList({ mainBizId, bizId, type, showUpload }: FileBizListProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);

  const [array, setArray] = useState<Admin.FileBiz[]>([]);

  useEffect(() => {
    refreshList();
  }, [mainBizId, bizId, type]);

  function refreshList() {
    fileBizApi.list({ query: { mainBizId, bizId, type }, sorter: 'id DESC' }).then((res) => {
      setArray(res.data);
    });
  }

  const [handleDelete] = useDelete<number>(fileBizApi.remove, refreshList, '项目附件');

  function handleAddFiles(fileIds: string[]) {
    const params = fileIds.map((i) => ({ fileId: i, mainBizId, bizId, type }));
    return fileBizApi.saveBatch(params).then((res) => {
      FaUtils.showResponse(res, '上传附件');
      refreshList();
    });
  }

  const loading = loadingEffect[fileBizApi.getUrl('list')];

  return (
    <div>
      <Space className="fa-mb12">
        {showUpload && (
          <UploadFileModal onSubmit={handleAddFiles}>
            <Button icon={<UploadOutlined />} type="primary">
              上传附件
            </Button>
          </UploadFileModal>
        )}
        <Button onClick={refreshList} loading={loading}>
          刷新
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={[
          {
            dataIndex: 'fileName',
            title: '附件名称',
            render: (_, r) => (
              <a href={fileSaveApi.genLocalGetFile(r.fileId)} target="_blank" rel="noreferrer" className="fa-text-link fa-text">
                {r.fileName}
              </a>
            ),
          },
          { dataIndex: 'crtTime', title: '创建时间', width: 170 },
          { dataIndex: 'crtName', title: '创建用户', width: 100 },
          {
            title: '操作',
            dataIndex: 'menu',
            render: (_, r) => (
              <Space>
                <AuthDelBtn handleDelete={() => handleDelete(r.id)} />
              </Space>
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
