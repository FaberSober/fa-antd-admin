package com.faber.api.base.rbac.vo.req;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class RbacUserRoleUpdateVo implements Serializable {

    private List<String> userIds;

    private Long roleId;

}
