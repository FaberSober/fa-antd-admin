package com.faber.core.config.dbinit.vo;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Farando
 * @date 2023/2/18 20:27
 * @description
 */
@Data
public class FaDdl {

    private Long ver;
    private String verNo;
    private String remark;
    private List<FaDdlTableCreate> tableCreateList = new ArrayList<>();
    private List<FaDdlAddColumn> addColumnList = new ArrayList<>();
    private List<FaDdlSql> sqlList = new ArrayList<>();

    public FaDdl(long ver, String verNo, String remark) {
        this.ver = ver;
        this.verNo = verNo;
        this.remark = remark;
    }

    public FaDdl addTableCreate(FaDdlTableCreate tableCreate) {
        if (tableCreateList == null) {
            tableCreateList = new ArrayList<>();
        }
        tableCreateList.add(tableCreate);
        return this;
    }

    public FaDdl addAddColumn(FaDdlAddColumn addColumn) {
        if (addColumnList == null) {
            addColumnList = new ArrayList<>();
        }
        addColumnList.add(addColumn);
        return this;
    }

    public FaDdl addSql(FaDdlSql sql) {
        if (sqlList == null) {
            sqlList = new ArrayList<>();
        }
        sqlList.add(sql);
        return this;
    }

}
