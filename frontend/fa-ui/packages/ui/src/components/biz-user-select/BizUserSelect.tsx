import React, {useEffect, useState} from 'react';
import {departmentApi, userApi} from "@ui/services/base";
import {Admin} from "@ui/types";
import {Button, Col, Form, Input, Row, Space} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {clearForm, useTableQueryParams} from "@ui/hooks";
import {BaseBizTable, BaseTableUtils, FaberTable} from "@ui/components/base-table";
import SelectedUserList from "@ui/components/biz-user-select/SelectedUserList";
import {BaseTree} from "@ui/components/base-tree";
import {FaLabel} from "@ui/components/decorator";
import {CommonModalProps, DragModal} from '../base-modal';
import {FaFlexRestLayout} from "@ui/components";


export interface SelectedUser {
  id: string;
  allowRemove?: boolean;
}

export interface BizUserSelectProps extends CommonModalProps<any> {
  selectedUsers?: SelectedUser[]; // 已经选中的用户ID
  onChange?: (v: SelectedUser[], callback: () => void, error?: any) => void;
}

/**
 * Department User Select Modal
 * @author xu.pengfei
 * @date 2022/12/28 14:38
 */
export default function BizUserSelect({children, record, fetchFinish, selectedUsers, onChange, ...props}: BizUserSelectProps) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [dept, setDept] = useState<Admin.Department>();
  const [innerUsers, setInnerUsers] = useState<SelectedUser[]>(selectedUsers || [])

  useEffect(() => {
    // console.log('selectedUsers', selectedUsers)
    setInnerUsers(selectedUsers || [])
  }, [selectedUsers])

  const {
    queryParams,
    setFormValues,
    handleTableChange,
    setExtraParams,
    fetchPageList,
    loading,
    list,
    paginationProps,
  } = useTableQueryParams<Admin.UserWeb>(
    userApi.page,
    { extraParams: { departmentId: dept?.id }, sorter: { field: 'crtTime', order: 'descend' } },
    '用户',
  );

  useEffect(() => {
    setExtraParams({ departmentId: dept?.id })
  }, [dept])

  function onTreeDeptSelect(keys: any[], event: any) {
    setDept(keys.length > 0 ? event.node.sourceData : undefined);
  }

  function handleAdd(item: Admin.UserWeb) {
    const newSel = [ ...innerUsers||[], { id: item.id, allowRemove: true } ]
    setInnerUsers(newSel)
  }

  function handleRemove(item: Admin.User) {
    setInnerUsers(innerUsers.filter(i => i.id !== item.id))
  }

  /** 生成表格字段List */
  function genColumns() {
    const { sorter } = queryParams;
    return [
      BaseTableUtils.genSimpleSorterColumn('账户', 'username', undefined, sorter),
      BaseTableUtils.genSimpleSorterColumn('姓名', 'name', 130, sorter),
      {
        ...BaseTableUtils.genSimpleSorterColumn('部门', 'departmentId', 130, sorter),
        render: (_, r) => r.departmentName,
      },
      {
        title: '操作',
        dataIndex: 'opr',
        render: (_, record) => (
          <Space>
            {innerUsers.map(i => i.id).indexOf(record.id) === -1 && (
              <Button type="dashed" size="small" onClick={() => handleAdd(record)}>添加</Button>
            )}
          </Space>
        ),
        width: 80,
        fixed: 'right',
        tcRequired: true,
        tcType: 'menu',
      },
    ] as FaberTable.ColumnsProp<Admin.UserWeb>[];
  }

  function handleConfirm() {
    if (onChange) {
      setConfirmLoading(true)
      onChange(innerUsers, () => {
        setConfirmLoading(false)
        setOpen(false)
      }, () => setConfirmLoading(false))
    }
  }

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
      </span>
      <DragModal
        title="选择用户"
        open={open}
        onOk={handleConfirm}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
        width={1200}
        {...props}
      >
        <Row className="fa-flex-row" style={{height: 600}} gutter={12}>
          <Col md={5}>
            <BaseTree
              rootName="全部"
              onSelect={onTreeDeptSelect}
              // 自定义配置
              serviceName="部门"
              serviceApi={departmentApi}
              showTopBtn={false}
              treeStyle={{padding: 0}}
              className="fa-border"
            />
          </Col>

          <Col md={14}>
            <div className="fa-full fa-flex-column">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="fa-mb12">
                <Form form={form} layout="inline" onFinish={setFormValues}>
                  <Form.Item name="name" label="姓名">
                    <Input placeholder="请输入姓名" />
                  </Form.Item>
                </Form>

                <Space>
                  <Button onClick={() => form.submit()} loading={loading} icon={<SearchOutlined />}>查询</Button>
                  <Button onClick={() => clearForm(form)} loading={loading}>重置</Button>
                </Space>
              </div>

              <BaseBizTable
                biz="UserList-Search"
                columns={genColumns()}
                pagination={{ ...paginationProps, size: 'small' }}
                loading={loading}
                dataSource={list}
                rowKey={(item) => item.id}
                onChange={handleTableChange}
                refreshList={() => fetchPageList()}
                batchDelete={(ids) => userApi.removeBatchByIds(ids)}
                showComplexQuery={false}
                showBatchDelBtn={false}
                showTableColConfigBtn={false}
                showCheckbox={false}
                showTopDiv={false}
              />
            </div>
          </Col>

          <Col md={5} className="fa-flex-column" style={{ height: '100%' }}>
            <FaLabel title="已选择" className="fa-mb12" />
            <FaFlexRestLayout>
              <SelectedUserList selectedUsers={innerUsers} onRemove={handleRemove} />
            </FaFlexRestLayout>
          </Col>
        </Row>
      </DragModal>
    </span>
  )
}
