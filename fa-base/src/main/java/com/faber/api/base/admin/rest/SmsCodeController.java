package com.faber.api.base.admin.rest;

import com.faber.api.base.admin.biz.SmsCodeBiz;
import com.faber.api.base.admin.entity.SmsCode;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.validation.Valid;
import java.util.Map;

@FaLogBiz("短信")
@Controller
@RequestMapping("/api/base/admin/smsCode")
public class SmsCodeController extends BaseController<SmsCodeBiz, SmsCode, Integer> {

    /**
     * 创建短信验证码
     * @param params
     * @return
     */
    @FaLogOpr("创建验证码")
    @RequestMapping(value = "/portal/create", method = RequestMethod.POST)
    @ResponseBody
    @IgnoreUserToken
    public Ret<Object> portalCreate(@Valid @RequestBody Map<String, Object> params) {
        baseBiz.create(params);
        return ok();
    }

}