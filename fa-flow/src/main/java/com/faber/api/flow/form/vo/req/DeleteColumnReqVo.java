package com.faber.api.flow.form.vo.req;

import java.io.Serializable;

import com.dtflys.forest.annotation.NotNull;

import lombok.Data;

@Data
public class DeleteColumnReqVo implements Serializable {
    
    @NotNull
    private String tableName;

    @NotNull
    private String column;

}
