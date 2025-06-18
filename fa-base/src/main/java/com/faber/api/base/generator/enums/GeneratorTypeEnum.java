package com.faber.api.base.generator.enums;

import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 代码生成-类型
 */
@Getter
public enum GeneratorTypeEnum implements IEnum<String> {
    JAVA_ENTITY("java.entity", "entity.java.vm"),
    JAVA_MAPPER("java.mapper", "mapper.java.vm"),
    JAVA_BIZ("java.biz", "biz.java.vm"),
    JAVA_CONTROLLER("java.controller", "controller.java.vm"),
    XML_MAPPER("xml.mapper", "mapper.xml.vm"),
    RN_PROPS("rn.props", "rn_prop.ts.vm"),
    RN_SERVICE("rn.service", "rn_service.ts.vm"),
    RN_MODAL("rn.modal", "rn_modal.tsx.vm"),
    RN_VIEW("rn.view", "rn_view.tsx.vm"),
    RN_LIST("rn.list", "rn_list.tsx.vm");

    @JsonValue
    @EnumValue
    private final String value;
    private final String desc;

    GeneratorTypeEnum(String value, String desc) {
        this.value = value;
        this.desc = desc;
    }

}
