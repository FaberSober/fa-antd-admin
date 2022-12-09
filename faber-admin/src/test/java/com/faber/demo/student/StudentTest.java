package com.faber.demo.student;

import com.faber.AdminBootstrap;
import com.faber.api.demo.biz.StudentBiz;
import com.faber.api.demo.entity.Student;
import com.faber.api.demo.mapper.StudentMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/9 09:59
 */
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StudentTest {

    @Resource
    StudentMapper studentMapper;

    @Test
    public void testGetById() {
        Student student = studentMapper.selectById(1);
        log.info("student: {}", student);
    }

    @Test
    public void testUpdateById() {
        Student student = studentMapper.selectById(1);
        student.addTag(new Student.Tag("新生"));
        studentMapper.updateById(student);
        log.info("student: {}", student);
    }

}
