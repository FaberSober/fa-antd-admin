package com.faber.api.base.rbac.vo;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@ToString
public class RoleMenuVo implements Serializable {

    /** 角色ID */
    private Long roleId;

    /** 全勾选的菜单ID */
    private List<Long> checkedMenuIds = new ArrayList<>();

    /** 半勾选的菜单ID */
    @Deprecated
    private List<Long> halfCheckedMenuIds = new ArrayList<>();

}
