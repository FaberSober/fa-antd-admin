package com.faber.core.vo.query;

import java.io.Serializable;

import com.faber.core.exception.BuzzException;
import com.faber.core.utils.FaSqlUtils;

import cn.hutool.core.util.StrUtil;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class BasePageQuery<T> implements Serializable {

    /** 当前页码 */
    private int current = 1;

    /** 每页条数 */
    private int pageSize = 10;

    /** 排序 */
    private String sorter;

    /** 查询用户 */
    private String queryUserId;

    /** 查询参数 */
    private T query;

    public long getSkip() {
        return (long) (this.getCurrent() - 1) * this.getPageSize();
    }

    /**
     * 设置排序字段，只允许"字段名 ASC"或"字段名 DESC"的格式，防止SQL注入
     * 
     * @param sorter 排序字符串，格式："字段名 ASC"或"字段名 DESC"
     * @throws BuzzException 当格式不正确或包含危险字符时抛出异常
     */
    public void setSorter(String sorter) {
        // 为空或null直接设置
        if (StrUtil.isEmpty(sorter)) {
            this.sorter = sorter;
            return;
        }

        // 验证排序字符串格式和安全性
        FaSqlUtils.validateSorterSafety(sorter.trim());

        this.sorter = sorter.trim();
    }

}
