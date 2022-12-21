package com.faber.api.base.demo.rest;

import com.faber.api.base.demo.biz.StudentBiz;
import com.faber.api.base.demo.entity.Student;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@FaLogBiz("学生")
@RestController
@RequestMapping("/api/base/demo/student")
public class StudentController extends BaseController<StudentBiz, Student, String> {

    /**
     * 分页查询
     */
//    @RequestMapping(value = "/pageJoin", method = RequestMethod.POST)
//    @ResponseBody
//    public TableResultResponse<StudentJoinInfo> pageJoin(@RequestBody Map<String, Object> params) {
//        Query query = new Query(params);
//        return baseBiz.pageJoin(query);
//    }

}