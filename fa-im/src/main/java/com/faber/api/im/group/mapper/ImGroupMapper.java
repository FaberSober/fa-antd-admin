package com.faber.api.im.group.mapper;

import com.faber.api.im.group.entity.ImGroup;
import com.faber.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 群聊信息Mapper接口
 *
 * @author faber
 */
@Mapper
public interface ImGroupMapper extends BaseMapper<ImGroup> {
}