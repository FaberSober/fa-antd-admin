import React, {createContext, useState} from 'react';
import useBus from "use-bus";
import {LayoutProps} from "@/props/base";

export interface ApiEffectLayoutContextProps {
  loadingEffect: any, // 全局api请求加载
}

export const ApiEffectLayoutContext = createContext<ApiEffectLayoutContextProps>({
  loadingEffect: {},
});

/**
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function ApiEffectLayout({ children }: LayoutProps.BaseChildProps) {
  const [loadingEffect, setLoadingEffect] = useState<any>({});

  useBus(
    ['@@api/CHANGE_URL_LOADING'],
    ({ type, payload }) => {
      const { url, loading: urlLoading } = payload
      if (urlLoading) {
        setLoadingEffect({ ...loadingEffect, [url]: true })
      } else {
        const i = { ...loadingEffect }
        delete i[url]
        setLoadingEffect(i)
      }
    },
    [loadingEffect],
  )


  const contextValue: ApiEffectLayoutContextProps = {
    loadingEffect,
  };

  return (
    <ApiEffectLayoutContext.Provider value={contextValue}>
      {children}
    </ApiEffectLayoutContext.Provider>
  )
}
