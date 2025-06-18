/**
 * 重置表格字段
 * @param form
 */
export default function clearForm(form: any, fields?: any[]) {
  if (form === undefined || form == null) return;
  form.resetFields(fields);
  form.submit();
}
