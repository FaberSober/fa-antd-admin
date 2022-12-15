import {cloneDeep, get, isNil, trim} from 'lodash';
import Fa from '@/props/base/Fa';
import BaseTreeProps from './interface';

export function parseNode<T = any>(nodeList: Fa.TreeNode<T, any>[] | undefined): BaseTreeProps.TreeNode<T>[] | undefined {
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
export function flatTree(tree: Fa.TreeNode[] = [], pid: string | number = 0): BaseTreeProps.FlatTreeNode[] {
  const list: BaseTreeProps.FlatTreeNode[] = [];
  tree.forEach((item, index) => {
    const { children, id, name } = item;
    if (children && children[0]) {
      list.push(...flatTree(children, item.id));
    }
    list.push({ key: id, index, pid, name });
  });
  return list;
}

/** 平铺Tree型结构 */
export function flatTreeList(tree: BaseTreeProps.NodeProps[] = [], pid: string | number = 0): BaseTreeProps.FlatTreeNode[] {
	const list: BaseTreeProps.FlatTreeNode[] = [];
	tree.forEach((item, index) => {
		const { children, key, name } = item;
		if (children && children[0]) {
			list.push(...flatTreeList(children, item.key));
		}
		list.push({ key, index, pid, name });
	});
	return list;
}

function findPathInner(options: any[] | undefined, destId: any, valueKey = 'value'): any {
	if (isNil(options)) return undefined;
	for (let i = 0; i < options.length; i += 1) {
		const o = options[i];
		// first check self is desc
		if (trim(get(o, valueKey)) === trim(destId)) {
			return [o];
		}
		if (o.children && o.children[0]) {
			// try find in children
			const co = findPathInner(o.children, destId, valueKey);
			if (co) {
				return [o, ...co];
			}
		}
	}
	return undefined;
}

/**
 * 从options中查找目标值的路径数组
 * @param options
 * @param destId
 * @param valueKey
 */
export function findPath(options: any[] | undefined, destId: any, valueKey = 'value') {
	return findPathInner(options, destId, valueKey) || [];
}

/**
 * 指定id，在tree中查找item，找到节点后回调
 * @param tree
 * @param id
 * @param callback 找到节点后的回调
 */
export function findTreeItem(tree: Fa.TreeNode[], id: any, callback?: (data: Fa.TreeNode, index: number, dataList: Fa.TreeNode[]) => void): {
  node: Fa.TreeNode,
  index: number,
  siblings: Fa.TreeNode[],
}|undefined {
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i].id === id) {
      if (callback) callback(tree[i], i, tree);
      return { node: tree[i], index: i, siblings: tree }
    }
    if (tree[i].children) {
      const result = findTreeItem(tree[i].children!, id, callback)
      if (result) return result;
    }
  }
}


/**
 * Tree节点拖动排序
 * @param tree tree数据
 * @param dragKey 拖动节点key
 * @param dropKey 放置节点key
 * @param dropPosition 放置位置：-1前/0上/1下
 * @param dropToGap 是否放置到间隙位置
 * @param dropNodeChildren 放置节点children
 * @param dropNodeExpand 放置节点是否展开
 */
export function dropItem(tree: Fa.TreeNode[], dragKey: any, dropKey: any, dropPosition: number, dropToGap: boolean, dropNodeChildren: any[], dropNodeExpand: boolean):Fa.TreeNode[] {
  const data = cloneDeep(tree);
  const { node: dropNode } = findTreeItem(tree, dropKey)!;

  // Find dragObject
  const dragInfo = findTreeItem(data, dragKey)!;
  dragInfo.siblings.splice(dragInfo.index, 1);
  const dragObj = dragInfo.node;

  const dropInfo = findTreeItem(data, dropKey)!;
  if (!dropToGap) {
    // Drop on the content放置到节点的展开子节点上，默认追加到队尾
    dropInfo.node.children = dropInfo.node.children || [];
    // where to insert 添加到头部
    dropInfo.node.children.unshift(dragObj);
  } else if (
    (dropNodeChildren || []).length > 0 && // Has children
    dropNodeExpand && // Is expanded
    dropPosition === 1 // On the bottom gap在放置节点的下间隙
  ) {
    dropInfo.node.children = dropInfo.node.children || [];
    // where to insert 添加到头部
    dropInfo.node.children.unshift(dragObj);
  } else {
    const { index: i, siblings: ar } = dropInfo;
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }

  return data;
}

export function setTreeDisabled(treeList: Fa.TreeNode[]|undefined, disabledIds?: any[]) {
  if (isNil(disabledIds) || disabledIds.length === 0) return;

  if (isNil(treeList) || treeList.length === 0) return;
  treeList.map(i => {
    if (disabledIds.indexOf(i.id) > -1) {
      i.disabled = true
    }
    setTreeDisabled(i.children, disabledIds)
  })
}
