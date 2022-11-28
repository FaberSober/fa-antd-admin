package com.faber.buzz.rbac.vo.query;

import com.faber.common.vo.BasePageQuery;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class RbacUserRoleQueryVo extends BasePageQuery {

    private Long roleId;
    private String name;
    private String username;

}
