package com.faber.api.base.demo.biz;

import com.alicp.jetcache.anno.CacheInvalidate;
import com.alicp.jetcache.anno.CacheUpdate;
import com.alicp.jetcache.anno.Cached;
import com.faber.api.base.demo.entity.Student;
import com.faber.core.web.biz.BaseBiz;
import com.faber.api.base.demo.mapper.StudentMapper;
import org.springframework.stereotype.Service;

import java.io.Serializable;

/**
 * Demo-学生表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 17:14:45
 */
@Service
public class StudentBiz extends BaseBiz<StudentMapper, Student> {

    @Cached(name="student:", key="#id")
    @Override
    public Student getById(Serializable id) {
        return super.getById(id);
    }

    @CacheUpdate(name="student:", key="#entity.id", value="#entity")
    @Override
    public boolean updateById(Student entity) {
        return super.updateById(entity);
    }

    @CacheInvalidate(name="student:", key="#id")
    @Override
    public boolean removeById(Serializable id) {
        return super.removeById(id);
    }

//    public TableResultResponse<StudentJoinInfo> pageJoin(Query query) {
//        Example example = parseQuery(query, StudentJoinInfo.class);
//        if (query.getLimit() > 1000) throw new BuzzException("查询结果数量大于1000，请缩小查询范围");
//
//        Page<Object> result = PageHelper.startPage(query.getPage(), query.getLimit());
//
//        List<StudentJoinInfo> list = mapper.selectByExample(example);
//        return new TableResultResponse<StudentJoinInfo>(new PageInfo<>(list));
//    }

}