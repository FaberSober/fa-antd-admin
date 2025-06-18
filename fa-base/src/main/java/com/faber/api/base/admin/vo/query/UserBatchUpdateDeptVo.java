package com.faber.api.base.admin.vo.query;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserBatchUpdateDeptVo implements Serializable {

    private List<String> userIds;

    private String departmentId;

}
