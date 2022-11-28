package com.faber.buzz.article.biz;

import com.faber.buzz.article.entity.Book;
import com.faber.buzz.article.mapper.BookMapper;
import com.faber.common.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * 文章-书本
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@Service
public class BookBiz extends BaseBiz<BookMapper, Book> {

    @Resource
    private DetailBiz detailBiz;

//    public BookDetail getDetail(Integer id) {
//        Book book = getById(id);
//
//        List<BookOutlineDetail> detailList = detailBiz.getBaseMapper().getByBook(id);
//
//        BookDetail bd = new BookDetail();
//        bd.setBook(book);
//        bd.setDetailList(detailList);
//
//        return bd;
//    }

}