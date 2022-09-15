package com.faber.demo.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.BuzzException;
import com.faber.common.msg.TableResultResponse;
import com.faber.common.util.Query;
import com.faber.demo.entity.Student;
import com.faber.demo.mapper.StudentMapper;
import com.faber.demo.vo.StudentJoinInfo;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.stereotype.Service;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.mapperhelper.SqlHelper;

import java.util.List;

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