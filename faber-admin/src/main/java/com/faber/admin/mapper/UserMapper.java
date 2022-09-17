package com.faber.admin.mapper;

import com.faber.admin.entity.User;
import com.faber.admin.vo.GroupUser;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

public interface UserMapper extends BaseMapper<User> {

    List<GroupUser> selectGroupUser(Map<String, Object> params);

}
