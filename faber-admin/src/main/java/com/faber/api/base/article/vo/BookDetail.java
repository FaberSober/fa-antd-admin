package com.faber.api.base.article.vo;

import com.faber.api.base.article.entity.Book;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class BookDetail {

    private Book book;

    private List<BookOutlineDetail> detailList;

}
