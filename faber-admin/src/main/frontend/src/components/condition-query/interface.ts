namespace ConditionQuery {
	/** 自定义筛选条件-类型 */
	export enum CondOpr {
		equal = 'equal', // '等于',
		not_equal = 'not_equal', // '不等于',
		contain = 'contain', //  '包含',
		not_contain = 'not_contain', // '不包含',
		start_contain = 'start_contain', // '开始于',
		end_contain = 'end_contain', // '结束于',
		greater = 'greater', // '大于',
		greater_equal = 'greater_equal', // '大于等于',
		less = 'less', // '小于',
		less_equal = 'less_equal', // '小于等于',
		between = 'between', // '介于',
		in = 'in', // 'IN',
	}

	/** 自定义筛选条件 */
	export interface Cond {
		id: string;
		opr: CondOpr;
		key?: string;
		title?: string;
		name?: string;
		value?: string;
		begin?: string;
		end?: string;
	}

	export enum Type {
		AND = 'and',
		OR = 'or',
	}

	export interface CondGroup {
		id: string;
		type: Type;
		condList: Cond[];
	}

	export const OPR_MAP: { [key: string]: string } = {
		[ConditionQuery.CondOpr.equal]: '等于',
		[ConditionQuery.CondOpr.not_equal]: '不等于',
		[ConditionQuery.CondOpr.contain]: '包含',
		[ConditionQuery.CondOpr.not_contain]: '不包含',
		[ConditionQuery.CondOpr.start_contain]: '开始于',
		[ConditionQuery.CondOpr.end_contain]: '结束于',
		[ConditionQuery.CondOpr.greater]: '大于',
		[ConditionQuery.CondOpr.greater_equal]: '大于等于',
		[ConditionQuery.CondOpr.less]: '小于',
		[ConditionQuery.CondOpr.less_equal]: '小于等于',
		[ConditionQuery.CondOpr.between]: '介于',
		[ConditionQuery.CondOpr.in]: 'IN',
	};
}

export default ConditionQuery;
