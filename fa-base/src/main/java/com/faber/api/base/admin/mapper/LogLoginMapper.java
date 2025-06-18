package com.faber.api.base.admin.mapper;

import com.faber.api.base.admin.entity.LogLogin;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.core.vo.chart.ChartSeriesVo;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * BASE-登录日志
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
public interface LogLoginMapper extends FaBaseMapper<LogLogin> {

    List<ChartSeriesVo> countByDay(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    List<ChartSeriesVo> countByPro();

}
