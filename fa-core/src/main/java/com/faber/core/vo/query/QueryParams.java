package com.faber.core.vo.query;

import cn.hutool.core.util.StrUtil;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@ToString
@NoArgsConstructor
public class QueryParams implements Serializable {

    /** 当前页码 */
    private int current = 1;
    /** 每页条数 */
    private int pageSize = 10;
    /** 排序 */
    private String sorter;
    /** 单查询字段 */
    private String search;
    /** 表格查询字段 */
    private Map<String, Object> query = new HashMap<>();
    /** 查询场景ID */
    private Integer sceneId;

    /**
     * 高级查询组合条件
     * type: or\and
     * condList: 单属性查询列表
     */
    private List<ConditionGroup> conditionList;

    public List<Sorter> getSorterInfo() {
        List<Sorter> sorterList = new ArrayList<>();

        if (StrUtil.isEmpty(this.sorter)) return sorterList;


        String[] ss0 = this.sorter.split(",");
        for (String oneSorter : ss0) {
            String[] ss = StrUtil.blankToDefault(oneSorter, "").trim().split(" ");
            Sorter sorter1 = new Sorter();
            sorter1.setField(StrUtil.toUnderlineCase(ss[0]));
            sorter1.setAsc(ss.length > 1 && "asc".equalsIgnoreCase(ss[1]));

            sorterList.add(sorter1);
        }

        return sorterList;
    }

    public void addConditionGroup(ConditionGroup item) {
        if (this.conditionList == null) this.conditionList = new ArrayList<>();
        this.conditionList.add(item);
    }

    public void addConditionGroupList(List<ConditionGroup> list) {
        if (this.conditionList == null) this.conditionList = new ArrayList<>();
        this.conditionList.addAll(list);
    }

}
