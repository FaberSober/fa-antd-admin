package com.faber.admin.vo;

import com.faber.admin.entity.User;
import lombok.Data;

@Data
@Deprecated
public class UserWeb extends User {

    private String departmentName;

}
