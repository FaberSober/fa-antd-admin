import React, {createContext, useState} from 'react';
import useBus from "use-bus";
import * as Fa from "@/../../types/base/Fa";

export interface ApiEffectLayoutContextProps {
  loadingEffect: any, // 全局api请求加载
}

export const ApiEffectLayoutContext = createContext<ApiEffectLayoutContextProps>({
  loadingEffect: {},
});

let loadingEffectOrigin:any = {};

/**
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function ApiEffectLayout({ children }: Fa.BaseChildProps) {
  const [loadingEffect, setLoadingEffect] = useState<any>({});

  useBus(
    ['@@api/CHANGE_URL_LOADING'],
    ({ type, payload }) => {
      const { url, loading: urlLoading } = payload
      // console.log('@@api/CHANGE_URL_LOADING', url, urlLoading)
      if (urlLoading) {
        loadingEffectOrigin[url] = true;
      } else {
        delete loadingEffectOrigin[url]
      }
      setLoadingEffect({ ...loadingEffectOrigin })
    },
    [],
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
