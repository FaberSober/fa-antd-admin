package com.faber.api.im.group.mapper;

import com.faber.api.im.group.entity.ImGroupMember;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 群成员Mapper接口
 *
 * @author faber
 */
@Mapper
public interface ImGroupMemberMapper extends FaBaseMapper<ImGroupMember> {
}