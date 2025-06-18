import type { Fa } from '@fa/ui';

export default {
  /** -------------------------------- 网关配置 -------------------------------- */
  GATE_APP: {
    /** ADMIN服务 */
    admin: '/api/base/admin',
    /** rbac服务 */
    rbac: '/api/base/rbac',
    /** generator服务 */
    generator: '/api/base/generator',
    /** doc服务 */
    doc: '/api/base/doc',
  },
} as Fa.ConfigApp;
