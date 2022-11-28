package com.faber.buzz.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.buzz.admin.entity.Area;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;

/**
 * 中国行政地区表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 09:55:39
 */
public interface AreaMapper extends BaseMapper<Area> {

    long findClosetByLoc(@Param("lng") BigDecimal lng, @Param("lat") BigDecimal lat);
	
}
