package com.faber.api.base.demo.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.api.base.demo.entity.Student;

/**
 * Demo-学生表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
public interface StudentMapper extends FaBaseMapper<Student> {

    // 添加拦截忽略注解，指定忽略全表删除拦截器
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();

}
