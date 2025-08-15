import React, { CSSProperties } from 'react';
import { Spin } from "antd";
import { isNil } from "lodash";


export interface FaLoadingProps {
  loading?: boolean;
  text?: string;
  className?: string | undefined;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2025/7/9 11:27
 */
export default function FaLoading({ loading, text, className, style }: FaLoadingProps) {
  if (isNil(loading) || !loading) return null;
  return (
    <div className={`fa-flex-row-center ${className}`} style={{ ...style }}>
      {loading && <Spin spinning={loading} size="small" />}
      {text && <span className="fa-ml8">{text}</span>}
    </div>
  )
}
