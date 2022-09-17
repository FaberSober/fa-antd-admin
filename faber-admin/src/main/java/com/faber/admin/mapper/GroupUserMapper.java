package com.faber.admin.mapper;

import com.faber.admin.entity.GroupUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

/**
 * 领导类型角色关联
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 10:30:34
 */
// @Mapper
public interface GroupUserMapper extends BaseMapper<GroupUser> {

    /**
     * 删除无效的关联账户
     */
    void deleteNotValidGroupUsers();

}
