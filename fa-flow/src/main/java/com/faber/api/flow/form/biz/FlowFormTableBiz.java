package com.faber.api.flow.form.biz;

import org.springframework.stereotype.Service;

import com.faber.api.flow.form.entity.FlowFormTable;
import com.faber.api.flow.form.mapper.FlowFormTableMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * FLOW-流程表单关联表
 *
 * @author Code Generator
 * @date 2026-01-31
 */
@Service
public class FlowFormTableBiz extends BaseBiz<FlowFormTableMapper, FlowFormTable> {

    public FlowFormTable getLinkTable(Integer flowFormId, String tableName) {
        return this.lambdaQuery()
                .eq(FlowFormTable::getFlowFormId, flowFormId)
                .eq(FlowFormTable::getTableName, tableName)
                .one();
    }

}
