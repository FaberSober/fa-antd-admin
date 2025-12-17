package com.faber.api.flow.form.vo.ret;

import java.io.Serializable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.Data;

/**
 * 表列信息
 */
@Data
public class TableColumnVo implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /** 字段名 */
    private String field;
    
    /** 数据类型（如 varchar(255)） */
    private String type;
    
    /** 纯类型（如 varchar） */
    private String dataType;
    
    /** 字符长度（varchar 专用） */
    private Integer length;
    
    /** 数字精度 */
    private Integer precision;
    
    /** 小数位数 */
    private Integer scale;
    
    /** 是否可空（YES/NO） */
    private String nullable;
    
    /** 默认值 */
    private String defaultValue;
    
    /** 键类型（PRI 表示主键） */
    private String key;
    
    /** 自增等（auto_increment） */
    private String extra;
    
    /** 字段注释（最重要，用于表单 label） */
    private String comment;

    // 后处理 length 的 getter
    public Integer getLength() {
        if (length != null) {
            return length; // 字符类型直接用 CHARACTER_MAXIMUM_LENGTH
        }
        // 整数类型从 COLUMN_TYPE 解析显示宽度
        if ("int".equalsIgnoreCase(dataType) || type != null) {
            Matcher matcher = Pattern.compile("\\((\\d+)\\)").matcher(type);
            if (matcher.find()) {
                return Integer.parseInt(matcher.group(1));
            }
        }
        return precision; // 备选：用 NUMERIC_PRECISION（如 int 默认 10）
    }

}
