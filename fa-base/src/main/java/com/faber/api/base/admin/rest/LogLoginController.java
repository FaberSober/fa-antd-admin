
package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.LogLoginBiz;
import com.faber.api.base.admin.entity.LogLogin;
import com.faber.api.base.admin.vo.query.LogLoginCountByDayReqVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.chart.ChartSeriesVo;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * BASE-登录日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
@FaLogBiz("登录日志")
@RestController
@RequestMapping("/api/base/admin/logLogin")
public class LogLoginController extends BaseController<LogLoginBiz, LogLogin, Integer> {

    @FaLogOpr(value = "按天统计", crud = LogCrudEnum.R)
    @RequestMapping(value = "/countByDay", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<ChartSeriesVo>> countByDay(@RequestBody LogLoginCountByDayReqVo reqVo) {
        List<ChartSeriesVo> data = baseBiz.countByDay(reqVo);
        return ok(data);
    }

    @FaLogOpr(value = "按省份统计", crud = LogCrudEnum.R)
    @RequestMapping(value = "/countByPro", method = RequestMethod.GET)
    @ResponseBody
    public Ret<List<ChartSeriesVo>> countByPro() {
        List<ChartSeriesVo> data = baseBiz.countByPro();
        return ok(data);
    }

}