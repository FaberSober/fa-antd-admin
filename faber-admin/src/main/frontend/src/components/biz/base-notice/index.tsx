import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import noticeService from '@/services/admin/notice';
import Admin from '@/props/admin';
import FaberBase from '@/props/base/FaberBase';
import { RES_CODE } from '@/configs/server.config';

/**
 * 全局公告-强提醒-顶部固定展示
 * @author xu.pengfei
 * @date 2021/1/7
 */
export default function BaseNotice() {
  const [array, setArray] = useState<Admin.Notice[]>([]);

  useEffect(() => {
    noticeService.list({ delState: FaberBase.DelState.AVAILABLE, status: FaberBase.TrueOrFalse.TRUE, strongNotice: FaberBase.TrueOrFalse.TRUE }).then((res) => {
      if (res && res.status === RES_CODE.OK) {
        setArray(res.data);
      }
    });
  }, []);

  return (
    <div>
      {array.map((item) => (
        <Alert key={item.id} message={`${item.title}: ${item.content}`} banner />
      ))}
    </div>
  );
}
