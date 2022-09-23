import { isNil, trim } from 'lodash';
import FaberBase from '@/props/base/FaberBase';

export function parseNode<T = any>(nodeList: FaberBase.TreeNode<T, any>[] | undefined): FaberBase.BaseTreeNode<T>[] | undefined {
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
  }));
}

/** 平铺Tree型结构 */
export function flatTreeList<T>(tree: FaberBase.TreeNode<T>[] = []): T[] {
  const list: T[] = [];
  tree.forEach((item, index) => {
    const { children, sourceData } = item;
    if (children && children[0]) {
      list.push(...flatTreeList(children));
    }
    list.push(sourceData);
  });
  return list;
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