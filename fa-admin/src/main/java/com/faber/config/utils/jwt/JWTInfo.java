package com.faber.config.utils.jwt;

import lombok.*;

import java.io.Serializable;

/**
 * JWT信息
 * @author xu.pengfei
 * @date 2022/11/28 11:33
 */
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class JWTInfo implements Serializable {

    /**
     * 用户ID
     */
    private String userId;

    /**
     * token来源：web
     */
    private String source;

}
