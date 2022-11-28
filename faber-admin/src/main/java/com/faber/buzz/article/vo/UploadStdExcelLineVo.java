package com.faber.buzz.article.vo;

import lombok.Data;
import lombok.ToString;

/**
 * 标准知识录入-Excel文档上传，解析Excel的文档一行内容
 */
@Data
@ToString
public class UploadStdExcelLineVo {

    /**
     * 章节号
     */
    private String no;

    /**
     * 章节标题
     */
    private String name;

    /**
     * 内容文本
     */
    private String detail;

    /**
     * 入库后保存的outline id
     */
    private Integer outlineId;

}
