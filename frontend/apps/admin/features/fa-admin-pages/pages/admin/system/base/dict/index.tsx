import React, { useState } from 'react';
import { Empty } from 'antd';
import { BaseTree, FaLabel } from '@fa/ui';
import type { Admin } from '@/types';
import { dictApi } from '@features/fa-admin-pages/services';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import DictModal from './modal/DictModal';
import DictOptionsEdit from './cube/DictOptionsEdit';

/**
 * 字典管理
 * @author xu.pengfei
 * @date 2020/12/25
 */
export default function DictManage() {
  const [viewRecord, setViewRecord] = useState<Admin.Dict>();

  function onTreeSelect(keys: any[]) {
    if (keys.length > 0) {
      dictApi.getById(keys[0]).then((res) => setViewRecord(res.data));
    } else {
      setViewRecord(undefined);
    }
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  function refreshData() {
    if (viewRecord === undefined) return;
    dictApi.getById(viewRecord.id).then((res) => setViewRecord(res.data));
  }

  return (
    <div className="fa-full-content">
      <Allotment defaultSizes={[100, 500]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <BaseTree
            // showRoot
            showOprBtn
            onSelect={onTreeSelect}
            onAfterDelItem={onAfterDelItem}
            // 自定义配置
            serviceName="字典分组"
            ServiceModal={DictModal}
            serviceApi={dictApi}
          />
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full fa-m12">
          {viewRecord ? (
            <div className="fa-flex-column fa-full">
              <FaLabel title={`${viewRecord?.name} / ${viewRecord?.code} / ${viewRecord?.description || ''}`} className="fa-mb12" />

              <DictOptionsEdit dict={viewRecord} onChange={(v) => setViewRecord(v)} onRefresh={refreshData} />
            </div>
          ) : (
            <Empty description="请先选择字典分组" />
          )}
        </div>
      </Allotment>
    </div>
  );
}
