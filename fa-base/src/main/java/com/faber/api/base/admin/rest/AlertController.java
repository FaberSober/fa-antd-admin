package com.faber.api.base.admin.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.base.admin.biz.AlertBiz;
import com.faber.api.base.admin.entity.Alert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * BASE-告警信息
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-12-16 11:40:21
 */
@FaLogBiz("BASE-告警信息")
@RestController
@RequestMapping("/api/base/admin/alert")
public class AlertController extends BaseController<AlertBiz, Alert, Integer> {


    @FaLogOpr(value = "查询分组情况", crud = LogCrudEnum.C)
    @RequestMapping(value = "/selectCountOfType", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Map<String,Integer>> selectCountOfType() {
        return ok(baseBiz.selectCountOfType());
    }
}