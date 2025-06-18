package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.util.Date;


/**
 * BASE-用户设备
 * 
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2024-01-11 14:52:43
 */
@FaModalName(name = "BASE-用户设备")
@TableName("base_user_device")
@Data
public class UserDevice extends BaseDelEntity {
	
    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
//    @ExcelProperty("所属用户ID")
    private String userId;

    @ExcelProperty("所属用户")
    @TableField(exist = false)
    private String userName;

    @NotNull
    @ExcelProperty("设备ID")
    private String deviceId;

    @ExcelProperty("设备型号")
    private String model;

    @ExcelProperty("设备厂商")
    private String manufacturer;

    @ExcelProperty("系统")
    private String os;

    @ExcelProperty("系统版本号")
    private String osVersion;

    @ExcelProperty("是否允许访问")
    private Boolean enable;

    @ExcelProperty("最后在线时间")
    private Date lastOnlineTime;

}
