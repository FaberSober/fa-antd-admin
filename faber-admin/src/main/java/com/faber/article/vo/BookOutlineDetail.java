package com.faber.article.vo;

import com.faber.article.entity.Detail;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class BookOutlineDetail extends Detail {

    private String outlineNo;
    private String outlineTitle;

}
