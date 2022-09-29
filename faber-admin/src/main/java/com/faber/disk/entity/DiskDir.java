package com.faber.disk.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaModalName;
import com.faber.common.bean.BaseDelEntity;
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

    //  ID
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 文件夹名称
    // @Column(name = "name")
    private String name;

    // 父级节点
    // @Column(name = "parent_id")
    private Integer parentId;

}
