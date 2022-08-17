package com.faber.demo.rest;

import com.faber.common.rest.BaseController;
import com.faber.demo.biz.StudentBiz;
import com.faber.demo.entity.Student;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo/student")
public class StudentController extends BaseController<StudentBiz,Student> {

}