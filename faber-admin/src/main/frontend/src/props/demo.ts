import Fa from '@/props/base/Fa';
import FaEnums from "@/props/base/FaEnums";

namespace Demo {

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
