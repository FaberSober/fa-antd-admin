package com.faber.article.rest;

import com.faber.article.biz.BookBiz;
import com.faber.article.entity.Book;
import com.faber.common.rest.BaseController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/article/book")
public class BookController extends BaseController<BookBiz,Book, Integer> {

//    /**
//     * 获取书本的所有信息
//     * @param id
//     * @return
//     */
//    @RequestMapping(value = "/getDetail/{id}", method = RequestMethod.GET)
//    @ResponseBody
//    public ObjectRestResponse<BookDetail> getDetail(@PathVariable Integer id) {
//        BookDetail o = baseBiz.getDetail(id);
//        return ok(o);
//    }

}