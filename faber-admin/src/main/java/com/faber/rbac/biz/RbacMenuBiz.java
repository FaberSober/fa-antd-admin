package com.faber.rbac.biz;

import com.faber.common.biz.BaseBiz;
import com.faber.rbac.entity.RbacMenu;
import com.faber.rbac.mapper.RbacMenuMapper;
import org.springframework.stereotype.Service;

/**
 * BASE-权限表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@Service
public class RbacMenuBiz extends BaseBiz<RbacMenuMapper,RbacMenu> {
}