package com.faber.api.base.admin.vo.query;

import com.faber.core.config.validator.validator.TelNoValidator;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

@Data
public class UserForgetResetPwdVo implements Serializable {

    @NotNull
    private String username;

    @NotNull
    @TelNoValidator
    private String tel;

    @NotNull
    private String password;

    @NotNull
    private String passwordConfirm;

}
