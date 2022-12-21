package com.faber.core.vo.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 字典
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DictOption<T> {
    private T value;
    private String label;
    private String color;
    private int sort;

    public DictOption(T value, String text) {
        this.value = value;
        this.label = text;
    }
}
