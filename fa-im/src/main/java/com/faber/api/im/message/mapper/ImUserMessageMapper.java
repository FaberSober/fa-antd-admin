package com.faber.api.im.message.mapper;

import com.faber.api.im.message.entity.ImUserMessage;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户消息状态Mapper接口
 *
 * @author faber
 */
@Mapper
public interface ImUserMessageMapper extends FaBaseMapper<ImUserMessage> {
}