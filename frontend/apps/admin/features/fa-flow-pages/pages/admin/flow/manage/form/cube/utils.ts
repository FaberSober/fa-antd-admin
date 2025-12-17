import { Flow } from "@/types";
import { isNil } from "lodash";

export const SHOW_LENGTH = ['varchar', 'char', 'varbinary', 'binary', 'text', 'int', 'bigint', 'tinyint', 'smallint', 'mediumint']
export const SHOW_PRECISION = ['decimal', 'numeric', 'float', 'double'];
export const SHOW_SCALE = ['decimal', 'numeric', 'float', 'double'];

/**
 * resort columns by sort from item dataConfig
 * @param columns
 * @param dataConfig
 */
export function resortColumnsByConfig(columns: Flow.TableColumnVo[], dataConfig: Flow.FlowFormDataConfig) {
  const columnSortMap: Record<string, number> = {};
  let length = dataConfig?.main?.columns?.length || 0;
  dataConfig?.main?.columns?.forEach(col => {
    columnSortMap[col.field] = col.sort;
  });
  columns.sort((a, b) => {
    const sortA = columnSortMap[a.field] ?? length;
    const sortB = columnSortMap[b.field] ?? length;
    return sortA - sortB;
  });
}
