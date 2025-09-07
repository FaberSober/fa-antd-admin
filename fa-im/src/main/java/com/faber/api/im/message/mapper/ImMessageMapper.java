package com.faber.api.im.message.mapper;

import com.faber.api.im.message.entity.ImMessage;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 消息Mapper接口
 *
 * @author faber
 */
@Mapper
public interface ImMessageMapper extends FaBaseMapper<ImMessage> {
}