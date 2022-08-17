package com.faber.common.util;


import lombok.Data;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 查询参数：分页、排序
 */
@Data
public class Query extends LinkedHashMap<String, Object> {
    private static final long serialVersionUID = 1L;
    /** 当前页码 */
    private int page = 1;
    /** 每页条数 */
    private int limit = 10;
    /** 排序 */
    private String sorter;
    /** 单查询字段 */
    private String search;
    /** 查询场景ID */
    private Integer sceneId;

    /**
     * 高级查询组合条件
     * type: or\and
     * condList: 单属性查询列表
     */
    private List<Map> conditionList;

    public Query(Map<String, Object> params) {
        this.putAll(params);

        // 分页参数
        if (params.get("currentPage") != null) {
            this.page = Integer.parseInt(params.get("currentPage").toString());
        }
        if (params.get("pageSize") != null) {
            this.limit = Integer.parseInt(params.get("pageSize").toString());
        }
        this.remove("currentPage");
        this.remove("pageSize");

        // 排序
        if (params.get("sorter") != null) {
            this.sorter = params.get("sorter").toString().trim();
        }
        this.remove("sorter");

        // 单查询字段
        if (params.get("search") != null) {
            this.search = params.get("search").toString().trim();
        }
        this.remove("search");

        // 查询场景ID
        if (params.get("sceneId") != null) {
            this.sceneId = Integer.parseInt(params.get("sceneId").toString());
        }
        this.remove("sceneId");

        // 高级查询组合条件
        if (params.get("conditionList") != null) {
            this.conditionList = (List<Map>) params.get("conditionList");
        }
        this.remove("conditionList");
    }

    public int getStart() {
        return (page - 1) * limit;
    }

}
