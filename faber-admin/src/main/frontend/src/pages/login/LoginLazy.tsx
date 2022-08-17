import React, { Suspense } from 'react'
import { RouteComponentProps } from '@reach/router'
import { PageLoading } from "@/components/antd-pro";

const OtherComponent = React.lazy(() => import('./Login'));

export default function LoginLazy(_: RouteComponentProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <OtherComponent />
    </Suspense>
  )
}