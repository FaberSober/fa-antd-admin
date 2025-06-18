package com.faber.core.vo.tree;

import lombok.Data;
import lombok.ToString;

/**
 * 树节点位置变更[排序、父节点]
 */
@Data
@ToString
public class TreePosChangeVo {

    /**
     * 对应实体的ID
     */
    private String key;

    /**
     * 更新排序index
     */
    private Integer index;

    /**
     * 更新排序pid
     */
    private String pid;

}
