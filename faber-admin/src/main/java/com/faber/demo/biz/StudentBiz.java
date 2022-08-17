package com.faber.demo.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.demo.entity.Student;
import com.faber.demo.mapper.StudentMapper;
import org.springframework.stereotype.Service;

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