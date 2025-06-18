import type { Fa } from "@fa/ui";

export default {
  /** -------------------------------- 网关配置 -------------------------------- */
  GATE_APP: {
    /** app服务 */
    app: {
      app: '/api/app/app',
      crash: '/api/app/crash',
    },
  },
} as Fa.ConfigApp