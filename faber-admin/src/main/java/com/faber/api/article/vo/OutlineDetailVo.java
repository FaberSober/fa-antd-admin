package com.faber.api.article.vo;

import com.faber.api.article.entity.Detail;
import com.faber.api.article.entity.Outline;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class OutlineDetailVo extends Outline {

    private Detail detail;

}
