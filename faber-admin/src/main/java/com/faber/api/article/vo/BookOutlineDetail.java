package com.faber.api.article.vo;

import com.faber.api.article.entity.Detail;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class BookOutlineDetail extends Detail {

    private String outlineNo;
    private String outlineTitle;

}
