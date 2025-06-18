import ConditionQuery from "./ConditionQuery";

export function needValue(opr: ConditionQuery.CondOpr):boolean {
  return [ConditionQuery.CondOpr.isNotNull, ConditionQuery.CondOpr.isNull].indexOf(opr) === -1
}
