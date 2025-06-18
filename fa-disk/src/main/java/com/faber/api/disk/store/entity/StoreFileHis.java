package com.faber.api.disk.store.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

    
/**
 * STORE-文件-历史记录
 * 
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-03-15 17:16:15
 */
@FaModalName(name = "STORE-文件-历史记录")
@TableName("disk_store_file_his")
@Data
public class StoreFileHis extends BaseDelEntity {
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("存储文件ID")
    private Integer storeFileId;

    @SqlEquals
    @ExcelProperty("版本文件ID")
    private String fileSaveId;

    @SqlEquals
    @ExcelProperty("Office文件变更内容zip包文件ID（适用于onlyoffice）")
    private String changeFileId;

    @ExcelProperty("文件名")
    private String fileName;

    @SqlEquals
    @ExcelProperty("版本号")
    private Integer ver;

    @ExcelProperty("备注")
    private String remark;

}
