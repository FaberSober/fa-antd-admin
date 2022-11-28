package com.faber.buzz.article.vo;

import com.faber.buzz.article.entity.Book;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class BookDetail {

    private Book book;

    private List<BookOutlineDetail> detailList;

}
