import React, { useContext } from 'react';
import { isNil } from 'lodash';
import { Avatar, Image, Popover } from 'antd';
import { fileSaveApi } from '@features/fa-admin-pages/services';
import ConfigLayoutContext from '@features/fa-admin-pages/layout/config/context/ConfigLayoutContext';

/**
 * @author xu.pengfei
 * @date 2024/12/30 12:10
 */
export default function WxMiniApp() {
  const { systemConfig } = useContext(ConfigLayoutContext);

  if (isNil(systemConfig.wxminiapp)) return null;
  return (
    <Popover title="微信小程序" content={<Image src={fileSaveApi.genLocalGetFile(systemConfig.wxminiapp)} width={300} />}>
      <div className="fa-link-grey fa-flex-center" style={{ width: 44, height: '100%' }}>
        <Avatar alt="微信小程序" src={fileSaveApi.genLocalGetFilePreview(systemConfig.wxminiapp)} size={25} />
      </div>
    </Popover>
  );
}
