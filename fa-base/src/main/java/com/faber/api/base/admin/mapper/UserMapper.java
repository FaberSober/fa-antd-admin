package com.faber.api.base.admin.mapper;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.api.base.admin.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper extends FaBaseMapper<User> {

    List<User> listJoin(@Param("ew") QueryWrapper<User> wrapper);

}
