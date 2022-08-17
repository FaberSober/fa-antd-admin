package com.faber.common.vo;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 字典
 */
@Data
@AllArgsConstructor
public class DictOption {
    private String value;
    private String text;
    private String color;
    private int sort;
}
