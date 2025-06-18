package com.faber.api.base.generator.vo.ret;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 表结构
 * table_name tableName, engine, table_comment tableComment, create_time createTime
 * @author Farando
 * @date 2023/3/9 11:03
 * @description
 */
@Data
public class TableVo implements Serializable {

    private String tableName;
    private String engine;
    private String tableComment;
    private Date createTime;

}
