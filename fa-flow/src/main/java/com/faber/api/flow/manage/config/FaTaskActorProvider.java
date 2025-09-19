package com.faber.api.flow.manage.config;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aizuda.bpm.engine.core.Execution;
import com.aizuda.bpm.engine.core.FlowCreator;
import com.aizuda.bpm.engine.core.enums.NodeSetType;
import com.aizuda.bpm.engine.entity.FlwTaskActor;
import com.aizuda.bpm.engine.exception.FlowLongException;
import com.aizuda.bpm.engine.impl.GeneralTaskActorProvider;
import com.aizuda.bpm.engine.model.NodeAssignee;
import com.aizuda.bpm.engine.model.NodeModel;
import com.faber.api.base.admin.biz.DepartmentBiz;
import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.Department;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.rbac.biz.RbacUserRoleBiz;
import com.faber.api.base.rbac.entity.RbacUserRole;

import cn.hutool.core.util.StrUtil;
import jakarta.annotation.Resource;

/**
 * 任务参与者
 * https://flowlong.aizuda.com/docs/taskActorProvider.html
 * 1. 审核人指定角色：如果角色名下只有一个账户，则直接分配给该账户；
 * 2. 审核人指定部门：如果部门名下只有一个账户，则直接分配给该账户；
 */
@Component
public class FaTaskActorProvider extends GeneralTaskActorProvider {

    @Resource UserBiz userBiz;
    @Resource DepartmentBiz departmentBiz;
    @Resource RbacUserRoleBiz rbacUserRoleBiz;
    
    @Override
    public List<FlwTaskActor> getTaskActors(NodeModel nodeModel, Execution execution) {
        // 处理审批人为：角色
        if (NodeSetType.role.eq(nodeModel.getSetType())) {
            List<FlwTaskActor> flwTaskActors = new ArrayList<>();
            for (NodeAssignee nodeAssignee: nodeModel.getNodeAssigneeList()) {
                // 如果角色名下只有一个账户，则直接分配给该账户；
                Long count = rbacUserRoleBiz.lambdaQuery().eq(RbacUserRole::getRoleId, nodeAssignee.getId()).count();
                if (count == 1) {
                    RbacUserRole userRole = rbacUserRoleBiz.lambdaQuery().eq(RbacUserRole::getRoleId, nodeAssignee.getId()).one();
                    User user = userBiz.getById(userRole.getUserId());
                    flwTaskActors.add(FlwTaskActor.ofUser(nodeAssignee.getTenantId(), user.getId(), user.getName()));
                } else {
                    final Integer actorType = this.getActorType(nodeModel);
                    flwTaskActors.add(FlwTaskActor.of(nodeAssignee, actorType));
                }
            }
            return flwTaskActors;
        }

        // 处理审批人为：部门
        if (NodeSetType.department.eq(nodeModel.getSetType())) {
            List<FlwTaskActor> flwTaskActors = new ArrayList<>();
            for (NodeAssignee nodeAssignee: nodeModel.getNodeAssigneeList()) {
                // 如果部门名下只有一个账户，则直接分配给该账户；
                Long count = userBiz.lambdaQuery().eq(User::getDepartmentId, nodeAssignee.getId()).count();
                if (count == 1) {
                    User user = userBiz.lambdaQuery().eq(User::getDepartmentId, nodeAssignee.getId()).one();
                    flwTaskActors.add(FlwTaskActor.ofUser(nodeAssignee.getTenantId(), user.getId(), user.getName()));
                } else {
                    final Integer actorType = this.getActorType(nodeModel);
                    flwTaskActors.add(FlwTaskActor.of(nodeAssignee, actorType));
                }
            }
            return flwTaskActors;
        }

        // 处理审批人为：主管
        if (NodeSetType.supervisor.eq(nodeModel.getSetType())) {
            // 找到发起人的主管
            FlowCreator flowCreator = execution.getFlowCreator();
            User createUser = userBiz.getById(flowCreator.getCreateId());
            if (StrUtil.isEmpty(createUser.getDepartmentId())) throw new FlowLongException("流程创建人【" + createUser.getName() + "】未绑定部门，请联系管理员");
            // get creator's department
            Department department = departmentBiz.getById(createUser.getDepartmentId());
            if (department == null) throw new FlowLongException("流程创建人【" + createUser.getName() + "】绑定部门【" + createUser.getDepartmentId() + "】不存在，请联系管理员");
            if (StrUtil.isEmpty(department.getManagerId())) throw new FlowLongException("部门【" + department.getName() + "】未设置主管，请联系管理员");
            User manager = userBiz.getById(department.getManagerId());
            if (manager == null) throw new FlowLongException("部门【" + department.getName() + "】设置主管【" + department.getManagerId() + "】未查询到数据，请联系管理员");
            return Collections.singletonList(
                            FlwTaskActor.ofUser(null, manager.getId(), manager.getName())
                    );
        }
        
        return super.getTaskActors(nodeModel, execution);
    }
    
}
