import React, { type ReactNode, useState } from 'react';
import { DragModal, type DragModalProps, FaUtils, type Fa, UploadFileLocal, BaseDrawer } from '@fa/ui';
import { Col, Form, Row } from 'antd';
import { FileBizList } from "@features/fa-admin-pages/components";
import WebSocketPlainTextCube from "../socket/WebSocketPlainTextCube";

export interface CommonExcelUploadModalProps extends DragModalProps {
  fetchFinish?: () => void;
  apiDownloadTplExcel?: () => any;
  apiImportExcel: (params: { fileId: string } & any) => Promise<Fa.Ret<boolean>>;
  templates?: string | ReactNode; // 下载模板
  formItems?: ReactNode;
  extraParams?: Record<any, any>;
  tips?: string | ReactNode;
  showTemplateDownload?: boolean;
  /** 展示ws导入过程文本信息 */
  showMsg?: boolean;
  accept?: string;
  /** 导入业务类型，有值的话展示导入关联的导入历史记录 */
  type?: string;
}

/**
 * 通用Excel导入弹框
 * @author xu.pengfei
 * @date 2023/6/27 14:21
 */
export default function CommonExcelUploadModal({
  children,
  title,
  fetchFinish,
  apiDownloadTplExcel,
  apiImportExcel,
  templates,
  formItems,
  extraParams,
  tips,
  showTemplateDownload = true,
  showMsg = true,
  accept,
  type,
  ...props
}: CommonExcelUploadModalProps) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const params = {
      ...fieldsValue,
      ...extraParams,
      buzzType: type,
    };

    setLoading(true);
    apiImportExcel(params)
      .then((res) => {
        setLoading(false);
        FaUtils.showResponse(res, '导入文件');
        if (fetchFinish) {
          fetchFinish();
        }
        setOpen(false);
      })
      .catch(() => setLoading(false));
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue({ fileId: undefined });
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal
        title="导入文件"
        open={open}
        onOk={() => form.submit()}
        okText="导入"
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish} {...FaUtils.formItemFullLayout}>
          {showTemplateDownload && (
            <Row className="fa-mb12">
              <Col offset={4} className="fa-flex-column">
                {apiDownloadTplExcel && <a onClick={apiDownloadTplExcel}>点击下载导入模板Excel文件</a>}
                {templates}
              </Col>
            </Row>
          )}

          {formItems}

          <Form.Item name="fileId" label="导入文件" rules={[{ required: true }]}>
            <UploadFileLocal accept={accept ? accept : FaUtils.FileAccept.EXCEL} />
          </Form.Item>

          {tips && (
            <Row className="fa-mb12">
              <Col offset={4} md={20}>
                {tips}
              </Col>
            </Row>
          )}

          {type && (
            <Row className="fa-mb12">
              <Col offset={4} md={20}>
                <BaseDrawer triggerDom={<a>导入历史记录</a>} title="导入历史记录">
                  <FileBizList mainBizId="" bizId="" type={type} />
                </BaseDrawer>
              </Col>
            </Row>
          )}

          {showMsg && (
            <div className="fa-mb12">
              <WebSocketPlainTextCube />
            </div>
          )}
        </Form>
      </DragModal>
    </span>
  );
}
