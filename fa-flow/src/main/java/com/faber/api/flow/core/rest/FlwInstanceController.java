package com.faber.api.flow.core.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.flow.core.biz.FlwInstanceBiz;
import com.faber.api.flow.core.entity.FaFlwInstance;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 流程实例表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-24 14:23:52
 */
@FaLogBiz("流程实例表")
@RestController
@RequestMapping("/api/flow/core/flwInstance")
public class FlwInstanceController extends BaseController<FlwInstanceBiz, FaFlwInstance, Long> {

}