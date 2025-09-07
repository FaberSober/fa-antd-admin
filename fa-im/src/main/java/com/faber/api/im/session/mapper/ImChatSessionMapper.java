package com.faber.api.im.session.mapper;

import com.faber.api.im.session.entity.ImChatSession;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 聊天会话Mapper接口
 *
 * @author faber
 */
@Mapper
public interface ImChatSessionMapper extends FaBaseMapper<ImChatSession> {
}