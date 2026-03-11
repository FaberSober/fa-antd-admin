package com.faber.api.im.core.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.faber.api.im.core.entity.ImMessage;
import com.faber.api.im.core.vo.req.ImMessagePageQueryVo;
import com.faber.core.config.mybatis.base.FaBaseMapper;

/**
 * IM-消息表
 * 
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
public interface ImMessageMapper extends FaBaseMapper<ImMessage> {
	
    /** 查询任务 */
    List<ImMessage> pageQuery(@Param("query") ImMessagePageQueryVo queryVo);

}
