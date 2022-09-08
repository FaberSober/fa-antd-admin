import { DragModalProps } from '@/components/modal/DragModal';
import ConditionQuery from '@/components/biz/condition-query/interface';

declare global {
	interface Window {
		/** 高德地图JS API */
		AMap: any;
		/** 高德地图UI组件库 */
		AMapUI: any;
		/** NEditor */
		UE: any;
		/** 七牛 */
		qiniu: any;
		/** flv.js播放器 */
		flvjs: any;
		/** echarts */
		echarts: any;
		/** socket.io.js */
		io: any;
		/** pdfjs */
		pdfjs: any;
		/** Jessibuca */
		Jessibuca: any;
		/** mqtt */
		mqtt: any;
		/** mqtt */
		globalData: any;
	}
}

namespace Ajax {
	/**
	 * 服务返回数据定义
	 */
	export interface Response<T = any> {
		/**
		 * 状态码，默认200为成功
		 */
		status: number;
		/**
		 * 返回文本描述
		 */
		message: string;
		/**
		 * 返回主体内容
		 */
		data: T;
	}

	export interface Dict {
		sort?: number;
		text: string;
		value: string;
		color?: string;
	}

	export interface PageDict {
		[key: string]: Dict[];
	}

	export interface Pagination {
		current: number;
		pageSize: number;
		total?: number;
	}

	export interface Page<T = any> {
		dicts: PageDict;
		pagination: Pagination;
		rows: T[];
	}

	/**
	 * Antd Table排序
	 */
	export interface Sorter {
		field: string;
		order: 'ascend' | 'descend' | null ;
	}

	/**
	 * 通用entity新增、编辑弹框的属性
	 */
	export interface CommonModalProps<T> extends DragModalProps {
		title?: string;
		record?: T;
		fetchFinish?: () => void;
	}

	/**
	 * 通用查询组合参数
	 */
	export interface InitQueryParams {
		/** 表格分页 */
		pagination?: Pagination;
		/** 排序 */
		sorter?: Sorter;
		/** 查询Form字段 */
		formValues?: any | undefined;
		/** 外部补充参数 */
		extraParams?: any;
		/** 场景ID */
		sceneId?: string | undefined;
		/** 组合查询 */
		conditionList?: ConditionQuery.CondGroup[];
	}

	/**
	 * 通用查询组合参数
	 */
	export interface QueryParams {
		/** 表格分页 */
		pagination: Pagination;
		/** 排序 */
		sorter: Sorter;
		/** 查询Form字段 */
		formValues: any | undefined;
		/** 外部补充参数 */
		extraParams?: any;
		/** 场景ID */
		sceneId?: string | undefined;
		/** 组合查询 */
		conditionList?: ConditionQuery.CondGroup[];
	}
}

export default Ajax;
