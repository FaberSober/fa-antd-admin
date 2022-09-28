package com.faber.common.vo;


import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import com.faber.common.vo.query.ConditionGroup;
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
    private List<ConditionGroup> conditionList;

    public Query(Map<String, Object> params) {
        // 删除params中为空的元素
        params.entrySet().removeIf(entry -> ObjectUtil.isEmpty(entry.getValue()));
        this.putAll(params);

        // 分页参数
        if (params.get("current") != null) {
            this.page = Integer.parseInt(params.get("current").toString());
        }
        if (params.get("pageSize") != null) {
            this.limit = Integer.parseInt(params.get("pageSize").toString());
        }
        this.remove("current");
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
            this.conditionList = (List<ConditionGroup>) params.get("conditionList");
        }

        this.remove("conditionList");
    }

    public int getStart() {
        return (page - 1) * limit;
    }

    public Sorter getSorterInfo() {
        if (StrUtil.isEmpty(this.sorter)) return null;
        String[] ss = this.sorter.split(" ");
        Sorter sorter1 = new Sorter();
        sorter1.setField(StrUtil.toUnderlineCase(ss[0]));
        sorter1.setAsc(ss.length > 1 && "asc".equalsIgnoreCase(ss[1]));
        return sorter1;
    }

}
