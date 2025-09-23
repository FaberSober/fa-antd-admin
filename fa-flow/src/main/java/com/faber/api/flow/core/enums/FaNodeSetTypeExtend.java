package com.faber.api.flow.core.enums;

import java.util.Objects;
import com.aizuda.bpm.engine.core.enums.NodeSetType;

/**
 * 对{@link NodeSetType}的扩展，从20开始
 */
public enum FaNodeSetTypeExtend {

    /**
     * 代码接口指定
     */
    code(20),
    ;

    private final int value;

    FaNodeSetTypeExtend(int value) {
        this.value = value;
    }

    public boolean ne(Integer value) {
        return !eq(value);
    }

    public boolean eq(Integer value) {
        return Objects.equals(this.value, value);
    }

}
