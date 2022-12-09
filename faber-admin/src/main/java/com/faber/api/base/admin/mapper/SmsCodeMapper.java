package com.faber.api.base.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.api.base.admin.entity.SmsCode;

/**
 * 短信验证码
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
public interface SmsCodeMapper extends BaseMapper<SmsCode> {

    void deleteInvalidCode();

}
