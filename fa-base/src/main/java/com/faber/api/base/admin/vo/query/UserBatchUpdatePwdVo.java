package com.faber.api.base.admin.vo.query;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserBatchUpdatePwdVo implements Serializable {

    private String newPwd;
    private String passwordCheck;
    private List<String> userIds;

}
