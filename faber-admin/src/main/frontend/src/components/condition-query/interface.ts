namespace ConditionQuery {
	/** 自定义筛选条件-类型 */
	export enum CondOpr {
		equal = 'eq', // '等于',
		not_equal = 'ne', // '不等于',
		contain = 'like', //  '包含',
		not_contain = 'notLike', // '不包含',
		start_contain = 'likeLeft', // '开始于',
		end_contain = 'likeRight', // '结束于',
		greater = 'gt', // '大于',
		greater_equal = 'ge', // '大于等于',
		less = 'lt', // '小于',
		less_equal = 'le', // '小于等于',
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
		[ConditionQuery.CondOpr.equal]: '=',
    [ConditionQuery.CondOpr.in]: 'IN',
		[ConditionQuery.CondOpr.not_equal]: '!=',
    [ConditionQuery.CondOpr.greater]: '>',
    [ConditionQuery.CondOpr.greater_equal]: '>=',
    [ConditionQuery.CondOpr.less]: '<',
    [ConditionQuery.CondOpr.less_equal]: '<=',
		[ConditionQuery.CondOpr.contain]: '包含',
		[ConditionQuery.CondOpr.not_contain]: '不包含',
		[ConditionQuery.CondOpr.start_contain]: '开始于',
		[ConditionQuery.CondOpr.end_contain]: '结束于',
		[ConditionQuery.CondOpr.between]: '介于',
	};
}

export default ConditionQuery;
