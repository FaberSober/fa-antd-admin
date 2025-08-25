package com.faber.api.flow.core.enums;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ObjUtil;
import com.baomidou.mybatisplus.annotation.EnumValue;
import com.baomidou.mybatisplus.annotation.IEnum;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

/**
 * 流程实例状态枚举
 * 
 * @author xu.pengfei
 * @date 2025-08-25 17:25:29
 */
@Getter
public enum FaInstanceStateEnum implements IEnum<Integer> {
    /** 作废状态，删除当前任务，保留了历史审批任务 */
    DESTROY(-3, "作废"),
    /** 已暂停状态，被主动挂起，暂停执行 */
    SUSPEND(-2, "已暂停"),
    /** 暂存待审 */
    SAVE_AS_DRAFT(-1, "暂存待审"),
    /** 审批中 */
    ACTIVE(0, "审批中"),
    /** 审批通过 */
    COMPLETE(1, "审批通过"),
    /** 审批拒绝【驳回结束流程】 */
    REJECT(2, "审批拒绝"),
    /** 撤销审批 */
    REVOKE(3, "撤销审批"),
    /** 超时结束 */
    TIMEOUT(4, "超时结束"),
    /** 强制终止 */
    TERMINATE(5, "强制终止"),
    /** 自动通过 */
    AUTO_PASS(6, "自动通过"),
    /** 自动拒绝 */
    AUTO_REJECT(7, "自动拒绝");

    @JsonValue
    @EnumValue
    private final Integer value;
    private final String desc;

    FaInstanceStateEnum(Integer value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public static FaInstanceStateEnum fromValue(Integer value) {
        FaInstanceStateEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.value, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FaInstanceStateEnum value: " + value);
        }
        return result;
    }

    public static FaInstanceStateEnum fromDesc(String value) {
        FaInstanceStateEnum result = ArrayUtil.firstMatch(i -> ObjUtil.equals(i.desc, value), values());
        if (result == null) {
            throw new IllegalArgumentException("Invalid FaInstanceStateEnum desc: " + value);
        }
        return result;
    }

}