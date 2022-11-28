package com.faber.buzz.article.vo;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class UploadStdExcelParams implements Serializable {

    private String name;
    private String fileId;
    private String remark;
    private String bizType;
    private String bizId;

}
