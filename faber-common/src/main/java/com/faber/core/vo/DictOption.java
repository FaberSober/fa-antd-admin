package com.faber.core.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 字典
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictOption {
    private String value;
    private String text;
    private String color;
    private int sort;

    public DictOption(String value, String text) {
        this.value = value;
        this.text = text;
    }
}
