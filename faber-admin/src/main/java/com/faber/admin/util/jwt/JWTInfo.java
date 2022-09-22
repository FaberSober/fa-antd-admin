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
public class JWTInfo implements Serializable, IJWTInfo {

    private String username;
    private String userId;
    private String name;

}
