package com.faber.core.config.dbinit.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * SQL-通用DDL语句
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaDdlSql {

    private String comment;
    private String sqlPath;

}
