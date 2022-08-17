package com.faber.admin.vo;

import com.faber.admin.entity.Department;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DepartmentPageVo extends Department {

    private UserInfo manager;

}
