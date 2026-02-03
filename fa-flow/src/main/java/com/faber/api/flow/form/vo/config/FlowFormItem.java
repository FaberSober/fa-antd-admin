package com.faber.api.flow.form.vo.config;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import lombok.Data;

/**
 * 流程表单项配置
 */
@Data
public class FlowFormItem implements Serializable {
    
    /** 组件类型 */
    private String type;
    
    /** 唯一标识ID */
    private String id;
    
    /** 表名（用于子表关联） */
    private String tableName;
    
    /** 字段名 */
    private String name;
    
    /** 标签文本 */
    private String label;
    
    /** 占位符文本 */
    private String placeholder;
    
    /** 校验规则 */
    private List<Map<String, Object>> rules;
    
    /** 子表单项（用于容器类组件） */
    private List<FlowFormItem> children;
    
    // -------------------- 布局属性 --------------------
    /** 栅格占位列数（24栅格系统） */
    private Integer md;
    
    // -------------------- 高级子表属性 (high_subtable) --------------------
    /** 子表关联表名 */
    private String subtable_tableName;
    
    // -------------------- 装饰文本属性 (deco_text) --------------------
    /** 文本内容 */
    private String content;
    
    /** 行高 */
    private Integer deco_lineHeight;
    
    /** 字体大小 */
    private Integer deco_fontSize;
    
    /** 文本对齐方式: left/center/right */
    private String deco_textAlign;
    
    /** 文本颜色 */
    private String deco_color;
    
    /** 是否加粗 */
    private Boolean deco_fontWeight;
    
    /** 是否斜体 */
    private Boolean deco_fontStyle;
    
    /** 文本装饰: none/underline/line-through/overline */
    private String deco_textDecoration;
    
    // -------------------- 装饰链接属性 (deco_href) --------------------
    /** 链接地址 */
    private String deco_href;
    
    // -------------------- 装饰分割线属性 (deco_hr) --------------------
    /** 分割线颜色 */
    private String deco_hrColor;
    
    /** 分割线粗细 */
    private Integer deco_hrThickness;
    
    /** 分割线样式: solid/dashed/dotted */
    private String deco_hrStyle;
    
    /** 上边距 */
    private Integer deco_hrMarginTop;
    
    /** 下边距 */
    private Integer deco_hrMarginBottom;
    
    // -------------------- 装饰提示框属性 (deco_alert) --------------------
    /** 提示框类型: success/info/warning/error */
    private String deco_alertType;
    
    /** 是否显示图标 */
    private Boolean deco_alertShowIcon;
    
    /** 是否可关闭 */
    private Boolean deco_alertClosable;
    
    /** 是否为横幅模式 */
    private Boolean deco_alertBanner;
    
    /** 辅助性文字介绍 */
    private String deco_alertDescription;
    
}
