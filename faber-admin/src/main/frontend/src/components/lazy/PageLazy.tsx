import React, {ReactNode, Suspense} from 'react'
import { PageLoading } from "@/components/antd-pro";
import LayoutProps from "@/props/base/LayoutProps";

interface IProps {
  pageImport: () => Promise<any>;
  children?: ReactNode;
  /** 顶部菜单模块配置 */
  headerModal?: LayoutProps.HeaderModal;
  [key:string]: any,
}

export default function PageLazy({ pageImport, ...props }: IProps) {

  const OtherComponent = React.lazy(pageImport);

  return (
    <Suspense fallback={<PageLoading style={{ height: '100%', width: '100%' }} />}>
      <OtherComponent {...props} />
    </Suspense>
  )
}
