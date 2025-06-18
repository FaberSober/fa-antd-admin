import type { ReactNode } from 'react';
import type ConditionQuery from '@ui/components/condition-query/interface';
import type { ColumnProps, TableProps } from 'antd/es/table';
import type { Fa } from '@fa/ui';

/**
 * 通用业务表格配置
 */
namespace FaberTable {
  /** 单值回掉 */
  export interface TcCondProp {
    index: number;
    value: any;
    callback: (value: string, index: number, name?: string) => void;
    style: { width: 400; marginRight: 12 };
    placeholder: '请输入筛选条件的值';
    mode?: string | undefined;
  }

  /** 双值回掉 */
  export interface TcCondBetweenProps {
    index: number;
    value: [begin: any, end: any];
    callback: (
      value: [beginValue: string, endValue: string],
      index: number,
      name?: [beginName: string | undefined, endName: string | undefined],
    ) => void;
    style: { width: 400; marginRight: 12 };
  }

  /**
   * 自定义表格column
   */
  export interface ColumnsProp<T> extends ColumnProps<T> {
    dataIndex: string | string[]; // table#dataIndex唯一ID配置
    title?: string;
    width?: number;
    sort?: number; // 排序-用于用户自定义字段排序
    tcRequired?: boolean; // 必须
    tcChecked?: boolean; // 默认勾选
    tcCondComponent?: (props: TcCondProp) => JSX.Element; // 自定义条件查询筛选值自定义录入组件-单值录入组件-方法定义
    tcCondComponentElement?: FunctionComponent; // 自定义条件查询筛选值自定义录入组件-单值录入组件-组件定义
    tcCondBetweenComponent?: (props: TcCondBetweenProps) => JSX.Element; // 自定义条件查询筛选值自定义录入组件-双值录入组件-方法定义
    tcCondBetweenComponentElement?: FunctionComponent; // 自定义条件查询筛选值自定义录入组件-双值录入组件-组件定义
    tcType?: string | undefined; // 自定义类型:menu操作菜单/
    tcConditionHide?: boolean; // 自定义条件查询-是否隐藏
    tcLabel?: string; // 自定义条件查询-标签
  }

  /**
   * BaseTable的定义
   */
  export interface BaseSimpleTableProps<RecordType extends object = any> extends TableProps<RecordType> {
    showRowNum?: boolean; // 是否展示行号
    showCheckbox?: boolean; // 是否展示勾选框
    columns: FaberTable.ColumnsProp<RecordType>[]; // antd表格字段
    refreshList: () => void; // 刷新列表
    batchDelete?: (ids: any[]) => Promise<Fa.Ret>; // 批量删除API
    renderCheckBtns?: (rowKeys: any[]) => ReactNode; // 自定义追加的多选的按钮
    rowClickSelected?: boolean; // 点击row是否选中
    rowClickSingleSelected?: boolean; // 点击row是否单选
    showBatchDelBtn?: boolean; // 是否展示多选删除按钮
    showTopTips?: boolean; // 是否展示顶部选中文本信息
    showTopDiv?: boolean; // 是否展示顶部DIV
    onSelectedRowsChange?: (rows: any[]) => void; // 选中keys变更回调
    scrollY?: number;
    keyName?: string; // Key字段名称
    batchDelBtn?: ReactNode|string; // 批量删除Button
  }

  /**
   * BaseTable的定义
   */
  export interface BaseTableProps<RecordType extends object = any> extends BaseSimpleTableProps<RecordType> {
    showTableColConfigBtn?: boolean; // 是否展示自定义表格字段按钮
    showComplexQuery?: boolean; // 是否展示高级查询
    biz: string; // 业务模块：用于区分存储表格自定义配置的Key
    renderQuerySuffix?: () => ReactNode; // 自定义追加的查询条件后缀
    renderQueryAll?: () => ReactNode; // 自定义追加的全部查询
    querySuffix?: ReactNode; // 自定义追加的查询条件后缀
    onSceneChange?: (sceneId: string) => void; // 查询场景变更
    onConditionChange?: (conditionList: ConditionQuery.CondGroup[]) => void; // 组合查询条件变更
    showDeleteByQuery?: boolean; // 是否展示-根据当前查询条件全量删除
    onDeleteByQuery?: () => void; // 根据当前查询条件全量删除
  }
}

export default FaberTable;
