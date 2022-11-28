package com.faber.core.utils;

import cn.hutool.core.util.ObjectUtil;
import com.faber.core.vo.tree.TreeNode;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * tree utils
 * @author xu.pengfei
 * @date 2022/11/28 14:34
 */
public class TreeUtil {

    /**
     * 两层循环实现建树
     * @param treeNodes 传入的树节点列表
     * @return
     */
    public static <T extends TreeNode> List<T> build(List<T> treeNodes, Serializable root) {
        List<T> trees = new ArrayList<T>();

        for (T treeNode : treeNodes) {
            if (ObjectUtil.equal(ObjectUtil.toString(root), ObjectUtil.toString(treeNode.getParentId()))) {
                trees.add(treeNode);
            }

            for (T it : treeNodes) {
                if (ObjectUtil.equal(it.getParentId(), treeNode.getId())) {
                    treeNode.add(it);
                }
            }
        }
        return trees;
    }

    /**
     * 使用递归方法建树
     * @param treeNodes
     * @return
     */
    public static <T extends TreeNode> List<T> buildByRecursive(List<T> treeNodes, Serializable root) {
        List<T> trees = new ArrayList<T>();
        for (T treeNode : treeNodes) {
            if (ObjectUtil.equal(ObjectUtil.toString(root), ObjectUtil.toString(treeNode.getParentId()))) {
                trees.add(findChildren(treeNode, treeNodes));
            }
        }
        return trees;
    }

    /**
     * 递归查找子节点
     * @param treeNodes
     * @return
     */
    public static <T extends TreeNode> T findChildren(T treeNode, List<T> treeNodes) {
        for (T it : treeNodes) {
            if (ObjectUtil.equal(treeNode.getId(), it.getParentId())) {
                if (treeNode.getChildren() == null) {
                    treeNode.setChildren(new ArrayList<TreeNode>());
                }
                treeNode.add(findChildren(it, treeNodes));
            }
        }
        return treeNode;
    }

}
