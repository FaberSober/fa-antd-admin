package com.faber.base.socket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/5 17:40
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatObject {
    private String userName;
    private String message;
}
