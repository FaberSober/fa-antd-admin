import ConditionQuery from '@ui/types/core/ConditionQuery';

export function needValue(opr: ConditionQuery.CondOpr):boolean {
  return [ConditionQuery.CondOpr.isNotNull, ConditionQuery.CondOpr.isNull].indexOf(opr) === -1
}
