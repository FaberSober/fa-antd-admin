package com.faber.core.vo.chart;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 用于chart展示的series通用数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartSeriesVo implements Serializable {

    private String name;
    private Integer value;

}
