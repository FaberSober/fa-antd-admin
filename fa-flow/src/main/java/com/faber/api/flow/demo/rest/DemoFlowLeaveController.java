package com.faber.api.flow.demo.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.flow.demo.biz.DemoFlowLeaveBiz;
import com.faber.api.flow.demo.entity.DemoFlowLeave;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * DEMO-请假流程
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-24 13:30:43
 */
@FaLogBiz("DEMO-请假流程")
@RestController
@RequestMapping("/api/flow/demo/demoFlowLeave")
public class DemoFlowLeaveController extends BaseController<DemoFlowLeaveBiz, DemoFlowLeave, Integer> {

}