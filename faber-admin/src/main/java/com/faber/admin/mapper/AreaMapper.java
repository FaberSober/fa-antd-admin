package com.faber.admin.mapper;

import com.faber.admin.entity.Area;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

import java.math.BigDecimal;

/**
 * 中国行政地区表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 09:55:39
 */
// @Mapper
public interface AreaMapper extends Mapper<Area> {

    long findClosetByLoc(@Param("lng") BigDecimal lng, @Param("lat") BigDecimal lat);
	
}
