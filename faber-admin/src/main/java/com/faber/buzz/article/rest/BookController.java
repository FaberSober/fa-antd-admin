package com.faber.buzz.article.rest;

import com.faber.buzz.article.biz.BookBiz;
import com.faber.buzz.article.entity.Book;
import com.faber.buzz.article.vo.BookDetail;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/article/book")
public class BookController extends BaseController<BookBiz, Book, Integer> {

    /**
     * 获取书本的所有信息
     * @param id
     * @return
     */
    @RequestMapping(value = "/getBookDetail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<BookDetail> getBookDetail(@PathVariable Integer id) {
        BookDetail o = baseBiz.getBookDetail(id);
        return ok(o);
    }

}