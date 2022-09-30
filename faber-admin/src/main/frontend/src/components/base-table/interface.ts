import { ReactNode } from 'react';
import Ajax from '@/props/base/Ajax';
import ConditionQuery from '@/components/condition-query/interface';
import { ColumnProps, TableProps } from 'antd/lib/table';

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
	}

	/** 双值回掉 */
	export interface TcCondBetweenProps {
		index: number;
		value: [begin: any, end: any];
		callback: (value: [beginValue: string, endValue: string], index: number, name?: [beginName: string | undefined, endName: string | undefined]) => void;
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
		tcCondComponent?: (props: TcCondProp) => JSX.Element; // 自定义条件查询筛选值自定义录入组件-单值录入组件
		tcCondBetweenComponent?: (props: TcCondBetweenProps) => JSX.Element; // 自定义条件查询筛选值自定义录入组件-双值录入组件
		tcType?: string | undefined; // 自定义类型
		tcConditionHide?: boolean; // 自定义条件查询-是否隐藏
		tcLabel?: string; // 自定义条件查询-标签
	}

	/**
	 * 自定义表格配置
	 */
	export interface Config<T> {
		columns?: ColumnsProp<T>[]; // 表格字段配置
	}

	/**
	 * BaseTable的定义
	 */
	export interface BaseTableProps<RecordType extends object = any> extends TableProps<RecordType> {
		showTableColConfigBtn?: boolean; // 是否展示自定义表格字段按钮
		showComplexQuery?: boolean; // 是否展示高级查询
		showCheckbox?: boolean; // 是否展示勾选框
		localData?: boolean; // 是否本地数据[查询场景、字段配置]
		buzzModal: string; // 业务模块：用于区分存储表格自定义配置的Key
		columns: FaberTable.ColumnsProp<RecordType>[]; // antd表格字段
		refreshList: () => void; // 刷新列表
		batchDelete?: (ids: any[]) => Promise<Ajax.Response>; // 批量删除API
		renderQuerySuffix?: () => ReactNode; // 自定义追加的查询条件后缀
		renderCheckBtns?: (rowKeys: any[]) => ReactNode; // 自定义追加的多选的按钮
		onSceneChange?: (sceneId: string) => void; // 查询场景变更
		onConditionChange?: (conditionList: ConditionQuery.CondGroup[]) => void; // 组合查询条件变更
		rowClickSelected?: boolean; // 点击row是否选中
		rowClickSingleSelected?: boolean; // 点击row是否单选
		showBatchBelBtn?: boolean; // 是否展示多选删除按钮
		onSelectedRowsChange?: (rows: any[]) => void; // 选中keys变更回调
		scrollY?: number;
    scrollYOccupied?: number;
	}
}

export default FaberTable;
