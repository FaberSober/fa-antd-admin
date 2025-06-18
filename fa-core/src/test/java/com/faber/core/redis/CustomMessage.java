package com.faber.core.redis;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/7 14:28
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomMessage implements Serializable {
    private String message;
}
