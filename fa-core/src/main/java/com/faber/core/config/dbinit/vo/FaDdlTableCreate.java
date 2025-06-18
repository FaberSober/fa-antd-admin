package com.faber.core.config.dbinit.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SQL-建表语句
 * @author Farando
 * @date 2023/2/18 20:26
 * @description
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaDdlTableCreate {

    private String tableName;
    private String comment;
    private String sqlPath;

}
