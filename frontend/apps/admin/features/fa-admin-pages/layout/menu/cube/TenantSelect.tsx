import React, { useContext } from 'react';
import { ApartmentOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import UserLayoutContext from '../../user/context/UserLayoutContext';
import './TenantSelect.scss';

/**
 * 切换租户：
 * 1. 普通租户用户：只有一个租户，不显示切换器。
 * 2. 平台管理员 / 多租户用户：显示租户切换器。
 * 3. 超级管理员：展示“全部租户”
 * @author xu.pengfei
 * @date 2026-04-24 15:46:02
 */
export default function TenantSelect() {
  const { tenants, selectedTenant, switchTenant } = useContext(UserLayoutContext);

  if (!selectedTenant || tenants.length <= 1) {
    return null;
  }

  return (
    <Select
      className="tenant-select"
      popupClassName="tenant-select-popup"
      value={selectedTenant.tenantId}
      onChange={switchTenant}
      variant="borderless"
      showSearch
      optionFilterProp="label"
      style={{ width: 126 }}
      suffixIcon={<ApartmentOutlined />}
      options={tenants.map((i) => ({
        value: i.tenantId,
        label: i.tenantName || i.tenantId,
      }))}
    />
  );
}
