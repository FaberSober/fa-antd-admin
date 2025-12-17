package com.faber.api.flow.form.vo.req;

import java.io.Serializable;

import com.dtflys.forest.annotation.NotNull;
import com.faber.api.flow.form.vo.ret.TableColumnVo;

import lombok.Data;

@Data
public class CreateColumnReqVo implements Serializable {
    
    @NotNull
    private String tableName;

    @NotNull
    private TableColumnVo column;

}
