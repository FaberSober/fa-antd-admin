package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.AreaBiz;
import com.faber.api.base.admin.entity.Area;
import com.faber.api.base.admin.vo.ret.AreaPathVo;
import com.faber.core.utils.IpUtils;
import com.faber.core.vo.IpAddr;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/api/base/admin/area")
public class AreaController extends BaseController<AreaBiz, Area, Integer> {

    @RequestMapping(value = "/findByAreaCode/{areaCode}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Area> findByAreaCode(@PathVariable long areaCode) {
        Area area = baseBiz.findByAreaCode(areaCode);
        return ok(area);
    }

    @RequestMapping(value = "/pathLine/{areaCode}", method = RequestMethod.GET)
    @ResponseBody
    public List<Area> pathLine(@PathVariable long areaCode) {
        return baseBiz.pathLine(areaCode);
    }

    @RequestMapping(value = "/path/{areaCode}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<AreaPathVo> path(@PathVariable long areaCode) {
        AreaPathVo data = baseBiz.path(areaCode);
        return ok(data);
    }

    @RequestMapping(value = "/findAreaByLoc", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Area> path(@RequestParam("lng") BigDecimal lng, @RequestParam("lat") BigDecimal lat) {
        Area area = baseBiz.findAreaByLoc(lng, lat);
        return ok(area);
    }

    /**
     * Ip定位
     */
    @RequestMapping(value = "/locIp", method = RequestMethod.GET)
    @ResponseBody
    public Ret<IpAddr> locIp() {
        IpAddr data = baseBiz.locIp();
        return ok(data);
    }

}