package com.faber.api.base.generator.vo.ret;

import lombok.Data;

import java.io.Serializable;

/**
 * @author Farando
 * @date 2023/3/9 15:07
 * @description
 */
@Data
public class ColumnVo implements Serializable {

    private String columnName;
    private String dataType;
    /**
     * 字段类型，入：tinyint(1),varchar(255)
     */
    private String columnType;
    private String columnComment;
    private String columnKey;
    private String extra;

    // mysql对应的java类型
    private String attrType;
    // mysql对应的typescript类型
    private String attrTsType;
    //属性名称(第一个字母大写)，如：user_name => UserName
//    private String attrName;
    //属性名称(第一个字母小写)，如：user_name => userName
    private String attrname;

}
