package com.faber.api.flow.manage.config;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
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
import com.faber.api.flow.core.enums.FaNodeSetTypeExtend;

import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.spring.SpringUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

/**
 * 任务参与者
 * https://flowlong.aizuda.com/docs/taskActorProvider.html
 * 1. 审核人指定角色：如果角色名下只有一个账户，则直接分配给该账户；
 * 2. 审核人指定部门：如果部门名下只有一个账户，则直接分配给该账户；
 */
@Slf4j
@Component
public class FaTaskActorProvider extends GeneralTaskActorProvider {

    @Resource UserBiz userBiz;
    @Resource DepartmentBiz departmentBiz;
    @Resource RbacUserRoleBiz rbacUserRoleBiz;
    
    @Override
    public List<FlwTaskActor> getTaskActors(NodeModel nodeModel, Execution execution) {
        // 审批人为：发起人自己
        if (NodeSetType.initiatorThemselves.eq(nodeModel.getSetType())) {
            FlowCreator flowCreator = execution.getFlowCreator();
            FlwTaskActor taskActor = FlwTaskActor.of(flowCreator, execution.getFlwTask());
            return Collections.singletonList(taskActor);
        }

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
                    flwTaskActors.add(FlwTaskActor.of(nodeAssignee, actorType, false));
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
                    flwTaskActors.add(FlwTaskActor.of(nodeAssignee, actorType, false));
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

        // 自定义代码处理逻辑
        if (FaNodeSetTypeExtend.code.eq(nodeModel.getSetType())) {
            // 获取代码路径，形如："nodeAssigneeCodePath": "com.faber.api.flow.demo.flow.DemoLeaveTaskActorProvider#getTaskActorCase1"
            String nodeAssigneeCodePath = MapUtil.getStr(nodeModel.getExtendConfig(), "nodeAssigneeCodePath");
            if (StrUtil.isEmpty(nodeAssigneeCodePath)) {
                throw new FlowLongException("节点【" + nodeModel.getNodeName() + "】自定义代码处理逻辑未指定，请联系管理员");
            }
            String[] codeSs = nodeAssigneeCodePath.split("#");
            String className = codeSs[0];
            String methodName = codeSs[1];
            try {
                // 1. 通过 Spring 拿到 Bean
                Object clazzBean = SpringUtil.getBean(Class.forName(className));

                // 2. 获取方法（方法名 + 参数类型）
                Method method = clazzBean.getClass().getMethod(methodName, NodeModel.class, Execution.class);

                // 3. 调用方法
                @SuppressWarnings("unchecked")
                List<FlwTaskActor> result = (List<FlwTaskActor>) method.invoke(clazzBean, nodeModel, execution);

                return result;
            } catch (ClassNotFoundException e) {
                log.error(e.getMessage(), e);
                throw new FlowLongException("节点【" + nodeModel.getNodeName() + "】自定义代码处理逻辑【" + className + "】未找到，请联系管理员");
            } catch (NoSuchMethodException e) {
                log.error(e.getMessage(), e);
                throw new FlowLongException("节点【" + nodeModel.getNodeName() + "】自定义代码处理逻辑【" + className + "#" + methodName + "】的方法未找到，请联系管理员");
            } catch (Exception e) {
                log.error(e.getMessage(), e);
                throw new FlowLongException("节点【" + nodeModel.getNodeName() + "】自定义代码处理逻辑【" + className + "#" + methodName + "】的方法调用异常，请联系管理员" + e.getMessage());
            }
            
        }
        
        return super.getTaskActors(nodeModel, execution);
    }
    
}
