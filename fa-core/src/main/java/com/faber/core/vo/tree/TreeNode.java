package com.faber.core.vo.tree;

import lombok.Data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class TreeNode<T> implements Serializable {
    protected Serializable id;
    protected Serializable parentId;
    private String name;
    private Integer sort;
    private boolean hasChildren;
    List<TreeNode<T>> children;

    private T sourceData;

    public void add(TreeNode<T> node){
        if (children == null) children = new ArrayList<>();
        children.add(node);
    }

}
