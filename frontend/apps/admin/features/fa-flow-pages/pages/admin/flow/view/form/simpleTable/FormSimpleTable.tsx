import { Flow } from '@features/fa-flow-pages/types';
import React from 'react';

export interface FormSimpleTableProps {
  flowForm: Flow.FlowForm;
}

/**
 * 简单表格：即不包含流程的简单表格，功能如下：
 * 1. 增删改查；
 * 2. 导入导出；
 * @author xu.pengfei
 * @date 2026-02-05 17:29:24
 */
export default function FormSimpleTable({ flowForm }: FormSimpleTableProps) {
  return (
    <div></div>
  );
}