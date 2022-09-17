package com.faber.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.admin.entity.SmsCode;

/**
 * 短信验证码
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
// @Mapper
public interface SmsCodeMapper extends BaseMapper<SmsCode> {

    void deleteInvalidCode();

}
