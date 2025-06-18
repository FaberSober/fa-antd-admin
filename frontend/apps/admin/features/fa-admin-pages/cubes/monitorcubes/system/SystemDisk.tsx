import React, { useEffect, useState } from 'react';
import { useInterval } from 'ahooks';
import type { Admin } from '@/types';
import { systemApi } from '@features/fa-admin-pages/services';
import { FaUtils } from '@fa/ui';

export type SystemDiskProps = {};

export function SystemDisk() {
  const [data, setData] = useState<Admin.ServerInfo>();

  useEffect(() => {
    fetchData();
  }, []);

  useInterval(fetchData, 5000);

  function fetchData() {
    systemApi.server().then((res) => setData(res.data));
  }

  return (
    <div className="fa-full fa-p12">
      {data &&
        data.fileStoreList.map((i) => {
          const freePer = i.freeSpace / i.totalSpace;
          const totalWidth = 200;
          const freePerWidth = (freePer * totalWidth).toFixed(0);
          return (
            <div key={i.uuid} className="fa-flex-row-center fa-mb12">
              <div className="fa-flex-1">{i.volume}</div>
              <div className="fa-mr12">{i.name}</div>
              <div className="fa-flex-row-center fa-p8 fa-border fa-border-r fa-relative" style={{ width: totalWidth, background: 'darkblue', color: '#FFF' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${freePerWidth}px`, background: 'grey' }} />
                <div className="fa-flex-1" />
                <div className="fa-flex-row-center" style={{ zIndex: 1 }}>
                  <div>{FaUtils.sizeToHuman(i.freeSpace, 1)}</div>
                  <div>&nbsp;/&nbsp;</div>
                  <div>{FaUtils.sizeToHuman(i.totalSpace, 1)}</div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

SystemDisk.displayName = 'SystemDisk'; // 必须与方法名称一致
SystemDisk.title = '磁盘';
SystemDisk.description = '磁盘运行状态指标图';
SystemDisk.showTitle = true; // 是否展示Card的Title
SystemDisk.permission = ''; // 需要的权限
SystemDisk.w = 4; // 宽度-max=16
SystemDisk.h = 12; // 高度
