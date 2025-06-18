package com.faber.api.app.app.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

    
/**
 * APP-APK版本表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2023-01-18 20:31:39
 */
@FaModalName(name = "APP-APK版本表")
@TableName("app_apk_version")
@Data
public class ApkVersion extends BaseDelEntity {

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
    private Long versionCode;

    @ExcelProperty("版本名称")
    private String versionName;

    @ExcelProperty("图标文件ID")
    private String iconId;

    @ExcelProperty("APK文件ID")
    private String fileId;

    @ExcelProperty("文件大小，单位字节")
    private Long size;

    @ExcelProperty("下载次数")
    private Integer downloadNum;

    @ExcelProperty("强制更新")
    private Boolean forceUpdate = false;

    @ExcelProperty("版本信息")
    private String remark;

}
