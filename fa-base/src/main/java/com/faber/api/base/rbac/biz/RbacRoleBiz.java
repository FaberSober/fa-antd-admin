package com.faber.api.base.rbac.biz;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.api.base.rbac.mapper.RbacRoleMapper;
import com.faber.api.base.rbac.entity.RbacRole;
import com.faber.api.base.rbac.enums.RbacRoleTypeEnum;
import com.faber.api.base.tn.biz.TenantBiz;
import com.faber.api.base.tn.biz.TenantUserBiz;
import com.faber.api.base.tn.entity.Tenant;
import com.faber.core.config.redis.annotation.FaCacheClear;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.web.biz.BaseBiz;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * BASE-角色表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleBiz extends BaseBiz<RbacRoleMapper, RbacRole> {

    @Lazy
    @Resource
    private TenantUserBiz tenantUserBiz;

    @Lazy
    @Resource
    private TenantBiz tenantBiz;

    @Override
    public QueryWrapper<RbacRole> parseQuery(QueryParams query) {
        QueryWrapper<RbacRole> wrapper = super.parseQuery(query);
        appendRoleScopeQuery(wrapper);
        return wrapper;
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean save(RbacRole entity) {
        fillAndCheckSaveRole(entity);
        return super.save(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean updateById(RbacRole entity) {
        fillAndCheckUpdateRole(entity);
        return super.updateById(entity);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public boolean removeById(Serializable id) {
        RbacRole role = getById(id);
        checkCanManageRole(role);
        return super.removeById(id);
    }

    @FaCacheClear(pre = "rbac:")
    @Override
    public void removeBatchByIds(List<Serializable> ids) {
        ids.forEach(id -> checkCanManageRole(getById(id)));
        super.removeBatchByIds(ids);
    }

    public RbacRole getRoleByName(String name) {
        long count = lambdaQuery().eq(RbacRole::getName, name).count();
        if (count != 1) throw new BuzzException("请联系管理检查角色配置：" + name);

        return lambdaQuery().eq(RbacRole::getName, name).one();
    }

    public List<RbacRole> listVisibleRolesByIds(List<Long> roleIds) {
        if (roleIds == null || roleIds.isEmpty()) {
            return List.of();
        }
        QueryWrapper<RbacRole> wrapper = new QueryWrapper<>();
        wrapper.eq("status", true).in("id", roleIds);
        appendRoleScopeQuery(wrapper);
        return list(wrapper);
    }

    @Override
    public void decorateOne(RbacRole role) {
        if (role == null || StrUtil.isBlank(role.getTenantId())) {
            return;
        }
        Tenant tenant = tenantBiz.getById(role.getTenantId());
        if (tenant != null) {
            role.setTenantName(tenant.getName());
        }
    }

    @Override
    public void decorateList(List<RbacRole> list) {
        if (list == null || list.isEmpty()) {
            return;
        }
        List<String> tenantIds = list.stream()
                .map(RbacRole::getTenantId)
                .filter(StrUtil::isNotBlank)
                .distinct()
                .collect(Collectors.toList());
        if (tenantIds.isEmpty()) {
            return;
        }
        Map<String, String> tenantNameMap = tenantBiz.listByIds(tenantIds).stream()
                .collect(Collectors.toMap(Tenant::getId, Tenant::getName, (a, b) -> a));
        list.forEach(role -> role.setTenantName(tenantNameMap.get(role.getTenantId())));
    }

    public void checkCanViewRole(Long roleId) {
        RbacRole role = getById(roleId);
        if (role == null) {
            throw new BuzzException("角色不存在");
        }
        if (canViewRole(role)) {
            return;
        }
        throw new BuzzException("无权查看该角色");
    }

    public void checkCanManageRole(Long roleId) {
        RbacRole role = getById(roleId);
        checkCanManageRole(role);
    }

    public void checkCanManageRole(RbacRole role) {
        if (role == null) {
            throw new BuzzException("角色不存在");
        }
        if (canManageRole(role)) {
            return;
        }
        throw new BuzzException("无权管理该角色");
    }

    private void appendRoleScopeQuery(QueryWrapper<RbacRole> wrapper) {
        if (isSuperAdminUser(getCurrentUserId())) {
            return;
        }

        String tenantId = getCurrentTenantId();
        wrapper.and(ew -> {
            ew.eq("type", RbacRoleTypeEnum.GLOBAL.getValue());
            if (StrUtil.isNotBlank(tenantId)) {
                ew.or(query -> query.eq("type", RbacRoleTypeEnum.TENANT.getValue()).eq("tenant_id", tenantId));
            }
        });
    }

    private boolean canViewRole(RbacRole role) {
        if (isSuperAdminUser(getCurrentUserId())) {
            return true;
        }
        RbacRoleTypeEnum type = getRoleType(role);
        if (type == RbacRoleTypeEnum.GLOBAL_SUPER) {
            return false;
        }
        if (type == RbacRoleTypeEnum.GLOBAL) {
            return true;
        }
        String tenantId = getCurrentTenantId();
        return StrUtil.isNotBlank(tenantId) && StrUtil.equals(tenantId, role.getTenantId());
    }

    private boolean canManageRole(RbacRole role) {
        if (isSuperAdminUser(getCurrentUserId())) {
            return true;
        }
        RbacRoleTypeEnum type = getRoleType(role);
        if (type == RbacRoleTypeEnum.GLOBAL_SUPER) {
            return false;
        }
        String tenantId = getCurrentTenantId();
        if (StrUtil.isBlank(tenantId) || !tenantUserBiz.isTenantAdminUser(getCurrentUserId(), tenantId)) {
            return false;
        }
        if (type == RbacRoleTypeEnum.GLOBAL) {
            return true;
        }
        return StrUtil.equals(tenantId, role.getTenantId());
    }

    private void fillAndCheckSaveRole(RbacRole entity) {
        if (isSuperAdminUser(getCurrentUserId())) {
            fillSuperAdminRoleScope(entity);
            return;
        }

        String tenantId = getCurrentTenantId();
        if (!tenantUserBiz.isTenantAdminUser(getCurrentUserId(), tenantId)) {
            throw new BuzzException("无权新增角色");
        }
        fillTenantAdminRoleScope(entity, tenantId);
    }

    private void fillAndCheckUpdateRole(RbacRole entity) {
        RbacRole db = getById(entity.getId());
        checkCanManageRole(db);

        if (isSuperAdminUser(getCurrentUserId())) {
            fillSuperAdminRoleScope(entity);
            return;
        }

        fillTenantAdminRoleScope(entity, getCurrentTenantId());
    }

    private void fillSuperAdminRoleScope(RbacRole entity) {
        RbacRoleTypeEnum type = entity.getType();
        if (type == null) {
            type = RbacRoleTypeEnum.TENANT;
            entity.setType(type);
        }
        if (type == RbacRoleTypeEnum.GLOBAL_SUPER || type == RbacRoleTypeEnum.GLOBAL) {
            entity.setTenantId(null);
            return;
        }
        if (type != RbacRoleTypeEnum.TENANT) {
            throw new BuzzException("角色类型错误");
        }
        if (StrUtil.isBlank(entity.getTenantId())) {
            entity.setTenantId(getCurrentTenantId());
        }
        if (StrUtil.isBlank(entity.getTenantId())) {
            throw new BuzzException("租户角色需要指定租户ID");
        }
    }

    private void fillTenantAdminRoleScope(RbacRole entity, String tenantId) {
        if (StrUtil.isBlank(tenantId)) {
            throw new BuzzException("当前租户不能为空");
        }
        RbacRoleTypeEnum type = entity.getType() == null ? RbacRoleTypeEnum.TENANT : entity.getType();
        if (type == RbacRoleTypeEnum.GLOBAL_SUPER) {
            throw new BuzzException("无权管理全局超管角色");
        }
        if (type == RbacRoleTypeEnum.GLOBAL) {
            entity.setType(RbacRoleTypeEnum.GLOBAL);
            entity.setTenantId(null);
            return;
        }
        if (type != RbacRoleTypeEnum.TENANT) {
            throw new BuzzException("角色类型错误");
        }
        entity.setType(RbacRoleTypeEnum.TENANT);
        entity.setTenantId(tenantId);
    }

    private RbacRoleTypeEnum getRoleType(RbacRole role) {
        if (role.getType() != null) {
            return role.getType();
        }
        if (role.getId() != null && role.getId() == 1L) {
            return RbacRoleTypeEnum.GLOBAL_SUPER;
        }
        return StrUtil.isBlank(role.getTenantId()) ? RbacRoleTypeEnum.GLOBAL : RbacRoleTypeEnum.TENANT;
    }

}
