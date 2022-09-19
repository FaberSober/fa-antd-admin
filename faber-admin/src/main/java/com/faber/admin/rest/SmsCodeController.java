package com.faber.admin.rest;

import com.faber.admin.biz.SmsCodeBiz;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.entity.SmsCode;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.Valid;
import java.util.Map;

@Controller
@RequestMapping("/api/admin/smsCode")
public class SmsCodeController extends BaseController<SmsCodeBiz, SmsCode, Integer> {

    /**
     * 创建短信验证码
     * @param params
     * @return
     */
    @RequestMapping(value = "/portal/create", method = RequestMethod.POST)
    @ResponseBody
    @IgnoreUserToken
    public ObjectRestResponse<Object> portalCreate(@Valid @RequestBody Map<String, Object> params) {
        baseBiz.create(params);
        return ok();
    }

}