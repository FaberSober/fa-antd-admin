import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { SITE_INFO } from '@/configs/server.config';

const IconFontDom = createFromIconfontCN({
  scriptUrl: SITE_INFO.ICON_FONT_SCRIPTS,
});

/**
 * @author xu.pengfei
 * @date 2021/4/8
 */
export default function IconFont(props: any) {
  return <IconFontDom {...props} />;
}
