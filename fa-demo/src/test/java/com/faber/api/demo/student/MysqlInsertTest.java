package com.faber.api.demo.student;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.faber.api.base.demo.entity.Student;
import com.faber.api.base.demo.mapper.StudentMapper;
import com.faber.api.demo.FaTestApp;
import com.github.pagehelper.PageHelper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import java.util.List;

@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MysqlInsertTest {

    @Resource StudentMapper studentMapper;

    @Test
    public void testInsert() {
        Student student = new Student();
        student.setId(1);
        student.setName("张三");
        student.setAge(18);
        student.setCorpId(1);
        student.setTenantId(1);
        studentMapper.insert(student);
    }

    @Test
    public void testInsertList() {
        for (int i = 0; i < 20; i++) {
            Student student = new Student();
            student.setId(i + 1);
            student.setName("张三");
            student.setAge(18);
            student.setCorpId(1);
            student.setTenantId(1);
            studentMapper.insert(student);
        }
    }

    @Test
    public void testDelete() {
        studentMapper.deleteByIdIgnoreLogic(1);
    }

    @Test
    public void testUpdate() {
        this.testDelete();
        this.testInsert();

        Student student = new Student();
        student.setId(1);
        student.setName("张三1");
        studentMapper.updateById(student);
    }

    @Test
    public void testDeleteAll() {
        studentMapper.deleteAll();
    }

    @Test
    public void testSelect() {
        PageHelper.startPage(3, 5);
        List<Student> list = studentMapper.selectList(new QueryWrapper<>());
        for (Student student : list) {
            System.out.println("student:" + student);
        }

//        Page<Student> page = new Page<>(1, 20);
//        QueryWrapper<Student> wrapper = new QueryWrapper<>();
//        wrapper.eq("id", 1);
//        Page<Student> result = studentMapper.selectPage(page, wrapper);
//        System.out.println(result.getTotal());
//        System.out.println(result.getRecords());
    }

}
