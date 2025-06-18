package com.faber.api.base.generator.vo.ret;

import com.faber.api.base.generator.vo.req.CodeGenReqVo;
import lombok.Data;

/**
 * @author Farando
 * @date 2023/3/9 14:47
 * @description
 */
@Data
public class CodeGenRetVo extends CodeGenReqVo {

    /**
     * 生成的代码
     */
    private String code;

}
