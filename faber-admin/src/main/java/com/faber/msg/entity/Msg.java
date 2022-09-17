package com.faber.msg.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import lombok.Getter;

import javax.persistence.*;
import java.util.Arrays;
import java.util.Date;


/**
 * 系统-消息
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-13 21:19:53
 */
@FaberModalName(name = "系统-消息")
@Table(name = "base_msg")
@Data
public class Msg extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    // ID
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    // 消息来源用户ID
    @SqlEquals
    @ExcelProperty("消息来源用户ID")
    @Column(name = "from_user_id")
    private String fromUserId;

    // 接收用户ID
    @SqlEquals
    @ExcelProperty("接收用户ID")
    @Column(name = "to_user_id")
    private String toUserId;

    // 消息内容
    @SqlSearch
    @ExcelProperty("消息内容")
    @Column(name = "content")
    private String content;

    // 是否已读
    @SqlEquals
    @ExcelProperty("是否已读")
    @Column(name = "is_read")
    private String isRead;

    // 已读时间
    @ExcelProperty("已读时间")
    @Column(name = "read_time")
    private Date readTime;

    // 业务类型
    @SqlEquals
    @ExcelProperty("业务类型")
    @Column(name = "buzz_type")
    private Integer buzzType;

    // 业务ID
    @SqlEquals
    @ExcelProperty("业务ID")
    @Column(name = "buzz_id")
    private String buzzId;

    public enum BuzzType {

        SYS(1, "系统通知"),
        SMS_CODE(2, "短信验证码"),
        MEMBER_REGISTRY_RESULT(3, "会员注册审核结果"),
        ERROR(100, "无效值");

        @Getter
        private int value;
        @Getter
        private String desc;

        BuzzType(int value, String desc) {
            this.value = value;
            this.desc = desc;
        }

        public static BuzzType valueOf(int value) {
            return Arrays.stream(BuzzType.values())
                    .filter(a -> a.getValue() == value)
                    .findFirst().orElse(BuzzType.ERROR);
        }
    }

}
