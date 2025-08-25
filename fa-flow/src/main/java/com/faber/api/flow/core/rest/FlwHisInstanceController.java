package com.faber.api.flow.core.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.flow.core.biz.FlwHisInstanceBiz;
import com.faber.api.flow.core.entity.FaFlwHisInstance;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 历史流程实例表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-25 17:27:09
 */
@FaLogBiz("历史流程实例表")
@RestController
@RequestMapping("/api/flow/core/flwHisInstance")
public class FlwHisInstanceController extends BaseController<FlwHisInstanceBiz, FaFlwHisInstance, Long> {

}