package com.faber.api.base.admin.vo.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * 升级sql文件解析的sql文件头信息
 */
@Data
public class FaSqlHeader implements Serializable {

    /**
     * sql对应的版本号，格式为：1_000_000L
     */
    private Long ver;

    /**
     * sql对应的版本编码，格式为：V1.0.0
     */
    private String verNo;

    /**
     * sql对应的升级文本内容
     */
    private String info;

    /**
     * sql内容
     */
    private String sql;

}
