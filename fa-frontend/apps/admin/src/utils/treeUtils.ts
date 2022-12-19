import { isNil, trim } from 'lodash';
import { Fa } from '@/types';

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
    if (children && children[0]) {
      list.push(...flatTreeList(children));
    }
    list.push(sourceData);
  });
  return list;
}

/**
 * 根据条件，查询树钟一个节点的完整路径
 * @param tree
 * @param checkFun
 */
export function findTreePath<T>(
  tree: Fa.TreeNode<T>[] | undefined,
  checkFun: (item: Fa.TreeNode<T>) => boolean,
): Fa.TreeNode<T>[] {
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
      // try find in children
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
