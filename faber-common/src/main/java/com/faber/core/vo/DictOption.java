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
public class DictOption<T> {
    private T value;
    // TODO 统一命名为label
    private String text;
    private String color;
    private int sort;

    public DictOption(T value, String text) {
        this.value = value;
        this.text = text;
    }
}
