package com.faber.core.utils;

import cn.hutool.core.util.ObjUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.faber.core.vo.tree.TreeNode;
import org.apache.poi.ss.formula.functions.T;

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
            // 摘取列表中的root节点，放到tree中
            if (ObjUtil.equal(ObjUtil.toString(root), ObjUtil.toString(treeNode.getParentId()))) {
                trees.add(treeNode);
            }

            // 将每个节点放到对于的父节点里
            for (T it : treeNodes) {
                if (ObjUtil.equal(it.getParentId(), treeNode.getId())) {
                    treeNode.add(it);
                }
            }
        }
        loopLevel(trees, 1);
        return trees;
    }

    public static <T extends TreeNode> void loopLevel(List<T> treeNodes, int level) {
        if (treeNodes == null || treeNodes.isEmpty()) return;
        for (T treeNode : treeNodes) {
            treeNode.setLevel(level);
            loopLevel(treeNode.getChildren(), level + 1);
        }
    }

//    /**
//     * 使用递归方法建树
//     * @param treeNodes
//     * @return
//     */
//    public static <T extends TreeNode> List<T> buildByRecursive(List<T> treeNodes, Serializable root) {
//        List<T> trees = new ArrayList<T>();
//        for (T treeNode : treeNodes) {
//            if (ObjectUtil.equal(ObjectUtil.toString(root), ObjectUtil.toString(treeNode.getParentId()))) {
//                trees.add(findChildren(treeNode, treeNodes));
//            }
//        }
//        return trees;
//    }
//
//    /**
//     * 递归查找子节点
//     * @param treeNodes
//     * @return
//     */
//    public static <T extends TreeNode> List<T> findChildren(T parent, List<T> treeNodes) {
//        List<T> children = new ArrayList<>();
//        for (T it : treeNodes) {
//            if (ObjectUtil.equal(parent.getId(), it.getParentId())) {
//                children.add(it);
//            }
//        }
//        return children;
//    }

}
