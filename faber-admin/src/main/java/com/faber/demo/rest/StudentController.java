package com.faber.demo.rest;

import com.faber.common.msg.TableResultResponse;
import com.faber.common.rest.BaseController;
import com.faber.common.util.Query;
import com.faber.demo.biz.StudentBiz;
import com.faber.demo.entity.Student;
import com.faber.demo.vo.StudentJoinInfo;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/demo/student")
public class StudentController extends BaseController<StudentBiz,Student> {

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