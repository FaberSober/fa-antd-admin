package com.faber.api.flow.form.vo.config;

import java.io.Serializable;
import java.util.ArrayList;
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
    
    /**
     * 递归获取所有 type=high_subtable 的子表单项
     * 
     * @return 所有子表单项的列表
     */
    public List<FlowFormItem> getAllSubTableItems() {
        List<FlowFormItem> result = new ArrayList<>();
        if (items == null || items.isEmpty()) {
            return result;
        }
        
        for (FlowFormItem item : items) {
            collectSubTableItems(item, result);
        }
        
        return result;
    }
    
    /**
     * 递归收集子表单项
     * 
     * @param item 当前表单项
     * @param result 收集结果列表
     */
    private void collectSubTableItems(FlowFormItem item, List<FlowFormItem> result) {
        // 如果当前项是子表，添加到结果中
        if ("high_subtable".equals(item.getType())) {
            result.add(item);
        }
        
        // 递归处理子项
        if (item.getChildren() != null && !item.getChildren().isEmpty()) {
            for (FlowFormItem child : item.getChildren()) {
                collectSubTableItems(child, result);
            }
        }
    }
    
}
