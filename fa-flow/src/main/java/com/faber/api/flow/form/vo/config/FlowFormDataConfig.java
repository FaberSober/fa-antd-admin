package com.faber.api.flow.form.vo.config;

import java.io.Serializable;
import java.util.List;

import com.faber.api.flow.form.vo.ret.TableColumnVo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
public class FlowFormDataConfig implements Serializable {
    
    private Table main;
    private List<SubTable> subTables;

    /**
     * 主表配置
     */
    @Data
    public static class Table implements Serializable {
        private String tableName;
        private String pkField;
        private String comment;
        private List<Column> columns;
    }

    /**
     * 子表配置
     */
    @Data
    @EqualsAndHashCode(callSuper=true)
    public static class SubTable extends Table {
        private String fkField;
    }

    @Data
    @EqualsAndHashCode(callSuper=true)
    public static class Column extends TableColumnVo {
        private Integer sort;
    }

}
