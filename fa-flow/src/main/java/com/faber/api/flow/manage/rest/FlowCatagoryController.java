package com.faber.api.flow.manage.rest;

import com.faber.api.flow.manage.biz.FlowCatagoryBiz;
import com.faber.api.flow.manage.entity.FlowCatagory;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseTreeController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * FLOW-流程分类
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 09:32:31
 */
@FaLogBiz("FLOW-流程分类")
@RestController
@RequestMapping("/api/flow/manage/flowCatagory")
public class FlowCatagoryController extends BaseTreeController<FlowCatagoryBiz, FlowCatagory, Integer> {

}