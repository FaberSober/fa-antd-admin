package com.faber.msg.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.enums.BoolEnum;
import lombok.Data;
import lombok.Getter;
import lombok.experimental.Accessors;

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
@TableName("base_msg")
@Data
@Accessors(chain = true)
public class Msg extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("来源用户")
    private String fromUserName;

    @SqlEquals
    @ExcelProperty("来源用户ID")
    private String fromUserId;

    @ExcelProperty("接收用户")
    private String toUserName;

    @SqlEquals
    @ExcelProperty("接收用户ID")
    private String toUserId;

    @SqlSearch
    @ExcelProperty("消息内容")
    private String content;

    @SqlEquals
    @ExcelProperty("是否已读")
    private BoolEnum isRead;

    @ExcelProperty("已读时间")
    private Date readTime;

    @SqlEquals
    @ExcelProperty("业务类型")
    private Integer buzzType;

    @SqlEquals
    @ExcelProperty("业务ID")
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
