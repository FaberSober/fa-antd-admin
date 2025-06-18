package com.faber.api.base.admin.vo.query;

import com.faber.core.config.validator.validator.TelNoValidator;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

/**
 * 用户更新字段Bean
 * @author xu.pengfei
 * @date 2022/11/28 16:34
 */
@Data
public class UserAccountVo {

    private String username;

    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthday;

    private String address;

    @TelNoValidator
    private String tel;

    private String email;

    private Integer sex;

    private String description;

    private String img;

}
