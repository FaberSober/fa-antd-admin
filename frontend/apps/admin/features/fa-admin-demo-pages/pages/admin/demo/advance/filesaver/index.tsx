import React, { useState } from 'react';
import { Button, Card, Input, Space, Upload } from "antd";
// import MonacoEditor from "react-monaco-editor";
import { FaUtils } from "@fa/ui";
import { saveAs } from 'file-saver';


/**
 * @author xu.pengfei
 * @date 2023/7/15 16:32
 */
export default function DemoAdvanceFileSaver() {
  const [data1, setData1] = useState(FaUtils.tryFormatJson('{"foo":"bar"}'))
  const [data2, setData2] = useState('')

  function handleSaveFile() {
    const blob = new Blob([data1], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "test.json");
  }

  return (
    <div className="fa-full-content fa-bg-white fa-p12 fa-flex-column">
      <Card title="保存文件到本地" className="fa-mb12">
        <Input.TextArea
          autoSize={{minRows:1, maxRows: 25}}
          value={data1}
          onChange={e => setData1(e.target.value)}
        />
        {/*<MonacoEditor*/}
        {/*  height={100}*/}
        {/*  language="sql"*/}
        {/*  theme="vs-dark"*/}
        {/*  value={data1}*/}
        {/*  onChange={v => setData1(v)}*/}
        {/*  options={{*/}
        {/*    selectOnLineNumbers: true,*/}
        {/*    folding: true,*/}
        {/*    minimap: { enabled: true },*/}
        {/*  }}*/}
        {/*/>*/}
        <Space className="fa-mt12">
          <Button onClick={handleSaveFile}>保存本地文件</Button>
        </Space>
      </Card>

      <Card title="上传本地文件" className="fa-mb12">
        <Input.TextArea
          autoSize={{minRows:1, maxRows: 25}}
          value={data2}
          onChange={e => setData2(e.target.value)}
        />

        {/*<MonacoEditor*/}
        {/*  height={100}*/}
        {/*  language="sql"*/}
        {/*  theme="vs-dark"*/}
        {/*  value={data2}*/}
        {/*  onChange={v => setData2(v)}*/}
        {/*  options={{*/}
        {/*    selectOnLineNumbers: true,*/}
        {/*    folding: true,*/}
        {/*    minimap: { enabled: true },*/}
        {/*  }}*/}
        {/*/>*/}
        <Space className="fa-mt12">
          <Upload
            beforeUpload={file => {
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = () => {
                const result = reader.result as string;
                // console.log("result===", result);
                setData2(FaUtils.tryFormatJson(result))
              };
              return false;
            }}
            showUploadList={false}
          >
            <Button>上传本地文件</Button>
          </Upload>
        </Space>
      </Card>
    </div>
  )
}
