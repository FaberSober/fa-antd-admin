package com.faber.common.vo.msg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 基础返回Response父类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse {

    private int status = 200;
    private String message;

}
