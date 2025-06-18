import { ReactNode } from 'react';

namespace BaseTreeProps {
  /**
   * 运用于BaseTree的node节点
   */
  export interface TreeNode<T = any, KeyType = number> {
    id?: KeyType;
    parentId?: KeyType;
    name?: string;
    // tree
    label: string;
    value: KeyType;
    isLeaf: boolean;
    level: number; // 层级，从1开始
    children: BaseTreeProps.TreeNode<T>[] | undefined;
    sourceData?: T;
  }

  export interface NodeProps {
    key: number | string;
    title: JSX.Element;
    children: NodeProps[] | undefined;
    name: string;
  }

  export interface ExtraContextMenus {
    key: string;
    icon?: ReactNode;
    title: string | ReactNode;
    onMenuClick: (e: any, item: any) => void;
  }

  export interface FlatTreeNode {
    key: number | string;
    index: number;
    pid: number | string;
    name: string;
  }
}

export default BaseTreeProps;
