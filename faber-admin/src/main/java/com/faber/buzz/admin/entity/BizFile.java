package com.faber.buzz.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


/**
 * 通用-业务附件
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
@TableName("base_biz_file")
@Data
@NoArgsConstructor
public class BizFile extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    private String bizId;

    @SqlEquals
    private String bizType;

    /**
     * FIXME 附件URL 修改为存储文件ID
     */
    private String url;

    public BizFile(String bizId, String bizType) {
        this.bizId = bizId;
        this.bizType = bizType;
    }

    @ToString
    @AllArgsConstructor
    public enum BizType {
        ILLEGAL_CAPTURE("ILLEGAL_CAPTURE", "违章抓拍记录");

        public final String value;
        public final String text;
    }

}
