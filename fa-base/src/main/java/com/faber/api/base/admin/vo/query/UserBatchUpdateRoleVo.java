package com.faber.api.base.admin.vo.query;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserBatchUpdateRoleVo implements Serializable {

    private List<String> userIds;
    private List<Long> roleIds;

}
