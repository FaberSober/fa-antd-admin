package com.faber.api.base.generator.vo.req;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

/**
 * @author Farando
 * @date 2023/3/30 16:38
 * @description
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class CodeGenBase implements Serializable {

    /**
     * 包名
     */
    private String packageName;

    /**
     * 删除表名前缀
     */
    private String tablePrefix;

    /**
     * 前端模块前缀
     */
    private String apiPath;

    /**
     * 前端模块前缀
     */
    private String mainModule;

    /**
     * 生成的表名s
     */
    private List<String> tableNames;

    /**
     * 作者
     */
    private String author;

    /**
     * 作者email
     */
    private String email;

    /**
     * Java复制项目
     */
    private String javaCopyPath;

    /**
     * 前端复制目录
     */
    private String rnCopyPath;

}
