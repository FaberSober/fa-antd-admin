package com.faber.admin.mapper;

import com.faber.admin.entity.User;
import com.faber.admin.vo.GroupUserVo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

public interface UserMapper extends BaseMapper<User> {

    List<GroupUserVo> selectGroupUser(Map<String, Object> params);

}
