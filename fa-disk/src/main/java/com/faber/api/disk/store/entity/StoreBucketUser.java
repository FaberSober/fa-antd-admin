package com.faber.api.disk.store.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.base.admin.entity.User;
import com.faber.api.disk.store.enums.StoreBucketUserTypeEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

    
/**
 * STORE-库-人员关联
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-28 11:14:56
 */
@FaModalName(name = "STORE-库-人员关联")
@TableName("disk_store_bucket_user")
@Data
public class StoreBucketUser extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("库ID")
    private Integer bucketId;

    @SqlEquals
    @ExcelProperty("用户ID")
    private String userId;

    @SqlEquals
    @ExcelProperty("类型")
    private StoreBucketUserTypeEnum type;

    // 查询返回
    @TableField(exist = false)
    private User user;

}
