package com.faber.api.base.admin.biz;

import org.springframework.stereotype.Service;

import com.faber.api.base.admin.entity.UserToken;
import com.faber.api.base.admin.mapper.UserTokenMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * BASE-用户token
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-24 19:10:40
 */
@Service
public class UserTokenBiz extends BaseBiz<UserTokenMapper,UserToken> {
    @Override
    public boolean save(UserToken entity) {
        entity.setUserId(getCurrentUserId());
        return super.save(entity);
    }
}