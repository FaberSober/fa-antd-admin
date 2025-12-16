package com.faber.api.flow.form.vo.req;

import java.io.Serializable;

import lombok.Data;

@Data
public class CreateFormTableReqVo implements Serializable {
    
    private String tableName;
    private String comment;
    
}
