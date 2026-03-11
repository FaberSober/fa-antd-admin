package com.faber.api.flow.form.vo.config;

import java.io.Serializable;
import java.util.List;

import com.faber.api.flow.form.vo.ret.TableColumnVo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FlowFormDataConfig implements Serializable {
    
    private Table main;

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

    @Data
    @EqualsAndHashCode(callSuper=true)
    public static class Column extends TableColumnVo {
        private Integer sort;
    }

}
