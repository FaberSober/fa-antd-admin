import React from 'react';
import { Button, Space, Upload } from 'antd';
import { saveAs } from 'file-saver';
import FaInputEditModal from '../modal/FaInputEditModal';

export interface ExportAndImportBtnProps {
  filename: string;
  layout: string;
  onUpload: (v: string) => void;
}

/**
 * @author xu.pengfei
 * @date 2023/10/12 15:24
 */
export default function ExportAndImportBtn({ filename, layout, onUpload }: ExportAndImportBtnProps) {
  function handleSaveFile() {
    const blob = new Blob([layout], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${filename}.json`);
  }

  return (
    <Space>
      <FaInputEditModal title="编辑配置" value={layout} onChange={(v) => onUpload(v)}>
        <Button>编辑配置</Button>
      </FaInputEditModal>
      <Button onClick={handleSaveFile}>导出配置</Button>
      <Upload
        beforeUpload={(file) => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            const result = reader.result as string;
            if (onUpload) {
              onUpload(result);
            }
          };
          return false;
        }}
        showUploadList={false}
      >
        <Button>上传配置</Button>
      </Upload>
    </Space>
  );
}
