package com.faber.api.flow.manage.biz;

import org.springframework.stereotype.Service;

import com.faber.api.flow.manage.mapper.FlowTaskFaMapper;
import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import jakarta.annotation.Resource;

@Service
public class FlowTaskBiz {

    @Resource
    private FlowTaskFaMapper flowTaskMapper;

    public TableRet<FlowTaskRet> pagePendingApproval(BasePageQuery<FlowTaskPageReqVo> query) {
        PageInfo<FlowTaskRet> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> flowTaskMapper.queryTask(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

}
