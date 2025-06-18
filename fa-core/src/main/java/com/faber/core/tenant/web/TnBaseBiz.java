package com.faber.core.tenant.web;

import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.biz.BaseBiz;

public abstract class TnBaseBiz<M extends FaBaseMapper<T>, T> extends BaseBiz<M, T> implements TnUserTrait {

    @Override
    protected void preProcessQuery(QueryParams query) {
        query.getQuery().put("corpId", getCorpId());
    }

}
