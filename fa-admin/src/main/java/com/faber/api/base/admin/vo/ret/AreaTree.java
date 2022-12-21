package com.faber.api.base.admin.vo.ret;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * 地区Tree
 * @author xu.pengfei
 * @date 2022/11/28 16:33
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
