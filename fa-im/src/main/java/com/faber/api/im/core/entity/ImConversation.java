package com.faber.api.im.core.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.im.core.enums.ImConversationTypeEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;

import lombok.Data;

/**
 * IM-会话表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@FaModalName(name = "IM-会话表")
@TableName("im_conversation")
@Data
public class ImConversation extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("类型：1-单聊/2-群聊")
    private ImConversationTypeEnum type;

    @ExcelProperty("群聊名称")
    private String title;

}
