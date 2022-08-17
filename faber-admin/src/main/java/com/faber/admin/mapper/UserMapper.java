package com.faber.admin.mapper;

import com.faber.admin.entity.User;
import com.faber.admin.vo.GroupUser;
import tk.mybatis.mapper.common.Mapper;

import java.util.List;
import java.util.Map;

public interface UserMapper extends Mapper<User> {

    List<GroupUser> selectGroupUser(Map<String, Object> params);

}
