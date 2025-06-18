import { Fa, FaEnums } from '@fa/ui';
import { Admin } from '@/types';

namespace Disk {
  /** STORE-库 */
  export interface StoreBucket extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 库名称 */
    name: string;
    /** 总文件大小 */
    size: number;
    /** 目录数量 */
    dirCount: number;
    /** 文件数量 */
    fileCount: number;
  }

  /** STORE-库-人员关联 */
  export interface StoreBucketUser extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 库ID */
    bucketId: string;
    /** 用户ID */
    userId: string;
    /** 类型1-创建者/2-操作者 */
    type: FaEnums.StoreBucketUserTypeEnum;
    /** 查询返回-用户 */
    user: Admin.User;
  }

  export interface StoreFileInnerTag {
    id: number;
    /** 标签ID */
    tagId: number;
    /** 名称 */
    name: string;
    /** 颜色 */
    color: string;
  }

  /** STORE-文件 */
  export interface StoreFile extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 库ID */
    bucket: string;
    /** 文件夹名称 */
    name: string;
    /** 父级节点 */
    parentId: string;
    /** 是否文件夹 */
    dir: boolean;
    /** 文件类型 */
    type: string;
    /** 文件ID */
    fileId: string;
    /** 文件大小(KB) */
    size: number;
    /** 完整路径 */
    fullPath: string;
    /** 标签 */
    tags: StoreFileInnerTag[];
    /** 文件信息 */
    info: string;
    /** 是否有删除动作 */
    deleteAction: boolean;
  }

  /** STORE-文件-标签 */
  export interface StoreFileTag extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 文件ID */
    fileId: number;
    /** 标签ID */
    tagId: number;
  }

  /** STORE-标签 */
  export interface StoreTag extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 库ID */
    bucket: string;
    /** 父ID */
    parentId: number;
    /** 名称 */
    name: string;
    /** 排序ID */
    sort: number;
    /** 颜色 */
    color: string;
  }

  /** STORE-文件-历史记录 */
  export interface StoreFileHis extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 存储文件ID */
    storeFileId: string;
    /** 版本文件ID */
    fileSaveId: string;
    /** Office文件变更内容zip包文件ID（适用于onlyoffice） */
    changeFileId: string;
    /** 文件名 */
    fileName: string;
    /** 版本号 */
    ver: string;
    /** 备注 */
    remark: string;
  }

}

export default Disk;
