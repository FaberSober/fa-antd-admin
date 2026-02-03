package com.faber.api.flow.form.vo.config;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

/**
 * 自定义拖拽表单的布局配置
 * 对应前端 Flow.FlowFormConfig 接口
 */
@Data
public class FlowFormConfig implements Serializable {
    
    /** 表单配置 */
    private FlowFormProperty formConfig;
    
    /** 表单布局（使用树形结构的表单项列表） */
    private List<FlowFormItem> items;
    
}
