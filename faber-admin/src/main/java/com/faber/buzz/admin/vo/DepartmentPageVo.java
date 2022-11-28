package com.faber.buzz.admin.vo;

import com.faber.buzz.admin.entity.Department;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DepartmentPageVo extends Department {

    private UserInfo manager;

}
