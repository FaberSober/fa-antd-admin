package com.faber.api.base.generator.vo.req;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Farando
 * @date 2023/3/9 11:04
 * @description
 */
@Data
public class TableQueryVo implements Serializable {

    private String tableName;
    private String tableComment;

}
