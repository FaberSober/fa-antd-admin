package com.faber.api.base.disk.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * 云盘/文件夹
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-07-13 10:36:38
 */
@FaModalName(name = "云盘/文件夹")
@TableName("disk_dir")
@Data
public class DiskDir extends BaseDelEntity {

    /** ID */
    @SqlTreeId
    @TableId(type = IdType.AUTO)
    private Integer id;

    /** 文件夹名称 */
    @SqlSorter
    @SqlTreeName
    private String name;

    /** 父级节点 */
    @SqlTreeParentId
    private Integer parentId;

}
