package com.faber.api.flow.manage.biz;

import com.faber.core.web.biz.BaseTreeBiz;
import org.springframework.stereotype.Service;

import com.faber.api.flow.manage.entity.FlowCatagory;
import com.faber.api.flow.manage.mapper.FlowCatagoryMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * FLOW-流程分类
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 09:32:31
 */
@Service
public class FlowCatagoryBiz extends BaseTreeBiz<FlowCatagoryMapper,FlowCatagory> {
}