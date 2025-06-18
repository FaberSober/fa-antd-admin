import { each } from "lodash";

/**
 * 重置表格字段
 * @param form
 */
export default function clearFormExclude(form: any, excludeFields?: any[]) {
  if (form === undefined || form == null) return;

  if (excludeFields) {
    const fields:any[] = [];
    each(form.getFieldsValue(), (v, k) => {
      if (!excludeFields.includes(k)) {
        fields.push(k)
      }
    })

    form.resetFields(fields);
  } else {
    form.resetFields();
  }
  form.submit();
}
