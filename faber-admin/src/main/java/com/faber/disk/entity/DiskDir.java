package com.faber.disk.entity;

import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * 云盘/文件夹
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-07-13 10:36:38
 */
@FaberModalName(name = "云盘/文件夹")
@Table(name = "disk_dir")
@Data
public class DiskDir extends BaseDelEntity {

    //  ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 文件夹名称
    @Column(name = "name")
    private String name;

    // 父级节点
    @Column(name = "parent_id")
    private Integer parentId;

}
