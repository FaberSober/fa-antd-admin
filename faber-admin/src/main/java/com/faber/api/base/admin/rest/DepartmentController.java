package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.DepartmentBiz;
import com.faber.api.base.admin.entity.Department;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/base/admin/department")
public class DepartmentController extends BaseTreeController<DepartmentBiz, Department, String> {

}
