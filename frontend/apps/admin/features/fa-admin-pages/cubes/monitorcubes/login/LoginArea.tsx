import React, { useEffect, useState } from 'react';
import type { Fa } from '@/types';
import { logLoginApi } from '@features/fa-admin-pages/services';
import EchartsPie from '@features/fa-admin-pages/components/echarts/EchartsPie';

export type LoginAreaProps = {};

export function LoginArea() {
  const [array, setArray] = useState<Fa.ChartSeriesVo[]>([]);

  useEffect(() => {
    logLoginApi.countByPro().then((res) => setArray(res.data));
  }, []);

  return (
    <div className="fa-full fa-p12">
      <EchartsPie
        title="登录地区统计"
        // subTitle="Pie Chart"
        // data={[
        //   {value: 1048, name: 'Search Engine'},
        //   {value: 735, name: 'Direct'},
        //   {value: 580, name: 'Email'},
        //   {value: 484, name: 'Union Ads'},
        //   {value: 300, name: 'Video Ads'}
        // ]}
        data={array}
        dataTitle="登录地区"
        // style={{width: 500, height: 300}}
      />
    </div>
  );
}

LoginArea.displayName = 'LoginArea'; // 必须与方法名称一致
LoginArea.title = '登录地区统计';
LoginArea.description = '登录地区统计柱饼图';
LoginArea.showTitle = true; // 是否展示Card的Title
LoginArea.permission = ''; // 需要的权限
LoginArea.w = 4; // 宽度-max=16
LoginArea.h = 12; // 高度
