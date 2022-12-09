package com.faber.api.base.article.vo;

import com.faber.api.base.article.entity.Detail;
import com.faber.api.base.article.entity.Outline;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class OutlineDetailVo extends Outline {

    private Detail detail;

}
