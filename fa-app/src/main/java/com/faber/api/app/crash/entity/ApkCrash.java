package com.faber.api.app.crash.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;


/**
 * APP-APK崩溃日志表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-20 13:59:18
 */
@FaModalName(name = "APP-APK崩溃日志表")
@TableName("app_apk_crash")
@Data
public class ApkCrash extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("应用ID")
    private Integer appId;

    @ExcelProperty("应用名称")
    private String name;

    @ExcelProperty("应用包名")
    private String applicationId;

    @ExcelProperty("版本号")
    private Integer versionCode;

    @ExcelProperty("版本名称")
    private String versionName;

    @ExcelProperty("错误日志")
    private String message;

    @ExcelProperty("崩溃日志详情")
    private String detail;

    @ExcelProperty("崩溃时间")
    private Date crashTime;

    @ExcelProperty("rom信息")
    private String romInfo;

    @ExcelProperty("设备厂商")
    private String deviceManufacturer;

    @ExcelProperty("设备型号")
    private String deviceModel;

    @ExcelProperty("android版本")
    private String androidVersion;

    @ExcelProperty("sdk版本")
    private Integer androidSdk;

}
