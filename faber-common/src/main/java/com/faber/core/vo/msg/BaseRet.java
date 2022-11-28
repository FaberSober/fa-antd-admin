package com.faber.core.vo.msg;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 基础返回Response父类
 * @author xu.pengfei
 * @date 2022/11/28 14:43
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseRet {

    private int status = 200;
    private String message;

}
