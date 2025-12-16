package com.faber.api.flow.form.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.flow.form.biz.FlowFormBiz;
import com.faber.api.flow.form.entity.FlowForm;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}