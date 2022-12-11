package com.faber.demo.student;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.faber.AdminBootstrap;
import com.faber.api.base.demo.entity.Student;
import com.faber.api.base.demo.mapper.StudentMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

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
        log.info(student.getTags()[0].getName());
        log.info(student.getInfo().getInfo1());
        log.info("student: {}", student);
    }

    @Test
    public void testUpdateById() {
        {
            Student student = studentMapper.selectById(1);
            // update json array
            student.setTags(new Student.Tag[] {
                    new Student.Tag("新生"),
                    new Student.Tag("一年级")
            });
            // update json object
            student.setInfo(new Student.Info("hello", "world"));
            studentMapper.updateById(student);
            log.info("student: {}", student);
        }
        
        {
            Student student = studentMapper.selectById(2);
            // update json array
            student.setTags(new Student.Tag[] {
                    new Student.Tag("新生"),
                    new Student.Tag("二年级")
            });
            // update json object
            student.setInfo(new Student.Info("hello", "bar"));
            studentMapper.updateById(student);
            log.info("student: {}", student);
        }
    }

    @Test
    public void testJsonQuery() {
        // json array like query
        {
            List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                    .apply("tags -> '$[*].name' LIKE CONCAT('%',{0},'%')", "新")
                    .list();
            log.info("list: {}", list);
        }

        // json object like query
        {
            List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                    .apply("info -> '$.info1' LIKE CONCAT('%',{0},'%')", "he")
                    .list();
            log.info("list: {}", list);
        }

        // json array equal query
        {
            List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                    .apply("JSON_CONTAINS(tags, JSON_OBJECT('name', {0}))", "新生")
                    .list();
            log.info("list: {}", list);
        }

        // json object equal query
        {
            List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                    .apply("info -> '$.info1' = {0}", "hello")
                    .list();
            log.info("list: {}", list);
        }
    }

    @Test
    public void testQuery1() {
        // 这个示例暂时无法之际从数据库中获取json的值，填写到tagNames中
        // 参考的blog可以实现，暂未找到原因。https://blog.csdn.net/m0_73311735/article/details/126869623
        List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                .select(Student::getTagNames)
                .eq(Student::getId, 1)
                .list();
        log.info("list: {}", list);
    }

}
