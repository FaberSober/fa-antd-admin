package com.faber.api.flow.form.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.flow.form.biz.FlowFormTableBiz;
import com.faber.api.flow.form.entity.FlowFormTable;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;

@FaLogBiz("流程表单关联表")
@RestController
@RequestMapping("/api/flow/form/flowFormTable")
public class FlowFormTableController extends BaseController<FlowFormTableBiz, FlowFormTable, Integer> {

}
