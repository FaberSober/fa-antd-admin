package com.faber.admin.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * ${DESCRIPTION}
 */
@Data
public class AreaTree {

    String name;
    protected long id;
    protected long parentId;
    private Integer sort;
    private boolean hasChildren;
    List<AreaTree> children = new ArrayList<AreaTree>();

}
