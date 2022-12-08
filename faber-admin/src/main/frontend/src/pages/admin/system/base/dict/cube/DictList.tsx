import React, {useEffect, useImperativeHandle, useRef} from 'react';
import {DownloadOutlined, EditOutlined, PlusOutlined, SearchOutlined} from '@ant-design/icons';
import {Button, Card, Form, Image, Input, Space} from 'antd';
import modelService from '@/services/admin/dict';
import Admin from '@/props/admin';
import {clearForm, useDelete, useExport, useTableQueryParams} from '@/utils/myHooks';
import BaseBizTable, {BaseTableUtils, FaberTable} from '@/components/base-table';
import {isUrlImg, previewImage} from "@/utils/utils";
import {AuthDelBtn, FaHref} from "@/components/decorator";
import DictModal from '../modal/DictModal';


const serviceName = '字典值';
const buzzModal = 'base_dict_v1';

interface IProps {
  type?: number;
}

function DictList({ type }: IProps, ref: any) {
  const addModalRef = useRef<any | null>(null);
  const [form] = Form.useForm();

  const { queryParams, setFormValues, handleTableChange, setSceneId, setConditionList, setExtraParams, fetchPageList, loading, list, paginationProps } =
    useTableQueryParams<Admin.DictWebVO>(modelService.page, { extraParams: { type }, sorter: { field: 'crtTime', order: 'descend' } }, serviceName);

  const [exporting, fetchExportExcel] = useExport(modelService.exportExcel, { ...queryParams, extraParams: { type } });
  const [handleDelete] = useDelete<number>(modelService.remove, fetchPageList, serviceName);

  useEffect(() => setExtraParams({ type }), [type]);

  useImperativeHandle(ref, () => ({
    showAddModal: () => {
      addModalRef.current.showModal();
    },
  }));

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      // BaseTableUtils.genSimpleSorterColumn('ID', 'id', 70, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('所属分类', 'type', 150, sorter),
        render: (val, record) => record.dictType?.name,
        tcConditionHide: true,
      },
      BaseTableUtils.genSimpleSorterColumn('字典文本', 'text', 200, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('字典值', 'value', 200, sorter),
        render: (val: string, record: Admin.DictWebVO) => {
          if (record.category === 1) {
            if (isUrlImg(val)) {
              return (
                <Image
                  height={50}
                  src={previewImage(val, 200)}
                  preview={{ src: val }}
                />
              )
            }

            return <a href={val}>文件下载</a>;
          }
          return <span>{val}</span>;
        },
      },
      BaseTableUtils.genSimpleSorterColumn('排序', 'sort', 70, sorter),
      BaseTableUtils.genSimpleSorterColumn('描述', 'description', 300, sorter),
      ...BaseTableUtils.genCtrColumns(sorter),
      ...BaseTableUtils.genUpdateColumns(sorter),
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            <DictModal title={`编辑${serviceName}信息`} record={record} fetchFinish={fetchPageList}>
              <FaHref icon={<EditOutlined />} text="编辑" />
            </DictModal>
            <AuthDelBtn handleDelete={() => handleDelete(record.id)} />
          </Space>
        ),
        width: 120,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.DictWebVO>[];
  }

  return (
    <div className="fa-full-content fa-flex-column fa-card">
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 12 }}>
        <strong style={{ fontSize: '18px', marginLeft: 8 }}>{serviceName}</strong>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Form style={{ flex: 1, flexDirection: 'row-reverse' }} form={form} layout="inline" onFinish={setFormValues}>
            <Form.Item name="search" label="搜索">
              <Input placeholder="请输入搜索内容" />
            </Form.Item>
          </Form>

          <Space>
            <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
            <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
            <DictModal ref={addModalRef} title={`新增${serviceName}信息`} fetchFinish={fetchPageList} type={type}>
              <Button icon={<PlusOutlined />} type="primary">新增</Button>
            </DictModal>
            <Button loading={exporting} icon={<DownloadOutlined />} onClick={fetchExportExcel}>导出</Button>
          </Space>
        </div>
      </div>

      <BaseBizTable
        buzzModal={buzzModal}
        columns={genColumns()}
        pagination={paginationProps}
        loading={loading}
        dataSource={list}
        rowKey={(item) => item.id}
        onChange={handleTableChange}
        refreshList={() => fetchPageList()}
        batchDelete={(ids) => modelService.removeBatchByIds(ids)}
        onSceneChange={(v) => setSceneId(v)}
        onConditionChange={(cL) => setConditionList(cL)}
      />
    </div>
  );
}
export default React.forwardRef(DictList);
