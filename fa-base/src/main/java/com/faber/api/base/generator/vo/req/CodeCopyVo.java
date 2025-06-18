package com.faber.api.base.generator.vo.req;

import lombok.Data;

import java.util.List;

/**
 * @author Farando
 * @date 2023/3/9 14:47
 * @description
 */
@Data
public class CodeCopyVo extends CodeGenBase {

    /**
     * 生成的表名s
     */
    private List<String> tableNames;

}
