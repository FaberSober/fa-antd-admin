package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

    
/**
 * BASE-用户token
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-24 19:10:40
 */
@FaModalName(name = "BASE-用户token")
@TableName("base_user_token")
@Data
public class UserToken extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;

    @ExcelProperty("用户ID")
    private String userId;

    @ExcelProperty("是否有效")
    private Boolean valid;

    @ExcelProperty("备注")
    private String remark;

}
