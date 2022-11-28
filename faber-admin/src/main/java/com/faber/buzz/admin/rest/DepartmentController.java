package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.DepartmentBiz;
import com.faber.buzz.admin.entity.Department;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/department")
public class DepartmentController extends BaseTreeController<DepartmentBiz, Department, String> {

}
