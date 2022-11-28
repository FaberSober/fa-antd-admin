package com.faber.buzz.article.vo;

import com.faber.buzz.article.entity.Detail;
import com.faber.buzz.article.entity.Outline;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class OutlineDetailVo extends Outline {

    private Detail detail;

}
