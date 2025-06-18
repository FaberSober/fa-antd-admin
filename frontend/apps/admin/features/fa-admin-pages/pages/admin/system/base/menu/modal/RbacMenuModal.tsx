import React, { useContext, useEffect, useState } from 'react';
import { get } from 'lodash';
import { Form, Input, Select } from 'antd';
import { ApiEffectLayoutContext, BaseBoolRadio, type CommonModalProps, DictEnumApiRadio, DragModal, FaEnums, FaUtils } from '@fa/ui';
import type { Rbac } from '@/types';
import { rbacMenuApi } from '@features/fa-admin-pages/services';
import RbacMenuCascader from '../helper/RbacMenuCascader';
import IconSelect from '@features/fa-admin-pages/components/icons/IconSelect';
import RouteCascader from '@features/fa-admin-pages/components/route/RouteCascader';

const serviceName = '菜单';

interface RbacMenuModalProps extends CommonModalProps<Rbac.RbacMenu> {
  scope: FaEnums.RbacMenuScopeEnum;
  parentId?: string;
}

/**
 * BASE-权限表实体新增、编辑弹框
 */
export default function RbacMenuModal({ children, title, record, scope, parentId, fetchFinish, ...props }: RbacMenuModalProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [_level, setLevel] = useState<FaEnums.RbacMenuLevelEnum | undefined>(() => {
    return record ? record.level : FaEnums.RbacMenuLevelEnum.MENU;
  });
  const [linkType, setLinkType] = useState<FaEnums.RbacLinkTypeEnum | undefined>(() => {
    return record ? record.linkType : FaEnums.RbacLinkTypeEnum.INNER;
  });

  /** 新增Item */
  function invokeInsertTask(params: any) {
    rbacMenuApi.save(params).then((res) => {
      FaUtils.showResponse(res, `新增${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    rbacMenuApi.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, `更新${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      scope,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      parentId: get(record, 'parentId', parentId),
      name: get(record, 'name'),
      level: get(record, 'level', FaEnums.RbacMenuLevelEnum.MENU),
      icon: get(record, 'icon'),
      status: get(record, 'status', true),
      linkType: get(record, 'linkType', FaEnums.RbacLinkTypeEnum.INNER),
      linkUrl: get(record, 'linkUrl'),
    };
  }

  function showModal() {
    setOpen(true);
    setLevel(record ? record.level : undefined);
    form.setFieldsValue(getInitialValues());
  }

  useEffect(() => {
    if (!props.open) return;
    setLevel(record ? record.level : undefined);
    form.setFieldsValue(getInitialValues());
  }, [record]);

  const loading = loadingEffect[rbacMenuApi.getUrl('save')] || loadingEffect[rbacMenuApi.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={(cv: any) => {
            if (cv.level) {
              setLevel(cv.level);
            }
            if (cv.linkType) {
              setLinkType(cv.linkType);
            }
            if (cv.level === FaEnums.RbacMenuLevelEnum.BUTTON) {
              form.setFieldsValue({ linkType: FaEnums.RbacLinkTypeEnum.PATH });
            }
          }}
        >
          <Form.Item name="level" label="菜单等级" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <DictEnumApiRadio enumName="RbacMenuLevelEnum" />
          </Form.Item>
          <Form.Item name="parentId" label="上级菜单" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <RbacMenuCascader
              showRoot
              onChangeWithItem={(_: any, raw: Rbac.RbacMenu | undefined) => {
                form.setFieldValue('linkUrl', raw ? raw.linkUrl : '');
              }}
              disabledIds={record ? [record.id] : undefined}
              scope={scope}
            />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="是否启用" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="linkType" label="链接类型" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Select>
              <Select.Option value={FaEnums.RbacLinkTypeEnum.INNER}>内部链接</Select.Option>
              <Select.Option value={FaEnums.RbacLinkTypeEnum.OUT}>外部链接</Select.Option>
              <Select.Option value={FaEnums.RbacLinkTypeEnum.PATH}>自定义路径</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="linkUrl" label="链接地址" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            {linkType === FaEnums.RbacLinkTypeEnum.INNER ? <RouteCascader /> : <Input placeholder="请输入菜单的链接地址\权限点" />}
          </Form.Item>

          <Form.Item name="icon" label="图标标识" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <IconSelect />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
