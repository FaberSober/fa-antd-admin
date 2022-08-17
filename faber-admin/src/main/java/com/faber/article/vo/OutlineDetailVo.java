package com.faber.article.vo;

import com.faber.article.entity.Detail;
import com.faber.article.entity.Outline;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class OutlineDetailVo extends Outline {

    private Detail detail;

}
