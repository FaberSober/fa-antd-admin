package com.faber.admin.biz;

import com.faber.admin.entity.MenuBlock;
import org.springframework.stereotype.Service;

import com.faber.admin.mapper.MenuBlockMapper;
import com.faber.common.biz.BaseBiz;

/**
 * BASE-菜单模块
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-11-20 15:53:22
 */
@Service
public class MenuBlockBiz extends BaseBiz<MenuBlockMapper, MenuBlock> {
}