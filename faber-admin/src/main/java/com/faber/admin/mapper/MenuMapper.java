package com.faber.admin.mapper;

import com.faber.admin.entity.Menu;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface MenuMapper extends Mapper<Menu> {
    List<Menu> selectMenuByAuthorityId(@Param("authorityId") String authorityId, @Param("authorityType") String authorityType);

    /**
     * 根据用户和组的权限关系查找用户可访问菜单
     * @param userId
     * @return
     */
    List<Menu> selectAuthorityMenuByUserId(@Param("userId") String userId);

    /**
     * 根据用户和组的权限关系查找用户可访问的系统
     * @param userId
     * @return
     */
    List<Menu> selectAuthoritySystemByUserId(@Param("userId") String userId);

    /**
     * 查找未挂在的父节点下Menu（父节点已逻辑删除）
     * @return
     */
    String findNotAttachedMenuIds();

    void removeByMenuIds(@Param("ids") String ids, @Param("name") String name, @Param("id") String id, @Param("ip") String ip);

}