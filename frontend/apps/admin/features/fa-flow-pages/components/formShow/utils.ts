import { Flow } from "@/types";
import { each, set } from "lodash";

export function getTableKeyMap(table?: Flow.FlowFormDataConfigTable): Record<string, Flow.FlowFormDataConfigColumn> {
  const mainTableMap = {}
  if (table && table.columns) {
    each(table.columns, (c) => {
      set(mainTableMap, c.field, c)
    })
  }
  return mainTableMap;
}
