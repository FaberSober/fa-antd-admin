import React from 'react';
import { Descriptions, type DrawerProps } from 'antd';
import type { Admin } from '@/types';
// import ReactJson from 'react-json-view';
import { FaClickCopyLink, FaUtils } from '@fa/ui';
import { each } from 'lodash';

export interface GateLogDrawerProps extends DrawerProps {
  record: Admin.LogApi;
}

/**
 * BASE-URL请求日志
 实体新增、编辑弹框
 */
export default function LogApiView({ record }: GateLogDrawerProps) {
  function decode(url: string) {
    try {
      return decodeURIComponent(url);
    } catch (e: any) {
      console.error(e.message, 'url=', url);
    }
    return url;
  }

  return (
    <Descriptions bordered column={1} styles={{label: {width: 120}}}>
      <Descriptions.Item label="模块">{record.biz}</Descriptions.Item>
      <Descriptions.Item label="操作">{record.opr}</Descriptions.Item>
      <Descriptions.Item label="操作备注">{record.oprRemark}</Descriptions.Item>
      <Descriptions.Item label="类型">{record.crud}</Descriptions.Item>
      <Descriptions.Item label={<FaClickCopyLink copyText={record.url}>URL</FaClickCopyLink>}>{record.url}</Descriptions.Item>
      <Descriptions.Item label={<FaClickCopyLink copyText={decode(record.url)}>URL[decodeURI]</FaClickCopyLink>}>{decode(record.url)}</Descriptions.Item>
      <Descriptions.Item label="Method">{record.method}</Descriptions.Item>
      <Descriptions.Item label="Headers">
        <JsonView json={FaUtils.tryParseJson(record.headers, {})} />
      </Descriptions.Item>
      <Descriptions.Item label="User-Agent">{record.agent}</Descriptions.Item>
      <Descriptions.Item label="操作系统">{record.os}</Descriptions.Item>
      <Descriptions.Item label="浏览器">{record.browser}</Descriptions.Item>
      <Descriptions.Item label="浏览器版本">{record.version}</Descriptions.Item>
      <Descriptions.Item label="IP">{record.crtHost}</Descriptions.Item>
      <Descriptions.Item label="请求用户ID">{record.crtUser}</Descriptions.Item>
      <Descriptions.Item label="请求用户">{record.crtName}</Descriptions.Item>
      <Descriptions.Item label="请求时间">{record.crtTime}</Descriptions.Item>
      <Descriptions.Item label="请求花费时间">{record.duration}ms</Descriptions.Item>
      <Descriptions.Item label="省">{record.pro}</Descriptions.Item>
      <Descriptions.Item label="市">{record.city}</Descriptions.Item>
      <Descriptions.Item label="地址">{record.addr}</Descriptions.Item>
      <Descriptions.Item label="客户端来源">{record.faFrom}</Descriptions.Item>
      <Descriptions.Item label="客户端版本号">{record.versionCode}</Descriptions.Item>
      <Descriptions.Item label="客户端版本名">{record.versionName}</Descriptions.Item>
      <Descriptions.Item label="否为移动终端">{record.mobile ? '是' : '否'}</Descriptions.Item>
      <Descriptions.Item label={<FaClickCopyLink copyText={record.request}>请求内容</FaClickCopyLink>}>
        {FaUtils.isJson(record.request) ? (
          <div>{record.request}</div>
          // <ReactJson
          //   src={JSON.parse(record.request)}
          //   collapsed={2}
          //   displayDataTypes={false}
          //   style={{ fontSize: '10px', maxHeight: '90vh', overflow: 'auto' }}
          //   // theme="monokai"
          // />
        ) : (
          record.request
        )}
      </Descriptions.Item>
      <Descriptions.Item label="返回码">{record.retStatus}</Descriptions.Item>
      <Descriptions.Item label={<FaClickCopyLink copyText={record.response}>返回内容</FaClickCopyLink>}>
        {FaUtils.isJson(record.response) ? (
          <div>{record.response}</div>
          // <ReactJson
          //   src={JSON.parse(record.response)}
          //   collapsed={2}
          //   displayDataTypes={false}
          //   style={{ fontSize: '10px', maxHeight: '90vh', overflow: 'auto' }}
          //   // theme="monokai"
          // />
        ) : (
          record.response
        )}
      </Descriptions.Item>
      <Descriptions.Item label={<FaClickCopyLink copyText={record.remark}>请求备注</FaClickCopyLink>}>{record.remark}</Descriptions.Item>
    </Descriptions>
  );
}

function JsonView({ json }: any) {
  const arr: any[] = [];
  each(json, (v, k) => {
    arr.push({ k, v });
  });
  return (
    <table className="fa-table">
      <tbody>
        {arr.map((i) => (
          <tr key={i.k}>
            <td style={{ width: 130 }}>{i.k}</td>
            <td>{i.v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
