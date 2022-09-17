package com.faber.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.admin.entity.Element;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ElementMapper extends BaseMapper<Element> {

    /**
     * 查询授权用户ID的所有权限Element
     *
     * @param userId 授权用户ID
     * @return List<Element>
     */
    List<Element> selectAuthorityElementByUserId(@Param("userId") String userId);

    /**
     * 获取全部有效的Element权限点
     *
     * @return List<Element>
     */
    List<Element> selectAllElementPermissions();

    /**
     * 获取分组下、指定菜单ID下的授权权限点Element
     *
     * @param groupId 分组ID
     * @param menuId  菜单ID
     * @return List<Element>
     */
    List<Element> selectAuthorityMenuElementByGroupId(@Param("groupId") int groupId, @Param("menuId") int menuId);

    /**
     * 逻辑删除无用的Element
     *
     * @param name 删除用户名称
     * @param id   删除用户ID
     * @param ip   删除操作IP
     */
    void removeNotValid(@Param("name") String name, @Param("id") String id, @Param("ip") String ip);

//    List<Element> selectAuthorityMenuElementByUserId(@Param("userId") String userId, @Param("menuId") String menuId);

//    List<Element> selectAuthorityElementByClientId(@Param("clientId") String clientId);

//    List<Element> selectByMenuCode(@Param("menuCode") String menuCode, @Param("userId") String userId);

}
