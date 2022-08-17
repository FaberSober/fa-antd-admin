package com.faber.common.constant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.util.Arrays;

/**
 * 通用审核结果
 */
@ToString
@AllArgsConstructor
public enum AuditResult {

    DOING("DOING", "待审核"),
    PASS("PASS", "已同意"),
    REJECTED("REJECTED", "已拒绝");

    public final String value;
    public final String text;

}
