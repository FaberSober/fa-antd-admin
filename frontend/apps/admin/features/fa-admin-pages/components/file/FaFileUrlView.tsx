import { FaCipher } from '@fa/ui';
import ConfigLayoutContext from '@features/fa-admin-pages/layout/config/context/ConfigLayoutContext';
import UserLayoutContext from '@features/fa-admin-pages/layout/user/context/UserLayoutContext';
import { Empty } from 'antd';
import { CSSProperties, useContext } from 'react';

export interface FaFileUrlViewProps {
  url: string;
  filename: string;
  waterMark?: boolean;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2024/9/11 21:26
 */
export default function FaFileUrlView({ url, filename, waterMark = true, style }: FaFileUrlViewProps) {
  const { systemConfig } = useContext(ConfigLayoutContext);
  const { user } = useContext(UserLayoutContext);


  if (url === undefined) return <Empty description="未传入文件" />;

  const originUrl = url; //要预览文件的访问地址
  let previewUrl = originUrl + '?fullfilename=' + filename;
  if (waterMark) {
    previewUrl += '&watermarkTxt=' + encodeURIComponent(user.name + '/' + user.username);
  }
  const kkUrl = systemConfig.kkFileViewUrl + '/onlinePreview?url=' + encodeURIComponent(FaCipher.encryptByBase64(previewUrl));
  return <iframe src={kkUrl} className="fa-full fa-iframe" style={{ border: 'none', ...style }} />;
}
