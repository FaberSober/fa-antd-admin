package com.faber.api.base.generator.vo.req;

import com.faber.api.base.generator.enums.GeneratorTypeEnum;
import lombok.Data;

/**
 * @author Farando
 * @date 2023/3/9 14:47
 * @description
 */
@Data
public class CodeGenReqVo extends CodeGenBase {

    /**
     * 生成的表名
     */
    private String tableName;

    /**
     * 生成代码类型
     */
    private GeneratorTypeEnum type;

}
