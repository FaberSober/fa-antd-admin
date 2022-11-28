package com.faber.buzz.rbac.vo;

import com.faber.buzz.rbac.entity.RbacUserRole;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RbacUserRoleRetVo extends RbacUserRole {

    private String name;
    private String username;

}
