package com.faber.api.base.admin.biz;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjUtil;
import com.faber.api.base.admin.entity.LogLogin;
import com.faber.api.base.admin.mapper.LogLoginMapper;
import com.faber.api.base.admin.vo.query.LogLoginCountByDayReqVo;
import com.faber.core.exception.BuzzException;
import com.faber.core.vo.chart.ChartSeriesVo;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * BASE-登录日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
@Service
public class LogLoginBiz extends BaseBiz<LogLoginMapper, LogLogin> {

    public List<ChartSeriesVo> countByDay(LogLoginCountByDayReqVo reqVo) {
        Date startDate = reqVo.getStartDate();
        Date endDate = reqVo.getEndDate();

        if (startDate.after(endDate)) throw new BuzzException("开始日期需要小于结束日期");

        List<ChartSeriesVo> list = baseMapper.countByDay(startDate, endDate);

        List<ChartSeriesVo> fillList = new ArrayList<>();

        // fill not find day
        Date cursorDate = new Date(startDate.getTime());
        while (cursorDate.before(endDate)) {
            String day = DateUtil.formatDate(cursorDate);
            Optional<ChartSeriesVo> dayCountVoOptional = list.stream().filter(i -> ObjUtil.equal(i.getName(), day)).findFirst();

            if (dayCountVoOptional.isPresent()) {
                fillList.add(dayCountVoOptional.get());
            } else {
                fillList.add(new ChartSeriesVo(day, 0));
            }

            cursorDate = DateUtil.offsetDay(cursorDate, 1);
        }

        return fillList;
    }

    public List<ChartSeriesVo> countByPro() {
        return baseMapper.countByPro();
    }

}