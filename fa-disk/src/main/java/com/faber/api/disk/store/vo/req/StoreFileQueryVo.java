package com.faber.api.disk.store.vo.req;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class StoreFileQueryVo implements Serializable {

    private Boolean deleted;

    private Integer bucketId;
    private Integer parentId;

    /**
     * 名称模糊搜索
     */
    private String name;

    /**
     * 文件类型搜索
     */
    private String type;

    /**
     * 目录
     */
    private Boolean dir;

    /**
     * 是否删除动作
     */
    private Boolean deleteAction;

    /**
     * 路径搜索是否及联查询
     */
    private Boolean recursive;

    /**
     * 路径搜索
     */
    private String fullPath;

    /**
     * tagIds查询类型: 1-同时满足/2-满足其一
     */
    private String tagQueryType;

    private List<Integer> tagIds;

    private String sorterField;

    /**
     * ASC / DESC
     */
    private String sorterType;

}
