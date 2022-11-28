package com.faber.buzz.admin.vo.ret;

import com.faber.buzz.admin.entity.Department;
import com.faber.buzz.admin.entity.User;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class DepartmentVo extends Department {

    private User manager;

}
