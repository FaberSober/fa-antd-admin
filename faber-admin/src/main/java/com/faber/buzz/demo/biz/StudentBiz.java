package com.faber.buzz.demo.biz;

import com.faber.buzz.demo.entity.Student;
import com.faber.common.biz.BaseBiz;
import com.faber.buzz.demo.mapper.StudentMapper;
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