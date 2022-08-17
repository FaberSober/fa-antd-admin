package com.faber.admin.mapper;

import com.faber.admin.entity.SmsCode;
import tk.mybatis.mapper.common.Mapper;

/**
 * 短信验证码
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
// @Mapper
public interface SmsCodeMapper extends Mapper<SmsCode> {

    void deleteInvalidCode();

}
