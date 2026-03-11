package com.faber.api.flow.form.vo.config;

import java.io.Serializable;

import lombok.Data;

/**
 * 流程表单属性配置
 */
@Data
public class FlowFormProperty implements Serializable {
    
    /** 表单名称 */
    private String name;
    
    /** 表单描述 */
    private String description;
    
    /** 标签宽度 */
    private Integer labelWidth;
    
    /** 表单布局方式: horizontal/vertical/inline */
    private String layout;
    
}
