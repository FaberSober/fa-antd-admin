package com.faber.admin.util.jwt;

import lombok.*;

import java.io.Serializable;

/**
 */
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class JWTInfo implements Serializable {

    private String userId;

    /**
     * token来源：web
     */
    private String source;

}
