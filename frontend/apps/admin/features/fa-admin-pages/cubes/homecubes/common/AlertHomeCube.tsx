import React, { useEffect, useState } from 'react';
import type { Admin } from '@features/fa-admin-pages/types';
import { alertApi } from '@features/fa-admin-pages/services';
import AlertModal from '@features/fa-admin-pages/pages/admin/system/base/alert/modal/AlertModal';
import { useNavigate } from 'react-router-dom';

export function AlertHomeCube() {
  const navigate = useNavigate();
  const [array, setArray] = useState<Admin.Alert[]>([]);

  useEffect(() => {
    refreshData();
  }, []);

  function refreshData() {
    alertApi.list({ query: { deal: false }, sorter: 'ID DESC' }).then((res) => {
      setArray(res.data);
    });
  }

  return (
    <div className="fa-full-content">
      {array.map((item) => {
        return (
          <AlertModal key={item.id} record={item} title="处理告警" fetchFinish={refreshData}>
            <div className="fa-flex-row-center fa-link-grey fa-p8 fa-border-b">
              <div style={{ width: 120, fontWeight: 500 }}>{item.type}</div>
              <div className="fa-flex-1">{item.content}</div>
              <div style={{ width: 150 }}>{item.crtTime}</div>
            </div>
          </AlertModal>
        );
      })}

      <a style={{ position: 'absolute', right: 12, top: -24, zIndex: 9999 }} onClick={() => navigate('/admin/system/base/alert')}>
        更多
      </a>
    </div>
  );
}

AlertHomeCube.displayName = 'AlertHomeCube'; // 必须与方法名称一致
AlertHomeCube.title = '预警信息';
AlertHomeCube.description = '展示系统中未处理的预警信息';
AlertHomeCube.showTitle = true; // 是否展示Card的Title
AlertHomeCube.permission = ''; // 需要的权限-对应RbacMenu.linkUrl
AlertHomeCube.w = 8; // 宽度-max=16
AlertHomeCube.h = 8; // 高度
