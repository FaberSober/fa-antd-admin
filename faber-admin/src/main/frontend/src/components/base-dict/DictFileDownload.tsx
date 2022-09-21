import React, { CSSProperties, useEffect, useState } from 'react';
import dictApi from '@/services/admin/dict';
import Admin from '@/props/admin';
import { RES_CODE } from '@/configs/server.config';
import { DownloadOutlined } from '@ant-design/icons';

export interface DictFileDownloadProps {
  dictTypeCode: string;
  dictText: string;
  onFetchData?: (dicts: Admin.Dict[]) => void;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2021/6/5
 */
export default function DictFileDownload({ dictTypeCode, dictText, onFetchData, style }: DictFileDownloadProps) {
  const [array, setArray] = useState<Admin.Dict[]>([]);

  useEffect(() => {
    dictApi.getByCodeAndText(dictTypeCode, dictText).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setArray(res.data);
        if (onFetchData) {
          onFetchData(res.data);
        }
      }
    });
  }, [dictTypeCode, dictText]);

  return (
    <div style={style}>
      {array.map((d) => (
        <a key={d.id} href={d.value} style={{ display: 'block' }}>
          <DownloadOutlined /> {d.description}
        </a>
      ))}
    </div>
  );
}
