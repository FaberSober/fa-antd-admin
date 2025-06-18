package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.UserDeviceBiz;
import com.faber.api.base.admin.entity.UserDevice;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserDevice;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * BASE-用户设备
 *
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2024-01-11 14:52:44
 */
@FaLogBiz("BASE-用户设备")
@RestController
@RequestMapping("/api/base/admin/userDevice")
public class UserDeviceController extends BaseController<UserDeviceBiz, UserDevice, Integer> {

    @IgnoreUserDevice
    @FaLogOpr(value = "更新设备信息", crud = LogCrudEnum.U)
    @RequestMapping(value = "/updateMine", method = RequestMethod.POST)
    @ResponseBody
    public Ret<UserDevice> updateMine(@Validated(value = Vg.Crud.U.class) @RequestBody UserDevice entity) {
        baseBiz.updateMine(entity);
        return ok();
    }

}