import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Input, Modal, Select, Space, TreeSelect } from 'antd';
import { DiskContext } from '@/layout';
import { storeFileApi } from '@/services';
import { Disk } from '@/types';
import { ApiEffectLayoutContext, BaseTableUtils, Fa, FaUtils } from '@fa/ui';
import { DownloadOutlined } from '@ant-design/icons';
import { isNil, trim } from 'lodash';
import { StoreDirModal, StoreFileCopyToModal, StoreFileMoveToModal, StoreFileTagsModal } from './modal';
import { FileGrid, FileTable, StoreDirPath, StoreUploadFile, ViewTypeToggle } from './cube';
import { useLocalStorage } from 'react-use';
import { StoreTagTreeSelect } from "@/components";
import './index.scss';

/**
 * 网盘-全部文件
 * @author xu.pengfei
 * @date 2022/12/22 10:39
 */
export default function index() {
  const { bucket } = useContext(DiskContext);
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [viewType, setViewType] = useLocalStorage<string>('disk.store.alls.viewType', 'list'); // 1-列表，2-网格
  const [dirId, setDirId] = useState(Fa.Constant.TREE_SUPER_ROOT_ID); // 当前选中的文件夹ID
  const [array, setArray] = useState<Disk.StoreFile[]>([]); // 当前展示的文件列表
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]); // 选中的文件ids
  const [search, setSearch] = useState<string>(''); // 搜索名称
  const [recursive, setRecursive] = useState<boolean>(true); // 是否及联查询
  const [tagQueryType, setTagQueryType] = useState<number>(1); // 标签搜索-类型：1-同时满足，2-满足其一
  const [tagIds, setTagIds] = useState<number[]>([]); // 标签搜索-选中标签
  const [sorter, setSorter] = useState<Fa.Sorter>({ field: 'name', order: 'ascend' }); // 排序-字段

  useEffect(() => {
    if (dirId !== Fa.Constant.TREE_SUPER_ROOT_ID) {
      setDirId(Fa.Constant.TREE_SUPER_ROOT_ID);
    } else {
      if (!loaded) {
        setLoaded(true);
        return;
      }
      refreshDir();
    }
  }, [bucket]);

  useEffect(() => {
    refreshDir();
  }, [dirId, tagQueryType, tagIds, sorter]);

  async function refreshDir() {
    setSelectedRowKeys([]);
    // setSearch('')

    const params = {
      query: {
        bucketId: bucket.id,
        parentId: dirId,
        tagQueryType,
        tagIds,
        fullPath: '',
        name: '',
      },
      sorter: `dir DESC, ${BaseTableUtils.getSorter(sorter)}`,
    };
    if (trim(search) !== '' || tagIds.length > 0) {
      const ret = await storeFileApi.treePathLine(dirId);
      const fullPathList = ret.data;
      params.query.fullPath = recursive ? ['#全部文件#', ...fullPathList.map((i) => `#${i.name}#`)].join(',') : '';
      params.query.name = trim(search);
      params.query.parentId = undefined!;
    }
    storeFileApi.queryFile(params).then((res) => {
      setArray(res.data);
    });
  }

  function handleBatchDownload() {
    if (isNil(selectedRowKeys) || selectedRowKeys.length === 0) return;

    storeFileApi.downloadZip(selectedRowKeys);
  }

  function handleBatchDelete() {
    if (isNil(selectedRowKeys) || selectedRowKeys.length === 0) return;

    Modal.confirm({
      title: '删除',
      content: `确认删除勾选中的 ${selectedRowKeys.length} 条数据？`,
      okText: '删除',
      okType: 'danger',
      onOk: async (close) => {
        storeFileApi.removeBatchByIds(selectedRowKeys).then((res) => {
          FaUtils.showResponse(res, '批量删除');
          refreshDir();
          close();
        });
      },
    });
  }

  const loadingDir = loadingEffect[storeFileApi.getUrl('queryFile')];
  const loadingDownloadZip = loadingEffect[storeFileApi.getUrl('downloadZip')];
  const loadingRemoveBatchByIds = loadingEffect[storeFileApi.getUrl('removeBatchByIds')];
  return (
    <div className="fa-full-content fa-bg-white">
      <div className="fa-flex-row-center fa-p8 fa-border-b">
        <Space className="fa-flex-1">
          <StoreDirPath dirId={dirId} onClick={setDirId} />
          <Input.Group compact style={{ display: 'flex' }}>
            <Select
              value={recursive}
              onChange={(v) => setRecursive(v)}
              options={[
                { label: '及联查询', value: true },
                { label: '当前目录', value: false },
              ]}
            />
            <Input.Search
              style={{ flex: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={refreshDir}
              placeholder="请输入名称"
            />
          </Input.Group>

          <Input.Group compact>
            <Select
              value={tagQueryType}
              onChange={(v) => setTagQueryType(v)}
              options={[
                { label: '同时满足', value: 1 },
                { label: '满足其一', value: 2 },
              ]}
            />
            <StoreTagTreeSelect
              value={tagIds}
              onChange={(v) => setTagIds(v)}
              multiple
              showCheckedStrategy={TreeSelect.SHOW_ALL}
              style={{ flex: 1, minWidth: 200 }}
            />
          </Input.Group>
        </Space>

        <Space>
          <StoreDirModal title="新建目录" dirId={dirId} addBtn fetchFinish={refreshDir} />
          <StoreUploadFile dirId={dirId} onSuccess={refreshDir} />
          <ViewTypeToggle value={viewType} onChange={setViewType} />
        </Space>
      </div>

      {/* selected rows */}
      {selectedRowKeys.length > 0 && (
        <div className="fa-bg-grey fa-border-b fa-flex-row-center" style={{ height: 39, padding: '0 8px' }}>
          <Space>
            <Checkbox
              indeterminate={selectedRowKeys.length < array.length}
              checked={selectedRowKeys.length === array.length}
              onChange={() => {
                if (selectedRowKeys.length < array.length) {
                  setSelectedRowKeys(array.map((i) => i.id));
                } else {
                  setSelectedRowKeys([]);
                }
              }}
            >
              <span style={{ marginLeft: 6 }}>
                已选<a style={{ margin: '0 4px' }}>{selectedRowKeys.length}</a>项
              </span>
            </Checkbox>
            <Button onClick={handleBatchDownload} loading={loadingDownloadZip} icon={<DownloadOutlined />}>
              打包下载
            </Button>
            <StoreFileTagsModal fileIds={selectedRowKeys} fetchFinish={refreshDir} />
            <StoreFileMoveToModal fileIds={selectedRowKeys} fetchFinish={refreshDir} />
            <StoreFileCopyToModal fileIds={selectedRowKeys} fetchFinish={refreshDir} />
            <Button onClick={handleBatchDelete} loading={loadingRemoveBatchByIds} danger>
              删除
            </Button>
            <Button onClick={() => setSelectedRowKeys([])}>取消</Button>
          </Space>
        </div>
      )}

      {/* Dir & File List */}
      <div>
        {viewType === 'list' && (
          <FileTable
            dirId={dirId}
            onRefresh={refreshDir}
            loading={loadingDir}
            dataSource={array}
            showHeader={selectedRowKeys.length === 0}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: (ks) => {
                setSelectedRowKeys(ks);
              },
            }}
            onChange={(_pagination, _filters, sorter: any) => {
              // console.log(pagination, filters, sorter, extra)
              setSorter({ field: sorter.field, order: sorter.order });
            }}
            onIntoDir={(v) => setDirId(v)}
            showPath={trim(search) !== '' || tagIds.length > 0}
          />
        )}

        {viewType === 'kanban' && (
          <FileGrid
            dirId={dirId}
            files={array}
            selectedRowKeys={selectedRowKeys}
            onSelectedChange={(v) => setSelectedRowKeys(v)}
            showHeader={selectedRowKeys.length === 0}
            onRefresh={refreshDir}
            onIntoDir={(v) => setDirId(v)}
          />
        )}
      </div>
    </div>
  );
}
