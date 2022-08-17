package com.faber.admin.mapper;

import com.faber.admin.entity.Group;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;

public interface GroupMapper extends Mapper<Group> {

    /**
     * 查询用户所在的角色分组
     * @param userId 用户ID
     * @return
     */
    List<Group> findByUserId(@Param("userId") String userId);

}
