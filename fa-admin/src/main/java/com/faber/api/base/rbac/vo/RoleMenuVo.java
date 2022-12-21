package com.faber.api.base.rbac.vo;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Data
@ToString
public class RoleMenuVo implements Serializable {

    // 角色ID
    private Long roleId;
    private List<Long> checkedRoleIds;
    private List<Long> halfCheckedRoleIds;

}
