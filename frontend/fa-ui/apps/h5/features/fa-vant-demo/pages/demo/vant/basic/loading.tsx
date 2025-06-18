import React from 'react';
import { PageLoading } from '@/components';


export interface loadingProps {
}

/**
 * @author xu.pengfei
 * @date 2023/4/6 11:23
 */
export default function loading({}: loadingProps) {
  return (
    <PageLoading />
  )
}