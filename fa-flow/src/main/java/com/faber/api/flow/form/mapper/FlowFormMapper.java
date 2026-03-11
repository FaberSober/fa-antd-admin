package com.faber.api.flow.form.mapper;

import com.faber.core.config.mybatis.base.FaBaseMapper;

import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;
import java.util.Map;

import com.faber.api.flow.form.entity.FlowForm;
import com.faber.api.flow.form.vo.ret.TableColumnVo;

/**
 * FLOW-流程表单
 * 
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-12-16 15:43:41
 */
public interface FlowFormMapper extends FaBaseMapper<FlowForm> {

    List<TableColumnVo> getTableColumns(@Param("tableName") String tableName);
    
    String getTableComment(@Param("tableName") String tableName);

    List<Map<String, Object>> selectByDynamicSql(@Param("sql") String sql);
	
}
