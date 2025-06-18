import React, { useContext } from 'react';
import { Button, Card, message, Space } from 'antd';
import { ApiEffectLayoutContext, ShiroPermissionContainer } from '@fa/ui';
import { authTestApi } from '@/services';


/**
 * @author xu.pengfei
 * @date 2022/9/24 20:56
 */
export default function AuthTest() {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);

  function test1() {
    authTestApi.test1().then((res) => {
      message.success(res.data);
    });
  }

  function test2() {
    authTestApi.test2().then((res) => {
      message.success(res.data);
    });
  }

  const loading1 = loadingEffect[authTestApi.getUrl('test1')];
  const loading2 = loadingEffect[authTestApi.getUrl('test2')];
  return (
    <div className="fa-full-content fa-bg-white fa-p12">
      <Card title="按钮权限控制-后台控制" className="fa-mb12">
        <div>在后台接口中进行权限按钮限制</div>
        <Space>
          <Button onClick={test1} loading={loading1}>
            有权限
          </Button>
          <Button onClick={test2} loading={loading2}>
            无权限
          </Button>
        </Space>
      </Card>

      <Card title="按钮权限控制-前台控制" className="fa-mb12">
        <div>在前台中进行权限按钮限制，没有权限的按钮不展示</div>
        <Space>
          <ShiroPermissionContainer permission="/admin/demo/biz/authTest@button1">
            <Button onClick={test1} loading={loading1}>
              有权限
            </Button>
          </ShiroPermissionContainer>
          <ShiroPermissionContainer permission="/admin/demo/biz/authTest@button2">
            <Button onClick={test1} loading={loading2}>
              无权限
            </Button>
          </ShiroPermissionContainer>
        </Space>
      </Card>
    </div>
  );
}
