package com.faber.api.base.admin.vo.query;

import com.faber.core.config.validator.validator.TelNoValidator;
import lombok.Data;

/**
 * 用户更新字段Bean
 * @author xu.pengfei
 * @date 2022/11/28 16:34
 */
@Data
public class UserAccountVo {

    private String username;

    private String name;

    private String birthday;

    private String address;

    @TelNoValidator
    private String tel;

    private String email;

    private String sex;

    private String description;

    private String img;

}
