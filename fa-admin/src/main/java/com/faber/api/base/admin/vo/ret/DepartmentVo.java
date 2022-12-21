package com.faber.api.base.admin.vo.ret;

import com.faber.api.base.admin.entity.Department;
import com.faber.api.base.admin.entity.User;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DepartmentVo extends Department {

    private User manager;

}
