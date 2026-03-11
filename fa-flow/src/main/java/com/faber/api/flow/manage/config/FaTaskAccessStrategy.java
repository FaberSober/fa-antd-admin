package com.faber.api.flow.manage.config;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Component;

import com.aizuda.bpm.engine.core.enums.ActorType;
import com.aizuda.bpm.engine.entity.FlwTaskActor;
import com.aizuda.bpm.engine.impl.GeneralAccessStrategy;
import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.rbac.biz.RbacUserRoleBiz;

import jakarta.annotation.Resource;

/**
 * 任务访问策略
 * https://flowlong.aizuda.com/docs/taskAccessStrategy.html
 * 1. 任务处理人为用户，判断用户是否在taskActors中；
 * 2. 任务处理人为角色，判读用户角色是否在taskActors中；
 * 3. 任务处理人为部门，判读用户部门是否在taskActors中；
 */
@Component
public class FaTaskAccessStrategy extends GeneralAccessStrategy {

    @Resource UserBiz userBiz;
    @Resource RbacUserRoleBiz rbacUserRoleBiz;

    @Override
    public FlwTaskActor isAllowed(String userId, List<FlwTaskActor> taskActors) {
        if (null != taskActors) {
            // 过滤处理人为用户的数据
            {
                List<FlwTaskActor> userTaskActors = taskActors.stream().filter(t -> ActorType.user.eq(t.getActorType())).toList();
                FlwTaskActor userActor = userTaskActors.stream().filter(t -> Objects.equals(t.getActorId(), userId))
                .findFirst().orElse(null);
                if (userActor != null) {
                    return userActor;
                }
            }
            
            // 过滤处理人为部门的数据
            {
                List<FlwTaskActor> deptTaskActors = taskActors.stream().filter(t -> ActorType.department.eq(t.getActorType())).toList();
                User user = userBiz.getById(userId);
                FlwTaskActor deptActor = deptTaskActors.stream().filter(t -> Objects.equals(t.getActorId(), user.getDepartmentId()))
                .findFirst().orElse(null);
                if (deptActor != null) {
                    return deptActor;
                }
            }

            // 过滤处理人为角色的数据
            {
                List<FlwTaskActor> roleTaskActors = taskActors.stream().filter(t -> ActorType.role.eq(t.getActorType())).toList();
                List<String> roleIds = rbacUserRoleBiz.getUserRoleIds(userId).stream().map(i -> Long.toString(i)).toList();
                FlwTaskActor roleActor = roleTaskActors.stream().filter(t -> roleIds.contains(t.getActorId()))
                .findFirst().orElse(null);
                if (roleActor != null) {
                    return roleActor;
                }
            }
        }
        return super.isAllowed(userId, taskActors);
    }
    
}
