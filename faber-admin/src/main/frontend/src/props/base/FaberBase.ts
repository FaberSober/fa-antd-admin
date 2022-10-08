namespace FaberBase {
	export enum DelState {
		AVAILABLE = 0,
		DELETED = 1,
	}

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

	export interface BaseOprEntity extends BaseCrtEntity {
		/** 更新时间 */
		updTime?: string;
		/** 更新人ID */
		updUser?: string;
		/** 更新人 */
		updName?: string;
		/** 更新IP */
		updHost?: string;
	}

	export interface BaseDelEntity extends BaseOprEntity {
		/** 删除状态 */
		delState?: DelState;
	}

	// ------------------------------------- 鉴权 -------------------------------------
	/**
	 * 登录获取的用户权限点Element、菜单Menu
	 */
	export interface PermissionInfo {
		id: number;
		code: string;
		type: string;
		uri: string;
		method: string;
		name: string;
		menu: string;
	}

	/**
	 * 登录获取的用户信息，全局保存
	 */
	export interface UserInfo {
		id: string;
		/** 姓名：中文 */
		name: string;
		/** 登录账号 */
		username: string;
		/** 头像URL */
		img: string;
		description: string;
		/** 部门ID */
		departmentId: string;
		elements: PermissionInfo[];
		menus: PermissionInfo[];
	}

	// ------------------------------------- Http Request -------------------------------------
	/**
	 * 分页参数
	 */
	export interface BasePageProps {
		sorter?: string; // 排序
		current?: number;
		pageSize?: number;
		/**
		 * 允许用户扩充 Item 字段
		 */
		[key: string]: any;
	}

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
	export interface TreeNode<T = any, KeyType = string> {
		id: KeyType;
		parentId: KeyType;
		name: string;
		sort: number;
		hasChildren: boolean;
		children: TreeNode<T, KeyType>[] | undefined;
		sourceData: T;
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

}

export default FaberBase;
