package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.rbac.entity.RbacRoleMenu;
import com.faber.rbac.mapper.RbacRoleMenuMapper;
import org.springframework.stereotype.Service;

/**
 * BASE-角色权限对应表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacRoleMenuBiz extends BaseBiz<RbacRoleMenuMapper,RbacRoleMenu> {
}