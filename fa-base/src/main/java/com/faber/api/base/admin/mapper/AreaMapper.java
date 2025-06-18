package com.faber.api.base.admin.mapper;

import com.faber.api.base.admin.entity.Area;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;

/**
 * 中国行政地区表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 09:55:39
 */
public interface AreaMapper extends FaBaseMapper<Area> {

    long findClosetByLoc(@Param("lng") BigDecimal lng, @Param("lat") BigDecimal lat);

}
