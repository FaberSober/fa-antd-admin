import React, { useEffect, useState } from 'react';
import type { Admin } from '@features/fa-admin-pages/types';
import { alertApi } from '@features/fa-admin-pages/services';
import AlertModal from '@features/fa-admin-pages/pages/admin/system/base/alert/modal/AlertModal';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Tooltip } from 'antd';
import { FaScrollList, TitleClickTab } from '@features/fa-admin-pages/components';

export function AlertHomeCube() {
  const [allAlerts, setAllAlerts] = useState<Admin.Alert[]>([]);

  useEffect(() => {
    refreshData();
  }, [])

  const refreshData = () => {
    alertApi.list({ query: {}, sorter: 'ID DESC' }).then(res => {
      setAllAlerts(res.data);
    })
  }

  return (
    <div className="fa-full-content">
      <FaScrollList
        list={allAlerts}
        renderItem={(item, index, seq) => {
          return (
            <AlertModal
              key={item.id}
              record={item}
              title="处理告警"
              fetchFinish={refreshData}
            >
              <div
                className="fa-flex-row-center fa-full fa-border-b fa-link-grey fa-pr12"
                style={{
                  backgroundColor: index === 0 ? '#fff8f8' : 'transparent',
                }}
              >
                <div
                  className="fa-transition"
                  style={{
                    backgroundColor: index === 0 ? '#ff4d4f' : 'transparent',
                    width: 3,
                    height: '100%',
                    marginRight: 6,
                  }}
                />

                <div className="fa-flex-center fa-border fa-mr8" style={{ width: 20, height: 20, borderRadius: 10}}>
                  <span style={{fontSize: '12px', lineHeight: '12px'}}>{seq + 1}</span>
                </div>

                <div style={{width: 120, fontWeight: 500}}>
                  <Tooltip title={item.type}>
                    <span className="ellipsis">{item.type}</span>
                  </Tooltip>
                </div>

                <div className="fa-flex-1" style={{padding: '0 8px'}}>
                  <div className="flex items-center">
                    {item.deal && <CheckCircleOutlined style={{color: '#54C41A', marginRight: 4, fontSize: 14}} />}
                    {!item.deal && <ExclamationCircleOutlined style={{color: '#FF4D4F', marginRight: 4, fontSize: 14}} />}
                    <Tooltip title={item.content}>
                      <span className="ellipsis">{item.content}</span>
                    </Tooltip>
                  </div>
                </div>

                <div style={{width: 160, textAlign: 'right'}}>
                  <Badge
                    status={item.deal ? 'success' : 'processing'}
                    text={<span className="fa-text-same-width-only" style={{fontSize: '12px'}}>{item.crtTime || ''}</span>}
                  />
                </div>
              </div>
            </AlertModal>
          )
        }}
      />
    </div>
  );
}

AlertHomeCube.displayName = 'AlertHomeCube';
AlertHomeCube.title = "预警信息";
AlertHomeCube.titleRender = () => <TitleClickTab title="预警信息" url="/admin/system/base/alert" />;
AlertHomeCube.description = '展示系统中未处理的预警信息（每1.5秒向上滚动一条）';
AlertHomeCube.showTitle = true;
AlertHomeCube.permission = '';
AlertHomeCube.w = 8;
AlertHomeCube.h = 8;
