package com.faber.api.base.generator.vo.req;

import com.faber.api.base.generator.enums.GeneratorTypeEnum;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author Farando
 * @date 2023/3/9 14:47
 * @description
 */
@Data
public class CodeGensReqVo extends CodeGenBase {

    /**
     * 生成的表名s
     */
    private List<String> tableNames;

    /**
     * 生成代码类型s
     */
    private List<GeneratorTypeEnum> types;

}
