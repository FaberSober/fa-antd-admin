package com.faber.core.config.dbinit.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SQL-数据库表-新增字段
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaDdlAddColumn {

    private String tableName;
    private String colName;
    private String comment;
    private String sqlPath;

}
