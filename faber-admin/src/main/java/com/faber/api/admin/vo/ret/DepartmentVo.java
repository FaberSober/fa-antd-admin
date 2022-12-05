package com.faber.api.admin.vo.ret;

import com.faber.api.admin.entity.Department;
import com.faber.api.admin.entity.User;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DepartmentVo extends Department {

    private User manager;

}
