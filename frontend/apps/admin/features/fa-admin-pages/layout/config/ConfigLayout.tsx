import React, { useEffect, useState } from 'react';
import type { Admin } from '@/types';
// import Favicon from 'react-favicon'
import { Favicon } from '@features/fa-admin-pages/components/icons/Favicon';
import { type Fa, PageLoading } from '@fa/ui';
import { configSysApi, fileSaveApi } from '@features/fa-admin-pages/services';
import ConfigLayoutContext, { type ConfigLayoutContextProps } from './context/ConfigLayoutContext';

/**
 * 系统配置的上下文
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function ConfigLayout({ children }: Fa.BaseChildProps) {
  const [systemConfig, setSystemConfig] = useState<Admin.SystemConfigPo>();

  useEffect(() => {
    refreshSystemConfig();
  }, []);

  // 获取系统配置参数
  function refreshSystemConfig() {
    configSysApi.getSystemConfig().then((res) => setSystemConfig(res.data));
  }

  if (systemConfig === undefined) return <PageLoading />;

  const contextValue: ConfigLayoutContextProps = {
    systemConfig,
    refreshSystemConfig,
  };

  return (
    <ConfigLayoutContext.Provider value={contextValue}>
      {systemConfig && systemConfig.logo && <Favicon url={fileSaveApi.genLocalGetFilePreview(systemConfig.logo)} />}
      {children}
    </ConfigLayoutContext.Provider>
  );
}
