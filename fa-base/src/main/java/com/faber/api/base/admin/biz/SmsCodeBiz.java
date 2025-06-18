package com.faber.api.base.admin.biz;

import cn.hutool.core.util.RandomUtil;
import com.faber.api.base.admin.entity.SmsCode;
import com.faber.api.base.admin.mapper.SmsCodeMapper;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.exception.BuzzException;
import com.faber.api.base.msg.helper.config.MsgSendConfig;
import com.faber.api.base.msg.helper.config.MsgSendSmsCode;
import com.faber.api.base.msg.helper.properties.SmsConfiguration;
import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.Date;
import java.util.Map;

/**
 * 短信验证码
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
@Service
public class SmsCodeBiz extends BaseBiz<SmsCodeMapper, SmsCode> {

    @Resource
    private SmsConfiguration smsConfiguration;

    public void create(Map<String, Object> params) {
        String phone = MapUtils.getString(params, "phone");

        // 查询是否已经有发送的验证码
        long count = lambdaQuery().eq(SmsCode::getPhone, phone).count();
        if (count > 0) {
            throw new BuzzException("验证码已发送,请注意查收");
        }

        // 生成验证码
        String code = RandomUtil.randomNumbers(6);

        MsgSendConfig msgSendConfig = MsgSendSmsCode.builder()
                .code(code)
                .build();

        // 发送阿里云短信
        try {
            smsConfiguration.sendSms(phone, msgSendConfig);
        } catch (Exception e) {
            _logger.error(e.getMessage(), e);

            throw new BuzzException("发送短信失败: " + e.getMessage());
        }

        // 验证码入库
        SmsCode smsCode = new SmsCode();
        smsCode.setCode(code);
        smsCode.setPhone(phone);
        smsCode.setCrtTime(new Date());
        save(smsCode);
    }

    /**
     * 删除失效的验证码
     */
    public void deleteInvalidCode() {
        baseMapper.deleteInvalidCode();
    }

    /**
     * 校验手机号+验证码
     * @param phone
     * @param code
     * @param ifDelete 验证成功后，是否删除验证码
     * @return
     */
    public void validate(String phone, String code, boolean ifDelete) {
        long count = lambdaQuery()
                .eq(SmsCode::getPhone, phone)
                .eq(SmsCode::getCode, code)
                .count();
        if (count > 0) {
            if (ifDelete) {
                this.deleteCode(phone);
            }

            return;
        }
        throw new BuzzException("短信验证码校验失败");
    }

    public void deleteCode(String phone) {
        lambdaUpdate().eq(SmsCode::getPhone, phone).remove();
    }

}