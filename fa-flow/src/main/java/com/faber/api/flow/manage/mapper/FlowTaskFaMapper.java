package com.faber.api.flow.manage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;

public interface FlowTaskFaMapper {

    List<FlowTaskRet> queryTask(@Param("query") FlowTaskPageReqVo queryVo, @Param("sorter") String sorter);

}
