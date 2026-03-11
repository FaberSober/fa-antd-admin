package com.faber.api.base.demo.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.base.demo.biz.StudentBiz;
import com.faber.api.base.demo.entity.Student;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;

@FaLogBiz("学生")
@RestController
@RequestMapping("/api/base/demo/student")
public class StudentController extends BaseController<StudentBiz, Student, Integer> {

}