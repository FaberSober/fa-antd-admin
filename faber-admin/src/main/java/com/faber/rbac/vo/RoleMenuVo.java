package com.faber.rbac.vo;

import lombok.Data;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

@Data
@ToString
@Accessors(chain = true)
public class RoleMenuVo implements Serializable {

    // 角色ID
    private Long roleId;
    private List<Long> checkedRoleIds;
    private List<Long> halfCheckedRoleIds;

}
