package com.faber.config.utils.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 鉴权请求
 * @author xu.pengfei
 * @date 2022/11/28 11:31
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest implements Serializable {

    private String username;
    private String password;

}
