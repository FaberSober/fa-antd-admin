package com.faber.article.rest;

import com.faber.article.vo.BookDetail;
import com.faber.article.vo.UploadStdExcelParams;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import com.faber.article.biz.BookBiz;
import com.faber.article.entity.Book;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;

@RestController
@RequestMapping("/api/article/book")
public class BookController extends BaseController<BookBiz,Book> {

    /**
     * 获取书本的所有信息
     * @param id
     * @return
     */
    @RequestMapping(value = "/getDetail/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse<BookDetail> getDetail(@PathVariable Integer id) {
        BookDetail o = baseBiz.getDetail(id);
        return ok(o);
    }

    /**
     * 上传STD标准Excel文件，解析Excel录入文档
     * @param params
     * @return
     */
    @RequestMapping(value = "/upload/stdExcel", method = RequestMethod.POST)
    @ResponseBody
    public ObjectRestResponse<Book> uploadStdExcel(@Valid @RequestBody UploadStdExcelParams params) throws IOException {
        Book data = baseBiz.uploadStdExcel(params);
        return ok(data);
    }

}