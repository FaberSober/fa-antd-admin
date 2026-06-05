package com.faber.api.base.tn.biz;

import cn.hutool.core.util.StrUtil;
import com.faber.api.base.tn.entity.Tenant;
import com.faber.api.base.tn.mapper.TenantMapper;
import com.faber.core.exception.BuzzException;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 租户
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class TenantBiz extends BaseBiz<TenantMapper, Tenant> {

    @Override
    protected void saveBefore(Tenant entity) {
        entity.setCode(StrUtil.trim(entity.getCode()));
        entity.setName(StrUtil.trim(entity.getName()));
        entity.setShortName(StrUtil.trim(entity.getShortName()));
        entity.setContactName(StrUtil.trim(entity.getContactName()));
        entity.setContactPhone(StrUtil.trim(entity.getContactPhone()));
        entity.setContactEmail(StrUtil.trim(entity.getContactEmail()));
        entity.setDescription(StrUtil.trim(entity.getDescription()));
        if (entity.getSort() == null) {
            entity.setSort(0);
        }

        long count = lambdaQuery()
                .eq(Tenant::getCode, entity.getCode())
                .ne(StrUtil.isNotBlank(entity.getId()), Tenant::getId, entity.getId())
                .count();
        if (count > 0) {
            throw new BuzzException("租户编码重复");
        }
    }

}
