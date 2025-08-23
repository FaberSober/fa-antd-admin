package com.faber.api.flow.manage.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.flow.manage.biz.FlowProcessBiz;
import com.faber.api.flow.manage.entity.FlowProcess;
import org.springframework.web.bind.annotation.RequestMapping;
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

}