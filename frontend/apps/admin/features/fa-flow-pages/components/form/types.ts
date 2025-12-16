// 字段的类型
export type FieldId = string;
// 行/组的类型，包含一个 ID 和内部的字段列表
export interface Row {
  id: string;
  fields: FieldId[];
}

export interface DynItem {
  id: string,
  type: 'input' | 'row',
  children?: DynItem[],
}
