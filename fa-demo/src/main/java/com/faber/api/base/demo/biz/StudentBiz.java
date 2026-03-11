package com.faber.api.base.demo.biz;

import org.springframework.stereotype.Service;

import com.faber.api.base.demo.entity.Student;
import com.faber.api.base.demo.mapper.StudentMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@Service
public class StudentBiz extends BaseBiz<StudentMapper, Student> {

}