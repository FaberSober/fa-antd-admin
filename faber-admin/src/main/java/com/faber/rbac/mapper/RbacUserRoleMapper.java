package com.faber.rbac.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.rbac.entity.RbacUserRole;
import com.faber.rbac.vo.RbacUserRoleRetVo;
import com.faber.rbac.vo.query.RbacUserRoleQueryVo;

import java.util.List;

/**
 * BASE-用户角色关联表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
public interface RbacUserRoleMapper extends BaseMapper<RbacUserRole> {

    List<RbacUserRoleRetVo> pageVo(RbacUserRoleQueryVo query);
	
}
