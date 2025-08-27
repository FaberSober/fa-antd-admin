package com.faber.api.flow.manage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;
import com.faber.api.flow.manage.vo.ret.FlowHisInstanceRet;

public interface FlowTaskFaMapper {

    /** 查询任务 */
    List<FlowTaskRet> queryTask(@Param("query") FlowTaskPageReqVo queryVo, @Param("sorter") String sorter);
    
    /** 查询历史任务 */
    List<FlowTaskRet> queryHisTask(@Param("query") FlowTaskPageReqVo queryVo, @Param("sorter") String sorter);

    /** 查询历史流程实例数据 */
    List<FlowHisInstanceRet> queryHisInstance(@Param("query") FlowTaskPageReqVo queryVo, @Param("sorter") String sorter);

    /** 查询待审批任务数量 */
    Integer countPendingApproval(@Param("actorId") String actorId);
    
    /** 查询我的申请数量 */
    Integer countMyApplications(@Param("createId") String createId);
    
    /** 查询我收到的任务数量（包括已完成的） */
    Integer countMyReceived(@Param("actorId") String actorId);
    
    /** 查询认领任务数量 */
    Integer countClaimTasks(@Param("actorId") String actorId);
    
    /** 查询已审批任务数量 */
    Integer countAudited(@Param("actorId") String actorId);

}
