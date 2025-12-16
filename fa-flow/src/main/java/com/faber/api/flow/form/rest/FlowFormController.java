package com.faber.api.flow.form.rest;

import java.sql.SQLException;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.flow.form.biz.FlowFormBiz;
import com.faber.api.flow.form.entity.FlowForm;
import com.faber.api.flow.form.vo.req.CreateFormTableReqVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;

/**
 * FLOW-流程表单
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-12-16 15:43:41
 */
@FaLogBiz("FLOW-流程表单")
@RestController
@RequestMapping("/api/flow/form/flowForm")
public class FlowFormController extends BaseController<FlowFormBiz, FlowForm, Integer> {

    
    @FaLogOpr(value = "新增主表", crud = LogCrudEnum.C)
    @RequestMapping(value = "/createFormTable", method = RequestMethod.POST)
    @ResponseBody
    public Ret<CreateFormTableReqVo> createFormTable(@Validated @RequestBody CreateFormTableReqVo reqVo) throws SQLException {
        baseBiz.createFormTable(reqVo);
        return ok(reqVo);
    }

}