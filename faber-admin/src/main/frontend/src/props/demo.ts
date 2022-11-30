import Fa from '@/props/base/Fa';

namespace Demo {

  /** Demo-学生表 */
  export interface Student extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 学生名 */
    name: string;
    /** 年龄 */
    age: string;
    /** 性别 */
    sex: string;
    /** 邮箱 */
    email: string;
    /** 生日 */
    birthday: string;
    /** 账户是否有效 */
    valid: boolean;
    /** 补充信息ID */
    infoId: string;
    /** 租户ID */
    tenantId: string;
  }

  /** DEMO-tree数据 */
  export interface Tree extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 名称 */
    name: string;
    /** 上级节点 */
    parentId: number;
    /** 排序ID */
    sort: number;
  }

}

export default Demo;
