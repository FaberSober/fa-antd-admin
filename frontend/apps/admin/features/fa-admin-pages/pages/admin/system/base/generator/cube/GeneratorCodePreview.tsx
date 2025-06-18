import React, { useEffect, useRef, useState } from 'react';
import { FaFlexRestLayout, FaHref, FaUtils } from '@fa/ui';
// import MonacoEditor from "react-monaco-editor";
import { useSize, useUpdate } from 'ahooks';
import type { Generator } from '@features/fa-admin-pages/types';
import { Button, Form, Input, Modal, Space, Tree } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useLocalStorage } from 'react-use';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { camelCase, get, isNil, trim } from 'lodash';
import { generatorApi } from '@features/fa-admin-pages/services';
import CodeCopyToModal from '../modal/CodeCopyToModal';

export interface GeneratorCodePreviewProps {
  tableNames: string[];
}

/**
 * @author xu.pengfei
 * @date 2023/3/9 13:59
 */
export default function GeneratorCodePreview({ tableNames }: GeneratorCodePreviewProps) {
  const domRef = useRef<any | null>();
  const size = useSize(domRef);

  const [form] = Form.useForm();
  const update = useUpdate();
  const [codeGen, setCodeGen] = useState<Generator.CodeGenRetVo>();
  const [selItem, setSelItem] = useState<any>();
  const [configCache, setConfigCache] = useLocalStorage<any>('generator.configCache', {
    packageName: 'com.faber.api',
    tablePrefix: 'base_',
    apiPath: 'base',
    mainModule: 'base',
    javaCopyPath: 'fa-base',
    rnCopyPath: 'frontend\\apps\\admin\\features\\fa-admin-pages\\pages\\admin',
    author: '',
    email: '',
  });

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    if (keys.length !== 1) return;

    const item: any = info.selectedNodes[0];
    console.log('item', item);

    if (isNil(item.type)) return;
    setSelItem(item);
  };

  useEffect(() => {
    fetchPreview();
  }, [selItem]);

  function getBasicParams(): any {
    const fieldsValue = form.getFieldsValue();
    return {
      packageName: get(fieldsValue, 'packageName', ''),
      tablePrefix: get(fieldsValue, 'tablePrefix', ''),
      apiPath: get(fieldsValue, 'apiPath', ''),
      mainModule: get(fieldsValue, 'mainModule', ''),
      author: get(fieldsValue, 'author', ''),
      email: get(fieldsValue, 'email', ''),
      javaCopyPath: get(fieldsValue, 'javaCopyPath', ''),
      rnCopyPath: get(fieldsValue, 'rnCopyPath', ''),
    };
  }

  function fetchPreview() {
    if (selItem === undefined) return;
    const fieldsValue = form.getFieldsValue();
    setConfigCache(fieldsValue);
    generatorApi
      .preview({
        ...getBasicParams(),
        tableName: selItem.tableName,
        type: selItem.type,
      })
      .then((res) => {
        setCodeGen(res.data);
      });
  }

  function handleCopyJava() {
    Modal.confirm({
      title: '复制Java',
      content: '确认复制Java文件？',
      onOk: () => {
        const params = {
          ...getBasicParams(),
          tableNames,
          types: ['java.entity', 'java.mapper', 'java.biz', 'java.controller', 'xml.mapper'],
        };
        generatorApi.copyBatch(params).then((res) => FaUtils.showResponse(res, '复制'));
      },
    });
  }

  function handleCopyAll() {
    Modal.confirm({
      title: '复制全部',
      content: '确认复制全部文件？',
      onOk: () => {
        const params = {
          ...getBasicParams(),
          tableNames,
        };
        generatorApi.copyAll(params).then((res) => FaUtils.showResponse(res, '复制'));
      },
    });
  }

  function handleCopyOne() {
    if (selItem === undefined) return;

    Modal.confirm({
      title: '复制',
      content: '确认复制当前文件？',
      onOk: () => {
        const params = {
          ...getBasicParams(),
          tableName: selItem.tableName,
          type: selItem.type,
        };
        generatorApi.copyOne(params).then((res) => FaUtils.showResponse(res, '复制'));
      },
    });
  }

  function handleCopyOneToPath(path: string) {
    if (selItem === undefined) return;
    const params = {
      ...getBasicParams(),
      tableName: selItem.tableName,
      type: selItem.type,
      path,
    };
    generatorApi.copyOneToPath(params).then((res) => FaUtils.showResponse(res, '复制'));
  }

  function tableNameToJava(tableName: string) {
    const name = tableNameToCaml(tableName);
    return name.substr(0, 1).toUpperCase() + name.substr(1);
  }

  function tableNameToCaml(tableName: string) {
    const tablePrefix = form.getFieldValue('tablePrefix');
    return camelCase(tableName.replace(trim(tablePrefix), ''));
  }

  const treeData: DataNode[] = [
    {
      title: 'main',
      key: 'main',
      children: [
        {
          title: 'java',
          key: 'java',
          children: [
            {
              title: 'entity',
              key: 'entity',
              children: tableNames.map((i) => ({
                title: `${tableNameToJava(i)}.java`,
                key: `${tableNameToJava(i)}.java`,
                isLeaf: true,
                type: 'java.entity',
                tableName: i,
              })),
            },
            {
              title: 'mapper',
              key: 'mapper',
              children: tableNames.map((i) => ({
                title: `${tableNameToJava(i)}Mapper.java`,
                key: `${tableNameToJava(i)}Mapper.java`,
                isLeaf: true,
                type: 'java.mapper',
                tableName: i,
              })),
            },
            {
              title: 'biz',
              key: 'biz',
              children: tableNames.map((i) => ({
                title: `${tableNameToJava(i)}Biz.java`,
                key: `${tableNameToJava(i)}Biz.java`,
                isLeaf: true,
                type: 'java.biz',
                tableName: i,
              })),
            },
            {
              title: 'rest',
              key: 'rest',
              children: tableNames.map((i) => ({
                title: `${tableNameToJava(i)}Controller.java`,
                key: `${tableNameToJava(i)}Controller.java`,
                isLeaf: true,
                type: 'java.controller',
                tableName: i,
              })),
            },
          ],
        },
        {
          title: 'mapperxml',
          key: 'mapperxml',
          children: tableNames.map((i) => ({
            title: `${tableNameToJava(i)}Mapper.xml`,
            key: `${tableNameToJava(i)}Mapper.xml`,
            isLeaf: true,
            type: 'xml.mapper',
            tableName: i,
          })),
        },
      ],
    },
    {
      title: 'frontend',
      key: '0-1',
      children: [
        {
          title: 'props',
          key: 'props',
          children: tableNames.map((i) => ({
            title: `${tableNameToCaml(i)}.ts`,
            key: `${i}.rn.props`,
            isLeaf: true,
            type: 'rn.props',
            tableName: i,
          })),
        },
        {
          title: 'services',
          key: 'service',
          children: tableNames.map((i) => ({
            title: `${tableNameToCaml(i)}.ts`,
            key: `${i}.rn.service`,
            isLeaf: true,
            type: 'rn.service',
            tableName: i,
          })),
        },
        {
          title: 'list',
          key: 'list',
          children: [
            {
              title: 'cube',
              key: 'cube',
              children: tableNames.map((i) => ({
                title: `${tableNameToJava(i)}View.tsx`,
                key: `${i}.rn.view`,
                isLeaf: true,
                type: 'rn.view',
                tableName: i,
              })),
            },
            {
              title: 'modal',
              key: 'modal',
              children: tableNames.map((i) => ({
                title: `${tableNameToJava(i)}Modal.tsx`,
                key: `${i}.rn.modal`,
                isLeaf: true,
                type: 'rn.modal',
                tableName: i,
              })),
            },
            ...tableNames.map((i) => ({
              title: `${tableNameToJava(i)}List.tsx`,
              key: `${i}.rn.list`,
              isLeaf: true,
              type: 'rn.list',
              tableName: i,
            })),
          ],
        },
      ],
    },
  ];

  return (
    <div className="fa-full-content-p12 fa-flex-row">
      <div className="fa-flex-column" style={{ width: 550, marginRight: 12 }}>
        <FaFlexRestLayout>
          <Tree.DirectoryTree defaultExpandAll onSelect={onSelect} treeData={treeData} />
        </FaFlexRestLayout>

        <Form
          form={form}
          initialValues={configCache}
          onFieldsChange={(cv: any) => {
            if (cv.tablePrefix) {
              update();
              fetchPreview();
            }
            setConfigCache(form.getFieldsValue());
          }}
        >
          <Form.Item name="packageName" label="包名" rules={[{ required: true }]}>
            <Input placeholder="base_table_name" />
          </Form.Item>
          <Form.Item name="tablePrefix" label="去除表前缀" rules={[{ required: false }]}>
            <Input placeholder="base_" />
          </Form.Item>
          <Form.Item name="apiPath" label="API路径" rules={[{ required: true }]}>
            <Input placeholder="base/admin" />
          </Form.Item>
          <Form.Item name="mainModule" label="前端模块" rules={[{ required: true }]}>
            <Input placeholder="base.admin" />
          </Form.Item>
          <Form.Item name="javaCopyPath" label="Java复制项目" rules={[{ required: true }]}>
            <Input placeholder="项目名称" />
          </Form.Item>
          <Form.Item name="rnCopyPath" label="前端复制目录" rules={[{ required: true }]}>
            <Input placeholder="前端的相对路径" />
          </Form.Item>
          <Form.Item name="author" label="作者" rules={[{ required: true }]}>
            <Input placeholder="作者" />
          </Form.Item>
          <Form.Item name="email" label="email" rules={[{ required: true }]}>
            <Input placeholder="email" />
          </Form.Item>
        </Form>
      </div>

      <FaFlexRestLayout style={{ display: 'flex', flexDirection: 'column' }}>
        <Space className="fa-mb12">
          <FaHref
            onClick={() => {
              FaUtils.copyToClipboard(selItem?.title);
            }}
            icon={<CopyOutlined />}
            text={selItem && selItem.title}
          />
          <Button onClick={handleCopyAll} icon={<CopyOutlined />}>
            复制全部文件
          </Button>
          <Button onClick={handleCopyJava} icon={<CopyOutlined />}>
            复制Java文件
          </Button>
          {selItem && (
            <Button onClick={handleCopyOne} icon={<CopyOutlined />}>
              复制当前文件
            </Button>
          )}
          {selItem && (
            <CodeCopyToModal onSubmit={(path) => handleCopyOneToPath(path)}>
              <Button icon={<CopyOutlined />}>复制当前文件到...</Button>
            </CodeCopyToModal>
          )}
        </Space>

        <FaFlexRestLayout>
          <div ref={domRef} style={{ height: '100%' }}>
            {size && size.height && codeGen && (
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 25 }}
                value={codeGen && codeGen.code}
                onChange={(e) => setCodeGen({ ...codeGen, code: e.target.value })}
              />
              // <MonacoEditor
              //   height={size.height}
              //   theme="vs-dark"
              //   language={codeGen ? codeGen.type.split(".")[0] : ''}
              //   value={codeGen && codeGen.code}
              //   options={{
              //     readOnly: true,
              //     selectOnLineNumbers: true,
              //     folding: true,
              //     minimap: { enabled: true },
              //   }}
              // />
            )}
          </div>
        </FaFlexRestLayout>
      </FaFlexRestLayout>
    </div>
  );
}
