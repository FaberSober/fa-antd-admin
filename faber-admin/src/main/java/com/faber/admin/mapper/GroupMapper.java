package com.faber.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.admin.entity.Group;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface GroupMapper extends BaseMapper<Group> {

    /**
     * 查询用户所在的角色分组
     * @param userId 用户ID
     * @return
     */
    List<Group> findByUserId(@Param("userId") String userId);

}
