import { FaUtils } from "@fa/ui";

export function getNodeKey() {
  return 'flk_' + Date.now() + "_" + FaUtils.generateId();
}
