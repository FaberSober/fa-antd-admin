import React, {useContext} from 'react';
import {ApiEffectLayoutContext} from "@/layout/ApiEffectLayout";
import {Col, Form, Row} from "antd";
import {UploadImgLocal} from "@/components/base-uploader";

const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } }

/**
 * @author xu.pengfei
 * @date 2022/12/11 22:48
 */
export default function ConfigSystem() {
  const {loadingEffect} = useContext(ApiEffectLayoutContext)
  const [form] = Form.useForm();

  function onFinish(v:any) {
  }

  return (
    <div className="fa-p12">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row>
          <Col md={8}>
            <Form.Item name="logo" label="系统LOGO">
              <UploadImgLocal />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item name="logoWithText" label="系统LOGO（带文字）">
              <UploadImgLocal />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
