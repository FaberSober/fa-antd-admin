package com.faber.api.base.demo.es;

import cn.easyes.annotation.IndexName;
import lombok.Data;

/**
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/12 17:36
 */
@Data
@IndexName("document")
public class Document {
    /**
     * es中的唯一id
     */
    private String id;

    /**
     * 文档标题
     */
    private String title;
    /**
     * 文档内容
     */
    private String content;
}
