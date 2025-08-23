package com.faber.api.flow.manage.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.flow.manage.biz.FlowProcessBiz;
import com.faber.api.flow.manage.entity.FlowProcess;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * FLOW-流程定义
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 14:10:49
 */
@FaLogBiz("FLOW-流程定义")
@RestController
@RequestMapping("/api/flow/manage/flowProcess")
public class FlowProcessController extends BaseController<FlowProcessBiz, FlowProcess, Integer> {


    @FaLogOpr(value = "新增", crud = LogCrudEnum.C)
    @RequestMapping(value = "/publish", method = RequestMethod.POST)
    @ResponseBody
    public Ret<FlowProcess> publish(@Validated(value = Vg.Crud.C.class) @RequestBody FlowProcess entity) {
        baseBiz.publish(entity);
        return ok(entity);
    }
   
    // @FaLogOpr(value = "部署流程", crud = LogCrudEnum.R)
    // @RequestMapping(value = "/deployById/{id}", method = RequestMethod.GET)
    // @ResponseBody
    // public Ret<Boolean> deployById(@PathVariable Integer id) {
    //     baseBiz.deployById(id);
    //     return ok();
    // }

    // @FaLogOpr(value = "启用流程", crud = LogCrudEnum.R)
    // @RequestMapping(value = "/activeById/{id}", method = RequestMethod.GET)
    // @ResponseBody
    // public Ret<Boolean> activeById(@PathVariable Integer id) {
    //     baseBiz.activeById(id);
    //     return ok();
    // }

    // @FaLogOpr(value = "停用流程", crud = LogCrudEnum.R)
    // @RequestMapping(value = "/deactiveById/{id}", method = RequestMethod.GET)
    // @ResponseBody
    // public Ret<Boolean> deactiveById(@PathVariable Integer id) {
    //     baseBiz.deactiveById(id);
    //     return ok();
    // }
}
