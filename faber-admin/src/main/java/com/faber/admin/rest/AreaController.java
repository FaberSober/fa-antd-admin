package com.faber.admin.rest;

import com.faber.admin.biz.AreaBiz;
import com.faber.admin.entity.Area;
import com.faber.admin.vo.AreaPathVo;
import com.faber.common.vo.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/admin/area")
public class AreaController extends BaseController<AreaBiz, Area, Integer> {

    @RequestMapping(value = "/findByAreaCode/{areaCode}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<Area> findByAreaCode(@PathVariable long areaCode) {
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
    public ObjectRestResponse<AreaPathVo> path(@PathVariable long areaCode) {
        AreaPathVo data = baseBiz.path(areaCode);
        return ok(data);
    }

    @RequestMapping(value = "/findAreaByLoc", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<Area> path(@RequestParam("lng") BigDecimal lng, @RequestParam("lat") BigDecimal lat) {
        Area area = baseBiz.findAreaByLoc(lng, lat);
        return ok(area);
    }

    /**
     * Ip定位
     * FIXME 使用新的接口
     */
    @RequestMapping(value = "/locIp", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse locIp() {
        Map<String, Object> map = baseBiz.locIp();
        return new ObjectRestResponse().data(map);
    }

}