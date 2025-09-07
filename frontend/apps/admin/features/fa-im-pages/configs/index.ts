import { Fa } from "@fa/ui";

export default {
  /** -------------------------------- 网关配置 -------------------------------- */
  GATE_APP: {
    /** im服务 */
    im: {
      friend: '/api/im/friend',
      group: '/api/im/group',
      message: '/api/im/message',
      session: '/api/im/session',
    },
  },
} as Fa.ConfigApp
