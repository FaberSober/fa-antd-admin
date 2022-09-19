package com.faber.admin.rest;

import com.faber.admin.biz.DepartmentBiz;
import com.faber.admin.entity.Department;
import com.faber.admin.vo.DepartmentInfo;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseTreeController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/department")
public class DepartmentController extends BaseTreeController<DepartmentBiz, Department, String> {

    /**
     * 获取部门详情
     * @param id
     * @return
     */
    @RequestMapping(value = "/info/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<DepartmentInfo> getInfoById(@PathVariable String id) {
        DepartmentInfo o = baseBiz.getInfoById(id);
        return ok(o);
    }

}
