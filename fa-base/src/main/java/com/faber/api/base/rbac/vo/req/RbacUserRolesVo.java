package com.faber.api.base.rbac.vo.req;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

@Data
public class RbacUserRolesVo implements Serializable {

    @NotNull
    private String userId;

    @Size(min = 1, message = "请选择用户角色")
    private List<Long> roleIds;

}
