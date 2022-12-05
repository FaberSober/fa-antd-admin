package com.faber.api.demo.rest;

import com.faber.api.demo.biz.StudentBiz;
import com.faber.api.demo.entity.Student;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo/student")
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