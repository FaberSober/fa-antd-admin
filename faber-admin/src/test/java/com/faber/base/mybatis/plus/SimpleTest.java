package com.faber.base.mybatis.plus;

import com.faber.AdminBootstrap;
import com.faber.demo.entity.Student;
import com.faber.demo.mapper.DemoStudentMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class SimpleTest {

    @Resource
    private DemoStudentMapper demoStudentMapper;

    @Test
    public void testList() {
        System.out.println(("----- selectAll method test ------"));
        List<Student> list = demoStudentMapper.selectList(null);
        list.forEach(System.out::println);
    }


}
