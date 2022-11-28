package com.faber.common.vo;

import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class TreePathVo<T> {

    private List<TreeNode<T>> list;

    private List<TreeNode<T>> tree;

}
