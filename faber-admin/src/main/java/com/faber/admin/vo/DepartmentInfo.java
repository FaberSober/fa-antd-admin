package com.faber.admin.vo;

import com.faber.admin.entity.Department;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DepartmentInfo  extends Department {

    private UserInfo manager;

    // 所属部门
    private Department belongDept;

}
