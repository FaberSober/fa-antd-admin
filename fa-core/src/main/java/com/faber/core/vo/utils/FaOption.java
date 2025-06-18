package com.faber.core.vo.utils;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Select通用返回Option
 */
@Data
@NoArgsConstructor
public class FaOption<T> {
    private T id;
    private String name;

    public FaOption(String name, T id) {
        this.id = id;
        this.name = name;
    }
}
