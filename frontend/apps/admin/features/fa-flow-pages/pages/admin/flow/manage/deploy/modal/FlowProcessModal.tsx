import { flowProcessApi as api } from '@/services';
import { Flow, Flw, FlwEnums } from '@/types';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { CommonModalProps, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { getNodeKey } from '@features/fa-flow-pages/components/flow/utils';
import { Button, Form } from 'antd';
import { get } from 'lodash';
import { useState } from 'react';
import FlowProcessForm from '../cube/FlowProcessForm';


/**
 * FLOW-流程定义实体新增、编辑弹框
 */
export default function FlowProcessModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Flow.FlowProcess>) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增FLOW-流程定义');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新FLOW-流程定义');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      const params = {
        ...values,
        modelContent: JSON.stringify({
          "key": values.processKey,
          "name": values.processName,
          "nodeConfig": {
            "nodeName": "发起人",
            "nodeKey": getNodeKey(),
            "type": FlwEnums.NodeType.major,
            "childNode": {
              "nodeName": "审核人",
              "nodeKey": getNodeKey(),
              // "callProcess": null,
              "type": FlwEnums.NodeType.approval,
              "setType": FlwEnums.NodeSetType.specifyMembers,
              "nodeAssigneeList": [
                {
                  "id": "1",
                  "name": "超级管理员"
                }
              ],
              "examineLevel": 1,
              "directorLevel": 1,
              "selectMode": 1,
              "termAuto": false,
              "term": 0,
              "termMode": 1,
              "examineMode": 2,
              "directorMode": 0,
              "typeOfApprove": 1,
              "remind": false,
              "approveSelf": 1
            }
          }
        } as Flw.ProcessModel),
      }
      invokeInsertTask(params);
    }
  }

  function getInitialValues() {
    return {
      catagoryId: get(record, 'catagoryId'),
      processKey: get(record, 'processKey'),
      processName: get(record, 'processName'),
      processIcon: get(record, 'processIcon'),
      processType: get(record, 'processType'),
      processVersion: get(record, 'processVersion'),
      instanceUrl: get(record, 'instanceUrl'),
      remark: get(record, 'remark'),
      useScope: get(record, 'useScope'),
      processState: get(record, 'processState'),
      // modelContent: get(record, 'modelContent'),
      sort: get(record, 'sort'),
      // birthday: FaUtils.getInitialKeyTimeValue(record, 'birthday'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && <Button icon={<PlusOutlined />} type="primary">新增</Button>}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <FlowProcessForm
          form={form}
          onFinish={onFinish}
          initialValues={getInitialValues()}
        />
      </DragModal>
    </span>
  )
}
