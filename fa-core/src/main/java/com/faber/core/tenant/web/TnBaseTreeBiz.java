package com.faber.core.tenant.web;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.biz.BaseTreeBiz;

public abstract class TnBaseTreeBiz<M extends FaBaseMapper<T>, T> extends BaseTreeBiz<M, T> implements TnUserTrait {

    @Override
    protected void preProcessQuery(QueryParams query) {
        query.getQuery().put("corpId", getCorpId());
    }

    @Override
    protected void enhanceTreeQuery(QueryWrapper<T> wrapper) {
        wrapper.eq("corp_id", getCorpId());
    }

}
