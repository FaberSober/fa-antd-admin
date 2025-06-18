import { difference, each, find, isNil, trim } from 'lodash';
import { Fa } from '@ui/types';
import { allInList } from "@ui/utils/utils";


export function parseNode<T = any>(nodeList: Fa.TreeNode<T, any>[] | undefined): Fa.BaseTreeNode<T>[] | undefined {
  if (isNil(nodeList) || nodeList.length === 0) return undefined;
  return nodeList.map((d) => ({
    id: d.id,
    parentId: d.parentId,
    name: d.name,
    // tree
    label: d.name,
    value: d.id,
    isLeaf: !d.hasChildren,
    children: parseNode<T>(d.children),
    sourceData: d.sourceData,
  })) as Fa.BaseTreeNode<T>[];
}

/** 平铺Tree型结构 */
export function flatTreeList<T>(tree: Fa.TreeNode<T>[] = []): T[] {
  const list: T[] = [];
  tree.forEach((item) => {
    const { children, sourceData } = item;
    list.push(sourceData);
    if (children && children[0]) {
      list.push(...flatTreeList(children));
    }
  });
  return list;
}


/** 平铺Tree型结构 */
export function flatTreeSourceList<T>(tree: Fa.TreeNode<T>[] = []): Fa.TreeNode<T>[] {
  const list: Fa.TreeNode<T>[] = [];
  tree.forEach((item) => {
    const { children } = item;
    if (children && children[0]) {
      list.push(...flatTreeSourceList(children));
    }
    list.push(item);
  });
  return list;
}

/**
 * 根据条件，查询树中一个节点
 * @param tree
 * @param checkFun
 */
export function findTreeNode<T>(tree: Fa.TreeNode<T>[] | undefined, checkFun: (item: Fa.TreeNode<T>) => boolean): Fa.TreeNode<T>|undefined {
  const list: Fa.TreeNode<T>[] = findTreePath(tree, checkFun)
  if (list && list[0]) {
    return list[list.length - 1]
  }
  return undefined
}

/**
 * 根据条件，查询树中一个节点的完整路径
 * @param tree
 * @param checkFun
 */
export function findTreePath<T>(tree: Fa.TreeNode<T>[] | undefined, checkFun: (item: Fa.TreeNode<T>) => boolean): Fa.TreeNode<T>[] {
  if (isNil(tree) || tree.length === 0) return [];
  const findPath = [];
  for (let i = 0; i < tree.length; i += 1) {
    const item = tree[i];
    if (checkFun(item)) {
      return [item];
    }
    const childFound = findTreePath(item.children, checkFun);
    if (childFound && childFound.length > 0) {
      findPath.push(item, ...childFound);
    }
  }
  return findPath;
}

function findPathInner(options: any[] | undefined, destId: any): any {
  if (isNil(options)) return undefined;
  for (let i = 0; i < options.length; i += 1) {
    const o = options[i];
    // first check self is desc
    if (trim(o.value) === trim(destId)) {
      return [o];
    }
    if (o.children && o.children[0]) {
      // try to find in children
      const co = findPathInner(o.children, destId);
      if (co) {
        return [o, ...co];
      }
    }
  }
  return undefined;
}

export function findPath(options: any[] | undefined, destId: any) {
  return findPathInner(options, destId) || [];
}

export function findNodeInTree<T>(tree: Fa.TreeNode<T>[] | undefined, checkFun: (item: T) => boolean): any {
  if (isNil(tree)) return undefined;
  const list = flatTreeList(tree)
  return find(list, i => checkFun(i));
}

/**
 * 计算key在tree中的全勾选、半勾选状态，返回全勾选的。
 */
export function calCheckedKey<T>(treeData: Fa.TreeNode<T>[] | undefined, checkedKeys: any[]):any[] {
  // treeData尚未初始化
  if (isNil(treeData) || treeData.length === 0) return [];

  const flatTree = flatTreeSourceList(treeData)
  // console.log('flatTree', flatTree)

  const cks:any[] = [];
  each(flatTree, node => {
    // 不在勾选的keys中，过滤掉
    if (checkedKeys.indexOf(node.id) === -1) {
      return;
    }
    // 以下为在勾选的keys中的情况判断
    // 1. 节点为叶子节点，无子节点，本身勾选则为全勾选
    if (isNil(node.children) || node.children.length === 0) {
      cks.push(node.id)
      return;
    }
    // 2. 节点为父节点，判断父节点的子节点是否全勾选，如果是，则该父节点为全勾选
    const cids = node?.children?.map(c => c.id) || [];
    const childrenAllCheck = allInList(cks, cids)
    if (childrenAllCheck) {
      cks.push(node.id)
      return;
    }
  })

  return cks;
}

/**
 * 计算key在tree中的全勾选、半勾选状态，返回全勾选和半勾选。
 * @param treeData
 * @param checkedKeys
 */
export function calCheckedAndHalfKey<T>(treeData: Fa.TreeNode<T>[] | undefined, checkedKeys: any[]):{
  allCheckedKeys: any[],
  halfCheckedKeys: any[]
} {
  if (isNil(treeData) || treeData.length === 0) return {allCheckedKeys: [], halfCheckedKeys: []}

  const allCheckedKeys = calCheckedKey(treeData, checkedKeys) || []
  const halfCheckedKeys = difference(checkedKeys, allCheckedKeys) || []
  return {allCheckedKeys, halfCheckedKeys}
}
