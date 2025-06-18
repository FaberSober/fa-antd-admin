import { ReactNode } from 'react';
import ConditionQuery from '@ui/types/core/ConditionQuery';
import { BaseOptionType } from "antd/es/cascader";

namespace Fa {
  // ------------------------------------- Constant -------------------------------------
  export type KeyType = string | number;

  export const RES_CODE = {
    OK: 200,
  };
  export const Constant = {
    /** 约定：tree结构数据，根结点的ID默认为0 */
    TREE_SUPER_ROOT_ID: 0,
    TREE_SUPER_ROOT_LABEL: '根节点',
    /** Tree Event Bus默认刷新key */
    TREE_REFRESH_BUS_KEY: '@@api/BASE_TREE_REFRESH',
    /** Token Header字段名 */
    TOKEN_KEY: 'Authorization',
    /** 登录模式： 1-本地、2-CAS */
    LOGIN_MODE_KEY: 'LOGIN_MODE',
    /** 租户-选中的企业ID */
    FA_TN_CORP_ID: 'fa-tn-corp-id',
    /** 添加到请求的Header中，标识请求来源 */
    FA_FROM: "FaFrom",
    /** 添加到请求的Header中，标识客户端版本号 */
    FA_VERSION_CODE: "FaVersionCode",
    /** 添加到请求的Header中，标识客户端版本名 */
    FA_VERSION_NAME: "FaVersionName",
  };

  export const ROOT_DEFAULT = {
    id: Fa.Constant.TREE_SUPER_ROOT_ID,
    name: Fa.Constant.TREE_SUPER_ROOT_LABEL,
    parentId: -1,
    sort: 0,
    sourceData: undefined,
    value: Fa.Constant.TREE_SUPER_ROOT_ID, // TODO remove this
    label: Fa.Constant.TREE_SUPER_ROOT_LABEL, // TODO remove this
    isLeaf: false,
    hasChildren: true,
  };

  // ------------------------------------- CONFIG -------------------------------------
  export interface ConfigApp {
    GATE_APP: any; // 网管
  }

  // ------------------------------------- ENTITY -------------------------------------
  export interface BaseCrtEntity {
    /** 创建时间 */
    crtTime?: string;
    /** 创建人ID */
    crtUser?: string;
    /** 创建人 */
    crtName?: string;
    /** 创建IP */
    crtHost?: string;
  }

  export interface BaseUpdEntity extends BaseCrtEntity {
    /** 更新时间 */
    updTime?: string;
    /** 更新人ID */
    updUser?: string;
    /** 更新人 */
    updName?: string;
    /** 更新IP */
    updHost?: string;
  }

  export interface BaseDelEntity extends BaseUpdEntity {
    /** 删除状态 */
    deleted?: boolean;
  }

  export type BaseTreeDelEntity = BaseDelEntity & BaseOptionType

  // ------------------------------------- Tenant ENTITY -------------------------------------
  export interface TnBaseEntity {
    /** 企业ID */
    corpId?: string;
    /** 租户ID */
    tenantId?: string;
  }

  export interface TnBaseCrtEntity extends TnBaseEntity {
    /** 创建时间 */
    crtTime?: string;
    /** 创建人ID */
    crtUser?: string;
    /** 创建人 */
    crtName?: string;
    /** 创建IP */
    crtHost?: string;
  }

  export interface TnBaseUpdEntity extends TnBaseCrtEntity {
    /** 更新时间 */
    updTime?: string;
    /** 更新人ID */
    updUser?: string;
    /** 更新人 */
    updName?: string;
    /** 更新IP */
    updHost?: string;
  }

  export interface TnBaseDelEntity extends TnBaseUpdEntity {
    /** 删除状态 */
    deleted?: boolean;
  }

  export interface Option {
    value: string;
    label: string;
  }

  // ------------------------------------- Http Request -------------------------------------
  /**
   * 服务返回数据定义
   */
  export interface Ret<T = any> {
    /**
     * 状态码，默认200为成功
     */
    status: number;
    /**
     * 返回文本描述
     */
    message: string;
    /**
     * 返回主体内容
     */
    data: T;
  }

  export interface LoginToken {
    tokenValue: string;
  }

  export interface Dict {
    value: any;
    label: string;
    color?: string;
    sort?: number;
  }

  export interface PageDict {
    [key: string]: Dict[];
  }

  export interface Pagination {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
    startRow: number;
    endRow: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }

  export interface Page<T = any> {
    dicts: PageDict;
    pagination: Pagination;
    rows: T[];
  }

  /**
   * Antd Table排序
   */
  export interface Sorter {
    field: string;
    order: 'ascend' | 'descend' | null;
  }

  export interface BaseQueryParams {
    query?: any;
    search?: any;
    sorter?: any;
    current?: number;
    pageSize?: number;
    sceneId?: any;
    [key: string]: any;
  }

  /**
   * 通用查询组合参数
   */
  export interface InitQueryParams {
    /** 表格分页 */
    pagination?: Pagination;
    /** 排序 */
    sorter?: Sorter;
    /** 单查询字段 */
    search?: string | undefined;
    /** 查询Form字段 */
    formValues?: any | undefined;
    /** 外部补充参数 */
    extraParams?: any;
    /** 场景ID */
    sceneId?: string | undefined;
    /** 组合查询 */
    conditionList?: ConditionQuery.CondGroup[];
  }

  /**
   * 通用查询组合参数
   */
  export interface QueryParams {
    /** 表格分页 */
    pagination: Pagination;
    /** 排序 */
    sorter: Sorter;
    /** 单查询字段 */
    search?: string | undefined;
    /** 查询Form字段 */
    formValues: any | undefined;
    /** 外部补充参数 */
    extraParams?: any;
    /** 场景ID */
    sceneId?: string | undefined;
    /** 组合查询 */
    conditionList?: ConditionQuery.CondGroup[];
  }

  export interface BasePageQuery<T> {
    sorter?: string; // 排序
    current?: number;
    pageSize?: number;
    query?: T;
  }

  /**
   * 分页参数
   */
  export interface BasePageProps {
    sorter?: string; // 排序
    current?: number;
    pageSize?: number;
    query?: any;
    /**
     * 允许用户扩充 Item 字段
     */
    [key: string]: any;
  }

  // ------------------------------------- Tree -------------------------------------
  /**
   * 树节点位置变更[排序、父节点]
   */
  export interface TreePosChangeVo {
    key: string | number;
    index: number;
    pid: string | number;
  }

  // ------------------------------------- 通用返回的Tree节点 -------------------------------------
  /**
   * 通用返回的Tree节点
   */
  export interface TreeNode<T = any, KeyType = any> {
    id: KeyType;
    parentId: KeyType;
    name: string;
    sort: number;
    hasChildren: boolean;
    level: number; // 层级，从1开始
    children: TreeNode<T, KeyType>[] | undefined;
    sourceData: T;
    disabled?: boolean | undefined;
  }

  export interface TreePathVo<T = any, KeyType = number> {
    list: TreeNode<T, KeyType>[];
    tree: TreeNode<T, KeyType>[];
  }

  /**
   * 运用于BaseTree的node节点
   */
  export interface BaseTreeNode<T = any, KeyType = number> {
    id?: KeyType;
    parentId?: KeyType;
    name?: string;
    // tree
    label: string;
    value: KeyType;
    isLeaf: boolean;
    children: TreeNode<T>[] | undefined;
    sourceData?: T;
  }

  // ------------------------------------- Layout -------------------------------------
  /** BaseChildProps */
  export interface BaseChildProps {
    children?: ReactNode;
  }

  // ------------------------------------- input field -------------------------------------
  export interface DefaultFieldProps<T> {
    value?: T | undefined;
    onChange?: (v: T) => void;
  }

  export interface DefaultArrayFieldProps<T> {
    value?: T[] | undefined;
    onChange?: (v: T[]) => void;
  }

  // ------------------------------------- input field -------------------------------------
  export interface ChartArrayData {
    name: string;
    value: number;
  }

  // ------------------------------------- input field -------------------------------------
  export interface LngLat {
    lng: number;
    lat: number;
  }

  // ------------------------------------- Chart -------------------------------------
  export interface ChartSeriesVo {
    name: string;
    value: number;
  }

  // ------------------------------------- Socket Task -------------------------------------
  export interface SocketTaskVo {
    taskId: string;
    name: string;
    total: number;
    cur: number;
    error: number;
    startTime: string;
  }

  export type ForwardRefComponent<P, T> = React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<T>>

}

export default Fa;
