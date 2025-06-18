package com.faber.api.demo.student;

import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.faber.api.base.demo.entity.Student;
import com.faber.api.base.demo.mapper.StudentMapper;
import com.faber.api.demo.FaTestApp;
import com.faber.core.context.BaseContextHandler;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;
import java.util.List;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/9 09:59
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class StudentTest {

    @Resource
    StudentMapper studentMapper;

    @Test
    public void testInsert() {
        BaseContextHandler.setUserId("1");
        BaseContextHandler.setName("Admin");
        BaseContextHandler.setUsername("超级管理员");
        BaseContextHandler.setLogin(true);

        Student student = new Student();
        student.setName("xx");
        student.setAge(12);
        student.setValid(true);

        // update json array
        student.setTags(new Student.Tag[]{
                new Student.Tag("新生"),
                new Student.Tag("一年级")
        });
        // update json object
        student.setInfo(new Student.Info("hello", "world"));

        studentMapper.insert(student);
    }

    @Test
    public void testGetById() {
        Student student = studentMapper.selectById(31);
        log.info(student.getTags()[0].getName());
        log.info(student.getInfo().getInfo1());
        log.info("student: {}", student);
    }

    @Test
    public void testUpdateById() {
        {
            Student student = studentMapper.selectById(30);
            // update json array
            student.setTags(new Student.Tag[]{
                    new Student.Tag("新生"),
                    new Student.Tag("一年级")
            });
            // update json object
            student.setInfo(new Student.Info("hello", "world"));
            studentMapper.updateById(student);
            log.info("student: {}", student);
        }

        {
            Student student = studentMapper.selectById(31);
            // update json array
            student.setTags(new Student.Tag[]{
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

        // json object equal query
        {
            List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                    .apply("info -> '$.info1' = {0}", "hello")
                    .list();
            log.info("list: {}", list);
        }

        // FIXME: 下面代码会报错，需要升级jsqlparser 4.5就不会报错了。但是目前jsqlparser 4.5版本和mybatisplus同时使用有bug，所以只能使用4.4。放弃下面的查询方法。
        // json array equal query
        {
            List<Student> list = new LambdaQueryChainWrapper<>(studentMapper)
                    .apply("JSON_CONTAINS(tags, JSON_OBJECT('name', {0}))", "新生")
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
